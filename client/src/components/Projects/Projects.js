//Projects.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Projects.scss';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'open',
  });

  // Correctly retrieve the logged-in user's ID
  const userId = localStorage.getItem('user_id'); // Ensure this key matches how you store it

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects');
      // Update to ensure that username or some identifier is displayed
      setProjects(response.data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  const handleAddProject = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/projects', {
        ...newProject,
        // Optionally add user_id if you want to automatically assign to the creator
        user_id: userId
      });
      console.log('Project added:', response.data);
      fetchProjects(); // Refetch projects to display the newly added one
      setNewProject({ title: '', description: '', status: 'open' }); // Reset form
    } catch (error) {
      console.error("Failed to add project", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleAssignToUser = async (projectId) => {
    try {
      await axios.put(`http://localhost:5000/api/projects/${projectId}`, {
        user_id: userId // Assign the project to the logged-in user
      });
      fetchProjects(); // Refetch projects to update the assignment
    } catch (error) {
      console.error("Failed to assign project to user", error);
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/projects/${projectId}`, {
        status: newStatus
      });
      fetchProjects(); // Refetch projects to update the status
    } catch (error) {
      console.error("Failed to change project status", error);
    }
  };

  return (
    <div className="projects-container">
      <h1>Projects</h1>
      {/* Project creation form */}
      <div className="add-project-form">
        <input
          name="title"
          type="text"
          placeholder="Title"
          value={newProject.title}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newProject.description}
          onChange={handleInputChange}
        />
        <select name="status" value={newProject.status} onChange={handleInputChange}>
          <option value="open">Open</option>
          <option value="in progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button onClick={handleAddProject}>Add Project</button>
      </div>
      {/* Projects list */}
      {projects.map((project) => (
        <div key={project.id} className="project-item">
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <p>Status:
            <select onChange={(e) => handleStatusChange(project.id, e.target.value)} value={project.status}>
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </p>
         {/* Display the username if available, otherwise show 'None' */}
    <p>Assigned to: {project.username ? project.username : 'None'}</p>
          {/* Button to assign project to the logged-in user */}
          <button onClick={() => handleAssignToUser(project.id)}>Assign to Me</button>
        </div>
      ))}
    </div>
  );
};

export default Projects;







