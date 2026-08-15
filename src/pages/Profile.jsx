import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Profil</h1>
      <div className="card max-w-md">
        <p><strong>Ad:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Rol:</strong> {user?.role}</p>
        <button onClick={logout} className="btn-danger mt-4">Çıxış et</button>
      </div>
    </div>
  );
}
