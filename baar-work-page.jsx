import { useState, useEffect } from "react";

/**
 * BAAR Work Page
 *
 * Two core showcases:
 *
 *   01 / Premium AI Production
 *       SaaS-style explainer + AI-generated visuals showcase card.
 *       Dynamic, cinematic, high-energy.
 *
 *   02 / The BAAR Method — Tier Flow
 *       Interactive step-based storytelling through the 6-stage
 *       client journey: Diagnosis → Recalibration → Mindset →
 *       Process → Output → Sustained System
 *
 *   03 / The Content Engine
 *       How BAAR creates trend-native content for Reels/TikTok.
 *       5-step process illustration.
 */

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const B64="T1RUTwAJAIAAAwAQQ0ZGIGLm+fgAAAL8AAABkU9TLzJI5EbVAAABAAAAAGBjbWFwAMYCIgAAAoAAAABcaGVhZC8HifAAAACcAAAANmhoZWEGrANDAAAA1AAAACRobXR4DiAASgAABJAAAAAUbWF4cAAFUAAAAAD4AAAABm5hbWVyEWWmAAABYAAAASBwb3N0AAMAAAAAAtwAAAAgAAEAAAABAAAh3s2+Xw889QADA+gAAAAA5imjWgAAAADmKaNbAAD/OwOdAyAAAAADAAIAAAAAAAAAAQAAAyD/OAAAA+b/8gAfA5gAAQAAAAAAAAAAAAAAAAAAAAUAAFAAAAUAAAADAtMBkAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAA/Pz8/AAAAIAByAyD/OAAAAyAAyAAAAAAAAAAAAfQD6AAAACAAAAAAAAwAlgABAAAAAAABAAQAAAABAAAAAAACAAcABAABAAAAAAADAAwACwABAAAAAAAEAAwAFwABAAAAAAAFAAsAIwABAAAAAAAGAAwACwADAAEECQABAAgALgADAAEECQACAA4ANgADAAEECQADABgARAADAAEECQAEABgAXAADAAEECQAFABYAdAADAAEECQAGABgAREJhYXJSZWd1bGFyQmFhci1SZWd1bGFyQmFhciBSZWd1bGFyVmVyc2lvbiAzLjAAQgBhAGEAcgBSAGUAZwB1AGwAYQByAEIAYQBhAHIALQBSAGUAZwB1AGwAYQByAEIAYQBhAHIAIABSAGUAZwB1AGwAYQByAFYAZQByAHMAaQBvAG4AIAAzAC4AMAAAAAIAAAADAAAAFAADAAEAAAAUAAQASAAAAAwACAACAAQAIABCAFIAYgBy//8AAAAgAEEAUgBhAHL////hAAD/sgAA/5IAAQAAAAoAAAAKAAAAAAADAAIAAwACAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAQCAAEBAQ1CYWFyLVJlZ3VsYXIAAQEBGvgbAvgcA/gYBIv7Wfox+bQF1g+L+CUS3xEAAgEBDRFCYWFyIFJlZ3VsYXJCYWFyAAAAAAEAIwAiADMABQIAAQANABAAjgDVAS/4iL0W+CT5UPwkBg73wA76IYz5mxWLi46OlZOTldj3touLH9XOg3zEH8R8u3ayb7FwqGqfZQieZZVhXhplgml5bR55bnl3eX4IiYqLiokaiYyJjB6peqZyoWoIo2iXV18aTn1kcGIecWJoamFyYHJceleACIFWV4ZYG/wcBouCi4F+gJaY9yqL+bKLHg76eviE+bQVxb9nVZ8fzvtF9yj8Htj7YZZth2p5cQhxeW18axv9RAZrbpqleR95pYaslqnZ92X3K/gpyvdACLuduqu+G7MGDvogjPl7FcOmjKIe9+cGsMyEfrofuX63dbRttW2tZadbCKdcmVFIGkp/UnNcHoR9gH2AfVtVhTuyTq9UtEynX5KAjH2FfwiAhH+EfvsD/K+LWhv7EpqN93kfDgAAAAH0ADIBLAAAA40AAQPmACUDjP/y";

