import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../api/firebase";
import { getNewInquiriesCount, listenForNewInquiries } from "../api/inquiries";
import { useAuth } from "../contexts/AuthContext";
import useIsAdmin from "../hooks/useIsAdmin";

function linkClass({ isActive }) {
  return `nav-link${isActive ? " active" : ""}`;
}

export default function Navbar() {
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const [newInq, setNewInq] = useState(0);
  const initialLoadedRef = useRef(false);
  const lastCountRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function loadCount() {
      if (!isAdmin) {
        setNewInq(0);
        lastCountRef.current = 0;
        initialLoadedRef.current = false;
        return;
      }

      try {
        const count = await getNewInquiriesCount();
        if (cancelled) return;
        setNewInq(count);
        lastCountRef.current = count;
        initialLoadedRef.current = true;
      } catch {
        if (cancelled) return;
        setNewInq(0);
        lastCountRef.current = 0;
        initialLoadedRef.current = true;
      }
    }

    loadCount();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;

    const unsubscribe = listenForNewInquiries((newItems) => {
      const count = newItems.length;
      setNewInq(count);

      if (initialLoadedRef.current && count > lastCountRef.current) {
        toast.success("Имате ново запитване.");
      }

      lastCountRef.current = count;
    });

    return () => unsubscribe();
  }, [isAdmin]);

  async function handleLogout() {
    await signOut(auth);
  }

  const userLabel = user
    ? user.displayName?.trim() || user.email.split("@")[0]
    : "";

  return (
    <header className="site-nav">
      <div className="site-container site-nav-row">
        <div className="brand">
          <span className="brand-mark">TA</span>
          <span>TateAuto</span>
        </div>

        <nav className="nav-links">
          <NavLink to="/" className={linkClass}>
            Начало
          </NavLink>
          <NavLink to="/katalog" className={linkClass}>
            Каталог
          </NavLink>
          <NavLink to="/kontakti" className={linkClass}>
            Контакти
          </NavLink>
          {isAdmin ? (
            <>
              <NavLink to="/admin/avtomobili" className={linkClass}>
                Админ
              </NavLink>
              <NavLink to="/admin/zapitvania" className={linkClass}>
                Запитвания {newInq > 0 ? <span className="badge status-ok">{newInq}</span> : null}
              </NavLink>
            </>
          ) : null}
        </nav>

        <div className="nav-user">
          {user ? (
            <>
              <NavLink to="/profil" className={linkClass}>
                Профил
              </NavLink>
              <span className="user-pill" title={user.email}>
                {userLabel}
              </span>
              <button type="button" className="btn btn-light" onClick={handleLogout}>
                Изход
              </button>
            </>
          ) : (
            <>
              <NavLink to="/vhod" className={linkClass}>
                Вход
              </NavLink>
              <NavLink to="/registracia" className={linkClass}>
                Регистрация
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
