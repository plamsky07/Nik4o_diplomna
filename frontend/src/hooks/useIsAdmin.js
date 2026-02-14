import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { isUserAdmin } from "../api/roles";

export default function useIsAdmin() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function run() {
      if (!user) return setIsAdmin(false);
      const ok = await isUserAdmin(user.uid);
      setIsAdmin(ok);
    }
    if (!loading) run();
  }, [user, loading]);

  return { isAdmin, loading };
}
