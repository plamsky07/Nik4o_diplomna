import { sendEmailVerification } from "firebase/auth";
import { auth } from "../api/firebase";

export default function BlockedAction({ reason, onClose }) {
  async function resend() {
    await sendEmailVerification(auth.currentUser);
    alert("Изпратихме нов имейл за потвърждение. Провери пощата си.");
  }

  const title =
    reason === "not_logged" ? "Трябва да влезеш в профила си" : "Трябва да потвърдиш имейла си";

  const text =
    reason === "not_logged"
      ? "За да изпратиш запитване, първо влез в профила си."
      : "Преди да изпращаш запитвания, потвърди имейла си от линка, който ти изпратихме.";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lg">
        <h3 className="text-xl font-extrabold">{title}</h3>
        <p className="mt-2 text-slate-600">{text}</p>

        <div className="mt-5 flex gap-3 justify-end">
          {reason === "not_verified" && (
            <button
              onClick={resend}
              className="rounded-2xl bg-amber-600 text-white px-4 py-3 font-semibold"
            >
              Изпрати отново имейл
            </button>
          )}

          <button
            onClick={onClose}
            className="rounded-2xl border px-4 py-3 font-semibold"
          >
            Добре
          </button>
        </div>
      </div>
    </div>
  );
}
