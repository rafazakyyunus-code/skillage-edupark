import React, { useState, useEffect, useRef } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../../firebase";

const googleProvider = new GoogleAuthProvider();
const ALLOWED_ROLES = ['admin', 'editor', 'writer'];

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);
const ArrowIcon = ({ flip }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: flip ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

function Login() {
  const [mode, setMode]         = useState('login');
  const [animating, setAnimating] = useState(false);
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const resetForm = () => {
    setName(''); setEmail(''); setPassword(''); setConfirm('');
    setErrorMsg(''); setSuccessMsg(''); setShowPass(false); setShowConf(false);
  };

  const [backState, setBackState] = useState('idle'); // 'idle' | 'moving' | 'arriving'

  const switchMode = (next) => {
    if (animating || next === mode) return;
    setAnimating(true);
    resetForm();

    // Phase 1: shrink + fade out
    setBackState('moving');

    // Phase 2: after slide completes, expand back in
    setTimeout(() => {
      setMode(next);
      setAnimating(false);
      setBackState('arriving');
    }, 480);

    // Phase 3: back to idle
    setTimeout(() => setBackState('idle'), 750);
  };

  const redirectByRole = (role) => {
    if (role === 'admin')        navigate('/dashboard/admin');
    else if (role === 'editor')  navigate('/dashboard/editor');
    else if (role === 'writer')  navigate('/dashboard/create-article');
    else if (role === 'pending') navigate('/waiting-approval');
    else navigate('/');
  };

  const handleLogin = async () => {
    if (!email || !password) { setErrorMsg('Email dan password wajib diisi.'); return; }
    setErrorMsg(''); setLoading(true);
    try {
      const { user: fu } = await signInWithEmailAndPassword(auth, email, password);
      const snap = await get(ref(db, `users/${fu.uid}`));
      let role;
      if (!snap.exists()) {
        // Auto-create user baru dengan role pending
        await set(ref(db, `users/${fu.uid}`), {
          uid: fu.uid, displayName: fu.email.split('@')[0],
          email: fu.email, role: 'pending', status: 'active', createdAt: Date.now(),
        });
        role = 'pending';
      } else {
        role = snap.val().role;
      }
      redirectByRole(role);
    } catch (err) {
      const map = {
        'auth/user-not-found': 'Email tidak terdaftar.',
        'auth/wrong-password': 'Password salah.',
        'auth/invalid-email': 'Format email tidak valid.',
        'auth/invalid-credential': 'Email atau password salah.',
        'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi nanti.',
        'auth/network-request-failed': 'Gagal terhubung ke server.',
      };
      setErrorMsg(map[err.code] || 'Login gagal. Silakan coba lagi.');
    } finally { setLoading(false); }
  };

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirm) { setErrorMsg('Semua field wajib diisi.'); return; }
    if (password !== confirm) { setErrorMsg('Password dan konfirmasi tidak cocok.'); return; }
    if (password.length < 6) { setErrorMsg('Password minimal 6 karakter.'); return; }
    setErrorMsg(''); setLoading(true);
    try {
      const { user: fu } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(fu, { displayName: name });
      await set(ref(db, `users/${fu.uid}`), {
        uid: fu.uid, displayName: name, email: fu.email,
        role: 'pending', status: 'active', createdAt: Date.now(),
      });
      await auth.signOut();
      setSuccessMsg('Akun berhasil dibuat! Silakan login. Admin akan mengaktifkan akun Anda.');
      setTimeout(() => switchMode('login'), 2000);
    } catch (err) {
      const map = {
        'auth/email-already-in-use': 'Email sudah digunakan.',
        'auth/invalid-email': 'Format email tidak valid.',
        'auth/weak-password': 'Password terlalu lemah.',
      };
      setErrorMsg(map[err.code] || 'Pendaftaran gagal. Coba lagi.');
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setErrorMsg(''); setGLoading(true);
    try {
      const { user: fu } = await signInWithPopup(auth, googleProvider);
      const snap = await get(ref(db, `users/${fu.uid}`));
      let role;
      if (!snap.exists()) {
        // User baru via Google → auto-create dengan role pending
        role = 'pending';
        await set(ref(db, `users/${fu.uid}`), {
          uid: fu.uid, displayName: fu.displayName || fu.email, email: fu.email,
          role, status: 'active', createdAt: Date.now(),
        });
      } else {
        role = snap.val().role;
      }
      redirectByRole(role);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') setErrorMsg('Login Google gagal. Coba lagi.');
    } finally { setGLoading(false); }
  };

  const onKey = (e) => { if (e.key === 'Enter') mode === 'login' ? handleLogin() : handleSignUp(); };
  const isLogin = mode === 'login';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .lp *, .lp *::before, .lp *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: #EEEEEE;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 20px;
        }

        /* ── outer card ── */
        .lp-card {
          position: relative;
          display: flex;
          width: 860px; max-width: 100%;
          min-height: 560px;
          border-radius: 24px;
          overflow: hidden;
          background: #fff;
          box-shadow:
            0 32px 80px rgba(47,160,132,0.18),
            0 8px 32px rgba(0,0,0,0.09);
          animation: lpCardIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes lpCardIn {
          from { opacity:0; transform: translateY(28px) scale(0.96); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }

        /* ── SLIDING PANEL (green) ── */
        .lp-panel {
          position: absolute;
          top: 0; bottom: 0;
          width: 44%;
          z-index: 20;
          background: linear-gradient(150deg, #6FCF97 0%, #2FA084 50%, #1a7a62 100%);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 48px 40px;
          overflow: hidden;
          transition: left 0.7s cubic-bezier(0.77,0,0.175,1);
        }
        .lp-panel.is-login  { left: 0; border-radius: 0 24px 24px 0; }
        .lp-panel.is-signup { left: 56%; border-radius: 24px 0 0 24px; }

        /* panel deco */
        .lp-panel-deco1 {
          position:absolute; top:-90px; left:-90px;
          width:300px; height:300px; border-radius:50%;
          background:rgba(255,255,255,0.10);
          pointer-events:none;
        }
        .lp-panel-deco2 {
          position:absolute; bottom:-70px; right:-50px;
          width:250px; height:250px; border-radius:50%;
          background:rgba(255,255,255,0.08);
          pointer-events:none;
        }
        .lp-panel-deco3 {
          position:absolute; top:50%; left:50%;
          transform:translate(-50%,-50%);
          width:220px; height:220px;
          border:2px solid rgba(255,255,255,0.12);
          border-radius:50%;
          pointer-events:none;
        }
        .lp-panel-deco4 {
          position:absolute; top:50%; left:50%;
          transform:translate(-50%,-50%);
          width:140px; height:140px;
          border:2px solid rgba(255,255,255,0.10);
          border-radius:50%;
          pointer-events:none;
        }
        .lp-panel svg.lp-panel-lines {
          position:absolute; inset:0; width:100%; height:100%;
          pointer-events:none;
        }

        /* panel text content */
        .lp-panel-content {
          position:relative; z-index:2;
          display:flex; flex-direction:column;
          align-items:center; text-align:center;
          gap: 16px;
        }
        .lp-panel-icon {
          width: 64px; height: 64px;
          background: rgba(255,255,255,0.18);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(8px);
          border: 1.5px solid rgba(255,255,255,0.30);
          margin-bottom: 4px;
        }
        .lp-panel-title {
          font-size: 22px; font-weight: 800;
          color: #fff; letter-spacing: 0.5px;
          line-height: 1.2;
        }
        .lp-panel-sub {
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.75);
          line-height: 1.6; max-width: 200px;
        }
        .lp-panel-btn {
          margin-top: 8px;
          background: rgba(255,255,255,0.18);
          border: 1.5px solid rgba(255,255,255,0.45);
          border-radius: 50px;
          padding: 11px 30px;
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700; font-size: 12px;
          letter-spacing: 2px; text-transform: uppercase;
          cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          transition: background 0.25s, border-color 0.25s, transform 0.15s;
          backdrop-filter: blur(4px);
        }
        .lp-panel-btn:hover {
          background: rgba(255,255,255,0.28);
          border-color: rgba(255,255,255,0.7);
          transform: translateY(-1px);
        }
        .lp-panel-btn:active { transform: scale(0.97); }

        /* ── FORM SIDE ── */
        .lp-form-login, .lp-form-signup {
          position: absolute;
          top: 0; bottom: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 40px 48px;
          width: 56%;
          transition: left 0.7s cubic-bezier(0.77,0,0.175,1), opacity 0.4s ease;
        }
        .lp-form-login {
          right: 0; left: 44%;
        }
        .lp-form-login.is-signup-mode {
          left: 0; opacity: 0; pointer-events: none;
        }
        .lp-form-signup {
          left: 0; opacity: 0; pointer-events: none;
          right: auto; width: 56%;
        }
        .lp-form-signup.is-signup-mode {
          left: 0; opacity: 1; pointer-events: auto;
        }
        .lp-form-signup.is-login-mode {
          left: 0; opacity: 0; pointer-events: none;
        }

        /* form content fade-in stagger */
        .lp-form-inner {
          width: 100%;
          display: flex; flex-direction: column;
          align-items: center;
        }
        .lp-form-inner > * {
          animation: fadeSlideUp 0.45s cubic-bezier(0.22,1,0.36,1) both;
        }
        .lp-form-inner > *:nth-child(1) { animation-delay: 0.08s; }
        .lp-form-inner > *:nth-child(2) { animation-delay: 0.13s; }
        .lp-form-inner > *:nth-child(3) { animation-delay: 0.18s; }
        .lp-form-inner > *:nth-child(4) { animation-delay: 0.23s; }
        .lp-form-inner > *:nth-child(5) { animation-delay: 0.28s; }
        .lp-form-inner > *:nth-child(6) { animation-delay: 0.33s; }
        .lp-form-inner > *:nth-child(7) { animation-delay: 0.38s; }
        .lp-form-inner > *:nth-child(8) { animation-delay: 0.43s; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* logo */
        .lp-logo { width: 52px; height: 52px; margin-bottom: 6px; }

        /* title */
        .lp-title {
          font-size: 20px; font-weight: 800;
          color: #2FA084; letter-spacing: 3px;
          margin-bottom: 4px;
        }
        .lp-sub {
          font-size: 12px; color: #aaa; font-weight: 500;
          margin-bottom: 24px; letter-spacing: 0.3px;
        }

        /* inputs */
        .lp-field {
          width: 100%; position: relative;
          margin-bottom: 14px;
        }
        .lp-field-icon {
          position: absolute; left: 0; top: 50%;
          transform: translateY(-50%);
          color: #c0c0c8; display: flex;
          align-items: center; pointer-events: none;
        }
        .lp-input {
          width: 100%; border: none;
          border-bottom: 1.5px solid #e2e2ec;
          padding: 11px 32px 11px 24px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13.5px; color: #333;
          background: transparent; outline: none;
          transition: border-color 0.25s;
        }
        .lp-input::placeholder { color: #bbb; font-size: 13px; }
        .lp-input:focus { border-bottom-color: #2FA084; }

        .lp-eye {
          position: absolute; right: 0; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; color: #bbb;
          display: flex; align-items: center;
          padding: 4px; transition: color 0.2s;
        }
        .lp-eye:hover { color: #2FA084; }

        /* row */
        .lp-row {
          width: 100%; display: flex;
          align-items: center; justify-content: space-between;
          margin-bottom: 20px; margin-top: 2px;
        }
        .lp-remember {
          display: flex; align-items: center;
          gap: 8px; cursor: pointer;
          font-size: 12px; color: #999; user-select: none;
        }
        .lp-cb {
          width: 15px; height: 15px;
          border: 1.5px solid #ddd; border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; flex-shrink: 0;
        }
        .lp-cb.on { background: #2FA084; border-color: #2FA084; }

        .lp-forgot {
          font-size: 12px; color: #2FA084; font-weight: 600;
          cursor: pointer; background: none; border: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .lp-forgot:hover { text-decoration: underline; }

        /* messages */
        .lp-error {
          width: 100%; font-size: 12px;
          color: #e05c5c; text-align: center;
          margin-bottom: 10px; font-weight: 500;
        }
        .lp-success {
          width: 100%; font-size: 12px;
          color: #2FA084; text-align: center;
          margin-bottom: 10px; font-weight: 600;
        }

        /* main button */
        .lp-btn {
          background: linear-gradient(135deg, #6FCF97, #2FA084);
          border: none; border-radius: 50px;
          padding: 13px 52px; color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800; font-size: 12.5px;
          letter-spacing: 2.5px; cursor: pointer;
          box-shadow: 0 6px 22px rgba(47,160,132,0.35);
          transition: box-shadow 0.2s, transform 0.15s;
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 18px; white-space: nowrap;
        }
        .lp-btn:hover { box-shadow: 0 8px 30px rgba(47,160,132,0.5); transform: translateY(-1px); }
        .lp-btn:active { transform: scale(0.98); }
        .lp-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

        /* divider */
        .lp-divider {
          width: 100%; display: flex;
          align-items: center; gap: 10px; margin-bottom: 14px;
        }
        .lp-div-line { flex:1; height:1px; background:#ececf2; }
        .lp-div-txt { font-size: 11px; color: #bbb; font-weight: 600; letter-spacing: 0.5px; white-space: nowrap; }

        /* google btn */
        .lp-google {
          width: 100%; display: flex;
          align-items: center; justify-content: center; gap: 10px;
          border: 1.5px solid #e4e4ee; border-radius: 10px;
          padding: 11px 20px; background: white;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 600; color: #444;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .lp-google:hover {
          border-color: #6FCF97; background: #f5fdf9;
          box-shadow: 0 2px 14px rgba(47,160,132,0.12);
        }
        .lp-google:disabled { opacity: 0.55; cursor: not-allowed; }

        /* back button (follows panel) */
        .lp-back-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px;
          background: rgba(255,255,255,0.18);
          border: 1.5px solid rgba(255,255,255,0.45);
          border-radius: 50px;
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700; font-size: 12px;
          letter-spacing: 1px;
          cursor: pointer;
          backdrop-filter: blur(4px);
          white-space: nowrap;
          transition:
            left   0.7s cubic-bezier(0.4,0,0.2,1),
            right  0.7s cubic-bezier(0.4,0,0.2,1),
            opacity 0.35s ease,
            transform 0.35s cubic-bezier(0.4,0,0.2,1),
            background 0.25s,
            border-color 0.25s,
            box-shadow 0.25s;
          will-change: left, right, transform, opacity;
        }
        .lp-back-btn:hover {
          background: rgba(255,255,255,0.30);
          border-color: rgba(255,255,255,0.75);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .lp-back-btn:active { transform: scale(0.95) !important; opacity: 0.85 !important; }
        .lp-back-btn.is-moving {
          opacity: 0.5;
          transform: scale(0.88);
        }
        .lp-back-btn.is-arriving {
          opacity: 1;
          transform: scale(1);
        }
        .lp-back-btn .lp-back-arrow {
          display: flex; align-items: center;
          transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
        }
        .lp-back-btn.flipped .lp-back-arrow {
          transform: rotate(180deg);
        }

        /* spinners */
        .sp { width:14px; height:14px; border-radius:50%; animation: spin .7s linear infinite; flex-shrink:0; }
        .sp-w { border: 2px solid rgba(255,255,255,0.3); border-top-color: white; }
        .sp-g { border: 2px solid rgba(47,160,132,0.2); border-top-color: #2FA084; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 620px) {
          .lp-panel { display: none; }
          .lp-form-login, .lp-form-signup { position: relative; width:100%; left:0 !important; top:auto; bottom:auto; }
          .lp-form-login.is-signup-mode { display: none; }
          .lp-form-signup { opacity: 1; pointer-events: auto; }
          .lp-form-signup.is-login-mode { display: none; }
          .lp-form-signup.is-signup-mode { display: flex; }
          .lp-card { min-height: auto; }
        }
      `}</style>

      <div className="lp">
        <div className="lp-card">

          {/* ── BACK BUTTON (follows the green panel) ── */}
          <button
            onClick={() => navigate("/")}
            className={`lp-back-btn${backState === 'moving' ? ' is-moving' : backState === 'arriving' ? ' is-arriving' : ''}${!isLogin ? ' flipped' : ''}`}
            style={{
              position: "absolute",
              top: "16px",
              ...(isLogin ? { left: "16px", right: "auto" } : { right: "16px", left: "auto" }),
              zIndex: 30,
              transition: "left 0.7s cubic-bezier(0.77,0,0.175,1), right 0.7s cubic-bezier(0.77,0,0.175,1)",
            }}
          >
            <span className="lp-back-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
            </span>
            Kembali ke Website
          </button>

          {/* ── SLIDING GREEN PANEL ── */}
          <div className={`lp-panel ${isLogin ? 'is-login' : 'is-signup'}`}>
            <div className="lp-panel-deco1" />
            <div className="lp-panel-deco2" />
            <div className="lp-panel-deco3" />
            <div className="lp-panel-deco4" />
            <svg className="lp-panel-lines" viewBox="0 0 320 560" preserveAspectRatio="none">
              <line x1="0" y1="480" x2="320" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="80"/>
              <line x1="-20" y1="560" x2="280" y2="0" stroke="rgba(255,255,255,0.04)" strokeWidth="50"/>
            </svg>

            <div className="lp-panel-content">
              <div className="lp-panel-icon">
                {isLogin ? (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/>
                    <line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                )}
              </div>
              <p className="lp-panel-title">
                {isLogin ? 'Halo, Selamat\nDatang!' : 'Bergabung\nBersama Kami'}
              </p>
              <p className="lp-panel-sub">
                {isLogin
                  ? 'Belum punya akun? Daftar sekarang dan mulai perjalananmu.'
                  : 'Sudah punya akun? Login dan lanjutkan aktivitasmu.'}
              </p>
              <button
                className="lp-panel-btn"
                onClick={() => switchMode(isLogin ? 'signup' : 'login')}
                disabled={animating}
              >
                {isLogin ? 'SIGN UP' : 'LOGIN'}
                <ArrowIcon flip={!isLogin} />
              </button>
            </div>
          </div>

          {/* ── LOGIN FORM ── */}
          <div className={`lp-form-login ${isLogin ? '' : 'is-signup-mode'}`}>
            <div className="lp-form-inner" key={`login-${mode}`}>
              <svg className="lp-logo" viewBox="0 0 54 54" fill="none">
                <rect x="4" y="4" width="20" height="20" rx="4" stroke="#2FA084" strokeWidth="2.2" fill="none"/>
                <rect x="30" y="4" width="20" height="20" rx="4" stroke="#2FA084" strokeWidth="2.2" fill="none"/>
                <rect x="4" y="30" width="20" height="20" rx="4" stroke="#2FA084" strokeWidth="2.2" fill="none"/>
                <rect x="30" y="30" width="20" height="20" rx="4" stroke="#6FCF97" strokeWidth="2.2" fill="none"/>
                <rect x="17" y="17" width="20" height="20" rx="4" fill="#2FA084" opacity="0.15"/>
                <rect x="20" y="20" width="14" height="14" rx="3" fill="#2FA084" opacity="0.6"/>
              </svg>
              <h1 className="lp-title">LOGIN</h1>
              <p className="lp-sub" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                Selamat datang kembali
                {/* Ikon Tangan Melambai (Wave) */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#f59e0b' }}>
                  <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5" />
                  <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
                  <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4.5" />
                  <path d="M6 10V8a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5c0 4.42 3.58 8 8 8h3a6 6 0 0 0 6-6V11" />
                </svg>
              </p>

              <div className="lp-field">
                <span className="lp-field-icon"><EmailIcon /></span>
                <input className="lp-input" type="email" placeholder="Email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={onKey} autoComplete="email"/>
              </div>
              <div className="lp-field">
                <span className="lp-field-icon"><LockIcon /></span>
                <input className="lp-input" type={showPass ? 'text' : 'password'}
                  placeholder="Password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={onKey} autoComplete="current-password"/>
                <button className="lp-eye" type="button" onClick={() => setShowPass(v => !v)}>
                  {showPass ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              {errorMsg && <p className="lp-error">{errorMsg}</p>}

              <div className="lp-row">
                <label className="lp-remember" onClick={() => setRemember(v => !v)}>
                  <div className={`lp-cb${remember ? ' on' : ''}`}>
                    {remember && <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>}
                  </div>
                  Remember me
                </label>
                <button className="lp-forgot" type="button">Forgot Password?</button>
              </div>

              <button className="lp-btn" type="button" onClick={handleLogin} disabled={loading || gLoading}>
                {loading ? <><div className="sp sp-w"/> Masuk...</> : 'LOGIN'}
              </button>

              <div className="lp-divider">
                <div className="lp-div-line"/>
                <span className="lp-div-txt">OR CONTINUE WITH</span>
                <div className="lp-div-line"/>
              </div>

              <button className="lp-google" type="button" onClick={handleGoogle} disabled={loading || gLoading}>
                {gLoading ? <div className="sp sp-g"/> : <GoogleIcon />}
                {gLoading ? 'Menghubungkan...' : 'Sign in with Google'}
              </button>
            </div>
          </div>

          {/* ── SIGN UP FORM ── */}
          <div className={`lp-form-signup ${isLogin ? 'is-login-mode' : 'is-signup-mode'}`}>
            <div className="lp-form-inner" key={`signup-${mode}`}>
              <svg className="lp-logo" viewBox="0 0 54 54" fill="none">
                <rect x="4" y="4" width="20" height="20" rx="4" stroke="#2FA084" strokeWidth="2.2" fill="none"/>
                <rect x="30" y="4" width="20" height="20" rx="4" stroke="#2FA084" strokeWidth="2.2" fill="none"/>
                <rect x="4" y="30" width="20" height="20" rx="4" stroke="#2FA084" strokeWidth="2.2" fill="none"/>
                <rect x="30" y="30" width="20" height="20" rx="4" stroke="#6FCF97" strokeWidth="2.2" fill="none"/>
                <rect x="17" y="17" width="20" height="20" rx="4" fill="#2FA084" opacity="0.15"/>
                <rect x="20" y="20" width="14" height="14" rx="3" fill="#2FA084" opacity="0.6"/>
              </svg>
              <h1 className="lp-title">SIGN UP</h1>
              <p className="lp-sub" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                Buat akun baru
                {/* Ikon Sparkles / Kilauan */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#eab308' }}>
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/>
                  <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z"/>
                  <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z"/>
                </svg>
              </p>

              <div className="lp-field">
                <span className="lp-field-icon"><UserIcon /></span>
                <input className="lp-input" type="text" placeholder="Nama Lengkap"
                  value={name} onChange={e => setName(e.target.value)} onKeyDown={onKey}/>
              </div>
              <div className="lp-field">
                <span className="lp-field-icon"><EmailIcon /></span>
                <input className="lp-input" type="email" placeholder="Email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={onKey} autoComplete="email"/>
              </div>
              <div className="lp-field">
                <span className="lp-field-icon"><LockIcon /></span>
                <input className="lp-input" type={showPass ? 'text' : 'password'}
                  placeholder="Password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={onKey} autoComplete="new-password"/>
                <button className="lp-eye" type="button" onClick={() => setShowPass(v => !v)}>
                  {showPass ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <div className="lp-field">
                <span className="lp-field-icon"><LockIcon /></span>
                <input className="lp-input" type={showConf ? 'text' : 'password'}
                  placeholder="Konfirmasi Password" value={confirm}
                  onChange={e => setConfirm(e.target.value)} onKeyDown={onKey}/>
                <button className="lp-eye" type="button" onClick={() => setShowConf(v => !v)}>
                  {showConf ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              {errorMsg   && <p className="lp-error">{errorMsg}</p>}
              {successMsg && <p className="lp-success">{successMsg}</p>}

              <button className="lp-btn" type="button" onClick={handleSignUp} disabled={loading || gLoading}
                style={{ marginTop: '4px' }}>
                {loading ? <><div className="sp sp-w"/> Mendaftar...</> : 'SIGN UP'}
              </button>

              <div className="lp-divider">
                <div className="lp-div-line"/>
                <span className="lp-div-txt">OR CONTINUE WITH</span>
                <div className="lp-div-line"/>
              </div>

              <button className="lp-google" type="button" onClick={handleGoogle} disabled={loading || gLoading}>
                {gLoading ? <div className="sp sp-g"/> : <GoogleIcon />}
                {gLoading ? 'Menghubungkan...' : 'Sign up with Google'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Login;