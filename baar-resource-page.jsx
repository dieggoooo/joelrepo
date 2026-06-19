import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

/**
 * BAAR Resource Page
 *
 * Sections (in hierarchy):
 *   01 / Brand Assets & Usage
 *   02 / Brand Appearance
 *   03 / Color System
 *   04 / Typography
 *   05 / UI & Experience  (Card System V2, hover behavior, theme toggle, do's & don'ts)
 *   06 / Visual Systems   (Imagery · Layout · Illustration — unified finale)
 *        06a / Imagery System
 *        06b / Layout System
 *        06c / Illustration System
 *
 * TOC: Sticky left sidebar on desktop, IntersectionObserver scroll tracking.
 *      Floating bottom pill on mobile.
 */

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const B64="T1RUTwAJAIAAAwAQQ0ZGIGLm+fgAAAL8AAABkU9TLzJI5EbVAAABAAAAAGBjbWFwAMYCIgAAAoAAAABcaGVhZC8HifAAAACcAAAANmhoZWEGrANDAAAA1AAAACRobXR4DiAASgAABJAAAAAUbWF4cAAFUAAAAAD4AAAABm5hbWVyEWWmAAABYAAAASBwb3N0AAMAAAAAAtwAAAAgAAEAAAABAAAh3s2+Xw889QADA+gAAAAA5imjWgAAAADmKaNbAAD/OwOdAyAAAAADAAIAAAAAAAAAAQAAAyD/OAAAA+b/8gAfA5gAAQAAAAAAAAAAAAAAAAAAAAUAAFAAAAUAAAADAtMBkAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAA/Pz8/AAAAIAByAyD/OAAAAyAAyAAAAAAAAAAAAfQD6AAAACAAAAAAAAwAlgABAAAAAAABAAQAAAABAAAAAAACAAcABAABAAAAAAADAAwACwABAAAAAAAEAAwAFwABAAAAAAAFAAsAIwABAAAAAAAGAAwACwADAAEECQABAAgALgADAAEECQACAA4ANgADAAEECQADABgARAADAAEECQAEABgAXAADAAEECQAFABYAdAADAAEECQAGABgAREJhYXJSZWd1bGFyQmFhci1SZWd1bGFyQmFhciBSZWd1bGFyVmVyc2lvbiAzLjAAQgBhAGEAcgBSAGUAZwB1AGwAYQByAEIAYQBhAHIALQBSAGUAZwB1AGwAYQByAEIAYQBhAHIAIABSAGUAZwB1AGwAYQByAFYAZQByAHMAaQBvAG4AIAAzAC4AMAAAAAIAAAADAAAAFAADAAEAAAAUAAQASAAAAAwACAACAAQAIABCAFIAYgBy//8AAAAgAEEAUgBhAHL////hAAD/sgAA/5IAAQAAAAoAAAAKAAAAAAADAAIAAwACAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAQCAAEBAQ1CYWFyLVJlZ3VsYXIAAQEBGvgbAvgcA/gYBIv7Wfox+bQF1g+L+CUS3xEAAgEBDRFCYWFyIFJlZ3VsYXJCYWFyAAAAAAEAIwAiADMABQIAAQANABAAjgDVAS/4iL0W+CT5UPwkBg73wA76IYz5mxWLi46OlZOTldj3touLH9XOg3zEH8R8u3ayb7FwqGqfZQieZZVhXhplgml5bR55bnl3eX4IiYqLiokaiYyJjB6peqZyoWoIo2iXV18aTn1kcGIecWJoamFyYHJceleACIFWV4ZYG/wcBouCi4F+gJaY9yqL+bKLHg76eviE+bQVxb9nVZ8fzvtF9yj8Htj7YZZth2p5cQhxeW18axv9RAZrbpqleR95pYaslqnZ92X3K/gpyvdACLuduqu+G7MGDvogjPl7FcOmjKIe9+cGsMyEfrofuX63dbRttW2tZadbCKdcmVFIGkp/UnNcHoR9gH2AfVtVhTuyTq9UtEynX5KAjH2FfwiAhH+EfvsD/K+LWhv7EpqN93kfDgAAAAH0ADIBLAAAA40AAQPmACUDjP/y";

const SECTIONS = [
  { id: "brand-assets",    label: "Brand Assets & Usage",  num: "01", level: 1 },
  { id: "brand-appearance",label: "Brand Appearance",      num: "02", level: 1 },
  { id: "color-system",   label: "Color System",           num: "03", level: 1 },
  { id: "typography",     label: "Typography",             num: "04", level: 1 },
];

