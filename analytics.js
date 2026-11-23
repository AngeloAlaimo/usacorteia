// Corte IA: medición del sitio. Sin cookies y sin scripts de terceros.
// Nunca envía el correo, lo que se escribe en formularios ni datos de pago.
(() => {
  const KEY = "phc_ABpNKUrYVLdeszbC8RZu9HtGYQAphpmyrtp5SDXyzvTY";
  const live = /^(www\.)?usacorteia\.com$/.test(location.hostname);
  const REF_DAYS = 30;
  const get = (s, k) => { try { return s.getItem(k); } catch { return null; } };
  const set = (s, k, v) => { try { s.setItem(k, v); } catch { /* sin almacenamiento */ } };
  const uuid = () => crypto.randomUUID ? crypto.randomUUID() : "w-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);

  let anon = get(sessionStorage, "ci_anon");
  if (!anon) { anon = uuid(); set(sessionStorage, "ci_anon", anon); }

  const clean = v => (v || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 24);
  const q = new URLSearchParams(location.search);
  const fromUrl = clean(q.get("ref") || q.get("codigo"));
  if (fromUrl.length >= 2) set(localStorage, "ci_ref", JSON.stringify({c: fromUrl, t: Date.now()}));
  const ref = () => {
    try {
      const r = JSON.parse(get(localStorage, "ci_ref") || "null");
      return r && Date.now() - r.t < REF_DAYS * 864e5 ? r.c : "";
    } catch { return ""; }
  };
  const setRef = v => {
    const c = clean(v);
    if (c.length >= 2) set(localStorage, "ci_ref", JSON.stringify({c, t: Date.now()}));
    return c.length >= 2 ? c : "";
  };

  const utm = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach(k => {
    const v = q.get(k);
    if (v) set(sessionStorage, "ci_" + k, v.slice(0, 80));
    const saved = get(sessionStorage, "ci_" + k);
    if (saved) utm[k] = saved;
  });

  const sent = window.__ciEvents = [];
  function track(event, props = {}) {
    const properties = {...utm, ...props, app_env: "web", path: location.pathname, ref: ref() || undefined,
      $process_person_profile: false, $geoip_disable: true};
    sent.push({event, properties});
    if (!live || KEY.startsWith("__")) return;
    fetch("https://us.i.posthog.com/capture/", {method: "POST", keepalive: true, headers: {"content-type": "application/json"},
      body: JSON.stringify({api_key: KEY, event, distinct_id: anon, properties, timestamp: new Date().toISOString()})}).catch(() => {});
  }
  if (fromUrl.length >= 2 && live) {
    fetch("https://mxhuhxxqdzuzfbypngqp.supabase.co/functions/v1/affiliate", {method: "POST", keepalive: true,
      headers: {"content-type": "application/json"}, body: JSON.stringify({action: "click", code: fromUrl})}).catch(() => {});
  }
  window.CI = {track, ref, setRef, id: () => anon};
  track("web_page_view");
})();
