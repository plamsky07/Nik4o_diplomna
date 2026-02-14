import toast from "react-hot-toast";
import { resendVerification } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";

export default function EmailVerificationBanner() {
  const { user } = useAuth();

  if (!user || user.emailVerified) return null;

  async function onResend() {
    try {
      await resendVerification();
      toast.success("Изпратихме нов имейл за потвърждение.");
    } catch {
      toast.error("Не успяхме да изпратим имейл.");
    }
  }

  return (
    <div style={{ background: "#fff3cd", borderBottom: "1px solid #f5d486" }}>
      <div className="site-container" style={{ padding: "10px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <span style={{ color: "#7d5b00", fontWeight: 600 }}>
          Имейлът ви не е потвърден. Проверете пощата си.
        </span>
        <button type="button" className="btn btn-light" onClick={onResend}>
          Изпрати пак
        </button>
      </div>
    </div>
  );
}
