import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, get, set, onValue, off } from 'firebase/database';
import { auth, db } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [role, setRole]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Simpan referensi listener role agar bisa di-cleanup
  const roleListenerRef = useRef(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {

      // Bersihkan listener role sebelumnya (saat logout / ganti akun)
      if (roleListenerRef.current) {
        off(roleListenerRef.current);
        roleListenerRef.current = null;
      }

      if (firebaseUser) {
        try {
          const userRef = ref(db, `users/${firebaseUser.uid}`);
          const snapshot = await get(userRef);

          let userData;

          if (snapshot.exists()) {
            // User lama: ambil data yang sudah ada, jangan timpa
            userData = snapshot.val();
          } else {
            // User baru: auto-create dengan role "pending"
            const newUser = {
              uid:         firebaseUser.uid,
              displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              email:       firebaseUser.email,
              role:        'pending',
              status:      'active',
              createdAt:   Date.now(),
            };
            await set(userRef, newUser);
            userData = newUser;
          }

          // Set state awal
          setRole(userData.role);
          setUser({
            ...firebaseUser,
            role:        userData.role,
            status:      userData.status,
            displayName: userData.displayName || firebaseUser.email,
          });
          setLoading(false);

          // ─── REALTIME LISTENER UNTUK PERUBAHAN ROLE ───────────────────
          // Ini yang fix masalah utama: ketika admin approve user di dashboard,
          // role di Firebase DB berubah → listener ini langsung trigger →
          // state role di sini langsung update TANPA perlu logout/login ulang
          roleListenerRef.current = userRef;
          onValue(userRef, (snap) => {
            if (!snap.exists()) return;
            const latestData = snap.val();

            setRole(latestData.role);
            setUser((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                role:        latestData.role,
                status:      latestData.status,
                displayName: latestData.displayName || prev.email,
              };
            });
          });
          // ──────────────────────────────────────────────────────────────

        } catch (err) {
          console.error('AuthContext: gagal ambil/buat data user', err);
          await signOut(auth);
          setUser(null);
          setRole(null);
          setLoading(false);
        }
      } else {
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      // Bersihkan role listener saat komponen unmount
      if (roleListenerRef.current) {
        off(roleListenerRef.current);
        roleListenerRef.current = null;
      }
    };
  }, []);

  const logout = async () => {
    // Bersihkan listener sebelum logout
    if (roleListenerRef.current) {
      off(roleListenerRef.current);
      roleListenerRef.current = null;
    }
    await signOut(auth);
    setUser(null);
    setRole(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, role, userRole: role, loading, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);