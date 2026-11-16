# 📝 Notely – A Modern MERN Notes Application

**Notely** is a full-stack note-taking web application built using the MERN stack (MongoDB, Express.js, React.js, and Node.js). It provides users with a personal workspace where they can create, manage, edit, and delete their notes through a clean and modern interface.

The application features a modern SaaS-inspired design with Light and Dark modes, responsive layouts, user authentication, and a dashboard for managing personal notes.

---

## ✨ Features

### 1. User Authentication
- User registration and login.
- Secure password hashing using bcryptjs.
- JWT-based authentication.
- Protected routes for authenticated users.
- Persistent login using browser local storage.

### 2. Notes Management
- Create new notes with a title and description.
- View all personal notes.
- Edit existing notes.
- Delete notes.
- Notes are associated with their respective users.
- Automatic creation and update timestamps.

### 3. Modern User Interface
- Modern SaaS-style dashboard.
- Light and Dark theme support.
- Responsive interface.
- Sidebar navigation.
- Attractive note cards.
- Search functionality.
- Grid and list view options.
- Redesigned login and registration pages.

### 4. Database Management
- MongoDB Atlas integration.
- Mongoose schemas and models.
- User-specific note storage.
- Secure password storage.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Vite | Frontend development server and build tool |
| Tailwind CSS v4 | Styling and responsive design |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modeling |
| JWT | User authentication |
| bcryptjs | Password hashing |
| Axios | HTTP requests between frontend and backend |
| React Router | Frontend navigation |

---

## 📁 Project Structure

```text
mern-notes-app/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Note.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   └── notes.js
│   │
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── NoteModal.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ How to Run the Project Locally

Follow these instructions to set up the project on your computer.

### Step 1: Prerequisites

Make sure you have installed:

- [Node.js (LTS)](https://nodejs.org/)
- npm (included with Node.js)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- MongoDB Atlas account

### Step 2: Clone the Repository

Open your terminal and execute:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate into the project directory:

```bash
cd mern-notes-app-main
```

### Step 3: Install Backend Dependencies

From the project root directory, execute:

```bash
npm install
```

This installs the backend dependencies.

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory of the project.

Add the following variables:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secure_jwt_secret
```

**Environment variable explanation:**

- `PORT`: Port on which the Express backend runs.
- `MONGO_URI`: MongoDB Atlas connection string.
- `JWT_SECRET`: Secret key used to generate and verify authentication tokens.

**Important:** Replace the example values with your actual credentials. Never upload your `.env` file to GitHub or share database credentials with others.

### Step 5: Start the Backend Server

Open the first terminal in the project root:

```bash
npm run dev
```

If everything is configured correctly, you should see:

```text
Server started at port 5000
MongoDB connected: your-cluster-hostname
```

The backend will be available at:

```text
http://localhost:5000
```

### Step 6: Install Frontend Dependencies

Open a second terminal in VS Code.

Navigate to the frontend directory:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

### Step 7: Start the Frontend

Execute:

```bash
npm run dev
```

Vite will display a local development URL, usually:

```text
http://localhost:5173
```

Open this URL in your browser.

**Congratulations! Your Notely application is now running locally.**

---

## 🔄 How the Application Works

The application follows a client-server architecture.

### 1. Frontend

The React frontend provides the user interface.

Users interact with the application to:
- Register or log in.
- Create notes.
- View their notes.
- Edit and delete notes.
- Search through notes.
- Switch between Light and Dark themes.

Axios sends HTTP requests to the backend API.

### 2. Backend

The Express.js backend handles:
- Incoming API requests.
- User registration and login.
- Password hashing and verification.
- JWT token generation and verification.
- Notes CRUD operations.
- Communication with MongoDB.

### 3. Database

MongoDB stores two main collections:

**Users Collection**
- Username
- Email
- Hashed password
- Created and updated timestamps

**Notes Collection**
- Title
- Description
- CreatedBy (user reference)
- Created and updated timestamps

Each note is associated with the user who created it.

### 4. Authentication Flow

1. A user registers with their username, email, and password.
2. The backend hashes the password using bcryptjs.
3. The user is saved in MongoDB.
4. The backend generates a JWT token.
5. The frontend stores the token in local storage.
6. Authenticated requests send the token through the Authorization header.
7. Backend middleware verifies the token before allowing access to protected routes.

### 5. Frontend and Backend Communication

Vite is configured to proxy `/api` requests to the backend running on port 5000.

This allows the frontend to make requests such as:

```javascript
axios.post("/api/users/login", {
  email,
  password
});
```

No separate frontend API base URL is required for local development.

---

## 🔗 API Endpoints

The backend provides the following REST API endpoints.

### Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/register` | Register a new user |
| POST | `/api/users/login` | Log in an existing user |
| GET | `/api/users/me` | Get authenticated user details |

### Notes APIs

All notes endpoints require a valid JWT token in the Authorization header.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notes` | Fetch all notes belonging to the authenticated user |
| POST | `/api/notes` | Create a new note |
| PUT | `/api/notes/:id` | Update an existing note |
| DELETE | `/api/notes/:id` | Delete a note |

**Authorization header example:**

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🧪 Testing the Application

After starting both servers:

1. Open `http://localhost:5173`.
2. Register a new account.
3. Log in using your credentials.
4. Create a new note.
5. Edit an existing note.
6. Delete a note.
7. Test the search functionality.
8. Switch between Light and Dark modes.
9. Refresh the browser and verify your login session.

---

## ⚠️ Common Issues and Solutions

| Problem | Possible Solution |
|---|---|
| MongoDB connection error | Verify the MongoDB URI and Atlas Network Access settings |
| `Server error` during registration | Check backend terminal logs and MongoDB connectivity |
| Port 5000 already in use | Stop the other process or configure another port |
| Frontend cannot connect to backend | Ensure the backend is running on port 5000 |
| Missing dependencies | Run `npm install` in the appropriate directory |
| JWT authentication error | Verify the JWT secret and login again |

---

## 👥 Team Development Guidelines

To keep development organized, all team members should follow these practices:

1. Pull the latest changes before starting work.

```bash
git pull origin main
```

2. Create a separate branch for new features.

```bash
git checkout -b feature/your-feature-name
```

3. Make changes and test them locally.

4. Commit your changes.

```bash
git add .
git commit -m "Add your feature description"
```

5. Push your branch.

```bash
git push origin feature/your-feature-name
```

6. Create a Pull Request for review before merging into the main branch.

### Important Team Rules

- Never commit `.env` files.
- Do not expose MongoDB credentials or JWT secrets.
- Avoid directly modifying another team member's work without coordination.
- Test your changes before creating a Pull Request.
- Keep code organized and use meaningful commit messages.

---

## 🚀 Future Improvements

The following features can be considered for future development:

- Persistent Favorites and Archived notes.
- Categories and tags management.
- Rich-text note editor.
- Note sharing and collaboration.
- Image and file attachments.
- Password reset functionality.
- Advanced filtering and sorting.
- Note export functionality.
- Improved security and automated testing.

---

## 📌 Project Information

**Project Name:** Notely – MERN Notes App

**Project Type:** Full-Stack Web Application

**Technology:** MERN Stack

**Database:** MongoDB Atlas

**Frontend:** React.js + Vite + Tailwind CSS

**Backend:** Node.js + Express.js

**Authentication:** JWT + bcryptjs

**Purpose:** To provide users with a simple, secure, and modern digital workspace for managing personal notes.

---

## 📄 License

This project is developed for educational and collaborative development purposes.

---

**Notely – A calmer place for your thoughts.** 📝
