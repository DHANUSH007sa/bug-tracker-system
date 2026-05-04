# Bug Tracker System

A full-stack bug tracking application built with Express, MongoDB, and React. This system provides user authentication, bug reporting, status tracking, and a responsive dashboard for managing software issues.

## Screenshots

> Placeholder for app screenshots

- Screenshot 1: Login / Register flow
- Screenshot 2: Dashboard overview
- Screenshot 3: Bug list with filters
- Screenshot 4: Bug detail and status update

## Tech Stack

- Backend: Node.js, Express
- Database: MongoDB Atlas, Mongoose
- Authentication: JSON Web Tokens (JWT), bcrypt
- Frontend: React, React Router, Axios
- Styling: Tailwind CSS, custom CSS

## Local Setup

### 1. Clone repository

```bash
git clone https://github.com/DHANUSH007sa/bug-tracker-system.git
cd bug-tracker-system
```

### 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
# Update .env with your MongoDB connection string and JWT secret
npm start
```

### 3. Frontend setup

```bash
cd ../client
npm install
npm run dev
```

### 4. Access the app

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Features

- User registration and login with JWT authentication
- Protected routes for dashboard and bug management
- Create, read, update, and delete bugs
- Bug status updates and severity labels
- Search and filter bugs by status, severity, and project
- Responsive UI for mobile and desktop

## Folder Structure

```text
bug-tracker-system/
├── client/              # React frontend
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.js
├── server/              # Express backend
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── index.js
├── README.md
└── LICENSE
```

## API Endpoints

### Auth

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive a JWT token

### Bugs

- `GET /api/bugs` - List all bugs (authenticated)
- `POST /api/bugs` - Create a new bug (authenticated)
- `GET /api/bugs/:id` - Get a bug by ID (authenticated)
- `PUT /api/bugs/:id` - Update a bug by ID (authenticated)
- `DELETE /api/bugs/:id` - Delete a bug by ID (authenticated)

## License

MIT
