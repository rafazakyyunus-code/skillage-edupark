import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ── Halaman khusus user dengan role "pending" ──────────────────────────────
function WaitingApprovalPage() {
  const { user, logout } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F4F6F8',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: '20px',
      gap: '0',
    }}>
      {/* Card */}
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '48px 40px',
        maxWidth: '440px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 8px 40px rgba(47,160,132,0.12), 0 2px 12px rgba(0,0,0,0.06)',
      }}>
        {/* Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e8f8f3, #c6efe3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2FA084" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>

        {/* Label status */}
        <span style={{
          display: 'inline-block',
          background: '#FFF3CD',
          color: '#856404',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '4px 12px',
          borderRadius: '99px',
          marginBottom: '16px',
        }}>
          Status: Pending
        </span>

        <h1 style={{
          fontSize: '22px',
          fontWeight: '800',
          color: '#1a2e2a',
          lineHeight: '1.3',
          marginBottom: '12px',
        }}>
          MENUNGGU PERSETUJUAN ADMIN
        </h1>

        <p style={{
          fontSize: '14px',
          color: '#5a7a72',
          lineHeight: '1.7',
          marginBottom: '32px',
        }}>
          Akun kamu telah terdaftar dengan email{' '}
          <strong style={{ color: '#2FA084' }}>{user?.email}</strong>.
          <br />
          Silahkan tunggu admin mengaktifkan akun.
        </p>

        {/* Divider */}
        <div style={{ height: '1px', background: '#eef2f0', marginBottom: '24px' }} />

        <button
          onClick={logout}
          style={{
            width: '100%',
            padding: '12px',
            border: '1.5px solid #d0e8e0',
            borderRadius: '10px',
            background: 'transparent',
            color: '#2FA084',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.target.style.background = '#f0faf6'}
          onMouseLeave={e => e.target.style.background = 'transparent'}
        >
          Keluar
        </button>
      </div>

      <p style={{ marginTop: '20px', fontSize: '12px', color: '#9ab0aa' }}>
        Edupark CMS — Hubungi admin jika butuh bantuan
      </p>
    </div>
  );
}

// ── ProtectedRoute ────────────────────────────────────────────────────────
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}>
        <p style={{ color: '#9ab0aa', fontSize: '14px' }}>Memuat...</p>
      </div>
    );
  }

  // Belum login → ke halaman login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role "pending" → selalu ke halaman tunggu, blokir semua rute lain
  if (userRole === 'pending') {
    return <WaitingApprovalPage />;
  }

  // Role tidak cocok dengan rute yang diminta → 403
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        fontFamily: 'sans-serif',
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626' }}>Akses Ditolak</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Role kamu (<strong>{userRole}</strong>) tidak memiliki akses ke halaman ini.
        </p>
        <a href="/login" style={{ color: '#2FA084', fontSize: '13px', textDecoration: 'underline' }}>
          Kembali ke Login
        </a>
      </div>
    );
  }

  return children;
}

// Export WaitingApprovalPage jika perlu dipakai standalone di App Router
export { WaitingApprovalPage };