# ♾️⚡ RootLoop
> **The Developer's Neural Network.**  
> Code Storage. Encrypted Comms. Global News.

👉 **[Live Demo](https://rootloop.up.railway.app/)** 👈

---

## 🟢 System Overview

**RootLoop** is a comprehensive **MERN-style platform (MySQL, Express, React, Node)** designed specifically for developers. It serves as a centralized hub where users can securely store code snippets, network with other developers, exchange real-time encrypted messages, and stay updated with the latest tech news.

The architecture is split into a **Vite-powered React Client** and a robust **Node.js/Express Server**, ensuring high performance and a modern "Cyberpunk" aesthetic.

Final project developed by me for the start2impact Full Stack Development and AI Agents Master.

---

## 📂 Project Structure

```
rootloop/
├── client/                 # Frontend Application (Vite + React)
│   ├── public/             # Static assets (Favicon)
│   └── src/
│       ├── assets/         # Logos and Images
│       ├── components/     # Reusable UI Components (Navbar, Cards, Modals)
│       ├── context/        # Global State Management (AuthContext)
│       └── pages/          # Main Views (Home, Login, Social, News)
│
└── server/                 # Backend API (Node.js + Express)
    ├── index.js            # Main Server Entry Point
    └── database.sql          # Database Structure (Tables & Relations)
```

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Core**: React, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database Driver**: MySQL
- **Security**: BcryptJS (Hashing), JWT (Sessions), CORS

### Database
- **Cloud Hosting**: Railway (App & DB)
- **Database**: MySQL (Relational data for Users, Snippets, Friendships, Messages and Notifications)
- **Deployment**: Continuous Deployment from GitHub

---

## 🚀 Key Features

### 1. 🔐 Authentication & Security
- **JWT Authorization**: Stateless and secure session management.
- **Bcrypt Encryption**: All passwords are hashed before storage.
- **Protected Routes**: Middleware ensures sensitive data is only accessible to authenticated nodes.

### 2. ⚡ The Vault (Snippets)
- **Code Management**: Create, Read, Update, and Delete (CRUD) code snippets.
- **Syntax Highlighting**: Visual support for various programming languages.
- **One-Click Copy**: Rapidly copy code blocks to the clipboard.

### 3. 🌐 The Network (Social)
- **Node Discovery**: Search for other users by username.
- **Friendship Protocol**: Send, Accept, or Reject connection requests.
- **Profile Analytics**: View connection counts and user stats.

### 4. 💬 Encrypted Comms (Chat)
- **Direct Messaging**: Real-time messaging between connected nodes.
- **Persistent History**: Chat logs are stored securely in the database.
- **Auto-Scroll UI**: Automatically jumps to the newest message.

### 5. 🔔 System Logs (Notifications)
- **Real-time Alerts**: Notifications for friend requests and messages.
- **Optimistic UI**: Instant visual feedback when marking logs as read.
- **Mobile Optimized**: Fully responsive notification center for mobile devices.

### 6. ⚠️ Danger Zone
- **Node Termination**: Irreversible account deletion.
- **Cascading Delete**: Automatically purges all associated data (snippets, chats, friendships) from the database upon termination.

---

## ⚙️ Local Development Guide

**Note**: The project is live! You don't need to install it to test it. However, if you want to run a local instance for development purposes, follow these steps.

### Prerequisites
- Node.js
- MySQL Server (Local or Cloud)
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/sadsotti/rootloop.git
cd rootloop
```

### Step 2: Database Configuration

1. Create a new database named `rootloop_db`.
2. Execute the script found in `server/database.sql` to create tables.

### Step 3: Backend Setup

Navigate to `/server`, install dependencies, and create a `.env` file:

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder with your credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=rootloop_db
JWT_SECRET=your_super_secure_secret_key
PORT=5000
```

Start the Server:

```bash
npm start
# Console should output: "Server running on port 5000"
# and "Connected to MySQL database"
```

### Step 4: Frontend Setup

Navigate to `/client`, install dependencies, and create a `.env` file:

```bash
cd client
npm install
```

File: `client/.env`

```bash
VITE_API_URL=http://localhost:5000/api
```

Start the Client:

```bash
npm run dev
```

Open your browser and navigate to the Local URL provided by Vite (usually `http://localhost:5173`).

---

## 📡 API Endpoints (Brief Overview)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user node |
| POST | `/api/auth/login` | Authenticate and retrieve JWT |
| GET | `/api/snippets` | Retrieve user's snippets |
| POST | `/api/snippets` | Create a new snippet |
| GET | `/api/users/search` | Search for other users |
| POST | `/api/friends/request` | Send friend request |
| GET | `/api/messages/:id` | Get chat history with user :id |

---

## 🎨 Cyberpunk Design Philosophy

RootLoop embraces a dark, futuristic aesthetic inspired by cyberpunk culture. The UI features neon accents, grid patterns, and terminal-style typography to create an immersive developer experience.

---

## 🔧 Troubleshooting

### Common Issues

**Issue**: Cannot connect to MySQL database  
**Solution**: Verify your `.env` credentials and ensure MySQL server is running.

**Issue**: Port 5000 already in use  
**Solution**: Change the `PORT` value in your `.env` file or kill the process using port 5000.

**Issue**: Module not found errors  
**Solution**: Delete `node_modules` folders and `package-lock.json`, then run `npm install` again.

---

## 🔗 Useful Links

- https://www.start2impact.it/  
- https://linkedin.com/in/lorenzo-sottile  

---
