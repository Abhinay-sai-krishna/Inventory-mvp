# SaaS Inventory MVP

A lightweight, purely functional SaaS Inventory Management System built as an MVP. 

## Core Features
1. **Authentication**: Simple Signup and Login tailored for organizations.
2. **Dashboard Overview**: Quick statistics displaying Total Products, Total Overall Quantity, and Low Stock alerts.
3. **Product Management**: Full CRUD operations (Add, View, Edit, Delete) for inventory items.
4. **Low Stock Tracker**: Automatically highlights products dropping below a safe stock threshold (quantity <= 10).

## Tech Stack
- **Frontend:** HTML5, Vanilla CSS, Vanilla JS
- **Backend:** Node.js, Express.js
- **Database:** SQLite3

## Project Structure
- `server/` - Express backend and SQLite database connection logic.
- `client/` - Frontend assets including styles and UI logic.

## How to Run Locally

1. **Install dependencies**
   Make sure you have Node installed, then run:
   ```bash
   npm install
   ```

2. **Start the application**
   ```bash
   npm start
   ```

3. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`

## Deployment
This app can easily be hosted on services like Render, Railway, or Heroku as a simple Node.js web service. Set the build command to `npm install` and the run command to `npm start`.
