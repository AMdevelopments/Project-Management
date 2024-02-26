// Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.scss';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({ email: '', username: '' });
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    } else {
      fetchUserDetails();
      fetchUserProjects();
      fetchUserIssues();
    }
  }, [userId, navigate]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
      setUserDetails(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      navigate('/login');
    }
  };

  const fetchUserProjects = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/${userId}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching user projects:", error);
    }
  };

  // Within fetchUserIssues in Profile.js
const fetchUserIssues = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/user/${userId}/issues`);
    setIssues(response.data);
  } catch (error) {
    console.error("Error fetching user issues:", error);
  }
};


  const unassignProject = async (projectId) => {
    try {
      await axios.put(`http://localhost:5000/api/projects/${projectId}/unassign`);
      fetchUserProjects(); // Update projects in the profile view
    } catch (error) {
      console.error("Error unassigning project:", error);
    }
  };

  const unassignIssue = async (issueId) => {
    try {
      await axios.put(`http://localhost:5000/api/issues/${issueId}/unassign`);
      fetchUserIssues(); // Update issues in the profile view
    } catch (error) {
      console.error("Error unassigning issue:", error);
    }
  };

  const handleUserDetailsChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prevState => ({ ...prevState, [name]: value }));
  };

  const handleUpdateUserDetails = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/user/${userId}`, userDetails);
      alert('User details updated successfully');
    } catch (error) {
      console.error("Error updating user details:", error);
      alert('Failed to update user details');
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <form onSubmit={handleUpdateUserDetails} className="profile-form">
        <h2>Update User Details</h2>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={userDetails.email} onChange={handleUserDetailsChange} className="form-control" />
        </div>
        <div className="form-group">
          <label>Username:</label>
          <input type="text" name="username" value={userDetails.username} onChange={handleUserDetailsChange} className="form-control" />
        </div>
        <button type="submit" className="btn">Update Details</button>
      </form>

      <div className="projects-container">
        <h2>Your Projects</h2>
        {projects.length > 0 ? (
          projects.map(project => (
            <div key={project.id} className="project-item">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p>Status: {project.status}</p>
              <button onClick={() => unassignProject(project.id)}>Unassign</button>
            </div>
          ))
        ) : <p>No projects found.</p>}
      </div>

      <div className="issues-container">
        <h2>Your Issues</h2>
        {issues.length > 0 ? (
          issues.map(issue => (
            <div key={issue.id} className="issue-item">
              <h3>{issue.title}</h3>
              <p>Description: {issue.description}</p>
              <p>Status: {issue.status}</p>
              <button onClick={() => unassignIssue(issue.id)}>Unassign</button>
            </div>
          ))
        ) : <p>No issues assigned.</p>}
      </div>
    </div>
  );
};

export default Profile;






  
   

          



