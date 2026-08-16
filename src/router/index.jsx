import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Dashboard from '../pages/Dashboard';
import Tasks from '../pages/Tasks';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import ProtectedRoute from '../components/common/ProtectedRoute';

export const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        {
          path: '/',
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: '/tasks',
          element: (
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          ),
        },
        {
          path: '/profile',
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
      ],
    },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '*', element: <NotFound /> },
  ],
  { basename: import.meta.env.BASE_URL }
);
