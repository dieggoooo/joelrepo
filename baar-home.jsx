import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowUpRight, X, Menu, ChevronDown } from "lucide-react";

/**
 * BAAR Home — v1
 *
 * Full page assembling every locked decision:
 *   - Custom BAAR font (BC) from v6 style guide base64
 *   - Floating nav with dramatic resize after hero
 *   - Hero: status pill + two-tier opacity headline + horizontal draggable image stack
 *   - Manifesto card, Thesis cards (Three Rings), Tribe Mirror
 *   - Product preview, Quote pacing, Discord Handoff
 *   - Download/Resources section (adapted from v6)
 *   - Footer with Collab pill + Resource link
 *   - Theme toggler bottom-left (sun↔moon)
 */

const B64="T1RUTwAJAIAAAwAQQ0ZGIGLm+fgAAAL8AAABkU9TLzJI5EbVAAABAAAAAGBjbWFwAMYCIgAAAoAAAABcaGVhZC8HifAAAACcAAAANmhoZWEGrANDAAAA1AAAACRobXR4DiAASgAABJAAAAAUbWF4cAAFUAAAAAD4AAAABm5hbWVyEWWmAAABYAAAASBwb3N0AAMAAAAAAtwAAAAgAAEAAAABAAAh3s2+Xw889QADA+gAAAAA5imjWgAAAADmKaNbAAD/OwOdAyAAAAADAAIAAAAAAAAAAQAAAyD/OAAAA+b/8gAfA5gAAQAAAAAAAAAAAAAAAAAAAAUAAFAAAAUAAAADAtMBkAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAA/Pz8/AAAAIAByAyD/OAAAAyAAyAAAAAAAAAAAAfQD6AAAACAAAAAAAAwAlgABAAAAAAABAAQAAAABAAAAAAACAAcABAABAAAAAAADAAwACwABAAAAAAAEAAwAFwABAAAAAAAFAAsAIwABAAAAAAAGAAwACwADAAEECQABAAgALgADAAEECQACAA4ANgADAAEECQADABgARAADAAEECQAEABgAXAADAAEECQAFABYAdAADAAEECQAGABgAREJhYXJSZWd1bGFyQmFhci1SZWd1bGFyQmFhciBSZWd1bGFyVmVyc2lvbiAzLjAAQgBhAGEAcgBSAGUAZwB1AGwAYQByAEIAYQBhAHIALQBSAGUAZwB1AGwAYQByAEIAYQBhAHIAIABSAGUAZwB1AGwAYQByAFYAZQByAHMAaQBvAG4AIAAzAC4AMAAAAAIAAAADAAAAFAADAAEAAAAUAAQASAAAAAwACAACAAQAIABCAFIAYgBy//8AAAAgAEEAUgBhAHL////hAAD/sgAA/5IAAQAAAAoAAAAKAAAAAAADAAIAAwACAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAQCAAEBAQ1CYWFyLVJlZ3VsYXIAAQEBGvgbAvgcA/gYBIv7Wfox+bQF1g+L+CUS3xEAAgEBDRFCYWFyIFJlZ3VsYXJCYWFyAAAAAAEAIwAiADMABQIAAQANABAAjgDVAS/4iL0W+CT5UPwkBg73wA76IYz5mxWLi46OlZOTldj3touLH9XOg3zEH8R8u3ayb7FwqGqfZQieZZVhXhplgml5bR55bnl3eX4IiYqLiokaiYyJjB6peqZyoWoIo2iXV18aTn1kcGIecWJoamFyYHJceleACIFWV4ZYG/wcBouCi4F+gJaY9yqL+bKLHg76eviE+bQVxb9nVZ8fzvtF9yj8Htj7YZZth2p5cQhxeW18axv9RAZrbpqleR95pYaslqnZ92X3K/gpyvdACLuduqu+G7MGDvogjPl7FcOmjKIe9+cGsMyEfrofuX63dbRttW2tZadbCKdcmVFIGkp/UnNcHoR9gH2AfVtVhTuyTq9UtEynX5KAjH2FfwiAhH+EfvsD/K+LWhv7EpqN93kfDgAAAAH0ADIBLAAAA40AAQPmACUDjP/y";
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/* ─── Draggable Horizontal Image Stack ─── */
function ImageStack() {
  const photos = [
    { id: 0, label: "STUDIO 12", grad: "linear-gradient(150deg, #d4c4a8 0%, #b8a085 30%, #6a4f3a 75%, #2e1f12 100%)" },
    { id: 1, label: "REEL 03 · F4", grad: "linear-gradient(120deg, #2d2218 0%, #1a1410 60%, #0d0a07 100%)" },
    { id: 2, label: "FIELD · 24", grad: "linear-gradient(160deg, #1f2a36 0%, #11181f 55%, #060a10 100%)" },
    { id: 3, label: "PRODUCTION · 08", grad: "linear-gradient(140deg, #f0e9dd 0%, #d4c4a8 40%, #8a755e 90%)" },
    { id: 4, label: "BACKSTAGE · 17", grad: "linear-gradient(130deg, #1a0e08 0%, #0d0805 60%, #050302 100%)" },
  ];

  const [cards, setCards] = useState(
    photos.map((p, i) => ({ ...p, z: 50 - i * 10 }))
  );
  const [dragging, setDragging] = useState(false);
  const [animating, setAnimating] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const getStyle = (index) => {
    const rot = index === 0 ? 0 : -(2 + index * 3);
    const ox = index * -14;
    const oy = index * -8;
    return { transform: `rotate(${rot}deg) translate(${ox}px, ${oy}px)`, zIndex: cards[index].z };
  };

  const handlePointerDown = (e) => {
    if (animating) return;
    dragStart.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e) => {
    if (!dragging) return;
    setDragging(false);
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 60) return;
    setAnimating(true);
    setCards((prev) => {
      const next = [...prev];
      const top = next.shift();
      next.push(top);
      return next.map((c, i) => ({ ...c, z: 50 - i * 10 }));
    });
    setTimeout(() => setAnimating(false), 400);
  };

  return (
    <div className="img-stack">
      {[...cards].reverse().map((card) => {
        const index = cards.indexOf(card);
        const isTop = index === 0;
        const style = getStyle(index);
        return (
          <div
            key={card.id}
            className={`stack-card ${isTop ? "stack-top" : ""}`}
            style={{ ...style, background: card.grad }}
            onPointerDown={isTop && !animating ? handlePointerDown : undefined}
            onPointerUp={isTop ? handlePointerUp : undefined}
          >
            <div className="stack-vignette" />
            <div className="stack-stamp-wrap"><span className="stack-stamp">{card.label}</span></div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Theme Toggler ─── */
function ThemeToggler({ isDark, onToggle }) {
  return (
    <button className={`theme-toggle ${isDark ? "is-dark" : ""}`} onClick={onToggle} aria-label="Toggle theme">
      <svg className="theme-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <defs><mask id="bm"><rect x="0" y="0" width="100%" height="100%" fill="white" /><circle className="mask-c" r="9" fill="black" /></mask></defs>
        <circle className="body-c" cx="12" cy="12" fill="currentColor" stroke="none" mask="url(#bm)" />
        <g className="rays"><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="5.64" y1="5.64" x2="4.22" y2="4.22" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /><line x1="5.64" y1="18.36" x2="4.22" y2="19.78" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /></g>
      </svg>
    </button>
  );
}

/* ─── Download Link ─── */
function DL({ label, desc, accent = "var(--pulse)" }) {
  return (
    <a className="dl" href="#" style={{ color: "inherit" }}>
      <span className="dl-icon" style={{ borderColor: accent }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v6M2.5 4.5L5 7l2.5-2.5" stroke={accent} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 9h7" stroke={accent} strokeWidth="1.3" strokeLinecap="round"/></svg>
      </span>
      <span>
        <span className="dl-label" style={{ color: accent }}>{label}</span>
        {desc && <span className="dl-desc">{desc}</span>}
      </span>
    </a>
  );
}

/* ─── Collab Modal ─── */
function CollabModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", studio: "", kind: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const kinds = ["Brand", "Editorial", "Apparel", "Event", "Other"];

  useEffect(() => {
    if (!isOpen) return;
    const fn = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; setTimeout(() => setSubmitted(false), 500); }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const canSubmit = form.name.trim() && form.email.trim() && form.kind && form.message.trim();

  return (
    <>
      <div className={`modal-backdrop ${isOpen ? "is-open" : ""}`} onClick={onClose} />
      <div className="modal-shell">
        <div className={`modal ${isOpen ? "is-open" : ""}`}>
          {!submitted ? (<>
            <div className="modal-header"><h2 className="modal-title">Collab</h2><button className="modal-close" onClick={onClose}><X size={20} strokeWidth={1.5} /></button></div>
            <p className="modal-subtitle">Tell us what you have in mind. We answer everything we read.</p>
            <div className="channel-row"><div className="channel-avatar">B</div><div className="channel-meta"><span className="channel-name">BAAR</span><span className="channel-email">baarmedia.co@gmail.com</span></div></div>
            <form className="form" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
              <div className="field"><label className="field-label">Name<span className="req">*</span></label><input className="input" type="text" placeholder="Your name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
              <div className="field"><label className="field-label">Email<span className="req">*</span></label><input className="input" type="email" placeholder="you@somewhere.com" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} required /></div>
              <div className="field"><label className="field-label">Studio or Brand</label><input className="input" type="text" placeholder="Where you're working from" value={form.studio} onChange={(e) => setForm(f => ({ ...f, studio: e.target.value }))} /></div>
              <div className="field"><label className="field-label">What kind of collab<span className="req">*</span></label><div className="kind-row">{kinds.map(k => <button key={k} type="button" className={`kind-pill ${form.kind === k ? "kind-pill--active" : ""}`} onClick={() => setForm(f => ({ ...f, kind: f.kind === k ? "" : k }))}>{k}</button>)}</div></div>
              <div className="field"><label className="field-label">Message<span className="req">*</span></label><textarea className="textarea" placeholder="A few sentences." value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} required /></div>
              <button type="submit" className="submit" disabled={!canSubmit}>Send it <ArrowUpRight size={16} strokeWidth={2} className="submit-icon" /></button>
            </form>
          </>) : (<>
            <div className="modal-header"><h2 className="modal-title">Sent.</h2><button className="modal-close" onClick={onClose}><X size={20} strokeWidth={1.5} /></button></div>
            <div className="success"><div className="success-mark">✓</div><h3 className="success-title">We'll be in touch.</h3><p className="success-body">Every message gets read. If there's a fit, you'll hear from us within a week. If there isn't, we'll still tell you.</p></div>
          </>)}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════ MAIN PAGE ═══════════════════ */
export default function BaarHome() {
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [collabOpen, setCollabOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setPastHero(window.scrollY > window.innerHeight * 0.7);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const theme = isDark ? "dark" : "light";

  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800;900&family=Outfit:wght@300;400;500;600&family=Epilogue:ital,wght@0,300;0,400;1,300&display=swap');
@font-face{font-family:'BC';src:url('data:font/otf;base64,${B64}') format('opentype')}
*{box-sizing:border-box;margin:0;padding:0}body{margin:0}

[data-theme="light"]{--bg:#F6F7F9;--surface:rgba(255,255,255,0.72);--surface-s:rgba(255,255,255,0.88);--surface-w:rgba(252,250,247,0.85);--border:rgba(26,26,26,0.06);--border-s:rgba(26,26,26,0.12);--text:#1a1a1a;--text-s:rgba(26,26,26,0.65);--text-m:rgba(26,26,26,0.45);--text-d:rgba(26,26,26,0.32);--void:#1a1a1a;--pulse:#00C2FF;--ember:#FF8A00;--pa:0.04;--ea:0.03}
[data-theme="dark"]{--bg:#1a1a1a;--surface:rgba(255,255,255,0.04);--surface-s:rgba(255,255,255,0.07);--surface-w:rgba(255,240,220,0.05);--border:rgba(255,255,255,0.08);--border-s:rgba(255,255,255,0.15);--text:#F6F7F9;--text-s:rgba(246,247,249,0.72);--text-m:rgba(246,247,249,0.45);--text-d:rgba(246,247,249,0.30);--void:#0a0a0a;--pulse:#00C2FF;--ember:#FF8A00;--pa:0.07;--ea:0.05}

.page{background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif;min-height:100vh;position:relative;overflow-x:hidden;transition:background 600ms ${EASE},color 600ms ${EASE}}
.page::before{content:'';position:fixed;top:-10%;right:-15%;width:55%;height:55%;background:radial-gradient(ellipse at center,rgba(0,194,255,var(--pa)) 0%,transparent 60%);pointer-events:none;z-index:0;transition:background 600ms ${EASE}}
.page::after{content:'';position:fixed;bottom:-10%;left:-10%;width:50%;height:45%;background:radial-gradient(ellipse at center,rgba(255,138,0,var(--ea)) 0%,transparent 60%);pointer-events:none;z-index:0;transition:background 600ms ${EASE}}

/* ═══ NAV ═══ */
.nav-wrap{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;justify-content:center;padding:22px 16px;transition:padding 600ms ${EASE};pointer-events:none}
.nav-wrap.scrolled{padding:14px 16px}
.nav{pointer-events:auto;display:flex;align-items:center;justify-content:space-between;gap:24px;width:100%;max-width:740px;padding:10px 12px 10px 24px;background:var(--surface);backdrop-filter:blur(20px) saturate(140%);-webkit-backdrop-filter:blur(20px) saturate(140%);border:1px solid var(--border);border-radius:999px;box-shadow:0 1px 0 rgba(255,255,255,0.06) inset,0 12px 32px -14px rgba(0,0,0,0.12);transition:all 600ms ${EASE}}
.nav-wrap.scrolled .nav{max-width:660px;background:var(--surface-s);box-shadow:0 1px 0 rgba(255,255,255,0.08) inset,0 20px 48px -18px rgba(0,0,0,0.18)}
.nav-wrap.past-hero .nav{max-width:220px;padding:8px 14px 8px 20px;gap:12px}
.nav-wrap.past-hero .nav-links{opacity:0;width:0;overflow:hidden;gap:0;pointer-events:none}
.nav-wrap.past-hero .nav-cta{opacity:0;width:0;padding:0;overflow:hidden;pointer-events:none}
.nav-dots{display:flex;gap:4px;align-items:center;opacity:0;width:0;overflow:hidden;transition:all 500ms ${EASE};pointer-events:none}
.nav-wrap.past-hero .nav-dots{opacity:.55;width:auto;pointer-events:auto;cursor:pointer}
.nav-wrap.past-hero .nav-dots:hover{opacity:1}
.nav-dot{width:5px;height:5px;border-radius:50%;background:var(--text);transition:background 600ms ${EASE}}
.nav-dot:last-child{opacity:.45}
.nav-logo{font-family:'BC',sans-serif;font-size:26px;letter-spacing:.04em;line-height:1;color:var(--text);transition:color 600ms ${EASE},font-size 400ms ${EASE}}
.nav-wrap.past-hero .nav-logo{font-size:20px}
.nav-links{display:flex;align-items:center;gap:26px;transition:all 500ms ${EASE}}
.nav-link{font-size:13px;color:var(--text);opacity:0.65;cursor:pointer;transition:opacity 260ms ${EASE}}
.nav-link:hover{opacity:1}
.nav-cta{font-size:12px;font-weight:500;color:var(--bg);background:var(--text);padding:9px 18px;border-radius:999px;cursor:pointer;transition:all 280ms ${EASE};white-space:nowrap}
.nav-cta:hover{transform:translateY(-1px)}
.nav-mobile-btn{display:none;background:transparent;border:none;cursor:pointer;padding:8px;color:var(--text)}
@media(max-width:760px){.nav-links,.nav-cta{display:none}.nav-mobile-btn{display:inline-flex}.nav-wrap.past-hero .nav{max-width:100%}.nav-dots{display:none!important}}

/* ═══ HERO ═══ */
.hero{position:relative;z-index:1;padding:200px 40px 120px;max-width:1280px;margin:0 auto;min-height:100vh;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:60px;align-items:center}
@media(max-width:960px){.hero{grid-template-columns:1fr;padding:160px 28px 80px;min-height:unset;gap:64px}}
.hero-text{display:flex;flex-direction:column;gap:36px}
.status-pill{display:inline-flex;align-items:center;gap:10px;padding:8px 16px 8px 14px;background:var(--surface);backdrop-filter:blur(16px);border:1px solid var(--border);border-radius:999px;width:fit-content;box-shadow:0 1px 0 rgba(255,255,255,0.06) inset,0 6px 18px -8px rgba(0,0,0,0.10);opacity:0;animation:fadeUp 700ms ${EASE} forwards;transition:background 600ms ${EASE},border-color 600ms ${EASE}}
.status-dot{width:8px;height:8px;border-radius:50%;background:var(--pulse);box-shadow:0 0 12px rgba(0,194,255,0.6);position:relative;flex-shrink:0}
.status-dot::after{content:'';position:absolute;inset:-3px;border-radius:50%;background:var(--pulse);opacity:.25;animation:pulse 2.4s ${EASE} infinite}
@keyframes pulse{0%,100%{transform:scale(1);opacity:.25}50%{transform:scale(1.8);opacity:0}}
.status-label{font-size:12.5px;font-weight:500;color:var(--text)}
.status-sep{color:var(--text-m);opacity:.6}
.status-suffix{font-size:12px;color:var(--text-s)}
.hero-headline{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:clamp(44px,6.5vw,104px);line-height:.94;letter-spacing:-.005em;margin:0;opacity:0;animation:fadeUp 700ms ${EASE} 140ms forwards}
.hero-headline-line{display:block}
.hero-headline-line--dim{color:var(--text-d)}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
.hero-sub{font-family:'Epilogue',sans-serif;font-size:clamp(15px,1.4vw,18px);font-weight:300;line-height:1.55;color:var(--text-s);max-width:460px;margin:0;opacity:0;animation:fadeUp 700ms ${EASE} 280ms forwards}

/* ═══ IMAGE STACK ═══ */
.img-stack{position:relative;width:100%;height:440px;display:flex;align-items:center;justify-content:center;opacity:0;animation:fadeUp 900ms ${EASE} 200ms forwards}
@media(max-width:960px){.img-stack{height:360px;transform:scale(.85);transform-origin:center top}}
.stack-card{position:absolute;width:460px;height:320px;border-radius:14px;overflow:hidden;transition:transform 500ms ${EASE};will-change:transform;touch-action:none}
@media(max-width:960px){.stack-card{width:380px;height:260px}}
@media(max-width:540px){.stack-card{width:300px;height:210px}}
.stack-top{cursor:grab}.stack-top:active{cursor:grabbing}
.stack-card::after{content:'';position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");opacity:.4;pointer-events:none;mix-blend-mode:overlay;z-index:1}
.stack-vignette{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,.25) 100%);pointer-events:none;z-index:1}
.stack-stamp-wrap{position:absolute;inset:0;display:flex;align-items:flex-end;padding:14px 16px;z-index:2}
.stack-stamp{font-size:9px;font-weight:600;letter-spacing:.22em;color:rgba(255,255,255,.55);background:rgba(0,0,0,.32);backdrop-filter:blur(8px);padding:4px 9px;border-radius:4px;border:1px solid rgba(255,255,255,.08)}

/* ═══ SECTIONS ═══ */
.sec{position:relative;z-index:1;padding:140px 40px;max-width:1240px;margin:0 auto}
@media(max-width:760px){.sec{padding:100px 24px}}
.sec-meta{display:flex;align-items:baseline;gap:16px;margin-bottom:20px}
.sec-num{font-size:11px;font-weight:500;letter-spacing:.22em;color:var(--text-m);transition:color 600ms ${EASE}}
.sec-name{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:28px;letter-spacing:.02em;line-height:1;transition:color 600ms ${EASE}}
.sec-desc{font-family:'Epilogue',sans-serif;font-size:15px;font-weight:300;line-height:1.6;color:var(--text-s);max-width:560px;margin-bottom:48px;transition:color 600ms ${EASE}}
.sec-divider{height:1px;background:var(--border);margin-bottom:140px;transition:background 600ms ${EASE}}

/* ═══ SHOWCASE STRIPS ═══ */
.showcase{position:relative;z-index:1;padding:0 0 0;margin-bottom:0;overflow:hidden}
.showcase-header{padding:0 40px;max-width:1240px;margin:0 auto 28px;display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:16px}
@media(max-width:760px){.showcase-header{padding:0 24px}}
.showcase-label-wrap{display:flex;flex-direction:column;gap:8px}
.showcase-eyebrow{font-size:10px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:var(--text-m);transition:color 600ms ${EASE}}
.showcase-title{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:clamp(28px,4vw,40px);letter-spacing:-.005em;line-height:1;transition:color 600ms ${EASE}}
.showcase-cta{font-size:12px;font-weight:500;color:var(--text-m);display:flex;align-items:center;gap:6px;cursor:pointer;transition:color 260ms ${EASE}}
.showcase-cta:hover{color:var(--text)}

.showcase-track{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;padding:0 40px 20px;scrollbar-width:none}
.showcase-track::-webkit-scrollbar{display:none}
@media(max-width:760px){.showcase-track{padding:0 24px 16px;gap:12px}}

/* Feature card — tall left promo */
.sc-feature{flex-shrink:0;width:280px;min-height:340px;border-radius:20px;overflow:hidden;position:relative;scroll-snap-align:start;display:flex;flex-direction:column;justify-content:space-between;padding:28px 24px;transition:transform 500ms ${EASE}}
.sc-feature:hover{transform:translateY(-3px)}
.sc-feature-bg{position:absolute;inset:0;z-index:0}
.sc-feature-content{position:relative;z-index:1;display:flex;flex-direction:column;gap:12px;height:100%;justify-content:space-between}
.sc-feature-headline{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:28px;line-height:1.05;letter-spacing:-.005em;text-transform:uppercase}
.sc-feature-sub{font-family:'Epilogue',sans-serif;font-size:11px;font-weight:300;opacity:.7;line-height:1.5}
.sc-feature-btn{font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;padding:8px 16px;border-radius:999px;width:fit-content;display:flex;align-items:center;gap:6px;cursor:pointer;transition:all 280ms ${EASE}}

/* Media cards — landscape video/image placeholders */
.sc-media{flex-shrink:0;width:320px;aspect-ratio:4/3;border-radius:18px;overflow:hidden;position:relative;scroll-snap-align:start;cursor:pointer;transition:transform 500ms ${EASE}}
.sc-media:hover{transform:translateY(-3px)}
.sc-media-bg{position:absolute;inset:0}
.sc-media-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:48px;height:48px;border-radius:50%;background:rgba(0,0,0,.35);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;opacity:0;z-index:3;transition:opacity 360ms ${EASE},transform 360ms ${EASE}}
.sc-media:hover .sc-media-play,.sc-portrait:hover .sc-media-play{opacity:1;transform:translate(-50%,-50%) scale(1.05)}
.sc-media-badge{position:absolute;top:12px;left:12px;font-family:'Outfit',sans-serif;font-size:9px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;padding:5px 10px;border-radius:999px;background:rgba(0,0,0,.4);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.7)}
.sc-media-badge-pulse{border-color:rgba(0,194,255,.3);color:#00C2FF;background:rgba(0,194,255,.12)}

/* Tall portrait card */
.sc-portrait{flex-shrink:0;width:200px;aspect-ratio:9/16;border-radius:18px;overflow:hidden;position:relative;scroll-snap-align:start;cursor:pointer;transition:transform 500ms ${EASE}}
.sc-portrait:hover{transform:translateY(-3px)}

/* Grain overlay on showcase cards */
.sc-grain{position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.10 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");opacity:.5;mix-blend-mode:overlay;pointer-events:none;z-index:1}

/* Vignette on cards */
.sc-vig{position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.45) 100%);pointer-events:none;z-index:1}
.sc-vig-top{background:linear-gradient(0deg,transparent 60%,rgba(0,0,0,.35) 100%)}

/* Bottom label */
.sc-label{position:absolute;bottom:14px;left:14px;z-index:2;font-family:'Outfit',sans-serif;font-size:10px;font-weight:500;color:rgba(255,255,255,.75);letter-spacing:.04em}

/* ═══ MANIFESTO CARD ═══ */
.card-manifesto{position:relative;padding:56px 48px 48px;background:var(--surface-w);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:26px;overflow:hidden;box-shadow:0 1px 0 rgba(255,255,255,.06) inset,0 18px 48px -22px rgba(0,0,0,.10);transition:all 600ms ${EASE}}
.card-manifesto:hover{transform:translateY(-2px);box-shadow:0 1px 0 rgba(255,255,255,.08) inset,0 28px 64px -24px rgba(0,0,0,.14)}
.card-manifesto::after{content:'';position:absolute;top:0;right:0;width:200px;height:200px;background:radial-gradient(ellipse at top right,rgba(255,138,0,.06) 0%,transparent 70%);pointer-events:none}
.manifesto-eyebrow{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:var(--text-m);margin-bottom:28px;transition:color 600ms ${EASE}}
.manifesto-headline{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:clamp(36px,5.5vw,72px);line-height:.96;letter-spacing:-.005em;margin:0 0 32px;transition:color 600ms ${EASE}}
.manifesto-headline em{font-style:normal;color:#FF8A00}
.manifesto-sub{font-family:'Epilogue',sans-serif;font-size:16px;font-weight:300;line-height:1.6;color:var(--text-s);max-width:480px;margin:0;transition:color 600ms ${EASE}}

/* ═══ THESIS CARDS ═══ */
.thesis-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
@media(max-width:720px){.thesis-row{grid-template-columns:1fr}}
.card-thesis{position:relative;padding:36px 28px 32px;background:var(--surface);backdrop-filter:blur(16px);border:1px solid var(--border);border-radius:24px;overflow:hidden;box-shadow:0 6px 24px -10px rgba(0,0,0,.06);transition:all 500ms ${EASE}}
.card-thesis:hover{transform:translateY(-4px);box-shadow:0 14px 38px -14px rgba(0,0,0,.12)}
.card-thesis::before{content:attr(data-bg);position:absolute;bottom:-28px;right:-8px;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:200px;line-height:1;color:var(--text);opacity:.04;pointer-events:none;letter-spacing:-.04em;transition:color 600ms ${EASE}}
.thesis-num{font-size:11px;font-weight:500;letter-spacing:.22em;margin-bottom:18px}
.thesis-title{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:32px;letter-spacing:.005em;line-height:1;margin:0 0 14px;transition:color 600ms ${EASE}}
.thesis-body{font-family:'Epilogue',sans-serif;font-size:13.5px;font-weight:300;line-height:1.6;color:var(--text-s);margin:0;transition:color 600ms ${EASE}}

/* ═══ TRIBE MIRROR ═══ */
.tribe-row{display:grid;grid-template-columns:repeat(3,1fr);background:var(--surface);backdrop-filter:blur(16px);border:1px solid var(--border);border-radius:26px;overflow:hidden;padding:8px;transition:all 600ms ${EASE}}
@media(max-width:720px){.tribe-row{grid-template-columns:1fr}}
.card-tribe{padding:32px 28px;border-right:1px solid var(--border);transition:all 400ms ${EASE}}
.card-tribe:last-child{border-right:none}
@media(max-width:720px){.card-tribe{border-right:none;border-bottom:1px solid var(--border)}.card-tribe:last-child{border-bottom:none}}
.card-tribe:hover{background:rgba(128,128,128,.04)}
.tribe-label{font-size:10px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border-s);transition:all 600ms ${EASE}}
.tribe-body{font-family:'Epilogue',sans-serif;font-size:14px;font-weight:300;line-height:1.65;color:var(--text);margin:0;transition:color 600ms ${EASE}}

/* ═══ PRODUCT CARDS ═══ */
.product-row{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
@media(max-width:720px){.product-row{grid-template-columns:1fr}}
.card-product{background:var(--surface);backdrop-filter:blur(16px);border:1px solid var(--border);border-radius:26px;overflow:hidden;transition:all 500ms ${EASE};cursor:pointer}
.card-product:hover{transform:translateY(-4px);box-shadow:0 22px 50px -22px rgba(0,0,0,.18)}
.product-image{aspect-ratio:1/1;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
.product-image span{font-family:'BC',sans-serif;font-size:56px;letter-spacing:.06em;color:rgba(255,255,255,.08)}
.product-meta{padding:22px 24px 24px;display:flex;flex-direction:column;gap:6px}
.product-name{font-size:14px;font-weight:500;transition:color 600ms ${EASE}}
.product-status{font-family:'Epilogue',sans-serif;font-size:11px;font-weight:300;color:var(--text-m);transition:color 600ms ${EASE}}
.product-price-row{display:flex;justify-content:space-between;align-items:baseline;margin-top:10px;padding-top:12px;border-top:1px solid var(--border);transition:border-color 600ms ${EASE}}
.product-price{font-size:13px;font-weight:500;transition:color 600ms ${EASE}}
.product-action{font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--text-m);transition:color 240ms ${EASE}}
.card-product:hover .product-action{color:var(--text)}

/* ═══ DISCORD ═══ */
.card-discord{position:relative;padding:0;background:var(--void);color:#F6F7F9;border:1px solid transparent;border-radius:26px;overflow:hidden;transition:all 500ms ${EASE}}
[data-theme="dark"] .card-discord{border-color:rgba(0,194,255,.10)}
.card-discord::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 80% 20%,rgba(0,194,255,.12) 0%,transparent 50%);pointer-events:none;transition:background 500ms ${EASE}}
.card-discord:hover::after{background:radial-gradient(ellipse at 80% 20%,rgba(0,194,255,.20) 0%,transparent 55%)}
.discord-top{position:relative;z-index:1;padding:44px 44px 32px;display:flex;flex-direction:column;gap:16px}
.discord-inner{position:relative;z-index:1;display:flex;flex-direction:column;gap:16px}
.discord-preview{position:relative;z-index:1;border-top:1px solid rgba(255,255,255,.06);padding:0}
.discord-preview iframe{width:100%;height:320px;border:none;border-radius:0 0 25px 25px;display:block}
.discord-eyebrow{display:flex;align-items:center;gap:10px;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:rgba(246,247,249,.5)}
.discord-dot{width:6px;height:6px;border-radius:50%;background:#00C2FF;box-shadow:0 0 12px rgba(0,194,255,.6)}
.discord-title{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:clamp(28px,4vw,40px);letter-spacing:-.005em;line-height:1;margin:0}
.discord-body{font-family:'Epilogue',sans-serif;font-size:14.5px;font-weight:300;line-height:1.6;color:rgba(246,247,249,.65);max-width:460px;margin:0}
.discord-link{font-size:13px;font-weight:500;color:#F6F7F9;text-decoration:none;display:inline-flex;align-items:center;gap:8px;margin-top:12px;padding-bottom:4px;border-bottom:1px solid rgba(246,247,249,.3);transition:gap 280ms ${EASE},border-color 280ms ${EASE};width:fit-content}
.card-discord:hover .discord-link{gap:14px;border-color:#F6F7F9}

/* ═══ QUOTE ═══ */
.quote-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:720px){.quote-row{grid-template-columns:1fr}}
.card-notif{position:relative;padding:0;border-radius:20px;overflow:hidden;transition:all 500ms ${EASE};--mx:-200px;--my:-200px}
.card-notif:hover{transform:translateY(-2px)}
.card-notif .glow-border{position:absolute;inset:0;border-radius:inherit;background:var(--border);pointer-events:none;transition:background 600ms ${EASE}}
.card-notif .glow-fill{position:absolute;inset:1px;border-radius:19px;background:var(--surface-s);pointer-events:none;transition:background 600ms ${EASE}}
.notif-list{position:relative;z-index:1;display:flex;flex-direction:column;gap:24px;padding:32px 28px}
.notif-item{display:grid;grid-template-columns:20px 1fr;align-items:start;gap:10px}
.notif-dot{width:8px;height:8px;border-radius:50%;margin-top:6px}
.notif-dot--pulse{background:#2cff05}
.notif-dot--ember{background:#2cff05}
.notif-text{font-family:'Epilogue',sans-serif;font-size:14px;font-weight:700;line-height:1.45;color:var(--text);transition:color 600ms ${EASE}}
.notif-time{font-family:'Epilogue',sans-serif;font-size:12.5px;font-weight:400;color:var(--text-m);margin-top:3px;transition:color 600ms ${EASE}}
/* old quote styles removed — replaced by .card-notif above */
/* cleared */

/* ═══ DOWNLOADS ═══ */
.dl-group{background:var(--surface);backdrop-filter:blur(16px);border:1px solid var(--border);border-radius:26px;padding:24px 28px;display:flex;flex-direction:column;gap:6px;transition:all 600ms ${EASE}}
.dl{display:inline-flex;align-items:center;gap:10px;padding:10px 0;cursor:pointer;transition:opacity .2s;text-decoration:none;color:inherit}
.dl:hover{opacity:.7}
.dl-icon{width:24px;height:24px;border-radius:50%;border:1.5px solid var(--pulse);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .2s}
.dl:hover .dl-icon{background:rgba(0,194,255,.08)}
.dl-label{font-size:12.5px;font-weight:600;display:block;line-height:1.3}
.dl-desc{font-family:'Epilogue',sans-serif;font-size:10.5px;color:var(--text-m);display:block;margin-top:1px;transition:color 600ms ${EASE}}
.dl-divider{height:1px;background:var(--border);transition:background 600ms ${EASE}}

/* ═══ FOOTER ═══ */
.footer{position:relative;z-index:1;padding:80px 40px 56px;max-width:1240px;margin:0 auto;border-top:1px solid var(--border);transition:border-color 600ms ${EASE}}
@media(max-width:760px){.footer{padding:60px 24px 40px}}
.footer-top{display:grid;grid-template-columns:1fr auto;gap:48px;align-items:flex-start;margin-bottom:80px}
@media(max-width:760px){.footer-top{grid-template-columns:1fr;gap:48px}}
.footer-brand{display:flex;flex-direction:column;gap:14px;max-width:440px}
.footer-wordmark{font-family:'BC',sans-serif;font-size:clamp(56px,10vw,112px);letter-spacing:.04em;line-height:.9;margin:0;transition:color 600ms ${EASE}}
.footer-tagline{font-family:'Epilogue',sans-serif;font-style:italic;font-size:14px;font-weight:300;color:var(--text-s);margin:0;transition:color 600ms ${EASE}}
.footer-collab-zone{display:flex;flex-direction:column;align-items:flex-end;gap:14px}
@media(max-width:760px){.footer-collab-zone{align-items:flex-start}}
.footer-collab-caption{font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--text-m);transition:color 600ms ${EASE}}
.collab-pill{display:inline-flex;align-items:center;gap:12px;padding:10px 20px 10px 16px;background:var(--surface);backdrop-filter:blur(16px);border:1px solid var(--border);border-radius:999px;cursor:pointer;font:inherit;box-shadow:0 1px 0 rgba(255,255,255,.06) inset,0 6px 18px -8px rgba(0,0,0,.10);transition:all 320ms ${EASE}}
.collab-pill:hover{transform:translateY(-1px);background:var(--surface-s)}
.collab-dot{width:8px;height:8px;border-radius:50%;background:var(--pulse);box-shadow:0 0 12px rgba(0,194,255,.6);position:relative;flex-shrink:0}
.collab-dot::after{content:'';position:absolute;inset:-3px;border-radius:50%;background:var(--pulse);opacity:.25;animation:pulse 2.4s ${EASE} infinite}
.collab-label{font-size:13px;font-weight:500;color:var(--text)}
.collab-sep{color:var(--text-m);opacity:.6}
.collab-status{font-size:12.5px;color:var(--text-s)}
.footer-mid{display:flex;justify-content:space-between;align-items:center;padding:28px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);flex-wrap:wrap;gap:20px;transition:border-color 600ms ${EASE}}
.footer-links{display:flex;gap:28px;flex-wrap:wrap}
.footer-link{font-size:13px;color:var(--text);opacity:.65;cursor:pointer;transition:opacity 260ms ${EASE}}
.footer-link:hover{opacity:1}
.footer-socials{display:flex;gap:14px}
.footer-social{font-size:12px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--text-m);cursor:pointer;transition:color 260ms ${EASE}}
.footer-social:hover{color:var(--text)}
.footer-bottom{padding-top:24px;display:flex;justify-content:space-between;font-family:'Epilogue',sans-serif;font-size:11px;color:var(--text-m);flex-wrap:wrap;gap:14px;transition:color 600ms ${EASE}}

/* ═══ BIO ═══ */
.bio-wrap{position:relative;z-index:1}
.bio-headline{margin-bottom:56px}
.bio-headline-dim,.bio-headline-bold{display:block;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:clamp(36px,5.5vw,72px);line-height:1;letter-spacing:-.005em}
.bio-headline-dim{color:var(--text-d)}
.bio-headline-bold{color:var(--text)}
.bio-content{display:grid;grid-template-columns:300px 1fr;gap:0;align-items:start}
@media(max-width:860px){.bio-content{grid-template-columns:1fr;gap:32px}}
.bio-left{display:flex;flex-direction:column;gap:12px}
.bio-photo{position:relative;border-radius:20px;overflow:hidden;aspect-ratio:3/4;background:linear-gradient(160deg,#2a2218 0%,#1a1410 60%,#0d0a07 100%)}
.bio-photo-inner{position:absolute;inset:0;background:linear-gradient(160deg,#3a3028 0%,#2a2218 60%,#1a1410 100%)}
.bio-photo-grain{position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");opacity:.5;mix-blend-mode:overlay;pointer-events:none}
.bio-socials{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);display:flex;gap:10px;z-index:2}
.bio-social-icon{width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.45);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.7);transition:all 280ms ${EASE};text-decoration:none}
.bio-social-icon:hover{background:rgba(0,0,0,.65);color:#F6F7F9}
.bio-name{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:22px;letter-spacing:-.005em;line-height:1;transition:color 600ms ${EASE}}
.bio-text{padding-left:40px;display:flex;flex-direction:column;gap:20px}
@media(max-width:860px){.bio-text{padding-left:0}}
.bio-lead{font-family:'Epilogue',sans-serif;font-size:15px;font-weight:700;line-height:1.55;color:var(--text);transition:color 600ms ${EASE}}
.bio-body{font-family:'Epilogue',sans-serif;font-size:15px;font-weight:300;line-height:1.65;color:var(--text-s);transition:color 600ms ${EASE}}
.bio-bold{font-family:'Epilogue',sans-serif;font-size:15px;font-weight:700;line-height:1.55;color:var(--text);transition:color 600ms ${EASE}}

/* ═══ THEME TOGGLER ═══ */
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

/* ═══ MODAL ═══ */
.modal-backdrop{position:fixed;inset:0;background:rgba(26,26,26,.30);backdrop-filter:blur(8px);z-index:100;opacity:0;pointer-events:none;transition:opacity 400ms ${EASE}}
.modal-backdrop.is-open{opacity:1;pointer-events:auto}
.modal-shell{position:fixed;inset:0;z-index:101;display:flex;align-items:center;justify-content:center;padding:24px;pointer-events:none}
.modal{width:100%;max-width:520px;max-height:calc(100vh - 48px);background:rgba(255,255,255,.84);backdrop-filter:blur(28px) saturate(160%);border:1px solid var(--border);border-radius:26px;padding:36px;box-shadow:0 1px 0 rgba(255,255,255,.7) inset,0 40px 80px -20px rgba(0,0,0,.30);opacity:0;transform:translateY(12px) scale(.96);pointer-events:none;transition:opacity 500ms ${EASE},transform 500ms ${EASE};overflow-y:auto}
.modal.is-open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}
.modal-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px}
.modal-title{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:36px;letter-spacing:-.005em;line-height:1;margin:0;color:#1a1a1a}
.modal-close{background:transparent;border:none;cursor:pointer;padding:6px;margin:-6px;border-radius:999px;color:rgba(26,26,26,.65);transition:all 240ms ${EASE}}
.modal-close:hover{background:rgba(26,26,26,.06);color:#1a1a1a}
.modal-subtitle{font-family:'Epilogue',sans-serif;font-weight:300;font-size:13px;color:rgba(26,26,26,.65);margin:4px 0 22px}
.channel-row{display:flex;align-items:center;gap:12px;padding:12px 0 20px;margin-bottom:18px;border-bottom:1px solid rgba(26,26,26,.06)}
.channel-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#1a1a1a 0%,#2a2a2a 100%);color:#F6F7F9;display:flex;align-items:center;justify-content:center;font-family:'BC',sans-serif;font-size:14px;letter-spacing:.08em;flex-shrink:0}
.channel-meta{display:flex;flex-direction:column;gap:1px}
.channel-name{font-size:13px;font-weight:600;color:#1a1a1a}
.channel-email{font-family:'Epilogue',sans-serif;font-size:12px;color:rgba(26,26,26,.65)}
.form{display:flex;flex-direction:column;gap:16px}
.field{display:flex;flex-direction:column;gap:6px}
.field-label{font-size:11.5px;font-weight:500;letter-spacing:.05em;color:#1a1a1a}
.field-label .req{color:#FF8A00;margin-left:3px}
.input,.textarea{font-family:'Epilogue',sans-serif;font-size:14px;color:#1a1a1a;padding:11px 14px;background:rgba(255,255,255,.6);border:1px solid rgba(26,26,26,.06);border-radius:12px;outline:none;transition:all 240ms ${EASE};resize:none;width:100%}
.input::placeholder,.textarea::placeholder{font-style:italic;color:rgba(26,26,26,.45)}
.input:focus,.textarea:focus{border-color:rgba(26,26,26,.12);background:rgba(255,255,255,.85);box-shadow:0 0 0 3px rgba(0,194,255,.10)}
.textarea{min-height:96px;line-height:1.5}
.kind-row{display:flex;gap:6px;flex-wrap:wrap}
.kind-pill{font-family:'Outfit',sans-serif;font-size:12.5px;font-weight:500;color:rgba(26,26,26,.65);background:rgba(255,255,255,.45);border:1px solid rgba(26,26,26,.06);padding:7px 14px;border-radius:999px;cursor:pointer;transition:all 280ms ${EASE}}
.kind-pill:hover{color:#1a1a1a;background:rgba(255,255,255,.7)}
.kind-pill--active{color:#F6F7F9;background:#1a1a1a;border-color:#1a1a1a}
.submit{margin-top:14px;display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:14px 24px;background:#1a1a1a;color:#F6F7F9;border:none;border-radius:999px;font-family:'Outfit',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:transform 280ms ${EASE},opacity 280ms ${EASE}}
.submit:hover:not(:disabled){transform:translateY(-1px)}
.submit:disabled{opacity:.35;cursor:not-allowed}
.submit-icon{transition:transform 320ms ${EASE}}
.submit:hover:not(:disabled) .submit-icon{transform:translate(2px,-2px)}
.success{padding:24px 0 8px;display:flex;flex-direction:column;gap:14px}
.success-mark{width:36px;height:36px;border-radius:50%;background:#00C2FF;display:flex;align-items:center;justify-content:center;color:#1a1a1a;font-weight:700;font-size:16px}
.success-title{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:28px;letter-spacing:-.005em;line-height:1.05;margin:0;color:#1a1a1a}
.success-body{font-family:'Epilogue',sans-serif;font-weight:300;font-size:13.5px;color:rgba(26,26,26,.65);line-height:1.55;margin:0;max-width:380px}

/* ═══ MOBILE MENU ═══ */
.mobile-menu{position:fixed;inset:0;z-index:55;background:var(--bg);padding:96px 32px 48px;display:flex;flex-direction:column;gap:4px;transform:translateX(100%);transition:transform 620ms ${EASE},background 600ms ${EASE};pointer-events:none}
.mobile-menu.open{transform:translateX(0);pointer-events:auto}
.mobile-close{position:absolute;top:28px;right:22px;background:transparent;border:none;cursor:pointer;padding:10px;color:var(--text);border-radius:999px}
.mobile-link{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:44px;line-height:1.1;color:var(--text);text-decoration:none;padding:14px 0;letter-spacing:.01em;border-bottom:1px solid var(--border);transition:opacity 240ms ${EASE},transform 240ms ${EASE}}
.mobile-link:hover{opacity:.6;transform:translateX(4px)}
.mobile-cta{font-size:14px;font-weight:500;color:var(--bg);background:var(--text);padding:16px 24px;border-radius:999px;text-decoration:none;text-align:center;margin-top:24px;display:block;transition:all 600ms ${EASE}}
      `}</style>

      <div className="page" data-theme={theme}>
        <ThemeToggler isDark={isDark} onToggle={() => setIsDark(d => !d)} />

        {/* ═══ NAV ═══ */}
        <div className={`nav-wrap ${scrolled ? "scrolled" : ""} ${pastHero ? "past-hero" : ""}`}>
          <nav className="nav">
            <span className="nav-logo">BAAR</span>
            <div className="nav-links">
              <a className="nav-link" href="#">Home</a>
              <a className="nav-link" href="/work">Work</a>
              <a className="nav-link" href="/shop">Shop</a>
              <a className="nav-link" href="/resources">About</a>
            </div>
            <span className="nav-cta">Collab</span>
            <div className="nav-dots" onClick={() => setMobileMenu(true)}><span className="nav-dot" /><span className="nav-dot" /></div>
            <button className="nav-mobile-btn" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu size={20} strokeWidth={1.5} /></button>
          </nav>
        </div>

        {/* MOBILE MENU */}
        <div className={`mobile-menu ${mobileMenu ? "open" : ""}`}>
          <button className="mobile-close" onClick={() => setMobileMenu(false)}><X size={22} strokeWidth={1.5} /></button>
          {[{label:"Home",href:"#"},{label:"Work",href:"/work"},{label:"Shop",href:"/shop"},{label:"About",href:"/resources"}].map(item => <a key={item.label} href={item.href} className="mobile-link" onClick={() => setMobileMenu(false)}>{item.label}</a>)}
          <a href="#" className="mobile-cta" onClick={() => { setMobileMenu(false); setCollabOpen(true); }}>Collab</a>
        </div>

        {/* ═══ HERO ═══ */}
        <section className="hero">
          <div className="hero-text">
            <div className="status-pill">
              <span className="status-dot" />
              <span className="status-label">A creative studio</span>
              <span className="status-sep">·</span>
              <span className="status-suffix">currently making</span>
            </div>
            <h1 className="hero-headline">
              <span className="hero-headline-line hero-headline-line--dim">Most studios</span>
              <span className="hero-headline-line">stop at the surface.</span>
            </h1>
            <p className="hero-sub">We start where the surface is decided.</p>
          </div>
          <ImageStack />
        </section>

        {/* ═══ PREMIUM ADS SHOWCASE ═══ */}
        <section className="showcase sec">
          <div className="showcase-header">
            <div className="showcase-label-wrap">
              <span className="showcase-eyebrow">What We Build</span>
              <h2 className="showcase-title">Premium Ads</h2>
            </div>
            <a className="showcase-cta" href="/work">View all Premium Ads →</a>
          </div>
          <div className="showcase-track">
            {/* Feature promo card */}
            <div className="sc-feature" style={{ color: "#F6F7F9" }}>
              <div className="sc-feature-bg" style={{ background: "linear-gradient(145deg, #1a0810 0%, #2d0a1a 40%, #0a0a0a 100%)" }} />
              <div className="sc-grain" />
              <div className="sc-feature-content">
                <div>
                  <div className="sc-feature-headline" style={{ color: "#F6F7F9" }}>One link in.<br />Marketing out.</div>
                  <p className="sc-feature-sub" style={{ color: "rgba(246,247,249,.6)" }}>SaaS explainers, product demos, and AI-assisted ad creative across channels.</p>
                </div>
                <div className="sc-feature-btn" style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)", color: "#F6F7F9" }}>✦ View Production Reel</div>
              </div>
            </div>

            {/* Video placeholder cards */}
            {[
              { bg: "linear-gradient(150deg, #c8a0d8 0%, #e8c0f0 40%, #f0d0ff 100%)", badge: "AI-GEN", label: "Product Hero · 0:30", pulse: true },
              { bg: "linear-gradient(140deg, #2a2218 0%, #1a1410 60%, #0d0a07 100%)", badge: "EXPLAINER", label: "SaaS Walkthrough · 0:60" },
              { bg: "linear-gradient(160deg, #d4c8b8 0%, #b8a898 50%, #8a7e6e 100%)", badge: "UGC", label: "Testimonial Cut · 0:15" },
              { bg: "linear-gradient(135deg, #1a2a3a 0%, #0f1820 60%, #060a10 100%)", badge: "DEMO", label: "Feature Breakdown · 0:45", pulse: true },
            ].map((card, i) => (
              <div key={i} className="sc-media">
                <div className="sc-media-bg" style={{ background: card.bg }} />
                <div className="sc-grain" />
                <div className="sc-vig" />
                <div className={`sc-media-badge ${card.pulse ? "sc-media-badge-pulse" : ""}`}>{card.badge}</div>
                <div className="sc-media-play">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 3l9 5-9 5V3z" fill="rgba(255,255,255,.9)" /></svg>
                </div>
                <span className="sc-label">{card.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ SOCIAL TRENDS SHOWCASE ═══ */}
        <section className="showcase sec">
          <div className="showcase-header">
            <div className="showcase-label-wrap">
              <span className="showcase-eyebrow">The Content Engine</span>
              <h2 className="showcase-title">Social Trends</h2>
            </div>
            <a className="showcase-cta" href="/work">View all Social Trends →</a>
          </div>
          <div className="showcase-track">
            {/* Feature promo card */}
            <div className="sc-feature" style={{ color: "#F6F7F9" }}>
              <div className="sc-feature-bg" style={{ background: "linear-gradient(145deg, #0a0a0a 0%, #141414 50%, #0e0e0e 100%)" }} />
              <div className="sc-grain" />
              <div className="sc-feature-content">
                <div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(246,247,249,.4)", marginBottom: 12 }}>New Process</div>
                  <div className="sc-feature-headline" style={{ color: "#F6F7F9" }}>Culture first.<br />Calendar second.</div>
                  <p className="sc-feature-sub" style={{ color: "rgba(246,247,249,.5)" }}>Trend-native content for Reels, TikTok, and Shorts — built from what's already moving.</p>
                </div>
                <div className="sc-feature-btn" style={{ background: "rgba(44,255,5,.10)", border: "1px solid rgba(44,255,5,.25)", color: "#2cff05" }}>✦ View Method</div>
              </div>
            </div>

            {/* Portrait reel cards + landscape cards mixed */}
            {[
              { type: "portrait", bg: "linear-gradient(170deg, #f0e0c8 0%, #d4b890 40%, #a08060 100%)", label: "Style Edit · Reel" },
              { type: "media", bg: "linear-gradient(150deg, #f5d040 0%, #e8a820 40%, #c08010 100%)", label: "Drop Campaign · TikTok" },
              { type: "portrait", bg: "linear-gradient(170deg, #40a0c8 0%, #2880a0 50%, #106078 100%)", label: "Beach Day · Reel" },
              { type: "media", bg: "linear-gradient(140deg, #e8d8c8 0%, #d0c0a8 50%, #a09080 100%)", label: "Brand Editorial · Carousel" },
              { type: "portrait", bg: "linear-gradient(170deg, #1a1a1a 0%, #2a2a2a 50%, #0a0a0a 100%)", label: "Studio Session · Short" },
              { type: "media", bg: "linear-gradient(150deg, #d04020 0%, #a03018 40%, #601810 100%)", label: "Event Promo · TikTok" },
            ].map((card, i) => (
              card.type === "portrait" ? (
                <div key={i} className="sc-portrait">
                  <div style={{ position: "absolute", inset: 0, background: card.bg }} />
                  <div className="sc-grain" />
                  <div className="sc-vig" />
                  <div className="sc-media-play">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 3l9 5-9 5V3z" fill="rgba(255,255,255,.9)" /></svg>
                  </div>
                  <span className="sc-label">{card.label}</span>
                </div>
              ) : (
                <div key={i} className="sc-media">
                  <div className="sc-media-bg" style={{ background: card.bg }} />
                  <div className="sc-grain" />
                  <div className="sc-vig" />
                  <div className="sc-media-play">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 3l9 5-9 5V3z" fill="rgba(255,255,255,.9)" /></svg>
                  </div>
                  <span className="sc-label">{card.label}</span>
                </div>
              )
            ))}
          </div>
        </section>

        {/* ═══ MANIFESTO ═══ */}
        <section className="sec">
          <div className="card-manifesto">
            <div className="manifesto-eyebrow">The Foundation</div>
            <h2 className="manifesto-headline">Creativity isn't soft.<br />It's the <em>edge</em> they keep misclassifying.</h2>
            <p className="manifesto-sub">The gap between what organizations say they value and how they treat the creative process inside their walls. BAAR enters that gap.</p>
          </div>
        </section>

        {/* ═══ TRIBE MIRROR ═══ */}
        <section className="sec">
          <div className="sec-meta"><span className="sec-num">02</span><span className="sec-name">The Tribe</span></div>
          <p className="sec-desc">Right-brained thinkers inside left-brained institutions. This is who we build for.</p>
          <div className="tribe-row">
            <div className="card-tribe"><div className="tribe-label">Who They Are</div><p className="tribe-body">Right-brained thinkers who chose to operate inside left-brained institutions — not because they couldn't find alternatives, but because they saw the gap and believed they could close it from the inside.</p></div>
            <div className="card-tribe"><div className="tribe-label">What They Feel</div><p className="tribe-body">Unseen. Not incompetent — unseen. Their organizations aren't hostile to them. They're just organized around a center of gravity built before creativity was understood as strategy.</p></div>
            <div className="card-tribe"><div className="tribe-label">What They Need</div><p className="tribe-body">Legitimacy. Language. Proof. The positioning to walk into a boardroom and say: this is why what I do matters at the beginning of the process — not the end.</p></div>
          </div>
        </section>

        {/* ═══ DISCORD ═══ */}
        <section className="sec">
          <div className="card-discord">
            <div className="discord-top">
              <div className="discord-eyebrow"><span className="discord-dot" />The Tribe Lives Here</div>
              <h3 className="discord-title">The conversation continues on Discord.</h3>
              <p className="discord-body">Roles, channels, and the people closing the gap from the inside. Not a community for everyone. A community for those who recognize themselves.</p>
            </div>
            <a
              href="https://discord.gg/gNmVtUTB2"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: "relative", zIndex: 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                margin: "0 28px 28px", padding: "16px 24px", borderRadius: 14,
                background: "rgba(0,194,255,.12)", border: "1px solid rgba(0,194,255,.25)",
                color: "#00C2FF", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500,
                textDecoration: "none", transition: `background 280ms ${EASE}, border-color 280ms ${EASE}`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,194,255,.20)"; e.currentTarget.style.borderColor = "rgba(0,194,255,.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,194,255,.12)"; e.currentTarget.style.borderColor = "rgba(0,194,255,.25)"; }}
            >
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                <path d="M15.25 1.16A14.94 14.94 0 0011.5 0a.06.06 0 00-.06.03 10.5 10.5 0 00-.46.95 13.82 13.82 0 00-4.14 0 9.62 9.62 0 00-.47-.95A.06.06 0 006.3 0 14.9 14.9 0 002.56 1.16.05.05 0 002.53 1.19 15.32 15.32 0 00.04 10.59a.06.06 0 00.02.04 15.02 15.02 0 004.52 2.28.06.06 0 00.07-.02 10.73 10.73 0 00.93-1.51.06.06 0 00-.03-.08 9.9 9.9 0 01-1.41-.68.06.06 0 01-.01-.1c.1-.07.19-.14.28-.22a.06.06 0 01.06-.01 10.72 10.72 0 009.1 0 .06.06 0 01.06.01c.09.07.19.15.28.22a.06.06 0 010 .1 9.3 9.3 0 01-1.41.67.06.06 0 00-.03.09c.27.52.58 1.02.92 1.5a.06.06 0 00.07.02 14.97 14.97 0 004.53-2.28.06.06 0 00.02-.04A15.24 15.24 0 0015.28 1.19a.05.05 0 00-.03-.03zM6.01 8.67c-.92 0-1.67-.84-1.67-1.88s.74-1.88 1.67-1.88c.94 0 1.69.85 1.67 1.88 0 1.04-.74 1.88-1.67 1.88zm6.17 0c-.92 0-1.67-.84-1.67-1.88s.74-1.88 1.67-1.88c.94 0 1.69.85 1.67 1.88 0 1.04-.73 1.88-1.67 1.88z" fill="currentColor"/>
              </svg>
              Join BAAR on Discord
            </a>
          </div>
        </section>

        {/* ═══ SIGNALS ═══ */}
        <section className="sec">
          <div className="quote-row">
            <div className="card-notif" onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`); }} onMouseLeave={(e) => { e.currentTarget.style.setProperty('--mx', '-200px'); e.currentTarget.style.setProperty('--my', '-200px'); }}>
              <div className="glow-border" /><div className="glow-fill" />
              <div className="notif-list">
                <div className="notif-item">
                  <span className="notif-dot notif-dot--pulse" />
                  <div><div className="notif-text">We don't believe creativity needs to justify itself to strategy. We believe creativity is strategy.</div><div className="notif-time">1 hour ago</div></div>
                </div>
                <div className="notif-item">
                  <span className="notif-dot notif-dot--pulse" />
                  <div><div className="notif-text">Style is the residue of how something was made.</div><div className="notif-time">3 hours ago</div></div>
                </div>
                <div className="notif-item">
                  <span className="notif-dot notif-dot--pulse" />
                  <div><div className="notif-text">The gap between what organizations say they value and how they treat creativity inside their walls.</div><div className="notif-time">6 hours ago</div></div>
                </div>
              </div>
            </div>
            <div className="card-notif" onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`); }} onMouseLeave={(e) => { e.currentTarget.style.setProperty('--mx', '-200px'); e.currentTarget.style.setProperty('--my', '-200px'); }}>
              <div className="glow-border" /><div className="glow-fill" />
              <div className="notif-list">
                <div className="notif-item">
                  <span className="notif-dot notif-dot--ember" />
                  <div><div className="notif-text">Most agencies operate only in Ring 03. BAAR enters at Ring 01.</div><div className="notif-time">1 hour ago</div></div>
                </div>
                <div className="notif-item">
                  <span className="notif-dot notif-dot--ember" />
                  <div><div className="notif-text">Your content isn't working because your company hasn't decided what it actually thinks.</div><div className="notif-time">4 hours ago</div></div>
                </div>
                <div className="notif-item">
                  <span className="notif-dot notif-dot--ember" />
                  <div><div className="notif-text">Wearing it signals belonging inside institutions where vulnerability is rarely rewarded.</div><div className="notif-time">8 hours ago</div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ BIO — JOEL LARMOND ═══ */}
        <section className="sec">
          <div className="bio-wrap">
            <div className="bio-headline">
              <span className="bio-headline-dim">A creative technology approach</span>
              <span className="bio-headline-bold">to building what matters.</span>
            </div>
            <div className="bio-content">
              <div className="bio-left">
                <div className="bio-photo">
                  <div className="bio-photo-inner" />
                  <div className="bio-photo-grain" />
                  <div className="bio-socials">
                    <a href="#" className="bio-social-icon" aria-label="YouTube">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14.4 4.8s-.2-1.2-.7-1.7c-.6-.7-1.3-.7-1.7-.7C9.6 2 8 2 8 2s-1.6 0-4 .4c-.4 0-1.1 0-1.7.7-.5.5-.7 1.7-.7 1.7S1.2 6.2 1.2 7.5v1c0 1.3.4 2.7.4 2.7s.2 1.2.7 1.7c.6.7 1.5.7 1.9.7 1.4.1 5.8.2 5.8.2s2.4 0 4-.4c.4 0 1.1 0 1.7-.7.5-.5.7-1.7.7-1.7s.4-1.4.4-2.7v-1c0-1.3-.4-2.7-.4-2.7zM6.4 10V5.6L10.4 8 6.4 10z" fill="currentColor"/></svg>
                    </a>
                    <a href="#" className="bio-social-icon" aria-label="Instagram">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="13" height="13" rx="3.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2"/><circle cx="12" cy="4" r="0.8" fill="currentColor"/></svg>
                    </a>
                    <a href="#" className="bio-social-icon" aria-label="TikTok">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.5 2v5.5a3.5 3.5 0 11-2.5-3.35" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M10.5 2c.8 1 2 1.8 3.5 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                    </a>
                  </div>
                </div>
                <div className="bio-name">Joel Larmond</div>
              </div>
              <div className="bio-text">
                <p className="bio-lead">I balanced growing my business and expanding my clientele while earning a Film & Media degree at Georgia State University.</p>
                <p className="bio-body">Mornings were spent interning in SEO/Brand Development, afternoons in classes mastering production, evenings at International Relations events, and nights working an overnight delivery job — all to fuel my passion and fund my creative ventures.</p>
                <p className="bio-bold">Building BAAR means pushing creative boundaries from the inside out.</p>
                <p className="bio-body">From cinematic brand films to trend-native social content and full production systems, the goal has always been the same — build work that feels distinct. Something that breaks the scroll and makes you pause.</p>
                <p className="bio-bold">Details matter because they carry intention.</p>
                <p className="bio-body">Every frame, every edit, every beat has to serve the story. If it doesn't, it doesn't stay.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="footer">
          <div className="footer-top">
            <div className="footer-brand">
              <h1 className="footer-wordmark">BAAR</h1>
              <p className="footer-tagline">Be Authentic and Real.</p>
            </div>
            <div className="footer-collab-zone">
              <span className="footer-collab-caption">Collab</span>
              <button className="collab-pill" onClick={() => setCollabOpen(true)} type="button">
                <span className="collab-dot" />
                <span className="collab-label">Open for collabs</span>
                <span className="collab-sep">·</span>
                <span className="collab-status">case by case</span>
              </button>
            </div>
          </div>
          <div className="footer-mid">
            <div className="footer-links">
              <a className="footer-link" href="#">Home</a>
              <a className="footer-link" href="/work">Work</a>
              <a className="footer-link" href="/shop">Shop</a>
              <a className="footer-link" href="/resources">About</a>
              <a className="footer-link" href="https://discord.gg/gNmVtUTB2" target="_blank" rel="noopener noreferrer">Discord</a>
            </div>
            <div className="footer-socials">
              <span className="footer-social">Instagram</span>
              <span className="footer-social">TikTok</span>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} BAAR · Made on Earth</span>
            <span>v6.2 · System still learning</span>
          </div>
        </footer>

        <CollabModal isOpen={collabOpen} onClose={() => setCollabOpen(false)} />
      </div>
    </>
  );
}
