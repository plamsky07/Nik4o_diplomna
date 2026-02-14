const STORAGE_KEY = "ta_analytics_v1";
const SESSION_KEY = "ta_session_id_v1";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        totalPageViews: 0,
        sessions: 0,
        firstSeenAt: null,
        lastSeenAt: null,
        perPage: {},
        dailyViews: {},
        events: {},
      };
    }

    const parsed = JSON.parse(raw);
    return {
      totalPageViews: parsed.totalPageViews ?? 0,
      sessions: parsed.sessions ?? 0,
      firstSeenAt: parsed.firstSeenAt ?? null,
      lastSeenAt: parsed.lastSeenAt ?? null,
      perPage: parsed.perPage ?? {},
      dailyViews: parsed.dailyViews ?? {},
      events: parsed.events ?? {},
    };
  } catch {
    return {
      totalPageViews: 0,
      sessions: 0,
      firstSeenAt: null,
      lastSeenAt: null,
      perPage: {},
      dailyViews: {},
      events: {},
    };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function ensureSession(state) {
  const sessionId = sessionStorage.getItem(SESSION_KEY);
  if (sessionId) return;

  sessionStorage.setItem(SESSION_KEY, crypto.randomUUID());
  state.sessions += 1;
}

export function trackPageView(pathname) {
  if (!pathname) return;

  const state = loadState();
  ensureSession(state);

  const nowIso = new Date().toISOString();
  state.totalPageViews += 1;
  state.lastSeenAt = nowIso;
  if (!state.firstSeenAt) state.firstSeenAt = nowIso;

  state.perPage[pathname] = (state.perPage[pathname] ?? 0) + 1;

  const dayKey = getTodayKey();
  state.dailyViews[dayKey] = (state.dailyViews[dayKey] ?? 0) + 1;

  saveState(state);
}

export function trackEvent(name, amount = 1) {
  if (!name) return;
  const state = loadState();
  ensureSession(state);
  state.events[name] = (state.events[name] ?? 0) + amount;
  state.lastSeenAt = new Date().toISOString();
  if (!state.firstSeenAt) state.firstSeenAt = state.lastSeenAt;
  saveState(state);
}

export function getAnalyticsSummary() {
  const state = loadState();
  const todayKey = getTodayKey();

  const topPages = Object.entries(state.perPage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([path, views]) => ({ path, views }));

  const totalViews = state.totalPageViews;
  const sessions = state.sessions || 0;
  const avgPagesPerSession = sessions > 0 ? totalViews / sessions : 0;

  const carDetailsViews = state.events.car_details_view || 0;
  const inquirySubmits = state.events.inquiry_submit || 0;
  const conversionRate = carDetailsViews > 0 ? (inquirySubmits / carDetailsViews) * 100 : 0;

  return {
    totalViews,
    viewsToday: state.dailyViews[todayKey] ?? 0,
    sessions,
    avgPagesPerSession,
    topPages,
    carDetailsViews,
    inquirySubmits,
    conversionRate,
    events: state.events,
    firstSeenAt: state.firstSeenAt,
    lastSeenAt: state.lastSeenAt,
  };
}
