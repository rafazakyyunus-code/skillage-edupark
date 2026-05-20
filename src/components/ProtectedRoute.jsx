import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">Memuat...</p>
      </div>
    );
  }

  // Belum login → ke halaman login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Sudah login tapi role tidak diizinkan → 403
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-red-600">Akses Ditolak</h1>
        <p className="text-gray-500">
          Role kamu (<strong>{userRole}</strong>) tidak memiliki akses ke halaman ini.
        </p>
        <a href="/login" className="text-green-600 underline text-sm">
          Kembali ke Login
        </a>
      </div>
    );
  }

  return children;
}