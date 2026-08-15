import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../../context/AuthContext';

export default function Layout() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Yalnız daxil olan istifadəçilərə Navbar göstər */}
      {isAuthenticated && <Navbar />}
      <main className={`max-w-7xl mx-auto px-4 py-6 ${!isAuthenticated ? 'min-h-screen flex items-center justify-center' : ''}`}>
        <Outlet /> {/* Burada səhifələr render olunacaq */}
      </main>
    </>
  );
}
