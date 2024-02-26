# Project Management App

## Introduction

The Project Management App is a full-stack web application designed to help teams manage their projects and tasks efficiently. It allows users to register, log in, create and assign projects, track issues, and update their status.

## Features

- **User Authentication:** Register new users and manage user login sessions.
- **Project Management:** Users can create, assign, and manage projects.
- **Issue Tracking:** Allows users to create, assign, and track issues related to specific projects.
- **Dynamic Assignments:** Multiple users can assign projects and issues to themselves.

## Tech Stack

- **Frontend:** React, SCSS for styling.
- **Backend:** Flask (Python) for handling API requests.
- **Database:** MySQL for data storage.
- **Authentication:** Utilizes JWT for secure user authentication.

## Getting Started

### Prerequisites

Before you begin, ensure you have installed:

- Python 3.8+
- Node.js 14.x+
- MySQL 8.0+
- npm (usually comes with Node.js)

### Setup Instructions

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
   Install the required Python dependencies:
   pip install -r requirements.txt

Start the Flask application:
python app.py

The backend server will start on http://localhost:5000.

#### Frontend Setup

Navigate to the frontend directory (assuming it is named client):
cd client

Install the required Node.js packages:
npm install

Start the React application:
npm start

The frontend will be available on http://localhost:3000.

### Usage

After setting up both the backend and frontend, you can access the Project Management App through your browser at http://localhost:3000. From there, you can register a new account, log in, and start managing your projects and issues.

### Contributing

Contributions to the Project Management App are welcome. Please fork the repository, make your changes, and submit a pull request for review.

### License

This project is licensed under the MIT License - see the LICENSE.md file for details.
