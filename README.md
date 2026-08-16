# ⚡ TaskSphere

> A modern, responsive task management application built with **React 18** and **Tailwind CSS**. Features drag-and-drop workflow management, mock JWT authentication, live countdown timers, and optimistic UI updates.

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.style=for-the-badge)

🔗 **Live Demo:** [devproject-five.vercel.app](https://devproject-five.vercel.app)

---

## ✨ Features

- 🔐 **Authentication & Session:** Mock JWT-based Login and Register flow, local persistence, auto token expiration (1-hour TTL), and silent session cleanup.
- 🛡️ **Protected Routing:** Declarative route guards redirecting unauthorized guests safely.
- 📋 **Kanban Task Board:** Organize tasks visually under `Pending`, `In Progress`, and `Completed` columns.
- 🖐️ **Drag and Drop:** Effortlessly move tasks between status columns.
- ⏳ **Deadline & Countdowns:** Real-time countdowns for task deadlines with visual alerts for overdue tasks.
- ⚡ **Optimistic UI Updates:** Instant UI feedback on task modifications with automatic rollback on network failure.
- 👤 **Per-User Isolation:** Data is strictly scoped per user account.
- 🎨 **Profile Management:** Avatar support with default initials or custom profile image updates.
- 🌙 **Modern Dark Theme:** Styled using Tailwind CSS with mobile-first responsive layout.

---

## 🛠️ Tech Stack

- **Frontend Core:** React 18, Vite
- **Routing:** React Router v6 (Data Routers & Declarative `<Navigate />`)
- **State Management:** React Context API + `useReducer`
- **Styling:** Tailwind CSS
- **Data & Storage:** `json-server` (Mock HTTP REST API) & `localStorage` fallback

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Naill-dev/devproject.git](https://github.com/Naill-dev/devproject.git)
   cd devproject
Install dependencies:

Bash
npm install
Start the Mock API server (Optional if using localStorage fallback):

Bash
npm run server
Launch the development server:

Bash
npm run dev
Open your browser and navigate to http://localhost:5173.

📂 Project Structure
src/
├── main.jsx
├── App.jsx
├── index.css
├── router/
│   └── index.jsx
├── context/
│   ├── AuthContext.jsx
│   └── TaskContext.jsx
├── services/
│   └── api.js
├── pages/
│   ├── Dashboard.jsx
│   ├── Tasks.jsx
│   ├── Profile.jsx
│   └── NotFound.jsx
└── components/
    ├── auth/
    │   ├── Login.jsx
    │   └── Register.jsx
    ├── tasks/
    │   ├── TaskForm.jsx
    │   └── TaskItem.jsx
    └── common/
        ├── Layout.jsx
        ├── Navbar.jsx
        ├── ProtectedRoute.jsx
        └── ErrorBoundary.jsx
📝 Scripts
npm run dev — Starts Vite dev server.

npm run build — Builds production-ready static assets.

npm run preview — Previews the production build locally.

npm run server — Runs json-server for mock backend integration.

📄 License
This project is licensed under the MIT License.
