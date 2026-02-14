// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { listenAuth } from "../api/auth";
import { auth } from "../api/firebase";

const AuthContext = createContext(null);

function mapUser(u) {
  if (!u) return null;
  return {
    uid: u.uid,
    email: u.email || "",
    emailVerified: !!u.emailVerified,
    displayName: u.displayName || "",
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenAuth((u) => {
      setUser(mapUser(u));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  function refreshUser() {
    setUser(mapUser(auth.currentUser));
  }

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}