/* ─── Do / Don't block ─── */
function DD({ type, items }) {
  const isDo = type === "do";
  const accent = isDo ? "#00C2FF" : "#CC5544";
  return (
    <div className="dd-block" style={{ borderTop: `2px solid ${accent}` }}>
      <div className="dd-label" style={{ color: accent }}>{isDo ? "DO" : "DON'T"}</div>
      {items.map((item, i) => (
        <div key={i} className="dd-item" style={{ borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none" }}>
          <span className="dd-icon" style={{ color: accent }}>{isDo ? "✓" : "✕"}</span>
          <span className="dd-text">{item}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Download Link ─── */
function DL({ label, desc, accent = "#00C2FF" }) {
  return (
    <a className="dl-link" href="#">
      <span className="dl-icon" style={{ borderColor: accent }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M5 1v6M2.5 4.5L5 7l2.5-2.5" stroke={accent} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1.5 9h7" stroke={accent} strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </span>
      <span>
        <span className="dl-label" style={{ color: accent }}>{label}</span>
        {desc && <span className="dl-desc">{desc}</span>}
      </span>
    </a>
  );
}

/* ─── Spec Row ─── */
function Spec({ label, value }) {
  return (
    <div className="spec-row">
      <span className="spec-label">{label}</span>
      <code className="spec-val">{value}</code>
    </div>
  );
}

/* ─── Card Doc Block ─── */
function CardDoc({ num, name, desc, specs, rules }) {
  return (
    <div className="card-doc">
      <div className="card-doc-header">
        <span className="card-doc-num">{num}</span>
        <span className="card-doc-name">{name}</span>
      </div>
      <p className="card-doc-desc">{desc}</p>
      {specs && (
        <div className="spec-table">
          {specs.map(([l, v]) => <Spec key={l} label={l} value={v} />)}
        </div>
      )}
      {rules && (
        <ul className="card-doc-rules">
          {rules.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      )}
    </div>
  );
}

/* ─── Section Wrapper ─── */
function Section({ id, num, title, accent = "#00C2FF", children }) {
  return (
    <section id={id} className="page-section">
      <div className="sec-header">
        <span className="sec-num">{num}</span>
        <div className="sec-title-wrap">
          <h2 className="sec-title">{title}</h2>
          <div className="sec-rule" style={{ background: accent }} />
        </div>
      </div>
      {children}
    </section>
  );
}

/* ─── Theme Toggler ─── */
function ThemeToggler({ isDark, onToggle }) {
  return (
    <button className={`theme-toggle ${isDark ? "is-dark" : ""}`} onClick={onToggle} aria-label="Toggle theme">
      <svg className="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <defs><mask id="rm"><rect x="0" y="0" width="100%" height="100%" fill="white"/><circle className="mask-c" r="9" fill="black"/></mask></defs>
        <circle className="body-c" cx="12" cy="12" fill="currentColor" stroke="none" mask="url(#rm)"/>
        <g className="rays"><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="5.64" y1="5.64" x2="4.22" y2="4.22"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/><line x1="5.64" y1="18.36" x2="4.22" y2="19.78"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/></g>
      </svg>
    </button>
  );
}

/* ════════════════════════════════════ MAIN ════════════════════════════════════ */
export default function ResourcePage() {
  const [isDark, setIsDark] = useState(false);
  const [activeId, setActiveId] = useState("brand-assets");
  const [tocOpen, setTocOpen] = useState(false);
  const observerRef = useRef(null);

  /* IntersectionObserver — tracks which section is in view */
  useEffect(() => {
    const els = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean);
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveId(topmost.target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    els.forEach(el => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTocOpen(false);
  }, []);

  const theme = isDark ? "dark" : "light";

  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Outfit:wght@300;400;500;600&family=Epilogue:ital,wght@0,300;0,400;0,700;1,300&display=swap');
@font-face{font-family:'BC';src:url('data:font/otf;base64,${B64}') format('opentype')}
*{box-sizing:border-box;margin:0;padding:0}body{margin:0}

[data-theme="light"]{--bg:#F6F7F9;--surface:rgba(255,255,255,0.72);--surface-s:rgba(255,255,255,0.88);--surface-w:rgba(252,250,247,0.85);--border:rgba(26,26,26,0.06);--border-s:rgba(26,26,26,0.12);--text:#1a1a1a;--text-s:rgba(26,26,26,0.65);--text-m:rgba(26,26,26,0.45);--text-d:rgba(26,26,26,0.32);--void:#1a1a1a;--code-bg:rgba(26,26,26,0.05);--toc-active:#1a1a1a;--toc-idle:rgba(26,26,26,0.38)}
[data-theme="dark"]{--bg:#1a1a1a;--surface:rgba(255,255,255,0.04);--surface-s:rgba(255,255,255,0.07);--surface-w:rgba(255,240,220,0.05);--border:rgba(255,255,255,0.08);--border-s:rgba(255,255,255,0.15);--text:#F6F7F9;--text-s:rgba(246,247,249,0.72);--text-m:rgba(246,247,249,0.45);--text-d:rgba(246,247,249,0.30);--void:#0a0a0a;--code-bg:rgba(255,255,255,0.06);--toc-active:#F6F7F9;--toc-idle:rgba(246,247,249,0.35)}

.page{min-height:100vh;background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif;transition:background 600ms ${EASE},color 600ms ${EASE};position:relative}
.page-wrap{display:flex;max-width:1280px;margin:0 auto;position:relative}

/* ═══ SIDEBAR TOC ═══ */
.toc-rail{position:sticky;top:0;height:100vh;width:240px;flex-shrink:0;display:flex;flex-direction:column;padding:40px 0 40px 32px;overflow-y:auto;transition:all 600ms ${EASE}}
@media(max-width:900px){.toc-rail{display:none}}
.toc-wordmark{font-family:'BC',sans-serif;font-size:22px;letter-spacing:.06em;color:var(--text);margin-bottom:6px;transition:color 600ms ${EASE}}
.toc-tagline{font-family:'Epilogue',sans-serif;font-size:10px;font-weight:300;color:var(--text-m);margin-bottom:36px;transition:color 600ms ${EASE}}
.toc-label{font-size:9px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--text-d);margin-bottom:14px;transition:color 600ms ${EASE}}
.toc-nav{display:flex;flex-direction:column;gap:2px;flex:1}
.toc-item{display:flex;align-items:center;gap:10px;padding:6px 0;cursor:pointer;transition:all 280ms ${EASE};border:none;background:transparent;text-align:left;width:100%}
.toc-item:hover .toc-item-label{color:var(--text)!important;opacity:1}
.toc-item-dot{width:5px;height:5px;border-radius:50%;background:var(--text-d);flex-shrink:0;transition:all 320ms ${EASE}}
.toc-item.active .toc-item-dot{background:#00C2FF;box-shadow:0 0 8px rgba(0,194,255,.5);width:6px;height:6px}
.toc-item-label{font-size:12px;font-weight:400;color:var(--toc-idle);line-height:1.2;transition:color 320ms ${EASE}}
.toc-item.active .toc-item-label{color:var(--toc-active)!important;font-weight:500}
.toc-item.sub{padding-left:16px}
.toc-item.sub .toc-item-dot{width:3px;height:3px;background:var(--text-d)}
.toc-item.sub.active .toc-item-dot{background:#FF8A00;box-shadow:0 0 6px rgba(255,138,0,.5);width:5px;height:5px}
.toc-item.sub .toc-item-label{font-size:11px}
.toc-divider{height:1px;background:var(--border);margin:16px 0;transition:background 600ms ${EASE}}

/* ═══ MOBILE TOC PILL ═══ */
.toc-mobile{display:none;position:fixed;bottom:28px;left:50%;transform:translateX(-50%);z-index:60}
@media(max-width:900px){.toc-mobile{display:flex;flex-direction:column;align-items:center;gap:8px}}
.toc-pill-btn{display:flex;align-items:center;gap:10px;padding:10px 20px;background:var(--surface-s);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:999px;cursor:pointer;box-shadow:0 8px 24px -8px rgba(0,0,0,.2);white-space:nowrap;transition:all 400ms ${EASE}}
.toc-pill-active{font-size:12px;font-weight:500;color:var(--text)}
.toc-pill-dot{width:5px;height:5px;border-radius:50%;background:#00C2FF;box-shadow:0 0 8px rgba(0,194,255,.5)}
.toc-mobile-menu{background:var(--surface-s);backdrop-filter:blur(24px);border:1px solid var(--border);border-radius:18px;padding:12px;width:260px;box-shadow:0 24px 48px -12px rgba(0,0,0,.25)}
.toc-mobile-item{padding:9px 14px;border-radius:10px;font-size:12px;color:var(--text-s);cursor:pointer;transition:all 240ms ${EASE}}
.toc-mobile-item:hover,.toc-mobile-item.active{background:var(--surface);color:var(--text)}

/* ═══ MAIN CONTENT ═══ */
.main-content{flex:1;min-width:0;padding:60px 48px 120px 40px}
@media(max-width:900px){.main-content{padding:40px 24px 100px}}

/* Page header */
.page-header{margin-bottom:80px;padding-bottom:48px;border-bottom:1px solid var(--border)}
.page-header-eyebrow{font-size:10px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--text-m);margin-bottom:16px}
.page-header-title{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:clamp(40px,5vw,72px);line-height:.95;letter-spacing:-.005em;margin-bottom:20px}
.page-header-sub{font-family:'Epilogue',sans-serif;font-size:15px;font-weight:300;line-height:1.6;color:var(--text-s);max-width:520px}

/* Sections */
.page-section{margin-bottom:96px;scroll-margin-top:32px}
.sec-header{display:flex;align-items:flex-start;gap:18px;margin-bottom:40px}
.sec-num{font-size:11px;font-weight:500;letter-spacing:.22em;color:var(--text-m);padding-top:6px;min-width:32px}
.sec-title-wrap{display:flex;flex-direction:column;gap:10px}
.sec-title{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:clamp(26px,3.5vw,40px);letter-spacing:-.005em;line-height:1}
.sec-rule{height:2px;width:32px;border-radius:2px}
.sec-body{font-family:'Epilogue',sans-serif;font-size:14px;font-weight:300;line-height:1.7;color:var(--text-s);max-width:640px;margin-bottom:32px}
.sec-sublabel{font-size:10px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--text-m);margin:40px 0 16px}

/* Subsection header */
.subsec-header{margin:64px 0 28px;padding-bottom:16px;border-bottom:1px solid var(--border)}
.subsec-title{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:clamp(22px,3vw,32px);letter-spacing:-.005em;line-height:1}
.subsec-body{font-family:'Epilogue',sans-serif;font-size:13.5px;font-weight:300;line-height:1.65;color:var(--text-s);max-width:580px;margin-top:10px}

/* Surface cards */
.surface-card{background:var(--surface);backdrop-filter:blur(16px);border:1px solid var(--border);border-radius:20px;padding:28px 24px;margin-bottom:16px;transition:all 600ms ${EASE}}

/* Color swatches */
.swatch-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:10px;margin-bottom:24px}
.swatch{border-radius:12px;overflow:hidden;border:1px solid var(--border)}
.swatch-color{height:48px}
.swatch-meta{padding:8px 10px;background:var(--surface-s)}
.swatch-name{font-size:10px;font-weight:600;letter-spacing:.08em;color:var(--text)}
.swatch-val{font-family:'Epilogue',sans-serif;font-size:9px;color:var(--text-m);margin-top:2px}

/* Token table */
.token-table{width:100%;border-collapse:collapse;margin-bottom:32px;font-size:12px}
.token-table th{text-align:left;padding:8px 12px;font-size:9px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--text-m);border-bottom:1px solid var(--border-s)}
.token-table td{padding:10px 12px;border-bottom:1px solid var(--border);font-family:'Epilogue',sans-serif;color:var(--text-s);vertical-align:top;line-height:1.5}
.token-table td:first-child{font-family:'Outfit',sans-serif;font-weight:500;color:var(--text);white-space:nowrap}
.token-table td code{font-family:monospace;font-size:11px;background:var(--code-bg);padding:2px 6px;border-radius:4px;color:var(--text)}

/* Do / Don't */
.dd-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:32px}
@media(max-width:640px){.dd-grid{grid-template-columns:1fr}}
.dd-block{background:var(--surface-s);border-radius:16px;padding:20px;transition:all 600ms ${EASE}}
.dd-label{font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;margin-bottom:14px}
.dd-item{display:flex;gap:8px;align-items:flex-start;padding:8px 0}
.dd-icon{font-size:10px;margin-top:2px;flex-shrink:0}
.dd-text{font-family:'Epilogue',sans-serif;font-size:12px;color:var(--text-s);line-height:1.6}

/* Card docs */
.card-doc-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:32px}
@media(max-width:720px){.card-doc-grid{grid-template-columns:1fr}}
.card-doc{background:var(--surface);backdrop-filter:blur(16px);border:1px solid var(--border);border-radius:18px;padding:22px;transition:all 600ms ${EASE}}
.card-doc-header{display:flex;align-items:baseline;gap:10px;margin-bottom:10px}
.card-doc-num{font-size:9px;font-weight:600;letter-spacing:.22em;color:var(--text-m)}
.card-doc-name{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:20px;letter-spacing:.01em}
.card-doc-desc{font-family:'Epilogue',sans-serif;font-size:12.5px;font-weight:300;line-height:1.6;color:var(--text-s);margin-bottom:16px}
.spec-table{border-top:1px solid var(--border);margin-bottom:12px}
.spec-row{display:grid;grid-template-columns:120px 1fr;padding:7px 0;border-bottom:1px solid var(--border);gap:8px;align-items:baseline}
.spec-label{font-size:10px;font-weight:500;letter-spacing:.05em;color:var(--text-m)}
.spec-val{font-family:monospace;font-size:10.5px;color:var(--text);background:var(--code-bg);padding:2px 6px;border-radius:4px}
.card-doc-rules{padding-left:16px;display:flex;flex-direction:column;gap:5px}
.card-doc-rules li{font-family:'Epilogue',sans-serif;font-size:11.5px;color:var(--text-s);line-height:1.55}

/* Hover spec */
.hover-spec{background:var(--void);color:#F6F7F9;border-radius:18px;padding:28px 24px;margin-bottom:24px}
.hover-spec-title{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:22px;margin-bottom:16px}
.hover-row{display:grid;grid-template-columns:140px 1fr;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.06);gap:8px}
.hover-row:last-child{border-bottom:none}
.hover-key{font-size:10px;font-weight:500;letter-spacing:.05em;color:rgba(246,247,249,.45)}
.hover-val{font-family:monospace;font-size:11px;color:rgba(246,247,249,.75)}

/* Theme toggle docs */
.toggle-doc{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:28px}
@media(max-width:640px){.toggle-doc{grid-template-columns:1fr}}

/* Download links */
.dl-group{background:var(--surface-s);border-radius:20px;padding:20px 24px;margin-bottom:24px}
.dl-link{display:inline-flex;align-items:center;gap:10px;padding:10px 0;cursor:pointer;text-decoration:none;color:inherit;width:100%;transition:opacity .2s;border-bottom:1px solid var(--border)}
.dl-link:last-child{border-bottom:none}
.dl-link:hover{opacity:.7}
.dl-icon{width:24px;height:24px;border-radius:50%;border:1.5px solid;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .2s}
.dl-link:hover .dl-icon{background:rgba(0,194,255,.08)}
.dl-label{font-size:12.5px;font-weight:600;display:block;line-height:1.3}
.dl-desc{font-family:'Epilogue',sans-serif;font-size:10.5px;color:var(--text-m);display:block;margin-top:1px}

/* Typography specimens */
.type-specimen{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:24px;margin-bottom:12px}
.type-label{font-size:9px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--text-m);margin-bottom:10px}
.type-sample{line-height:1.1;margin-bottom:8px}
.type-meta{font-family:'Epilogue',sans-serif;font-size:10px;color:var(--text-m)}

/* Visual systems finale */
.visual-system-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0;background:var(--surface);border:1px solid var(--border);border-radius:24px;overflow:hidden;margin-bottom:24px}
@media(max-width:720px){.visual-system-grid{grid-template-columns:1fr}}
.vs-cell{padding:32px 26px;border-right:1px solid var(--border);transition:all 400ms ${EASE}}
.vs-cell:last-child{border-right:none}
@media(max-width:720px){.vs-cell{border-right:none;border-bottom:1px solid var(--border)}.vs-cell:last-child{border-bottom:none}}
.vs-cell:hover{background:rgba(128,128,128,.03)}
.vs-num{font-size:9px;font-weight:600;letter-spacing:.22em;color:var(--text-d);margin-bottom:14px}
.vs-title{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:22px;letter-spacing:.005em;margin-bottom:12px}
.vs-body{font-family:'Epilogue',sans-serif;font-size:12.5px;font-weight:300;line-height:1.65;color:var(--text-s)}
.vs-connector{text-align:center;padding:24px;font-family:'Epilogue',sans-serif;font-size:11px;color:var(--text-m);background:var(--surface-w);border-top:1px solid var(--border)}

/* Two-col layout */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:640px){.two-col{grid-template-columns:1fr}}

/* Principle block */
.principle{display:flex;gap:14px;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:14px;margin-bottom:10px}
.principle-num{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:28px;color:var(--text-d);line-height:1;flex-shrink:0;min-width:28px}
.principle-text{font-family:'Epilogue',sans-serif;font-size:13px;font-weight:300;line-height:1.6;color:var(--text-s)}
.principle-text strong{font-weight:600;color:var(--text)}

/* Highlight quote */
.hq{border-left:2px solid #FF8A00;padding:16px 20px;background:var(--surface-w);border-radius:0 12px 12px 0;margin-bottom:24px}
.hq p{font-family:'Epilogue',sans-serif;font-size:14px;font-weight:300;font-style:italic;line-height:1.65;color:var(--text-s)}

/* Visual systems overview card */
.vso{background:#1a1a1a;border-radius:20px;padding:28px;display:grid;grid-template-columns:200px 1fr 1fr 1fr;gap:20px;margin-bottom:20px;overflow:hidden;position:relative}
@media(max-width:900px){.vso{grid-template-columns:1fr 1fr;gap:16px;padding:22px}}
@media(max-width:540px){.vso{grid-template-columns:1fr}}
.vso-col{display:flex;flex-direction:column;gap:14px}

/* Color swatches with gradient strips */
.vso-swatch{border-radius:12px;overflow:hidden;background:#202020}
.vso-swatch-head{padding:12px 14px;display:flex;align-items:center;justify-content:space-between}
.vso-swatch-name{font-family:'Outfit',sans-serif;font-size:12px;font-weight:600;color:#F6F7F9}
.vso-swatch-hex{font-family:monospace;font-size:10px;color:rgba(246,247,249,.5)}
.vso-swatch-strip{display:flex;height:6px}
.vso-swatch-strip div{flex:1}

/* Type specimens */
.vso-type{background:#202020;border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:6px}
.vso-type-header{display:flex;justify-content:space-between;align-items:baseline}
.vso-type-role{font-family:'Outfit',sans-serif;font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:rgba(246,247,249,.4)}
.vso-type-font{font-family:'Outfit',sans-serif;font-size:10px;color:rgba(246,247,249,.3)}
.vso-type-sample{line-height:1.1;color:#F6F7F9}

/* Button specimens */
.vso-btn-row{display:flex;gap:8px;flex-wrap:wrap}
.vso-btn{font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;padding:7px 14px;border-radius:999px;cursor:default;transition:all 300ms ${EASE}}
.vso-btn-primary{background:#00C2FF;color:#1a1a1a;border:none}
.vso-btn-secondary{background:rgba(255,255,255,.06);color:#F6F7F9;border:1px solid rgba(255,255,255,.12)}
.vso-btn-ember{background:#FF8A00;color:#1a1a1a;border:none}
.vso-btn-ghost{background:transparent;color:rgba(246,247,249,.6);border:1px solid rgba(255,255,255,.12)}

/* Progress bars */
.vso-progress{display:flex;flex-direction:column;gap:8px;background:#202020;border-radius:12px;padding:16px}
.vso-bar-wrap{height:4px;border-radius:2px;background:rgba(255,255,255,.08);overflow:hidden}
.vso-bar{height:100%;border-radius:2px}

/* Icon row */
.vso-icon-row{display:flex;gap:8px}
.vso-icon-btn{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;transition:all 300ms ${EASE}}

/* Chip row */
.vso-chip-row{display:flex;gap:6px;flex-wrap:wrap}
.vso-chip{font-family:'Outfit',sans-serif;font-size:9px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:5px 10px;border-radius:6px;border:1px solid;cursor:default}

/* Search input */
.vso-search{background:#202020;border-radius:12px;padding:10px 14px;display:flex;align-items:center;gap:8px}
.vso-search-icon{color:rgba(246,247,249,.3);flex-shrink:0}
.vso-search-text{font-family:'Outfit',sans-serif;font-size:12px;color:rgba(246,247,249,.3)}

/* Radius specimens */
.vso-radius-row{display:flex;gap:8px;align-items:flex-end}
.vso-radius{background:#202020;border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;font-family:monospace;font-size:8px;color:rgba(246,247,249,.35)}

/* Theme toggler */
.theme-toggle{position:fixed;bottom:28px;left:28px;z-index:60;background:transparent;border:none;cursor:pointer;padding:8px;color:var(--text);opacity:.65;transition:opacity 280ms ${EASE},transform 280ms ${EASE},color 600ms ${EASE}}
.theme-toggle:hover{opacity:1;transform:scale(1.08)}
.theme-toggle:active{transform:scale(.92)}
.theme-icon{transition:transform 600ms ${EASE}}
.theme-toggle.is-dark .theme-icon{transform:rotate(280deg)}
.body-c{transition:r 500ms ${EASE}}
.theme-toggle:not(.is-dark) .body-c{r:5}
.theme-toggle.is-dark .body-c{r:9}
.mask-c{transition:cx 500ms ${EASE},cy 500ms ${EASE}}
.theme-toggle:not(.is-dark) .mask-c{cx:33;cy:0}
.theme-toggle.is-dark .mask-c{cx:17;cy:8}
.rays{transform-origin:12px 12px;transition:opacity 500ms ${EASE},transform 500ms ${EASE}}
.theme-toggle:not(.is-dark) .rays{opacity:1;transform:scale(1) rotate(0deg)}
.theme-toggle.is-dark .rays{opacity:0;transform:scale(0) rotate(-30deg)}
      `}</style>

      <div className="page" data-theme={theme}>
        <ThemeToggler isDark={isDark} onToggle={() => setIsDark(d => !d)} />

        <div className="page-wrap">

          {/* ═══ SIDEBAR TOC ═══ */}
          <aside className="toc-rail">
            <Link to="/" className="toc-wordmark" style={{ textDecoration: "none", color: "inherit" }}>BAAR</Link>
            <div className="toc-tagline">Be Authentic and Real.</div>
            <div style={{ display: "flex", gap: 16, margin: "12px 0" }}>
              <Link to="/" style={{ fontSize: 11, color: "var(--text-m)", textDecoration: "none" }}>Home</Link>
              <Link to="/work" style={{ fontSize: 11, color: "var(--text-m)", textDecoration: "none" }}>Work</Link>
              <Link to="/shop" style={{ fontSize: 11, color: "var(--text-m)", textDecoration: "none" }}>Shop</Link>
            </div>
            <div className="toc-label">Resource Guide</div>
            <nav className="toc-nav">
              {SECTIONS.map((s, i) => {
                const prevIsL1 = i > 0 && SECTIONS[i - 1].level === 1 && s.level === 2;
                return (
                  <button
                    key={s.id}
                    className={`toc-item ${s.level === 2 ? "sub" : ""} ${activeId === s.id ? "active" : ""}`}
                    onClick={() => scrollTo(s.id)}
                  >
                    <span className="toc-item-dot" />
                    <span className="toc-item-label">{s.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ═══ MAIN CONTENT ═══ */}
          <main className="main-content">

            {/* PAGE HEADER */}
            <header className="page-header">
              <div className="page-header-eyebrow">BAAR · Brand Resource Center</div>
              <h1 className="page-header-title">Resource<br />& Usage Guide</h1>
              <p className="page-header-sub">
                Everything you need to implement, extend, and protect the BAAR brand system. A centralized asset library and operational usage manual — one place, all the rules.
              </p>
            </header>

            {/* ─────────────────────────── 01 BRAND ASSETS ─────────────────────────── */}
            <Section id="brand-assets" num="01" title="Brand Assets & Usage" accent="#00C2FF">
              <p className="sec-body">
                The BAAR brand system exists to communicate one thing: that creativity is strategic, not decorative. Every asset choice — from the wordmark to the color of a button — is an expression of that thesis. Use these elements intentionally or not at all.
              </p>

              <div className="sec-sublabel">Logo Rules</div>
              <div className="surface-card">
                {[
                  ["Primary mark", "BC wordmark — the custom BAAR typeface. Used in nav, footer, product cards, and the collab modal avatar. Never substitute with Barlow Condensed or any other font."],
                  ["Minimum size", "18px on digital. Below this threshold legibility breaks and the mark loses its precision."],
                  ["Clear space", "The cap-height of the 'B' on all four sides minimum. Never crowd the mark."],
                  ["Color versions", "Full charcoal on Canvas, full Canvas on Charcoal, or Pulse-blue for digital emphasis moments. Never gradient, never outlined."],
                  ["Placement", "Top-left or top-center in nav. Centered and large in the footer. Never rotated, never scaled disproportionately."],
                ].map(([k, v]) => (
                  <div key={k} className="spec-row" style={{ gridTemplateColumns: "140px 1fr" }}>
                    <span className="spec-label">{k}</span>
                    <span style={{ fontFamily: "'Epilogue',sans-serif", fontSize: 12.5, color: "var(--text-s)", lineHeight: 1.55 }}>{v}</span>
                  </div>
                ))}
              </div>

              <div className="sec-sublabel">Visual System Overview</div>
              <div className="vso">
                {/* COL 1 — Color swatches */}
                <div className="vso-col">
                  {/* Pulse */}
                  <div className="vso-swatch">
                    <div className="vso-swatch-head" style={{ background: "#00C2FF" }}>
                      <span className="vso-swatch-name" style={{ color: "#1a1a1a" }}>Pulse</span>
                      <span className="vso-swatch-hex" style={{ color: "rgba(0,0,0,.45)" }}>#00C2FF</span>
                    </div>
                    <div className="vso-swatch-strip">
                      {["#B8EAFF","#7AD7FF","#3DC9FF","#00C2FF","#009FD4","#007BA8","#00587C","#003550"].map(c =>
                        <div key={c} style={{ background: c }} />
                      )}
                    </div>
                  </div>
                  {/* Ember */}
                  <div className="vso-swatch">
                    <div className="vso-swatch-head" style={{ background: "#FF8A00" }}>
                      <span className="vso-swatch-name" style={{ color: "#1a1a1a" }}>Ember</span>
                      <span className="vso-swatch-hex" style={{ color: "rgba(0,0,0,.45)" }}>#FF8A00</span>
                    </div>
                    <div className="vso-swatch-strip">
                      {["#FFDCBA","#FFBE75","#FFA03A","#FF8A00","#CC6E00","#995200","#663700","#331C00"].map(c =>
                        <div key={c} style={{ background: c }} />
                      )}
                    </div>
                  </div>
                  {/* Canvas */}
                  <div className="vso-swatch">
                    <div className="vso-swatch-head" style={{ background: "#F6F7F9" }}>
                      <span className="vso-swatch-name" style={{ color: "#1a1a1a" }}>Canvas</span>
                      <span className="vso-swatch-hex" style={{ color: "rgba(0,0,0,.35)" }}>#F6F7F9</span>
                    </div>
                    <div className="vso-swatch-strip">
                      {["#FFFFFF","#F6F7F9","#DBDBDB","#B8B8B8","#888888","#6D6D6D","#4A4A4A","#353535"].map(c =>
                        <div key={c} style={{ background: c }} />
                      )}
                    </div>
                  </div>
                  {/* Charcoal */}
                  <div className="vso-swatch">
                    <div className="vso-swatch-head" style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,.08)", borderRadius: "12px 12px 0 0" }}>
                      <span className="vso-swatch-name">Charcoal</span>
                      <span className="vso-swatch-hex">#1A1A1A</span>
                    </div>
                    <div className="vso-swatch-strip">
                      {["#353535","#2A2A2A","#202020","#1A1A1A","#141414","#0E0E0E","#0A0A0A","#000000"].map(c =>
                        <div key={c} style={{ background: c }} />
                      )}
                    </div>
                  </div>
                </div>

                {/* COL 2 — Typography */}
                <div className="vso-col">
                  <div className="vso-type">
                    <div className="vso-type-header">
                      <span className="vso-type-role">Display</span>
                      <span className="vso-type-font">Barlow Condensed</span>
                    </div>
                    <div className="vso-type-sample" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 56, letterSpacing: "-.01em" }}>Aa</div>
                  </div>
                  <div className="vso-type">
                    <div className="vso-type-header">
                      <span className="vso-type-role">UI System</span>
                      <span className="vso-type-font">Outfit</span>
                    </div>
                    <div className="vso-type-sample" style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 500, fontSize: 48 }}>Aa</div>
                  </div>
                  <div className="vso-type">
                    <div className="vso-type-header">
                      <span className="vso-type-role">Narrative</span>
                      <span className="vso-type-font">Epilogue</span>
                    </div>
                    <div className="vso-type-sample" style={{ fontFamily: "'Epilogue',sans-serif", fontWeight: 300, fontSize: 44 }}>Aa</div>
                  </div>
                  <div className="vso-type">
                    <div className="vso-type-header">
                      <span className="vso-type-role">Wordmark</span>
                      <span className="vso-type-font">BC Custom</span>
                    </div>
                    <div className="vso-type-sample" style={{ fontFamily: "'BC',sans-serif", fontSize: 40, letterSpacing: ".04em" }}>Aa</div>
                  </div>
                </div>

                {/* COL 3 — Buttons + Progress + Search */}
                <div className="vso-col">
                  {/* Buttons */}
                  <div style={{ background: "#202020", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="vso-btn-row">
                      <span className="vso-btn vso-btn-primary">Primary</span>
                      <span className="vso-btn vso-btn-secondary">Secondary</span>
                    </div>
                    <div className="vso-btn-row">
                      <span className="vso-btn vso-btn-ember">Ember CTA</span>
                      <span className="vso-btn vso-btn-ghost">Ghost</span>
                    </div>
                  </div>
                  {/* Search */}
                  <div className="vso-search">
                    <svg className="vso-search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/><path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                    <span className="vso-search-text">Search</span>
                  </div>
                  {/* Progress bars */}
                  <div className="vso-progress">
                    <div className="vso-bar-wrap"><div className="vso-bar" style={{ width: "75%", background: "#00C2FF" }} /></div>
                    <div className="vso-bar-wrap"><div className="vso-bar" style={{ width: "50%", background: "#FF8A00" }} /></div>
                    <div className="vso-bar-wrap"><div className="vso-bar" style={{ width: "30%", background: "rgba(255,255,255,.25)" }} /></div>
                  </div>
                  {/* Chips */}
                  <div className="vso-chip-row">
                    <span className="vso-chip" style={{ borderColor: "#00C2FF", color: "#00C2FF", background: "rgba(0,194,255,.08)" }}>Pulse</span>
                    <span className="vso-chip" style={{ borderColor: "#FF8A00", color: "#FF8A00", background: "rgba(255,138,0,.08)" }}>Ember</span>
                    <span className="vso-chip" style={{ borderColor: "#2cff05", color: "#2cff05", background: "rgba(44,255,5,.06)" }}>Signal</span>
                    <span className="vso-chip" style={{ borderColor: "rgba(255,255,255,.12)", color: "rgba(255,255,255,.4)" }}>Muted</span>
                  </div>
                </div>

                {/* COL 4 — Icons + Radius + Status */}
                <div className="vso-col">
                  {/* Icon buttons */}
                  <div className="vso-icon-row">
                    <div className="vso-icon-btn" style={{ background: "#FF8A00" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 6l5-4 5 4v7a1 1 0 01-1 1H4a1 1 0 01-1-1V6z" stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 13V9h4v4" stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div className="vso-icon-btn" style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.10)" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4" stroke="rgba(246,247,249,.55)" strokeWidth="1.2"/><path d="M10 10l3.5 3.5" stroke="rgba(246,247,249,.55)" strokeWidth="1.2" strokeLinecap="round"/></svg>
                    </div>
                    <div className="vso-icon-btn" style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.10)" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="3" stroke="rgba(246,247,249,.55)" strokeWidth="1.2"/><path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="rgba(246,247,249,.55)" strokeWidth="1.2" strokeLinecap="round"/></svg>
                    </div>
                  </div>
                  {/* Radius specimens */}
                  <div style={{ background: "#202020", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(246,247,249,.3)" }}>Border Radius</div>
                    <div className="vso-radius-row">
                      <div className="vso-radius" style={{ width: 32, height: 32, borderRadius: 12 }}>12</div>
                      <div className="vso-radius" style={{ width: 36, height: 36, borderRadius: 20 }}>20</div>
                      <div className="vso-radius" style={{ width: 40, height: 40, borderRadius: 26 }}>26</div>
                      <div className="vso-radius" style={{ width: 36, height: 24, borderRadius: 999 }}>pill</div>
                    </div>
                  </div>
                  {/* Status chips */}
                  <div style={{ background: "#202020", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(246,247,249,.3)" }}>Status Indicators</div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2cff05", boxShadow: "0 0 8px rgba(44,255,5,.6)" }} />
                        <span style={{ fontSize: 10, color: "rgba(246,247,249,.5)" }}>Active</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00C2FF", boxShadow: "0 0 8px rgba(0,194,255,.6)" }} />
                        <span style={{ fontSize: 10, color: "rgba(246,247,249,.5)" }}>Open</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,.2)" }} />
                        <span style={{ fontSize: 10, color: "rgba(246,247,249,.5)" }}>Idle</span>
                      </div>
                    </div>
                  </div>
                  {/* Glassmorphism specimen */}
                  <div style={{ background: "rgba(255,255,255,.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(246,247,249,.3)" }}>Glassmorphism</div>
                    <div style={{ fontSize: 10, color: "rgba(246,247,249,.4)" }}>rgba(255,255,255,0.72)</div>
                    <div style={{ fontSize: 10, color: "rgba(246,247,249,.4)" }}>blur(20px) saturate(140%)</div>
                  </div>
                </div>
              </div>

              <div className="sec-sublabel">Downloads</div>
              <div className="dl-group">
                <DL label="Visual System Overview" desc="Brand-at-a-glance card — PNG, 4K" accent="#00C2FF" />
                <DL label="BAAR Style Guide v6" desc="Full brand system — PDF, 48 pages" accent="#00C2FF" />
                <DL label="Logo Package" desc="Wordmark, icon, clearspace — SVG, PNG, EPS" accent="#00C2FF" />
                <DL label="Color Tokens" desc="Design tokens — JSON, CSS variables" accent="#00C2FF" />
                <DL label="Typography Kit" desc="Barlow Condensed, Outfit, Epilogue — WOFF2" accent="#FF8A00" />
                <DL label="Press Kit" desc="Boilerplate, photography, bios — ZIP" accent="#FF8A00" />
                <DL label="Cinematic Narrative DESIGN.md" desc="Google Stitch ready — YAML + Markdown" accent="#FF8A00" />
              </div>

              <div className="sec-sublabel">Do's & Don'ts — Logo</div>
              <div className="dd-grid">
                <DD type="do" items={[
                  "Use the BC custom font for the wordmark at all times",
                  "Maintain minimum clear space equal to the cap-height of 'B' on all sides",
                  "Use the full Charcoal wordmark on Canvas backgrounds",
                  "Use the full Canvas wordmark on dark surfaces",
                  "Keep the wordmark proportionally consistent — width locks to height",
                  "Use Pulse (#00C2FF) for the mark in digital interactive emphasis moments only",
                ]} />
                <DD type="dont" items={[
                  "Never substitute the BC font with Barlow Condensed or any other typeface",
                  "Never apply a gradient or outline treatment to the wordmark",
                  "Never place the mark below 18px on digital surfaces",
                  "Never rotate, skew, or compress the wordmark",
                  "Never crowd the mark — it needs clear space to breathe",
                  "Never use Ember as the logo color — Ember is reserved for editorial emphasis only",
                ]} />
              </div>
            </Section>

            {/* ─────────────────────────── 02 BRAND APPEARANCE ─────────────────────────── */}
            <Section id="brand-appearance" num="02" title="Brand Appearance" accent="#FF8A00">
              <p className="sec-body">
                BAAR's visual identity is built on five atmospheric registers. Each one describes a different dimension of how the brand should feel — not just look.
              </p>

              {[
                { title: "The Hook", accent: "#FF8A00", body: "First contact is cinematic. The hero exists to make a visitor stop, feel something, and stay curious. Oversized typography, floating photography, a status signal in the top-left corner. No immediate sales pitch. The hook says: 'something interesting is happening here.' The visitor decides whether to enter." },
                { title: "The Canvas", accent: "#F6F7F9", body: "The default surface is warm-white Canvas (#F6F7F9), not pure white. Canvas has warmth. It reads as intentional, editorial — like the field of a photography magazine layout. Text against Canvas is Deep Charcoal (#1a1a1a), not black. This is a soft world, not a hard one." },
                { title: "The Interface", accent: "#00C2FF", body: "UI elements float. The navigation is a pill, not a header. Cards are rounded surfaces that hover above the page. Buttons are glass-inspired. Everything feels 'wearable' — objects you carry rather than surfaces you click. The interface should feel light enough to wear, not heavy enough to operate." },
                { title: "The Experience", accent: "#FF9E33", body: "Motion carries half the luxury. Every hover is a lift, not a scale. Every transition runs at 600ms on cubic-bezier(0.22, 1, 0.36, 1). Reveals are staggered. Animations are weighted, calm, expensive-feeling. Nothing snaps. Nothing bounces. Everything arrives as if it has mass." },
                { title: "The Atmosphere", accent: "#888", body: "The background breathes. A faint Pulse-blue radial sits top-right (4% opacity in light mode, 7% in dark). A faint Ember radial sits bottom-left (3% opacity in light, 5% in dark). Together they create an atmospheric depth that makes the page feel dimensional — like a space you're inside, not a document you're reading." },
              ].map(({ title, accent, body }) => (
                <div key={title} className="surface-card" style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: accent, marginBottom: 10 }}>{title}</div>
                  <p style={{ fontFamily: "'Epilogue',sans-serif", fontSize: 13.5, fontWeight: 300, lineHeight: 1.7, color: "var(--text-s)" }}>{body}</p>
                </div>
              ))}

              <div className="sec-sublabel" style={{ marginTop: 40 }}>Do's & Don'ts — Appearance</div>
              <div className="dd-grid">
                <DD type="do" items={[
                  "Lead with atmosphere and emotional restraint — the experience should feel discovered",
                  "Use Canvas (#F6F7F9) as the default background in light mode",
                  "Allow generous whitespace — dark space is a premium asset",
                  "Let photography and content take visual precedence over chrome and UI",
                  "Keep the overall brand feeling calm, spatial, cinematic",
                ]} />
                <DD type="dont" items={[
                  "Don't make the site feel like a SaaS dashboard, startup landing page, or corporate brochure",
                  "Don't use pure white (#FFFFFF) as a primary background — it reads as sterile",
                  "Don't crowd elements — breathing room is not wasted space",
                  "Don't explain what the brand does in the hero — let the atmosphere do that work",
                  "Don't use neon, cyberpunk, or loud visual effects — the brand is soft futurist, not aggressive",
                ]} />
              </div>
            </Section>

            {/* ─────────────────────────── 03 COLOR SYSTEM ─────────────────────────── */}
            <Section id="color-system" num="03" title="Color System" accent="#00C2FF">
              <p className="sec-body">
                The palette is engineered for atmosphere, not decoration. Two modes, seven named tokens, one distribution rule: 85% Canvas + Charcoal, 10% glass surfaces, 5% Pulse + Ember combined.
              </p>

              <div className="sec-sublabel">Core Palette</div>
              <div className="swatch-row">
                {[
                  { name: "Deep Charcoal", val: "#1a1a1a", bg: "#1a1a1a" },
                  { name: "Canvas", val: "#F6F7F9", bg: "#F6F7F9" },
                  { name: "Void", val: "#0a0a0a", bg: "#0a0a0a" },
                  { name: "Pulse", val: "#00C2FF", bg: "#00C2FF" },
                  { name: "Ember", val: "#FF8A00", bg: "#FF8A00" },
                  { name: "Warm Amber", val: "#FF9E33", bg: "#FF9E33" },
                ].map(s => (
                  <div key={s.name} className="swatch">
                    <div className="swatch-color" style={{ background: s.bg }} />
                    <div className="swatch-meta">
                      <div className="swatch-name">{s.name}</div>
                      <div className="swatch-val">{s.val}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="sec-sublabel">Do's & Don'ts — Color</div>
              <div className="dd-grid">
                <DD type="do" items={[
                  "Keep Pulse + Ember combined at ~5% of any page — they are precious",
                  "Use Deep Charcoal (#1a1a1a) instead of pure black (#000000) everywhere",
                  "Use Canvas (#F6F7F9) instead of pure white as the primary background",
                  "Use Ember to accent a single load-bearing word in a headline — one word only",
                  "Let the atmospheric radial gradients (Pulse top-right, Ember bottom-left) do their work at low opacity",
                  "Use Signal Green (#2cff05) only on notification/signal card dots",
                ]} />
                <DD type="dont" items={[
                  "Never use Pulse and Ember on the same element simultaneously",
                  "Never use accent colors as background fills for sections or large surfaces",
                  "Never let accents appear as decoration — every instance must be intentional",
                  "Don't use the full color palette on a single page — restraint is the message",
                  "Don't use Signal Green (#2cff05) outside of notification/signal card contexts",
                  "Don't use pure black or pure white — the system has warmer substitutes for both",
                ]} />
              </div>
            </Section>

            {/* ─────────────────────────── 04 TYPOGRAPHY ─────────────────────────── */}
            <Section id="typography" num="04" title="Typography" accent="#FF9E33">
              <p className="sec-body">
                Three fonts. Three distinct registers. Each owns its domain — the wordmark, the cinematic voice, the system voice, the human voice. They should never bleed into each other's territory.
              </p>

              <div className="sec-sublabel">Font Stack</div>
              {[
                { font: "BC", role: "Wordmark", sample: "BAAR", size: 48, weight: 400, desc: "Custom BAAR font. Wordmark only — nav, footer, product cards. Never use for any other text." },
                { font: "Barlow Condensed", role: "Display / Cinematic", sample: "Most studios stop at the surface.", size: 32, weight: 700, desc: "Hero headlines, manifesto, section titles, mobile menu. Used sparingly — the impact depends on rarity." },
                { font: "Outfit", role: "UI System", sample: "Aa Bb Cc", size: 24, weight: 400, desc: "Nav links, labels, buttons, metadata, status pills. Every UI element that isn't narrative content." },
                { font: "Epilogue", role: "Narrative / Human", sample: "Creativity is strategy.", size: 20, weight: 300, desc: "Body copy, philosophy, descriptions. Light (300) for air, Bold (700) for signal card text only." },
              ].map(({ font, role, sample, size, weight, desc }) => (
                <div key={font} className="type-specimen">
                  <div className="type-label">{role}</div>
                  <div className="type-sample" style={{ fontFamily: `'${font}',sans-serif`, fontSize: size, fontWeight: weight, lineHeight: 1.1, color: "var(--text)", marginBottom: 8 }}>{sample}</div>
                  <div className="type-meta">{font} · {desc}</div>
                </div>
              ))}

              <div className="sec-sublabel" style={{ marginTop: 40 }}>Do's & Don'ts — Typography</div>
              <div className="dd-grid">
                <DD type="do" items={[
                  "Use Barlow Condensed for large display moments — hero, manifesto, section transition statements",
                  "Keep body text in Epilogue at 300 weight for maximum airiness",
                  "Use the opacity tier (0.32 → 1.0) on hero headline lines to create reading rhythm",
                  "Cap body text column width at 520–560px — never stretch narrative text full width",
                  "Reserve italic Epilogue for the footer tagline — keeping italics precious preserves their impact",
                  "Use Outfit exclusively for UI chrome — nav, buttons, labels, metadata",
                ]} />
                <DD type="dont" items={[
                  "Don't use Barlow Condensed for body copy — it's a display typeface, not a reading typeface",
                  "Don't mix Barlow Condensed and Outfit within the same line or sentence",
                  "Don't use more than three type sizes on a single card",
                  "Don't apply letter-spacing to body copy — tracking is reserved for eyebrows and labels",
                  "Don't use BC (custom font) for anything except the wordmark",
                  "Don't make body text pure black — use --text-s at 65% opacity for all narrative content",
                ]} />
              </div>
            </Section>

          </main>
        </div>

        {/* ═══ MOBILE TOC PILL ═══ */}
        <div className="toc-mobile">
          {tocOpen && (
            <div className="toc-mobile-menu">
              {SECTIONS.map(s => (
                <div
                  key={s.id}
                  className={`toc-mobile-item ${activeId === s.id ? "active" : ""}`}
                  style={{ paddingLeft: s.level === 2 ? 28 : 14 }}
                  onClick={() => scrollTo(s.id)}
                >
                  {s.label}
                </div>
              ))}
            </div>
          )}
          <button className="toc-pill-btn" onClick={() => setTocOpen(t => !t)}>
            <span className="toc-pill-dot" />
            <span className="toc-pill-active">
              {SECTIONS.find(s => s.id === activeId)?.label || "Contents"}
            </span>
          </button>
        </div>

      </div>
    </>
  );
}