/* ─── 6-stage tier journey ─── */
const STAGES = [
  {
    num: "01",
    phase: "Diagnosis",
    ring: "Compass Entry",
    ringColor: "#FF8A00",
    action: "BAAR identifies the organization showing signs of creative misalignment. We approach with a diagnosis before a pitch ever exists. The conversation begins with a mirror, not a menu.",
    feeling: "Seen",
    feelingDesc: "For the first time someone has named what we have been feeling for months.",
    deliverable: "Creative Misalignment Audit",
    investment: "$750 – $1,000",
    duration: "",
    tag: "Entry",
  },
  {
    num: "02",
    phase: "Recalibration",
    ring: "Ring 01 — Mindset",
    ringColor: "#FF9E33",
    action: "Honest confrontation between leadership and the creative team. The gap between what the organization says it values and how it actually operates gets put on the table.",
    feeling: "Exposed",
    feelingDesc: "Uncomfortable but necessary. Leadership sees the creative gap from both sides simultaneously.",
    deliverable: "Shared Language Document",
    investment: "Core Compass",
    duration: "",
    tag: "Compass",
  },
  {
    num: "03",
    phase: "Mindset Shift",
    ring: "Ring 01 — Mindset",
    ringColor: "#FF9E33",
    action: "A common vocabulary for creativity is installed across the organization. Leadership gains the language to advocate for creative investment. Creativity gain legitimacy.",
    feeling: "Equipped",
    feelingDesc: "The creative process is clear",
    deliverable: "Creative Philosophy Framework",
    investment: "Core Compass",
    duration: "",
    tag: "Compass",
  },
  {
    num: "04",
    phase: "Process Build",
    ring: "Ring 02 — Process",
    ringColor: "#00C2FF",
    action: "The infrastructure for consistent creative output is designed and installed. Not imposed from outside — built from the inside, with the people who will use it. A system you own.",
    feeling: "Invested",
    feelingDesc: "They helped build it. Ownership creates accountability that no external mandate ever could.",
    deliverable: "Creative Enrollment Blueprint",
    investment: "Core Compass",
    duration: "",
    tag: "Compass",
  },
  {
    num: "05",
    phase: "Output",
    ring: "Ring 03 — Output",
    ringColor: "#2cff05",
    action: "BAAR begins producing content that proves the thesis in the market. Social content, campaign assets, trend-native pieces. Every piece is a demonstration that the mindset and process work.",
    feeling: "Accountable",
    feelingDesc: "The content is real and public. The thesis is no longer theoretical — it's in the feed.",
    deliverable: "Content Production Pack",
    investment: "Core Compass + Retainer",
    duration: "Month 2–3",
    tag: "Production",
  },
  {
    num: "06",
    phase: "Sustained System",
    ring: "Retainer",
    ringColor: "#9C7CFF",
    action: "The system is running. BAAR maintains it, evolves it, and holds the organization accountable to the mindset it built.",
    feeling: "Sustained",
    feelingDesc: "The organization no longer needs BAAR to tell them creativity matters. They proved it themselves.",
    deliverable: "Monthly Content + Mindset Maintenance",
    investment: "$8,000 – $20,000 / month",
    duration: "",
    tag: "Retainer",
  },
];

/* ─── 5-step content engine ─── */
const CONTENT_STEPS = [
  {
    num: "01",
    title: "Cultural\nListening",
    accent: "#FF8A00",
    platforms: ["All Platforms"],
    body: "Before a concept exists, BAAR listens. Trending sounds, formats, cultural vocabulary. We build a brief from the culture, not from the brand calendar.",
    tool: "Trend monitoring + algorithm analysis",
  },
  {
    num: "02",
    title: "Native\nConcepting",
    accent: "#FF9E33",
    platforms: ["Reels"],
    body: "Concepts that feel native to the format first, brand second. Viewers don't watch ads — they watch content. The brand lives inside the content, not on top of it.",
    tool: "Brief + visual storyboard",
  },
  {
    num: "03",
    title: "",
    accent: "#9C7CFF",
    platforms: ["Reels"],
    body: "Reels (15–30s, visual hook in 1s). TikTok (text-native, sound-on, creator-voice). Shorts (mobile-full, high-retention cuts). The same concept gets spoken differently on each platform.",
    tool: "Format adaption + caption engineering",
  },
  {
    num: "04",
    title: "Performance\nLoop",
    accent: "#2cff05",
    platforms: ["Analytics"],
    body: "What gets watched gets repeated with variation. Performance data feeds directly back into the next concept brief. The system learns. The brand gets better at being itself in public.",
    tool: "Analytics → brief → next concept",
  },
];

/* ─── Theme Toggler ─── */
function ThemeToggler({ isDark, onToggle }) {
  return (
    <button className={`tt ${isDark ? "dark" : ""}`} onClick={onToggle} aria-label="Toggle theme">
      <svg className="ti" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <defs><mask id="wm"><rect width="100%" height="100%" fill="white"/><circle className="mc" r="9" fill="black"/></mask></defs>
        <circle className="bc" cx="12" cy="12" fill="currentColor" stroke="none" mask="url(#wm)"/>
        <g className="ry"><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="5.64" y1="5.64" x2="4.22" y2="4.22"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/><line x1="5.64" y1="18.36" x2="4.22" y2="19.78"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/></g>
      </svg>
    </button>
  );
}

