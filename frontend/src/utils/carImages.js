const FALLBACK_CAR_IMAGE_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" role="img" aria-label="TateAuto placeholder">
    <defs>
      <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stop-color="#0f2348" />
        <stop offset="100%" stop-color="#2d63dc" />
      </linearGradient>
      <linearGradient id="accent" x1="0%" x2="100%" y1="0%" y2="0%">
        <stop offset="0%" stop-color="#8dc0ff" stop-opacity="0.95" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.78" />
      </linearGradient>
    </defs>
    <rect width="1200" height="700" fill="url(#bg)" />
    <circle cx="220" cy="120" r="170" fill="#ffffff" opacity="0.08" />
    <circle cx="1010" cy="580" r="210" fill="#ffffff" opacity="0.05" />
    <path d="M254 430h90l78-102c24-31 61-48 100-48h233c51 0 98 26 126 68l35 52h74c42 0 76 34 76 76v33H1013c0-49-39-88-88-88s-88 39-88 88H481c0-49-39-88-88-88s-88 39-88 88H178v-29c0-28 22-50 50-50h26z" fill="url(#accent)" />
    <circle cx="392" cy="511" r="74" fill="#102248" opacity="0.96" />
    <circle cx="392" cy="511" r="43" fill="#d9e9ff" />
    <circle cx="925" cy="511" r="74" fill="#102248" opacity="0.96" />
    <circle cx="925" cy="511" r="43" fill="#d9e9ff" />
    <text x="120" y="610" fill="#ffffff" font-family="Trebuchet MS, Segoe UI, sans-serif" font-size="66" font-weight="700">TateAuto</text>
    <text x="120" y="662" fill="#d7e5ff" font-family="Trebuchet MS, Segoe UI, sans-serif" font-size="30">Снимката липсва или адресът й е невалиден</text>
  </svg>
`;

export const FALLBACK_CAR_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(FALLBACK_CAR_IMAGE_SVG)}`;

export function sanitizeCarImageUrl(value) {
  if (typeof value !== "string") return "";

  const url = value.trim();
  if (!url) return "";

  if (url.startsWith("data:image/") || url.startsWith("blob:")) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return url;

  return "";
}

export function getCarImagesForDisplay(car) {
  const images = Array.isArray(car?.images) ? car.images.map(sanitizeCarImageUrl).filter(Boolean) : [];
  if (images.length > 0) return images;

  const fallback = sanitizeCarImageUrl(car?.imageUrl);
  return fallback ? [fallback] : [FALLBACK_CAR_IMAGE];
}

export function getCarCoverImage(car) {
  return getCarImagesForDisplay(car)[0] || FALLBACK_CAR_IMAGE;
}

export function handleCarImageError(event) {
  if (!event?.currentTarget) return;
  if (event.currentTarget.src === FALLBACK_CAR_IMAGE) return;

  event.currentTarget.onerror = null;
  event.currentTarget.src = FALLBACK_CAR_IMAGE;
}
