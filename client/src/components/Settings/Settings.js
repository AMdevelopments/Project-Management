import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Settings.scss'; // Assume you have some CSS for styling

const Settings = () => {
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/settings');
      setSettings(response.data);
    } catch (error) {
      console.error("Failed to fetch settings", error);
    }
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      {settings.map((setting, index) => (
        <div key={index} className="setting-item">
          <h2>{setting.name}</h2>
          <p>{setting.value}</p>
        </div>
      ))}
    </div>
  );
};

export default Settings;
