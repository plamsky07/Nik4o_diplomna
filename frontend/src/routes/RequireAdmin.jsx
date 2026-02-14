import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { isUserAdmin } from "../api/roles";

export default function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    async function check() {
      if (!user) return setIsAdmin(false);
      const ok = await isUserAdmin(user.uid);
      setIsAdmin(ok);
    }
    if (!loading) check();
  }, [user, loading]);

  if (loading || isAdmin === null) return <div className="p-6">Зареждане...</div>;
  if (!user) return <Navigate to="/vhod" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}
