import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { auth, db } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [role, setRole]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef  = ref(db, `users/${firebaseUser.uid}`);
          const snapshot = await get(userRef);

          let userData;

          if (snapshot.exists()) {
            // ── User lama: ambil data yang sudah ada, jangan timpa ──
            userData = snapshot.val();
          } else {
            // ── User baru: auto-create dengan role "pending" ──
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

          setRole(userData.role);
          setUser({
            ...firebaseUser,
            role:        userData.role,
            status:      userData.status,
            displayName: userData.displayName || firebaseUser.email,
          });

        } catch (err) {
          console.error('AuthContext: gagal ambil/buat data user', err);
          await signOut(auth);
          setUser(null);
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
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