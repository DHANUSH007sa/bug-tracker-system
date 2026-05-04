# 🐛 BugTracker System

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## About The Project

BugTracker System is a polished full-stack issue management application built for product teams, developers, and QA engineers. It includes secure authentication, role-based access, bug reporting, triaging, and interactive dashboards with search and filtering.

This repo is designed to demonstrate real-world application architecture, professional UI design, and modern web development best practices.

## Features

- ✅ User authentication with role-based access control
- ✅ Create, assign, update, and manage software bugs
- ✅ Bug list filtering, sorting, and pagination
- ✅ Responsive dashboard and project overview
- ✅ Secure backend with Express, MongoDB, and JWT
- ✅ Professional Tailwind CSS UI with modern interactions

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express, JWT Authentication |
| Database | MongoDB, Mongoose |
| Deployment / Tools | Vite, Nodemon, dotenv |

## Getting Started

Follow these instructions to run the project locally.

### 1. Clone repo

```bash
git clone https://github.com/DHANUSH007sa/bug-tracker-system.git
cd bug-tracker-system
```

### 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
# update .env with MONGO_URI and JWT_SECRET
npm start
```

### 3. Frontend setup

```bash
cd ../client
npm install
npm run dev
```

### 4. Access locally

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## API Endpoints

| Route | Method | Description |
| --- | --- | --- |
| `/api/auth/register` | POST | Register a new user |
| `/api/auth/login` | POST | Login and receive JWT |
| `/api/users` | GET | Get all users (protected) |
| `/api/bugs` | GET | Fetch all bugs (protected) |
| `/api/bugs` | POST | Create a new bug (protected) |
| `/api/bugs/:id` | GET | Fetch bug details (protected) |
| `/api/bugs/:id` | PUT | Update a bug (protected) |
| `/api/bugs/:id` | DELETE | Delete a bug (protected) |

## Folder Structure

```text
bug-tracker-system/
├── client/              # React frontend
│   ├── public/          # Static assets
│   ├── src/             # React source code
│   │   ├── api/         # Axios setup
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth provider and hooks
│   │   ├── pages/       # App screens and routes
│   │   ├── services/    # API client definitions
│   │   └── styles/      # Custom CSS styles
│   ├── package.json
│   └── vite.config.js
├── server/              # Express backend
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── package.json
│   └── index.js
├── README.md
└── LICENSE
```

## Screenshots

> [screenshot] Login and registration experience

> [screenshot] Dashboard summary and activity feed

> [screenshot] Bugs list with filters and pagination

> [screenshot] Detailed bug view with assignment actions

## Role Based Access

| Role | Access |
| --- | --- |
| `admin` | Full access to manage users, bugs, and delete records |
| `developer` | Create and update bug details, change status, assign bugs |
| `reporter` | Create bugs, view dashboard, and submit issue reports |

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add feature'
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

Please keep contributions clean, well-documented, and aligned with the current design.

## License

Distributed under the MIT License. See `LICENSE` for more information.
