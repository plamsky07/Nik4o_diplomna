import AppRoutes from "./routes/AppRoutes.jsx";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "./utils/analytics";

export default function App() {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setShowLoader(true);
    const timeoutId = window.setTimeout(() => {
      setShowLoader(false);
    }, prefersReducedMotion ? 80 : 560);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return undefined;

    const targets = document.querySelectorAll(
      ".section, .surface-card, .car-card, .feature-card, .admin-kpi, .contact-item, .hero-content"
    );

    targets.forEach((el, idx) => {
      el.classList.add("reveal-item");
      el.style.setProperty("--reveal-delay", `${Math.min(idx * 35, 420)}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="route-shell">
      <Toaster position="top-right" />
      {showLoader ? (
        <div className="app-loader" aria-hidden="true">
          <div className="app-loader-mark">TA</div>
        </div>
      ) : null}
      <AppRoutes />
    </div>
  );
}
