// Issues.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Issues.scss';

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    projectId: '',
    status: 'open',
  });
  const [projects, setProjects] = useState([]);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    fetchProjects();
    fetchIssues();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  const fetchIssues = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/issues');
      setIssues(response.data.map(issue => ({
        ...issue,
        assigned_to: issue.assigned_to || 'None' // Adjust according to your API response
      })));
    } catch (error) {
      console.error("Failed to fetch issues", error);
    }
  };

  const handleAddIssue = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/issues', {
        ...newIssue,
        userId, // Adjust according to how your backend expects this data
      });
      console.log('Issue added:', response.data);
      fetchIssues();
      setNewIssue({ title: '', description: '', projectId: '', status: 'open' });
    } catch (error) {
      console.error("Failed to add issue", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIssue(prev => ({ ...prev, [name]: value }));
  };

  const assignIssueToUser = async (issueId) => {
    try {
      await axios.put(`http://localhost:5000/api/issues/${issueId}/assign`, { userId });
      fetchIssues();
    } catch (error) {
      console.error("Failed to assign issue", error);
    }
  };

  const unassignIssueFromUser = async (issueId) => {
    try {
      await axios.put(`http://localhost:5000/api/issues/${issueId}/unassign`);
      fetchIssues();
    } catch (error) {
      console.error("Failed to unassign issue", error);
    }
  };

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/issues/${issueId}`, { status: newStatus });
      fetchIssues();
    } catch (error) {
      console.error("Failed to update issue status", error);
    }
  };

  return (
    <div className="issues-container">
      <h1>Issues</h1>
      <div className="issue-form">
        <input type="text" placeholder="Title" value={newIssue.title} onChange={handleInputChange} name="title" />
        <textarea placeholder="Description" value={newIssue.description} onChange={handleInputChange} name="description" />
        <select value={newIssue.projectId} onChange={handleInputChange} name="projectId">
          <option value="">Select Project</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.title}</option>
          ))}
        </select>
        <select value={newIssue.status} onChange={handleInputChange} name="status">
          <option value="open">Open</option>
          <option value="in progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button onClick={handleAddIssue}>Add Issue</button>
      </div>
      {issues.map(issue => (
        <div key={issue.id} className="issue-item">
          <h2>{issue.title}</h2>
          <p>Description: {issue.description}</p>
          <p>Status:
            <select value={issue.status} onChange={e => handleStatusChange(issue.id, e.target.value)}>
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </p>
          <p>Assigned to: {issue.assigned_to}</p>
          {issue.user_id ? (
            <button onClick={() => unassignIssueFromUser(issue.id)}>Unassign</button>
          ) : (
            <button onClick={() => assignIssueToUser(issue.id)}>Assign to Me</button>
          )}
          <p>Project ID: {issue.projectId}</p>
        </div>
      ))}
    </div>
  );
};

export default Issues;
