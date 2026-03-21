# 🚀 Code-Buddy - Collaborative Code Editor

**Code-Buddy** is a real-time collaborative coding platform 🧑‍💻👩‍💻 that lets developers code together in the browser, execute code in multiple languages instantly, and share sessions live — all from a modern web interface. Whether you're pair programming, tutoring, or doing coding interviews, Code-Buddy makes real-time collaboration effortless.

---

## 🎯 Project Goal

The main objective of **Code-Buddy** is to provide:
- A **real-time collaborative code editor** with live cursor tracking for seamless programming with peers.
- **Instant code execution** for 15+ programming languages powered by a self-hosted Piston engine.
- A **lightweight, browser-based IDE** that removes the need for setting up local environments.

---

## ✨ Features

- ⚡ **Real-Time Code Collaboration**  
  Edit and share code with others live — changes are synchronized instantly using Yjs CRDT + Socket.IO.

- 🖱️ **Live Cursor Tracking**  
  See other users' cursors and selections in real-time with color-coded labels using Yjs Awareness.

- 🌐 **Multi-Language Code Execution**  
  Run code in 15+ languages including Python, JavaScript, Java, C, C++, Go, Rust, Ruby, PHP, and more via a self-hosted Piston instance.

- 🗂️ **VS Code-Style File Tabs**  
  Open multiple files with tab navigation, unsaved indicators (dot), and close buttons — just like VS Code.

- 🖥️ **Monaco Editor**  
  The same editor that powers VS Code — syntax highlighting, IntelliSense, and more.

- 👥 **Connected Users Panel**  
  See who's in the room in real-time. Users appear when they join and disappear when they leave.

- 🔐 **User Authentication**  
  Sign up and log in securely with JWT-based sessions and MongoDB-backed user data.

- 💾 **File Persistence**  
  Files are saved to MongoDB. Ctrl+S saves and syncs to all users in the room instantly.

- 💬 **Chat Panel**  
  Communicate with room members without leaving the editor.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, TailwindCSS |
| Editor | Monaco Editor, Yjs, y-monaco |
| Real-time | Socket.IO, Yjs CRDT, Y-Awareness |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT |
| Code Execution | Piston (self-hosted on Railway) |

---

## 🏗️ Project Structure
```
Code-Buddy/
│
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── codeEditor/  # Monaco editor + tab bar
│   │   │   ├── sidebar/     # File explorer, chat, users, run panel
│   │   │   └── common/      # Shared components
│   │   ├── context/         # React contexts (Auth, Socket, File, Room, Execute)
│   │   ├── services/        # API service classes
│   │   └── types/           # Socket event types
│   
│
├── server/                  # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # Express routes
│   │   ├── socket.js        # Socket.IO + Yjs sync logic
│   │   └── execute.js       # Piston API integration
│  
│
└── .env
```

---

## 🛠️ Local Setup Guide

> 🧠 **Prerequisites:** Make sure you have **Node.js**, **npm**, and **MongoDB** installed.

---

### 📥 Step 1: Clone the Repository
```bash
git clone https://github.com/princekr969/Code-Buddy.git
cd Code-Buddy
```

---

### ⚙️ Step 2: Server Setup

1. Navigate to the server directory:
```bash
   cd server
```

2. Create a `.env` file:
```env
   PORT=5000
   MONGODB_CONNECTION=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   DEVELOPMENT_FRONTEND_URL=http://localhost:5173
   PRODUCTION_FRONTEND_URL=<your-production-frontend-url>
   PISTON_URL=https://poston-deploy-production.up.railway.app
```

3. Install dependencies:
```bash
   npm install
```

4. Start the backend:
```bash
   npm run dev
```

---

### 🎨 Step 3: Client Setup

1. Navigate to the client directory:
```bash
   cd client
```

2. Create a `.env` file:
```env
   VITE_BACKEND_URL=http://localhost:5173/
   VITE_REACT_APP_SOCKET_URL=http://localhost:5000
```

3. Install dependencies:
```bash
   npm install
```

4. Start the development server:
```bash
   npm run dev
```

---

### 🧰 Build and Run

From the root of the project:
```bash
docker-compose --env-file .env up --build
```

This will:
- Build and start the **backend** container (Node.js on port 5000)
- Build and start the **frontend** container (React + Nginx on port 80)
- Automatically connect both containers in a Docker network

Then open:
- Frontend → http://localhost:5173
- Backend API → http://localhost:3000

---

## 🌐 Code Execution Setup (Piston)

Code-Buddy uses a **self-hosted Piston** instance for code execution.

The public Piston API went whitelist-only in February 2026, so you need your own instance.

### Deploy Piston on Railway (Free)

1. Create a new project on [railway.app](https://railway.app)
2. Deploy from GitHub using the Piston Dockerfile
3. Set `PORT=8080` in Railway environment variables
4. Generate a public domain in Railway service settings
5. Install languages by running:
```bash
# install languages on your Piston instance
node scripts/installLanguages.js
```

6. Add your Piston URL to `.env`:
```env
PISTON_URL=https://your-piston-instance.up.railway.app
```

### Supported Languages

| Language | Extension |
|---|---|
| Python 3 | `.py` |
| JavaScript (Node.js) | `.js` |
| TypeScript | `.ts` |
| Java | `.java` |
| C / C++ (GCC) | `.c` / `.cpp` |
| Go | `.go` |
| Rust | `.rs` |
| Ruby | `.rb` |
| PHP | `.php` |
| Bash | `.sh` |
| Kotlin | `.kt` |
| Lua | `.lua` |
| Swift | `.swift` |
| Scala | `.scala` |
| Haskell | `.hs` |

---

## ✅ Verify Everything is Working

Once running:
1. Visit **http://localhost**
2. Sign up or log in
3. Create or join a room
4. Open a file and start coding
5. Share the room URL with a collaborator — see their cursor live 🎉
6. Press **Ctrl+S** to save
7. Click **Run** to execute code

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue to suggest features or report bugs.

If you'd like to contribute directly:

1. Fork the repository
2. Create a new branch:
```bash
   git checkout -b feature/YourFeature
```
3. Make your changes and commit:
```bash
   git commit -m "Add YourFeature"
```
4. Push to the branch:
```bash
   git push origin feature/YourFeature
```
5. Create a pull request ✅

---

## 📄 License

MIT License — feel free to use, modify and distribute.

---

Thank you for checking out Code-Buddy! <br>
Happy coding 👨‍💻👩‍💻