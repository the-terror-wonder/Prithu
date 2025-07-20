# Prithu - Intelligent Route Optimizer

<p align="center">
  <img src="client/public/logo-full.png" alt="Prithu Logo" width="400"/>
</p>

**Prithu** is a full-stack MERN application designed to solve the Traveling Salesperson Problem (TSP) for real-world logistics. It provides users with the most efficient route between multiple stops, saving valuable time, fuel, and effort.

This project was built as a comprehensive portfolio piece to showcase a wide range of skills, from backend architecture and advanced algorithms to a modern, interactive, and aesthetically pleasing frontend design.

### 🔗 Live Demo  
[https://prithu.netlify.app/](https://prithu.netlify.app/)

---

## 🎯 Project Goals & Motivation

The primary motivation behind Prithu was to create a project that stands out in internship interviews by tackling a high-value, real-world problem. The goal was to move beyond simple CRUD apps and demonstrate a deep understanding of both practical web development and fundamental computer science principles.

### This was achieved by focusing on three key areas:

- **Solving a Real Problem**  
Route optimization is a multi-billion dollar challenge faced by logistics companies daily. This project shows an ambition to use technology to provide tangible business value.

- **Implementing Data Structures & Algorithms (DSA)**  
The core of the project is a custom-built solution to the Traveling Salesperson Problem, utilizing a 2-Opt heuristic. This demonstrates a strong grasp of graph theory and complex algorithms.

- **Demonstrating Full-Stack MERN Skills**  
The project proves the ability to handle the entire development lifecycle, from creating a secure backend API with a database to building a polished, interactive frontend in React.

---

## ✨ Features

- 🔐 **Secure User Authentication**  
  JWT-based registration and login system.

- 🚀 **Advanced Route Optimization**  
  Implements a 2-Opt heuristic to solve the TSP, providing a highly efficient route.

- 🗺️ **Interactive Map Interface**
  - Click-to-add stops with "snap-to-road" functionality via the Openrouteservice API.
  - Interactive popups on markers to display information and actions.
  - Dynamic route highlighting that responds to UI interaction.

- 🧭 **Full CRUD Functionality**
  - **Saved Places**: Users can save, name, and delete frequent locations.
  - **Saved Routes**: Entire multi-stop routes can be saved, named, reloaded, and deleted.

- 🕓 **Session & History Management**
  - Automatically logs optimized routes from the current session.
  - A clean, tabbed interface to manage planning and historical data.

- 📊 **Detailed Analytics**
  - An overlay panel displays total distance, estimated time, and a per-stop breakdown of the journey.

- 💎 **Polished & Performant UI/UX**
  - A cohesive, brand-aligned theme across all pages.
  - Collapsible UI panels and interactive hover effects.
  - Frontend actions are debounced to prevent excessive API calls and ensure a smooth user experience.

---

## 🔮 Future Enhancements

- 🧲 **Draggable Map Markers**  
  Allow users to fine-tune a stop's location by dragging its marker on the map.

- 🔃 **Manual Stop Reordering**  
  Implement drag-and-drop functionality in the sidebar list to allow for manual route adjustments.

- 🚚 **Vehicle Profiles**  
  Add an option to select a vehicle type (e.g., Car, Truck) to get routes optimized for that specific profile.

- ⏰ **Time Windows (TSPTW)**  
  Allow users to specify delivery time windows (e.g., "Arrive between 10 AM and 12 PM"), requiring a more advanced TSP with Time Windows algorithm.

- 🖨️ **Printable Route Manifest**  
  Generate a clean, text-based summary of the route for drivers.

---

## 🛠️ Tech Stack

### Backend
- **Node.js** – JavaScript runtime environment  
- **Express** – Web framework for Node.js  
- **MongoDB** – NoSQL database for storing user data, places, and routes  
- **Mongoose** – ODM for MongoDB  
- **JWT** – For secure user authentication  
- **Nodemailer** – Handles the feedback/suggestions form  
- **Openrouteservice API** – For geocoding, distance matrix, and route geometry

### Frontend
- **React** – JavaScript library for building UIs (with Hooks)  
- **Vite** – Lightning-fast build tool  
- **Tailwind CSS** – Utility-first CSS framework  
- **Leaflet & React-Leaflet** – For map interaction  
- **Axios** – For making API requests

---
## 📸 Screenshots

### 1. The Landing Page  
A modern, dark-themed landing page that explains the project's value proposition and includes a functional feedback form.  
<br>  
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/288f509c-b26f-4576-8944-02672f3ec758" />
<br>

---

### 2. Secure Authentication  
Clean, professional, and responsive login and registration pages.  
<br>  
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/c3492034-721f-4793-92df-5b5c71f23d01" />
<br>

---

### 3. The Dashboard & Route Planner  
The main user interface, featuring a dark-themed sidebar for planning and a clear, light-themed map for interaction.  
<br>  
<img width="1915" height="1079" alt="image" src="https://github.com/user-attachments/assets/3ee1e4bf-fb5f-4c78-b6e0-c36f0795efdb" />
 
<br>

---

### 4. Optimized Route & Interactive Summary  
An optimized route on the map, with an interactive summary panel that highlights the path when you hover over a segment.  
<br>  
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/cb6ecea6-01dd-4bb3-8b9e-25fc4774f645" />

<br>

---

### 5. History & Saved Data Management  
The history tab, showing session history and permanently saved routes in collapsible panels.  
<br>  
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/9ab0ca23-7bfd-4f81-a4e1-be285f823a80" />

<br>

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v18 or later)  
- npm or yarn  
- MongoDB Atlas account or local MongoDB instance  
- Openrouteservice API Key

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/prithu-project.git
cd prithu-project
```

---

### 2. Backend Setup

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file in the /server directory with the following:
PORT=5001
MONGO_URI=<YOUR_MONGO_CONNECTION_STRING>
JWT_ACCESS_SECRET=<YOUR_JWT_SECRET>
ORS_API_KEY=<YOUR_ORS_API_KEY>
EMAIL_USER=<YOUR_GMAIL_ADDRESS>
EMAIL_PASS=<YOUR_GMAIL_APP_PASSWORD>

# Start the backend server
npm start
```

---

### 3. Frontend Setup

```bash
# From the root directory, navigate to client
cd client

# Install dependencies
npm install

# Create a .env file in /client with:
VITE_API_URL=http://localhost:5001/api

# Start the frontend dev server
npm run dev
```

---

### 4. Running Both Simultaneously

```bash
# From root directory
npm install concurrently

# Then
npm start
```

---

## 🚀 Deployment

- **Frontend** hosted on [Netlify](https://www.netlify.com/)  
- **Backend API** hosted on [Render](https://render.com/)

CORS policies are configured to allow communication between frontend and backend.

---

## 🪪 License

This project is licensed under the **MIT License**.
