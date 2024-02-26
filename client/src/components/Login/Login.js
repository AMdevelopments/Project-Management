// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user ID and login state to localStorage
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('isLoggedIn', 'true'); // Set login state to true

        // Redirect to the user's profile page
        navigate(`/profile/${data.user_id}`);
      } else {
        // Handle errors, maybe display a message to the user
        console.error('Login failed:', data.message);
        // Optionally, update the state to show an error message here
      }
    } catch (error) {
      // Handle errors, maybe display a message to the user
      console.error('An error occurred during login:', error);
      // Optionally, update the state to show an error message here
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;




