export default function WorkPage() {
  const [isDark, setIsDark] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [hoveredContent, setHoveredContent] = useState(null);

  const stage = STAGES[activeStage];

  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800;900&family=Outfit:wght@300;400;500;600&family=Epilogue:ital,wght@0,300;0,400;0,700;1,300&display=swap');
@font-face{font-family:'BC';src:url('data:font/otf;base64,${B64}') format('opentype')}
*{box-sizing:border-box;margin:0;padding:0}body{margin:0}

[data-theme="light"]{--bg:#F6F7F9;--surface:rgba(255,255,255,0.72);--surface-s:rgba(255,255,255,0.88);--surface-w:rgba(252,250,247,0.85);--border:rgba(26,26,26,0.06);--border-s:rgba(26,26,26,0.12);--text:#1a1a1a;--text-s:rgba(26,26,26,0.65);--text-m:rgba(26,26,26,0.45);--text-d:rgba(26,26,26,0.28);--void:#0a0a0a;--track:rgba(26,26,26,0.08)}
[data-theme="dark"]{--bg:#1a1a1a;--surface:rgba(255,255,255,0.04);--surface-s:rgba(255,255,255,0.07);--surface-w:rgba(255,240,220,0.05);--border:rgba(255,255,255,0.08);--border-s:rgba(255,255,255,0.15);--text:#F6F7F9;--text-s:rgba(246,247,249,0.72);--text-m:rgba(246,247,249,0.45);--text-d:rgba(246,247,249,0.28);--void:#000000;--track:rgba(255,255,255,0.10)}

.page{background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif;min-height:100vh;position:relative;overflow-x:hidden;transition:background 600ms ${EASE},color 600ms ${EASE}}
.page::before{content:'';position:fixed;top:-10%;right:-15%;width:55%;height:55%;background:radial-gradient(ellipse at center,rgba(0,194,255,0.05) 0%,transparent 60%);pointer-events:none;z-index:0}
.page::after{content:'';position:fixed;bottom:-10%;left:-10%;width:50%;height:45%;background:radial-gradient(ellipse at center,rgba(255,138,0,0.04) 0%,transparent 60%);pointer-events:none;z-index:0}
.wrap{max-width:1240px;margin:0 auto;padding:0 40px;position:relative;z-index:1}
@media(max-width:760px){.wrap{padding:0 24px}}

/* NAV */
.nav-bar{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;justify-content:center;padding:22px 16px;pointer-events:none}
.nav-pill{pointer-events:auto;display:flex;align-items:center;justify-content:space-between;width:100%;max-width:720px;padding:10px 12px 10px 24px;background:var(--surface);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:999px;box-shadow:0 12px 32px -14px rgba(0,0,0,.12);transition:all 600ms ${EASE}}
.nav-logo{font-family:'BC',sans-serif;font-size:21px;letter-spacing:.04em;color:var(--text);line-height:1}
.nav-links{display:flex;gap:26px}
.nav-link{font-size:13px;color:var(--text);opacity:.65;cursor:pointer;transition:opacity 260ms ${EASE}}
.nav-link:hover{opacity:1}
.nav-link.active{opacity:1;font-weight:500}
.nav-cta{font-size:12px;font-weight:500;color:var(--bg);background:var(--text);padding:9px 18px;border-radius:999px;cursor:pointer;transition:transform 280ms ${EASE}}
.nav-cta:hover{transform:translateY(-1px)}
@media(max-width:760px){.nav-links,.nav-cta{display:none}}

/* PAGE HEADER */
.page-header{padding:200px 0 80px;border-bottom:1px solid var(--border);margin-bottom:120px}
.ph-eyebrow{font-size:10px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--text-m);margin-bottom:20px}
.ph-title{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:clamp(52px,7vw,104px);line-height:.93;letter-spacing:-.005em;margin-bottom:32px}
.ph-title span{display:block;color:var(--text-d)}
.ph-sub{font-family:'Epilogue',sans-serif;font-size:16px;font-weight:300;line-height:1.6;color:var(--text-s);max-width:520px}
.ph-meta{display:flex;gap:24px;margin-top:36px;flex-wrap:wrap}
.ph-tag{font-size:10px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;padding:6px 14px;border:1px solid var(--border);border-radius:999px;color:var(--text-m)}

/* SECTION RHYTHM */
.section{margin-bottom:140px}
.section-header{margin-bottom:56px}
.section-num{font-size:10px;font-weight:500;letter-spacing:.22em;color:var(--text-m);margin-bottom:12px}
.section-title{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:clamp(28px,4vw,48px);letter-spacing:-.005em;line-height:1;margin-bottom:14px}
.section-desc{font-family:'Epilogue',sans-serif;font-size:14.5px;font-weight:300;line-height:1.65;color:var(--text-s);max-width:560px}

/* ═══ AI PRODUCTION SHOWCASE ═══ */
.production-wrap{position:relative;border-radius:26px;overflow:hidden;background:var(--void);color:#F6F7F9}
.production-screen{position:relative;aspect-ratio:16/9;overflow:hidden;background:#000}
.prod-bg{position:absolute;inset:0;background:linear-gradient(135deg,#0a0a0a 0%,#111111 40%,#0d0d0d 100%)}

/* Animated scan lines */
.prod-scanlines{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,.008) 2px,rgba(255,255,255,.008) 4px);pointer-events:none}

/* Animated glow orbs */
.prod-orb1{position:absolute;width:45%;height:80%;top:-20%;left:5%;background:radial-gradient(ellipse at center,rgba(0,194,255,.18) 0%,transparent 60%);animation:orbDrift1 8s ${EASE} infinite}
.prod-orb2{position:absolute;width:60%;height:60%;bottom:-30%;right:-10%;background:radial-gradient(ellipse at center,rgba(255,138,0,.14) 0%,transparent 55%);animation:orbDrift2 11s ${EASE} infinite}
.prod-orb3{position:absolute;width:40%;height:40%;top:10%;right:15%;background:radial-gradient(ellipse at center,rgba(156,124,255,.10) 0%,transparent 60%);animation:orbDrift3 9s ${EASE} infinite}

@keyframes orbDrift1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(2%,3%) scale(1.05)}66%{transform:translate(-1%,-2%) scale(.97)}}
@keyframes orbDrift2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-3%,-2%) scale(1.08)}}
@keyframes orbDrift3{0%,100%{transform:translate(0,0)}40%{transform:translate(2%,2%)}80%{transform:translate(-1%,1%)}}

