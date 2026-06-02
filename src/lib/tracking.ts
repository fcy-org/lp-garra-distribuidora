const LEAD_CAPTURE_URL = "https://newtracking-sales-sys.vercel.app/api/public/leads";
const LEAD_CAPTURE_KEY = "cmpmpmr4s0001ld203h5ysqrj";

type TrackingParams = Record<string, string | undefined>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function getCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

function getStoredParam(key: string) {
  try {
    return localStorage.getItem(`tracking_${key}`) ?? undefined;
  } catch {
    return undefined;
  }
}

function setStoredParam(key: string, value: string) {
  try {
    localStorage.setItem(`tracking_${key}`, value);
  } catch {}
}

export function getTrackingParams(eventId = crypto.randomUUID()): TrackingParams {
  if (typeof window === "undefined") return { event_id: eventId };

  const params = new URLSearchParams(window.location.search);
  const trackingKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid"];
  const tracking: TrackingParams = {};

  trackingKeys.forEach((key) => {
    const value = params.get(key) ?? getStoredParam(key);
    if (value) {
      tracking[key] = value;
      setStoredParam(key, value);
    }
  });

  const timestamp = Math.floor(Date.now() / 1000);
  const fbclid = tracking.fbclid;
  const fbc = getCookie("_fbc") ?? (fbclid ? `fb.1.${timestamp}.${fbclid}` : undefined);

  return {
    ...tracking,
    fbc,
    fbp: getCookie("_fbp"),
    event_id: eventId,
    landing_page: window.location.href,
    referrer: document.referrer || undefined,
  };
}

export async function captureLead(payload: Record<string, unknown>) {
  const response = await fetch(LEAD_CAPTURE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-lead-capture-key": LEAD_CAPTURE_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "(sem resposta)");
    throw new Error(`Lead capture failed — status ${response.status}: ${body}`);
  }
}

export function trackMetaLead(eventId: string) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", "Lead", {}, { eventID: eventId });
}
