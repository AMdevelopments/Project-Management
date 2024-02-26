// App.js
import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Profile from './components/Profile/Profile';
import Projects from './components/Projects/Projects';
import Issues from './components/Issues/Issues';
import Homepage from './components/Homepage/Homepage'; // Make sure the path is correct
import './App.scss';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Homepage />} /> {/* Homepage route */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/issues" element={<Issues />} />
            {/* Add other routes as needed */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;












