import AppRoutes from "./routes/AppRoutes.jsx";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "./utils/analytics";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="route-shell">
      <Toaster position="top-right" />
      <AppRoutes />
    </div>
  );
}