/* Content overlay */
.prod-content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:40px}

/* Floating HUD elements */
.prod-hud-tl{position:absolute;top:28px;left:28px;display:flex;align-items:center;gap:8px}
.prod-hud-tr{position:absolute;top:28px;right:28px;display:flex;align-items:center;gap:8px}
.prod-hud-br{position:absolute;bottom:28px;right:28px;display:flex;align-items:center;gap:8px}
.prod-hud-bl{position:absolute;bottom:28px;left:28px}
.hud-tag{font-size:9px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;padding:5px 10px;border:1px solid rgba(255,255,255,.12);border-radius:4px;background:rgba(0,0,0,.5);backdrop-filter:blur(8px);color:rgba(255,255,255,.6)}
.hud-tag-pulse{border-color:rgba(0,194,255,.4);color:#00C2FF;background:rgba(0,194,255,.08)}
.hud-dot-live{width:6px;height:6px;border-radius:50%;background:#2cff05;box-shadow:0 0 8px rgba(44,255,5,.7);animation:livePulse 1.8s ease-in-out infinite}
@keyframes livePulse{0%,100%{opacity:1}50%{opacity:.4}}
.hud-live-text{font-size:9px;font-weight:600;letter-spacing:.14em;color:#2cff05}

/* Center title */
.prod-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.prod-headline{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:clamp(36px,5.5vw,80px);line-height:.92;letter-spacing:-.01em;color:#F6F7F9;text-shadow:0 2px 40px rgba(0,0,0,.9);margin-bottom:16px}
.prod-headline em{font-style:normal;color:#00C2FF}
.prod-play{width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,.1);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 360ms ${EASE};margin-top:20px}
.prod-play:hover{background:rgba(0,194,255,.2);border-color:rgba(0,194,255,.5);transform:scale(1.08)}
.prod-play svg{transform:translateX(2px)}

/* Progress bar */
.prod-progress{position:absolute;bottom:0;left:0;right:0;height:2px;background:rgba(255,255,255,.08)}
.prod-progress-fill{height:100%;width:65%;background:linear-gradient(90deg,#FF8A00,#00C2FF);animation:progressAnim 12s linear infinite}
@keyframes progressAnim{0%{width:0%}100%{width:100%}}

/* Corner metrics */
.prod-metric{display:flex;flex-direction:column;align-items:flex-end;gap:2px}
.prod-metric-val{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:22px;letter-spacing:-.02em;line-height:1;color:#F6F7F9}
.prod-metric-label{font-size:8px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.35)}

/* Grid lines decorative */
.prod-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:60px 60px;pointer-events:none}

/* Bottom spec strip */
.prod-specs{padding:28px 36px;display:flex;gap:32px;flex-wrap:wrap;border-top:1px solid rgba(255,255,255,.06)}
.prod-spec{display:flex;flex-direction:column;gap:4px}
.prod-spec-label{font-size:9px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.35)}
.prod-spec-val{font-size:14px;font-weight:500;color:#F6F7F9}
.prod-spec-val.accent-p{color:#00C2FF}
.prod-spec-val.accent-e{color:#FF8A00}

/* Bottom CTA row */
.prod-cta-row{padding:0 36px 28px;display:flex;align-items:center;justify-content:flex-end;flex-wrap:wrap;gap:16px}
.prod-cta-left{font-family:'Epilogue',sans-serif;font-size:12px;font-weight:300;color:rgba(255,255,255,.4);max-width:380px;line-height:1.6}
.prod-cta-btn{font-size:12px;font-weight:500;color:#F6F7F9;border:1px solid rgba(255,255,255,.2);padding:10px 20px;border-radius:999px;cursor:pointer;transition:all 280ms ${EASE};background:rgba(255,255,255,.06);display:flex;align-items:center;gap:8px}
.prod-cta-btn:hover{background:rgba(0,194,255,.12);border-color:rgba(0,194,255,.4)}

/* ═══ TIER FLOW ═══ */
.tier-track-wrap{margin-bottom:40px;overflow-x:auto;padding-bottom:8px}
.tier-track{display:flex;align-items:center;gap:0;min-width:600px}
.tier-node-wrap{display:flex;flex-direction:column;align-items:center;gap:8px;flex:1;cursor:pointer;transition:all 280ms ${EASE}}
.tier-node{width:40px;height:40px;border-radius:50%;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:15px;color:var(--text-m);transition:all 400ms ${EASE};background:var(--surface);position:relative;z-index:2}
.tier-node.active{border-width:2px;color:#F6F7F9;transform:scale(1.15)}
.tier-node-label{font-size:9px;font-weight:500;letter-spacing:.1em;text-align:center;color:var(--text-m);transition:color 280ms ${EASE};line-height:1.3}
.tier-node-wrap.active .tier-node-label{color:var(--text);font-weight:600}
.tier-connector{flex:1;height:2px;background:var(--track);margin:0 -1px;position:relative;z-index:1;min-width:20px;transition:background 400ms ${EASE}}
.tier-connector.filled{background:var(--text-m)}

.tier-detail{background:var(--void);color:#F6F7F9;border-radius:26px;padding:44px;position:relative;overflow:hidden;transition:all 500ms ${EASE}}
.tier-detail::before{content:'';position:absolute;top:-30%;right:-10%;width:60%;height:80%;border-radius:50%;pointer-events:none;transition:background 500ms ${EASE}}

.td-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:16px}
.td-phase{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:clamp(32px,4vw,56px);letter-spacing:-.005em;line-height:1}
.td-badges{display:flex;flex-direction:column;align-items:flex-end;gap:8px}
.td-ring-badge{font-size:9px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;padding:5px 12px;border-radius:999px;border:1px solid;background:rgba(255,255,255,.04)}
.td-stage-tag{font-size:9px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.35)}

.td-body{display:grid;grid-template-columns:1.4fr 1fr;gap:40px}
@media(max-width:760px){.td-body{grid-template-columns:1fr}}

.td-action{font-family:'Epilogue',sans-serif;font-size:15px;font-weight:300;line-height:1.7;color:rgba(255,255,255,.75);margin-bottom:24px}

.td-feeling-wrap{margin-bottom:0}
.td-feeling-label{font-size:9px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:6px}
.td-feeling-word{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:28px;margin-bottom:6px;letter-spacing:-.005em}
.td-feeling-desc{font-family:'Epilogue',sans-serif;font-size:12.5px;font-weight:300;line-height:1.6;color:rgba(255,255,255,.4);font-style:italic}

.td-right{display:flex;flex-direction:column;gap:20px}
.td-meta-item{padding:14px 0;border-bottom:1px solid rgba(255,255,255,.06)}
.td-meta-item:first-child{border-top:1px solid rgba(255,255,255,.06)}
.td-meta-label{font-size:9px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:5px}
.td-meta-val{font-size:13.5px;font-weight:500;color:rgba(255,255,255,.85)}
.td-meta-val.accent{font-weight:600}

.td-nav{display:flex;justify-content:space-between;align-items:center;margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,.06)}
.td-nav-btn{font-size:12px;font-weight:500;color:rgba(255,255,255,.45);cursor:pointer;transition:color 240ms ${EASE};display:flex;align-items:center;gap:8px;background:transparent;border:none;padding:0}
.td-nav-btn:hover{color:rgba(255,255,255,.85)}
.td-nav-btn:disabled{opacity:.2;cursor:not-allowed}
.td-progress-dots{display:flex;gap:6px}
.td-progress-dot{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.2);cursor:pointer;transition:all 280ms ${EASE}}
.td-progress-dot.active{width:18px;border-radius:4px;background:#F6F7F9}

/* ═══ CONTENT ENGINE ═══ */
.content-engine-wrap{overflow-x:auto;padding-bottom:20px}
.content-engine{display:flex;gap:0;min-width:900px}
.ce-step{flex:1;position:relative;cursor:pointer;transition:all 360ms ${EASE}}
.ce-step:hover{transform:translateY(-4px)}
.ce-step-inner{padding:32px 24px;background:var(--surface);backdrop-filter:blur(16px);border:1px solid var(--border);height:100%;transition:all 400ms ${EASE}}
.ce-step:first-child .ce-step-inner{border-radius:20px 0 0 20px}
.ce-step:last-child .ce-step-inner{border-radius:0 20px 20px 0}
.ce-step:hover .ce-step-inner{background:var(--surface-s);border-color:var(--border-s)}
.ce-connector{position:absolute;top:44px;right:-1px;width:2px;height:28px;background:var(--border);z-index:2}

.ce-num{font-size:9px;font-weight:600;letter-spacing:.18em;color:var(--text-m);margin-bottom:18px}
.ce-title{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:22px;line-height:1.1;margin-bottom:14px;transition:color 400ms ${EASE};white-space:pre-line}
.ce-body{font-family:'Epilogue',sans-serif;font-size:12.5px;font-weight:300;line-height:1.65;color:var(--text-s);margin-bottom:18px;transition:color 400ms ${EASE}}
.ce-tool{font-size:10px;font-weight:500;letter-spacing:.08em;color:var(--text-m);border-top:1px solid var(--border);padding-top:12px;margin-top:auto;transition:all 400ms ${EASE}}
.ce-platforms{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px}
.ce-platform-tag{font-size:9px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:4px 8px;border-radius:4px;background:var(--surface-s);border:1px solid var(--border);color:var(--text-m);transition:all 400ms ${EASE}}
.ce-step:hover .ce-platform-tag{border-color:var(--border-s)}

/* Number large */
.ce-big-num{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:100px;line-height:1;color:var(--text);opacity:.04;position:absolute;bottom:-10px;right:12px;pointer-events:none;letter-spacing:-.04em;transition:opacity 360ms ${EASE}}
.ce-step:hover .ce-big-num{opacity:.07}

/* ═══ STATS STRIP ═══ */
.stats-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:0;background:var(--surface);backdrop-filter:blur(16px);border:1px solid var(--border);border-radius:26px;overflow:hidden;margin-bottom:140px;transition:all 600ms ${EASE}}
@media(max-width:760px){.stats-strip{grid-template-columns:repeat(2,1fr)}}
.stat-cell{padding:36px 28px;border-right:1px solid var(--border);transition:all 400ms ${EASE}}
.stat-cell:last-child{border-right:none}
.stat-cell:hover{background:rgba(128,128,128,.03)}
.stat-num{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:48px;line-height:1;letter-spacing:-.02em;margin-bottom:8px;transition:color 600ms ${EASE}}
.stat-label{font-family:'Epilogue',sans-serif;font-size:12px;font-weight:300;color:var(--text-m);line-height:1.5;transition:color 600ms ${EASE}}

/* Theme toggler */
.tt{position:fixed;bottom:28px;left:28px;z-index:60;background:transparent;border:none;cursor:pointer;padding:8px;color:var(--text);opacity:.65;transition:opacity 280ms ${EASE},transform 280ms ${EASE},color 600ms ${EASE}}
.tt:hover{opacity:1;transform:scale(1.08)}
.tt:active{transform:scale(.92)}
.ti{transition:transform 600ms ${EASE}}
.tt.dark .ti{transform:rotate(280deg)}
.bc{transition:r 500ms ${EASE}}
.tt:not(.dark) .bc{r:5}
.tt.dark .bc{r:9}
.mc{transition:cx 500ms ${EASE},cy 500ms ${EASE}}
.tt:not(.dark) .mc{cx:33;cy:0}
.tt.dark .mc{cx:17;cy:8}
.ry{transform-origin:12px 12px;transition:opacity 500ms ${EASE},transform 500ms ${EASE}}
.tt:not(.dark) .ry{opacity:1;transform:scale(1) rotate(0deg)}
.tt.dark .ry{opacity:0;transform:scale(0) rotate(-30deg)}

@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.fade-in{opacity:0;animation:fadeUp 700ms ${EASE} forwards}

/* ═══ FOOTER ═══ */
@keyframes pulse{0%,100%{transform:scale(1);opacity:.25}50%{transform:scale(1.8);opacity:0}}
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
.collab-pill{display:inline-flex;align-items:center;gap:12px;padding:10px 20px 10px 16px;background:var(--surface);backdrop-filter:blur(16px);border:1px solid var(--border);border-radius:999px;cursor:default;font:inherit;box-shadow:0 1px 0 rgba(255,255,255,.06) inset,0 6px 18px -8px rgba(0,0,0,.10);transition:all 320ms ${EASE}}
.collab-dot{width:8px;height:8px;border-radius:50%;background:#00C2FF;box-shadow:0 0 12px rgba(0,194,255,.6);position:relative;flex-shrink:0}
.collab-dot::after{content:'';position:absolute;inset:-3px;border-radius:50%;background:#00C2FF;opacity:.25;animation:pulse 2.4s ${EASE} infinite}
.collab-label{font-size:13px;font-weight:500;color:var(--text)}
.collab-sep{color:var(--text-m);opacity:.6}
.collab-status{font-size:12.5px;color:var(--text-s)}
.footer-mid{display:flex;justify-content:space-between;align-items:center;padding:28px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);flex-wrap:wrap;gap:20px;transition:border-color 600ms ${EASE}}
.footer-links{display:flex;gap:28px;flex-wrap:wrap}
.footer-link{font-size:13px;color:var(--text);opacity:.65;cursor:pointer;transition:opacity 260ms ${EASE};text-decoration:none}
.footer-link:hover{opacity:1}
.footer-socials{display:flex;gap:14px}
.footer-social{font-size:12px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--text-m);cursor:pointer;transition:color 260ms ${EASE}}
.footer-social:hover{color:var(--text)}
.footer-bottom{padding-top:24px;display:flex;justify-content:space-between;font-family:'Epilogue',sans-serif;font-size:11px;color:var(--text-m);flex-wrap:wrap;gap:14px;transition:color 600ms ${EASE}}
      `}</style>

      <div className="page" data-theme={isDark ? "dark" : "light"}>
        <ThemeToggler isDark={isDark} onToggle={() => setIsDark(d => !d)} />

        {/* NAV */}
        <div className="nav-bar">
          <nav className="nav-pill">
            <span className="nav-logo">BAAR</span>
            <div className="nav-links">
              <span className="nav-link">Home</span>
              <span className="nav-link active">Work</span>
              <span className="nav-link">Shop</span>
              <span className="nav-link">About</span>
            </div>
            <span className="nav-cta">Discord</span>
          </nav>
        </div>

        <div className="wrap">

          {/* PAGE HEADER */}
          <header className="page-header fade-in">
            <div className="ph-eyebrow">BAAR — Creative Technology</div>
            <h1 className="ph-title">
              <span style={{ color: "var(--text-d)" }}>The work</span>
              doesn't explain itself.
            </h1>
            <div className="ph-meta">
              <span className="ph-tag">Advertisements</span>
              <span className="ph-tag">Social Content</span>
            </div>
          </header>

          {/* ════ 01 — AI PRODUCTION SHOWCASE ════ */}
          <section className="section">
            <div className="section-header">
              <div className="section-num">01</div>
              <h2 className="section-title">Premium Advertisements</h2>
            </div>

            <div className="production-wrap">
              {/* Cinematic screen */}
              <div className="production-screen">
                <div className="prod-bg" />
                <div className="prod-grid" />
                <div className="prod-orb1" />
                <div className="prod-orb2" />
                <div className="prod-orb3" />
                <div className="prod-scanlines" />

                {/* HUD elements */}
                <div className="prod-hud-tl">
                  <div className="hud-dot-live" />
                  <span className="hud-live-text">IN PRODUCTION</span>
                </div>
                <div className="prod-hud-tr">
                  <div className="hud-tag hud-tag-pulse">AI-GEN</div>
                </div>

                {/* Center */}
                <div className="prod-center">
                  <div className="prod-headline">
                    Built different.<br /><em>Runs different.</em>
                  </div>
                  <div className="prod-play" title="Watch Reel">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M6 4l12 6-12 6V4z" fill="rgba(255,255,255,0.9)" />
                    </svg>
                  </div>
                </div>

                {/* Corner metrics */}
                <div className="prod-hud-bl">
                  <div className="hud-tag">PLATFORM : SOCIAL</div>
                </div>
                <div className="prod-hud-br">
                  <div className="prod-metric">
                    <span className="prod-metric-val">4K</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="prod-progress">
                  <div className="prod-progress-fill" />
                </div>
              </div>

              {/* Spec strip */}
              <div className="prod-specs">
                {[
                  { label: "Format", val: "SaaS Explainer", accent: false },
                  { label: "Duration", val: "30 secs", accent: false },
                  { label: "Production", val: "AI-Assisted Hybrid", accent: "p" },
                  { label: "Platform", val: "", accent: false },
                  { label: "Visual Engine", val: "", accent: "e" },
                  { label: "Deliverables", val: "3 Version", accent: false },
                ].filter(({ val }) => val).map(({ label, val, accent }) => (
                  <div key={label} className="prod-spec">
                    <span className="prod-spec-label">{label}</span>
                    <span className={`prod-spec-val${accent ? ` accent-${accent}` : ""}`}>{val}</span>
                  </div>
                ))}
              </div>

              <div className="prod-cta-row">
                <div className="prod-cta-btn">
                  Request Production Reel
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 12L12 2M12 2H6M12 2v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                </div>
              </div>
            </div>
          </section>

          {/* ════ 02 — TIER SYSTEM FLOW ════ */}
          <section className="section">
            <div className="section-header">
              <div className="section-num">02</div>
              <h2 className="section-title">The BAAR Method</h2>
              <p className="section-desc">
                From first contact to a self-perpetuating content system. Six stages, three rings, one thesis. Click each stage to see how we build inside an organization.
              </p>
            </div>

            {/* Step track */}
            <div className="tier-track-wrap">
              <div className="tier-track">
                {STAGES.map((s, i) => (
                  <>
                    <div
                      key={s.num}
                      className={`tier-node-wrap ${activeStage === i ? "active" : ""}`}
                      onClick={() => setActiveStage(i)}
                    >
                      <div
                        className={`tier-node ${activeStage === i ? "active" : ""}`}
                        style={activeStage === i
                          ? { background: s.ringColor, borderColor: s.ringColor, boxShadow: `0 0 20px ${s.ringColor}50` }
                          : {}
                        }
                      >
                        {s.num}
                      </div>
                      <span className="tier-node-label">{s.phase}</span>
                    </div>
                    {i < STAGES.length - 1 && (
                      <div
                        key={`c${i}`}
                        className={`tier-connector ${i < activeStage ? "filled" : ""}`}
                      />
                    )}
                  </>
                ))}
              </div>
            </div>

            {/* Stage detail */}
            <div
              className="tier-detail"
              style={{ "--glow-color": stage.ringColor } as any}
            >
              <div
                style={{
                  position: "absolute", top: "-30%", right: "-10%", width: "60%",
                  height: "80%", borderRadius: "50%", pointerEvents: "none",
                  background: `radial-gradient(ellipse at center, ${stage.ringColor}14 0%, transparent 60%)`,
                  transition: `background 500ms ${EASE}`,
                }}
              />

              <div className="td-header">
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: stage.ringColor, marginBottom: 6 }}>{stage.ring}</div>
                  <div className="td-phase">{stage.phase}</div>
                </div>
                <div className="td-badges">
                  <div className="td-ring-badge" style={{ color: stage.ringColor, borderColor: stage.ringColor + "40" }}>{stage.ring}</div>
                  <div className="td-stage-tag">{stage.tag} · {stage.duration}</div>
                </div>
              </div>

              <div className="td-body">
                <div>
                  <p className="td-action">{stage.action}</p>
                  <div className="td-feeling-wrap">
                    <div className="td-feeling-label">Client State</div>
                    <div className="td-feeling-word" style={{ color: stage.ringColor }}>{stage.feeling}</div>
                    <div className="td-feeling-desc">"{stage.feelingDesc}"</div>
                  </div>
                </div>
                <div className="td-right">
                  {[
                    ["Deliverable", stage.deliverable],
                    ["Timeline", stage.duration],
                    ["Stage", stage.tag],
                  ].filter(([, val]) => val).map(([label, val]) => (
                    <div key={label} className="td-meta-item">
                      <div className="td-meta-label">{label}</div>
                      <div className="td-meta-val">{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="td-nav">
                <button className="td-nav-btn" onClick={() => setActiveStage(a => Math.max(0, a - 1))} disabled={activeStage === 0}>
                  ← Previous
                </button>
                <div className="td-progress-dots">
                  {STAGES.map((_, i) => (
                    <div
                      key={i}
                      className={`td-progress-dot ${i === activeStage ? "active" : ""}`}
                      onClick={() => setActiveStage(i)}
                      style={i === activeStage ? {} : {}}
                    />
                  ))}
                </div>
                <button className="td-nav-btn" onClick={() => setActiveStage(a => Math.min(STAGES.length - 1, a + 1))} disabled={activeStage === STAGES.length - 1}>
                  Next →
                </button>
              </div>
            </div>
          </section>

          {/* ════ 03 — CONTENT ENGINE ════ */}
          <section className="section">
            <div className="section-header">
              <div className="section-num">03</div>
              <h2 className="section-title">The Content Engine</h2>
              <p className="section-desc">
                How BAAR creates trend-native content for Instagram Reels, TikTok, and Shorts. A proprietary four-step method that puts culture before calendar.
              </p>
            </div>

            <div className="content-engine-wrap">
              <div className="content-engine">
                {CONTENT_STEPS.map((step, i) => (
                  <div
                    key={step.num}
                    className="ce-step"
                    onMouseEnter={() => setHoveredContent(i)}
                    onMouseLeave={() => setHoveredContent(null)}
                  >
                    <div
                      className="ce-step-inner"
                      style={hoveredContent === i ? { borderColor: step.accent + "30" } : {}}
                    >
                      <div className="ce-num">{step.num}</div>
                      <div className="ce-platforms">
                        {step.platforms.map(p => (
                          <span
                            key={p}
                            className="ce-platform-tag"
                            style={hoveredContent === i ? { borderColor: step.accent + "40", color: step.accent } : {}}
                          >{p}</span>
                        ))}
                      </div>
                      {step.title && (
                        <div
                          className="ce-title"
                          style={hoveredContent === i ? { color: step.accent } : {}}
                        >{step.title}</div>
                      )}
                      <div className="ce-body">{step.body}</div>
                      <div className="ce-tool">{step.tool}</div>
                    </div>
                    <div
                      className="ce-big-num"
                      style={{ color: step.accent }}
                    >{step.num}</div>
                    {i < CONTENT_STEPS.length - 1 && <div className="ce-connector" />}
                  </div>
                ))}
              </div>
            </div>

          </section>

        </div>

        {/* ═══ FOOTER ═══ */}
        <footer className="footer">
          <div className="footer-top">
            <div className="footer-brand">
              <h1 className="footer-wordmark">BAAR</h1>
              <p className="footer-tagline"></p>
            </div>
            <div className="footer-collab-zone">
              <span className="footer-collab-caption">Collab</span>
              <div className="collab-pill">
                <span className="collab-dot" />
                <span className="collab-label">Open for collabs</span>
                <span className="collab-sep">·</span>
                <span className="collab-status">case by case</span>
              </div>
            </div>
          </div>
          <div className="footer-mid">
            <div className="footer-links">
              <a className="footer-link" href="/">Home</a>
              <a className="footer-link" href="/work">Work</a>
              <a className="footer-link" href="/shop">Shop</a>
              <a className="footer-link" href="/resources">Resources</a>
              <a className="footer-link" href="https://discord.gg/gNmVtUTB2" target="_blank" rel="noopener noreferrer">Discord</a>
            </div>
            <div className="footer-socials">
              <span className="footer-social">Instagram</span>
              <span className="footer-social">LinkedIn</span>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} BAAR · Made in Atlanta</span>
            <span>Be Authentic and Real</span>
          </div>
        </footer>
      </div>
    </>
  );
}
