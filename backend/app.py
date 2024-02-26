#app.py
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy.orm import joinedload
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
# Update SQLALCHEMY_DATABASE_URI to use MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:rootroot@localhost/jira_clone'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Set the secret key for session management
app.secret_key = '9qOLYK5UAFxC7_v8nsRvWA'
CORS(app)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    projects = db.relationship('Project', backref='user', lazy=True)
    # Adding a relationship for issues
    issues = db.relationship('Issue', backref='assigned_user', lazy=True)

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default='open')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

class Issue(db.Model):
    __tablename__ = 'issues'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default='open')
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    # 'assigned_user' backref will be added to this model from the User class
class HomePageContent(db.Model):
    __tablename__ = 'homepage_content'
    id = db.Column(db.Integer, primary_key=True)
    welcome_message = db.Column(db.Text, nullable=False)
    app_description = db.Column(db.Text, nullable=False)


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    user = User.query.filter((User.username == data['username']) | (User.email == data['email'])).first()
    if user:
        return jsonify({'message': 'User already exists'}), 400

    # Here 'sha256' is replaced with 'pbkdf2:sha256'
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_user = User(username=data['username'], email=data['email'], password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully', 'user_id': new_user.id}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password_hash, data['password']):
        session['user_id'] = user.id  # Store user ID in session
        return jsonify({'message': 'Login successful', 'user_id': user.id})
    return jsonify({'message': 'Invalid username or password'}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)  # Remove user ID from session
    return jsonify({'message': 'Logout successful'})

@app.route('/api/user/<int:user_id>', methods=['GET', 'PUT'])
def user_details(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    if request.method == 'GET':
        return jsonify({'email': user.email, 'username': user.username, 'id': user.id}), 200
    elif request.method == 'PUT':
        data = request.get_json()
        user.email = data.get('email', user.email)
        user.username = data.get('username', user.username)
        db.session.commit()
        return jsonify({'message': 'User details updated successfully'}), 200

@app.route('/api/user/<int:user_id>/projects', methods=['GET'])
def get_user_projects(user_id):
    projects = Project.query.filter_by(user_id=user_id).all()
    return jsonify([{'id': project.id, 'title': project.title, 'description': project.description, 'status': project.status} for project in projects]), 200

@app.route('/api/change-password', methods=['PUT'])
def change_password():
    user_id = 1  # Placeholder, replace with logic to get the actual user id
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    data = request.get_json()
    if 'new_password' in data and check_password_hash(user.password_hash, data['old_password']):
        user.password_hash = generate_password_hash(data['new_password'], method='sha256')
        db.session.commit()
        return jsonify({'message': 'Password updated successfully'}), 200
    else:
        return jsonify({'message': 'Password update failed'}), 400

@app.route('/api/projects', methods=['GET', 'POST'])
def projects():
    if request.method == 'GET':
        # Use joinedload to load the user relationship and include usernames
        projects = Project.query.options(joinedload(Project.user)).all()
        projects_data = []
        for project in projects:
            project_data = {
                'id': project.id,
                'title': project.title,
                'description': project.description,
                'status': project.status,
                'user_id': project.user_id,
                'username': project.user.username if project.user else None  # Access the username of the assigned user
            }
            projects_data.append(project_data)
        return jsonify(projects_data), 200
    elif request.method == 'POST':
        data = request.get_json()
        user_id = data.get('user_id', None)
        new_project = Project(
            title=data['title'], 
            description=data.get('description'), 
            status=data.get('status', 'open'), 
            user_id=user_id
        )
        db.session.add(new_project)
        db.session.commit()
        return jsonify({'message': 'Project created successfully', 'project_id': new_project.id}), 201


@app.route('/api/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    project = Project.query.get_or_404(project_id)
    data = request.get_json()
    project.title = data.get('title', project.title)
    project.description = data.get('description', project.description)
    project.status = data.get('status', project.status)
    if 'user_id' in data:
        project.user_id = data['user_id']
    db.session.commit()
    return jsonify({'message': 'Project updated successfully'}), 200

@app.route('/api/projects/<int:project_id>/unassign', methods=['PUT'])
def unassign_project(project_id):
    project = Project.query.get_or_404(project_id)
    project.user_id = None
    db.session.commit()
    return jsonify({'message': 'Project unassigned successfully'}), 200

@app.route('/api/issues', methods=['GET', 'POST'])
def issues():
    if request.method == 'GET':
        all_issues = Issue.query.options(joinedload(Issue.assigned_user)).all()
        issues_data = [{
            'id': issue.id,
            'title': issue.title,
            'description': issue.description,
            'status': issue.status,
            'project_id': issue.project_id,
            'assigned_to': issue.assigned_user.username if issue.assigned_user else None
        } for issue in all_issues]
        return jsonify(issues_data), 200
    elif request.method == 'POST':
        # Your existing POST logic here for adding a new issue
        data = request.get_json()
        new_issue = Issue(
            title=data['title'],
            description=data['description'],
            project_id=data['projectId'],
            status=data['status']
        )
        db.session.add(new_issue)
        db.session.commit()
        return jsonify({'message': 'Issue added successfully', 'issue_id': new_issue.id}), 201


@app.route('/api/user/<int:user_id>/issues', methods=['GET'])
def get_user_issues(user_id):
    issues = Issue.query.filter_by(user_id=user_id).all()
    issues_data = [{
        'id': issue.id,
        'title': issue.title,
        'description': issue.description,
        'status': issue.status,
        'project_id': issue.project_id,
        'user_id': issue.user_id
    } for issue in issues]
    return jsonify(issues_data), 200
@app.route('/api/issues', methods=['POST'])
def add_issue():
    data = request.get_json()
    # Ensure you are accessing the correct keys from the JSON data
    new_issue = Issue(
        title=data['title'],
        description=data['description'],
        project_id=data['projectId'],  # This should match the key in your React state
        status=data['status']
    )
    db.session.add(new_issue)
    db.session.commit()
    return jsonify({'message': 'Issue added successfully', 'issue_id': new_issue.id}), 201



@app.route('/api/issues/<int:issue_id>', methods=['PUT'])
def update_issue(issue_id):
    issue = Issue.query.get_or_404(issue_id)
    data = request.get_json()
    issue.title = data.get('title', issue.title)
    issue.description = data.get('description', issue.description)
    issue.status = data.get('status', issue.status)
    # Optionally update user_id if direct assignment is implemented
    db.session.commit()
    return jsonify({'message': 'Issue updated successfully'}), 200

@app.route('/api/issues/<int:issue_id>/assign', methods=['PUT'])
def assign_issue(issue_id):
    issue = Issue.query.get_or_404(issue_id)
    data = request.get_json()
    user_id = data.get('user_id')
    issue.user_id = user_id
    db.session.commit()
    return jsonify({'message': 'Issue assigned successfully'}), 200

@app.route('/api/issues/<int:issue_id>/unassign', methods=['PUT'])
def unassign_issue(issue_id):
    issue = Issue.query.get_or_404(issue_id)
    issue.user_id = None  # Set the user_id to None to unassign the user from the issue
    db.session.commit()
    return jsonify({'message': 'Issue unassigned successfully'}), 200

@app.route('/api/homepage', methods=['GET'])
def get_homepage_content():
    content = HomePageContent.query.first()
    if content:
        return jsonify({
            'welcome_message': content.welcome_message,
            'app_description': content.app_description
        }), 200
    else:
        return jsonify({'message': 'Content not found'}), 404



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)


