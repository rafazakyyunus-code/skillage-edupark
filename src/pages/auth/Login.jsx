import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../../firebase";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@200;300;400;500&display=swap');

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .login-root {
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Exo 2', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .login-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .login-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 120% 60% at 50% 80%, rgba(180,160,140,0.18) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 30% 60%, rgba(100,120,150,0.25) 0%, transparent 55%),
      radial-gradient(ellipse 60% 40% at 70% 55%, rgba(80,100,130,0.2) 0%, transparent 55%);
  }

  .card-outer {
    position: relative;
    z-index: 1;
    width: 360px;
    animation: cardIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .lock-badge {
    position: absolute;
    top: -22px;
    left: 50%;
    transform: translateX(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(200,215,230,0.28);
    border: 1.5px solid rgba(255,255,255,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 14px rgba(0,0,0,0.25);
  }

  .login-card {
    width: 100%;
    background: rgba(180, 200, 220, 0.18);
    backdrop-filter: blur(22px) saturate(1.2);
    -webkit-backdrop-filter: blur(22px) saturate(1.2);
    border: 1.5px solid rgba(255,255,255,0.28);
    border-radius: 6px;
    padding: 52px 32px 28px;
    box-shadow:
      0 8px 32px rgba(0,0,0,0.28),
      inset 0 1px 0 rgba(255,255,255,0.35),
      inset 0 -1px 0 rgba(255,255,255,0.1);
  }

  .input-row {
    display: flex;
    align-items: center;
    background: rgba(230,240,250,0.18);
    border: 1.5px solid rgba(255,255,255,0.3);
    border-radius: 4px;
    padding: 0 14px;
    margin-bottom: 14px;
    transition: border-color 0.2s, background 0.2s;
  }

  .input-row:focus-within {
    border-color: rgba(255,255,255,0.6);
    background: rgba(230,240,250,0.26);
  }

  .input-icon {
    color: rgba(255,255,255,0.5);
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-right: 10px;
  }

  .field-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 13px 0;
    font-family: 'Exo 2', sans-serif;
    font-size: 14px;
    font-weight: 300;
    color: rgba(255,255,255,0.88);
    letter-spacing: 0.4px;
  }

  .field-input::placeholder {
    color: rgba(255,255,255,0.42);
  }

  .eye-toggle {
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(255,255,255,0.4);
    padding: 0;
    display: flex;
    align-items: center;
    transition: color 0.2s;
    flex-shrink: 0;
  }
  .eye-toggle:hover { color: rgba(255,255,255,0.75); }

  .remember-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 16px 0 22px;
    padding: 0 2px;
  }

  .remember-label {
    font-size: 12px;
    font-weight: 300;
    color: rgba(255,255,255,0.62);
    letter-spacing: 0.3px;
  }

  .toggle-track {
    width: 40px;
    height: 22px;
    border-radius: 11px;
    background: rgba(255,255,255,0.18);
    border: 1.5px solid rgba(255,255,255,0.3);
    position: relative;
    cursor: pointer;
    transition: background 0.25s, border-color 0.25s;
    flex-shrink: 0;
  }

  .toggle-track.on {
    background: rgba(92, 92, 93, 0.26);
    border-color: rgba(255,255,255,0.6);
  }

  .toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgba(255,255,255,0.85);
    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
    box-shadow: 0 1px 4px rgba(0,0,0,0.25);
  }

  .toggle-track.on .toggle-thumb {
    transform: translateX(18px);
  }

  .login-btn {
    width: 100%;
    background: rgba(200,220,240,0.20);
    border: 1.5px solid rgba(255,255,255,0.32);
    border-radius: 4px;
    padding: 13px 0;
    color: rgba(255,255,255,0.82);
    font-family: 'Exo 2', sans-serif;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 4px;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
    backdrop-filter: blur(4px);
  }

  .login-btn:hover {
    background: rgba(210,230,250,0.30);
    border-color: rgba(255,255,255,0.5);
    color: rgba(255,255,255,0.98);
  }

  .login-btn:active { transform: scale(0.98); }
  .login-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .error-msg {
    font-size: 12px;
    color: rgba(255, 120, 120, 0.9);
    text-align: center;
    margin-bottom: 12px;
    letter-spacing: 0.3px;
  }

  .spinner {
    width: 14px;
    height: 14px;
    border: 1.5px solid rgba(255,255,255,0.3);
    border-top-color: rgba(255,255,255,0.85);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 420px) {
    .card-outer { width: 88vw; }
  }
