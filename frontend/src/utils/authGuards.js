export function canSendInquiry(user) {
  if (!user) return { ok: false, reason: "not_logged" };
  if (!user.emailVerified) return { ok: false, reason: "not_verified" };
  return { ok: true };
}