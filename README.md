```md
# TaskSphere

A modern task management web app built with React. Create, update, and organize tasks with an optional deadline countdown, drag-and-drop status board, and mock authentication.

**Live demo:** [https://devproject-five.vercel.app](https://devproject-five.vercel.app)

---

## Features

- Mock authentication (login / logout) with session persistence
- Protected routes — unauthenticated users are redirected to login
- Task board with three columns: Pending, In Progress, Completed
- Drag and drop to change task status
- Create, edit, and delete tasks
- Optional deadline with live countdown and overdue state
- Form validation on auth and task forms
- Optimistic UI updates with rollback on failure
- Profile page with avatar initials or custom photo
- Responsive dark UI with Tailwind CSS

---

## Tech Stack

- React 18
- Vite
- React Router v6
- Context API + useReducer
- Tailwind CSS
- localStorage (mock data & session)

---

## Getting Started

```bash
git clone https://github.com/Naill-dev/devproject.git
cd devproject
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

---

## Demo Account

| Field | Value |
|-------|--------|
| Email | `demo@tasksphere.com` |
| Password | `Task2026!` |

This is a mock login for local/demo use only. There is no real backend.

---

## Project Structure

```text
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
│   └── Profile.jsx
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
```

---

## How It Works

- **Auth:** Credentials are checked against a mock user. A token and expiry time are stored in `localStorage`. On refresh, the session is restored if it is still valid.
- **Tasks:** Data is stored in `localStorage` via a small mock API layer with artificial delay. The UI updates optimistically; failed requests roll back state.
- **Deadlines:** Optional. If set, a countdown runs on the task card. When time is up, the card shows an overdue state.

---

## Author

**Nail Mammadov**  
GitHub: [Naill-dev](https://github.com/Naill-dev)

---

## License

MIT
```