`;

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const KeyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5"/>
    <path d="m21 2-9.6 9.6"/>
    <path d="m15.5 7.5 3 3L22 7l-3-3"/>
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
);

// Role yang diizinkan masuk ke CMS
const ALLOWED_ROLES = ['admin', 'editor', 'writer'];

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrorMsg('');
    setLoading(true);

    try {
      // 1. Sign in dengan Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 2. Ambil data role dari Realtime Database: /users/{uid}
      const userRef = ref(db, `users/${firebaseUser.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        await auth.signOut();
        setErrorMsg('Akun tidak ditemukan di database. Hubungi admin.');
        setLoading(false);
        return;
      }

      const userData = snapshot.val();
      const userRole = userData.role;

      // 3. Cek apakah role diizinkan
      if (!ALLOWED_ROLES.includes(userRole)) {
        await auth.signOut();
        setErrorMsg('Akses ditolak: Role Anda tidak diizinkan masuk.');
        setLoading(false);
        return;
      }

      // 4. Simpan ke localStorage
      localStorage.setItem('role', userRole);
      localStorage.setItem('user', JSON.stringify({ uid: firebaseUser.uid, email: firebaseUser.email, role: userRole }));

      // 5. Redirect berdasarkan role
      if (userRole === 'admin') navigate('/dashboard/admin');
      else if (userRole === 'editor') navigate('/dashboard/editor');
      else if (userRole === 'writer') navigate('/dashboard/create-article');
      else navigate('/');

    } catch (err) {
      console.error('Login error:', err.code);

      // Pesan error yang ramah
      const errorMessages = {
        'auth/user-not-found': 'Email tidak terdaftar.',
        'auth/wrong-password': 'Password salah.',
        'auth/invalid-email': 'Format email tidak valid.',
        'auth/invalid-credential': 'Email atau password salah.',
        'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi nanti.',
        'auth/network-request-failed': 'Gagal terhubung ke server. Cek koneksi internet.',
      };

      setErrorMsg(errorMessages[err.code] || 'Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        <div
          className="login-bg"
          style={{
            backgroundImage: "url('./public/login-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(3px) brightness(0.7)',
            transform: 'scale(1.05)',
          }}
        />

        <div className="card-outer">
          <div className="lock-badge">
            <LockIcon />
          </div>

          <div className="login-card">
            {/* Email */}
            <div className="input-row">
              <span className="input-icon"><UserIcon /></span>
              <input
                className="field-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="input-row">
              <span className="input-icon"><KeyIcon /></span>
              <input
                className="field-input"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowPass((v) => !v)}
                aria-label="Toggle password visibility"
              >
                {showPass ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* Error message */}
            {errorMsg && <p className="error-msg">{errorMsg}</p>}

            {/* Remember Me */}
            <div className="remember-row">
              <span className="remember-label">Remember Me</span>
              <div
                className={`toggle-track${remember ? ' on' : ''}`}
                onClick={() => setRemember((v) => !v)}
                role="switch"
                aria-checked={remember}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setRemember((v) => !v)}
              >
                <div className="toggle-thumb" />
              </div>
            </div>

            {/* Login button */}
            <button
              type="button"
              className="login-btn"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? <><div className="spinner" /> Masuk...</> : 'LOGIN'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;