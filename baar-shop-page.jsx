import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

/**
 * BAAR Shop Page
 *
 * Card format referenced from Google Stitch build.
 * Design system: BAAR v2 tokens (Deep Charcoal, Canvas, glassmorphism).
 * Product catalog expanded with apparel, accessories, objects.
 *
 * Status types:
 *   Pulse dot  = Made to Order
 *   Ember dot  = Limited Run / Drop
 *   Signal dot = In Stock
 */

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const B64="T1RUTwAJAIAAAwAQQ0ZGIGLm+fgAAAL8AAABkU9TLzJI5EbVAAABAAAAAGBjbWFwAMYCIgAAAoAAAABcaGVhZC8HifAAAACcAAAANmhoZWEGrANDAAAA1AAAACRobXR4DiAASgAABJAAAAAUbWF4cAAFUAAAAAD4AAAABm5hbWVyEWWmAAABYAAAASBwb3N0AAMAAAAAAtwAAAAgAAEAAAABAAAh3s2+Xw889QADA+gAAAAA5imjWgAAAADmKaNbAAD/OwOdAyAAAAADAAIAAAAAAAAAAQAAAyD/OAAAA+b/8gAfA5gAAQAAAAAAAAAAAAAAAAAAAAUAAFAAAAUAAAADAtMBkAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAA/Pz8/AAAAIAByAyD/OAAAAyAAyAAAAAAAAAAAAfQD6AAAACAAAAAAAAwAlgABAAAAAAABAAQAAAABAAAAAAACAAcABAABAAAAAAADAAwACwABAAAAAAAEAAwAFwABAAAAAAAFAAsAIwABAAAAAAAGAAwACwADAAEECQABAAgALgADAAEECQACAA4ANgADAAEECQADABgARAADAAEECQAEABgAXAADAAEECQAFABYAdAADAAEECQAGABgAREJhYXJSZWd1bGFyQmFhci1SZWd1bGFyQmFhciBSZWd1bGFyVmVyc2lvbiAzLjAAQgBhAGEAcgBSAGUAZwB1AGwAYQByAEIAYQBhAHIALQBSAGUAZwB1AGwAYQByAEIAYQBhAHIAIABSAGUAZwB1AGwAYQByAFYAZQByAHMAaQBvAG4AIAAzAC4AMAAAAAIAAAADAAAAFAADAAEAAAAUAAQASAAAAAwACAACAAQAIABCAFIAYgBy//8AAAAgAEEAUgBhAHL////hAAD/sgAA/5IAAQAAAAoAAAAKAAAAAAADAAIAAwACAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAQCAAEBAQ1CYWFyLVJlZ3VsYXIAAQEBGvgbAvgcA/gYBIv7Wfox+bQF1g+L+CUS3xEAAgEBDRFCYWFyIFJlZ3VsYXJCYWFyAAAAAAEAIwAiADMABQIAAQANABAAjgDVAS/4iL0W+CT5UPwkBg73wA76IYz5mxWLi46OlZOTldj3touLH9XOg3zEH8R8u3ayb7FwqGqfZQieZZVhXhplgml5bR55bnl3eX4IiYqLiokaiYyJjB6peqZyoWoIo2iXV18aTn1kcGIecWJoamFyYHJceleACIFWV4ZYG/wcBouCi4F+gJaY9yqL+bKLHg76eviE+bQVxb9nVZ8fzvtF9yj8Htj7YZZth2p5cQhxeW18axv9RAZrbpqleR95pYaslqnZ92X3K/gpyvdACLuduqu+G7MGDvogjPl7FcOmjKIe9+cGsMyEfrofuX63dbRttW2tZadbCKdcmVFIGkp/UnNcHoR9gH2AfVtVhTuyTq9UtEynX5KAjH2FfwiAhH+EfvsD/K+LWhv7EpqN93kfDgAAAAH0ADIBLAAAA40AAQPmACUDjP/y";

const PRODUCTS = [
  {
    id: "t01", name: "T-01 Core", material: "Heavyweight Cotton · 300gsm", price: 120,
    status: "made-to-order", statusLabel: "Made to Order", lead: "4–6 week lead",
    cta: "Configure", category: "apparel",
    image: "linear-gradient(165deg, #e8e6e4 0%, #d4d0cc 40%, #c0bab4 100%)",
  },
  {
    id: "h02", name: "H-02 Shell", material: "Technical Fleece · 400gsm", price: 280,
    status: "limited", statusLabel: "Limited Run", lead: "Drop: Next Friday",
    cta: "Notify Me", category: "apparel",
    image: "linear-gradient(150deg, #2a2a2a 0%, #1a1a1a 50%, #0e0e0e 100%)",
  },
  {
    id: "sh01", name: "SH-01 Brooklyn Camp", material: "Cotton Poplin · Striped", price: 140,
    status: "limited", statusLabel: "Limited Run", lead: "Drop: June 1",
    cta: "Notify Me", category: "apparel",
    image: "linear-gradient(145deg, #1a2440 0%, #15203a 50%, #0c1525 100%)",
  },
  {
    id: "t02", name: "T-02 Faith", material: "Embossed Premium Cotton", price: 95,
    status: "in-stock", statusLabel: "In Stock", lead: "Ships in 2–3 days",
    cta: "Configure", category: "apparel",
    image: "linear-gradient(155deg, #f0eded 0%, #e4e0dd 40%, #d8d2cc 100%)",
  },
  {
    id: "p01", name: "P-01 Wide Trouser", material: "Wool Blend · Pleated", price: 220,
    status: "made-to-order", statusLabel: "Made to Order", lead: "5–6 week lead",
    cta: "Configure", category: "apparel",
    image: "linear-gradient(160deg, #7a6e5e 0%, #5e5244 50%, #3a3228 100%)",
  },
  {
    id: "p02", name: "P-02 Wide Trouser", material: "Cotton Twill · Black", price: 195,
    status: "made-to-order", statusLabel: "Made to Order", lead: "5–6 week lead",
    cta: "Configure", category: "apparel",
    image: "linear-gradient(160deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%)",
  },
  {
    id: "ws01", name: "WS-01 Work Set", material: "Cotton Canvas · Brown", price: 340,
    status: "limited", statusLabel: "Limited Run", lead: "Drop: June 15",
    cta: "Notify Me", category: "apparel",
    image: "linear-gradient(150deg, #6b4c38 0%, #4a3428 50%, #2e1e18 100%)",
  },
  {
    id: "fs01", name: "FS-01 Field Set", material: "Ripstop Cotton · Black", price: 360,
    status: "made-to-order", statusLabel: "Made to Order", lead: "6–8 week lead",
    cta: "Configure", category: "apparel",
    image: "linear-gradient(140deg, #1a1a1a 0%, #111111 50%, #0a0a0a 100%)",
  },
  {
    id: "k01", name: "K-01 Key Tag", material: "Matte Stainless · Opener", price: 35,
    status: "in-stock", statusLabel: "In Stock", lead: "Ships in 2–3 days",
    cta: "Configure", category: "objects",
    image: "linear-gradient(140deg, #c8c8c8 0%, #a0a0a0 50%, #787878 100%)",
  },
  {
    id: "l01", name: "L-01 Lanyard", material: "Woven Nylon · Carabiner", price: 45,
    status: "in-stock", statusLabel: "In Stock", lead: "Ships in 2–3 days",
    cta: "Configure", category: "objects",
    image: "linear-gradient(135deg, #1a1a1a 0%, #111111 60%, #0a0a0a 100%)",
  },
];

const FILTERS = ["All", "Apparel", "Objects"];

function ThemeToggler({ isDark, onToggle }) {
  return (
    <button className={`tt ${isDark ? "dk" : ""}`} onClick={onToggle} aria-label="Toggle theme">
      <svg className="ti" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <defs><mask id="sm"><rect width="100%" height="100%" fill="white"/><circle className="mc" r="9" fill="black"/></mask></defs>
        <circle className="bc" cx="12" cy="12" fill="currentColor" stroke="none" mask="url(#sm)"/>
        <g className="ry"><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="5.64" y1="5.64" x2="4.22" y2="4.22"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/><line x1="5.64" y1="18.36" x2="4.22" y2="19.78"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/></g>
      </svg>
    </button>
  );
}

export default function ShopPage() {
  const [isDark, setIsDark] = useState(false);
  const [filter, setFilter] = useState("All");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const filtered = filter === "All"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === filter.toLowerCase());

  const dotColor = (status) => {
    if (status === "made-to-order") return "var(--pulse)";
    if (status === "limited") return "var(--ember)";
    return "#2cff05";
  };

  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800;900&family=Outfit:wght@300;400;500;600&family=Epilogue:ital,wght@0,300;0,400;0,700;1,300&display=swap');
@font-face{font-family:'BC';src:url('data:font/otf;base64,${B64}') format('opentype')}
*{box-sizing:border-box;margin:0;padding:0}body{margin:0}

[data-theme="light"]{--bg:#F6F7F9;--surface:rgba(255,255,255,0.72);--surface-s:rgba(255,255,255,0.88);--surface-w:rgba(252,250,247,0.85);--surface-card:rgba(247,243,242,1);--border:rgba(26,26,26,0.06);--border-s:rgba(26,26,26,0.12);--text:#1a1a1a;--text-s:rgba(26,26,26,0.65);--text-m:rgba(26,26,26,0.45);--text-d:rgba(26,26,26,0.28);--void:#1a1a1a;--pulse:#00C2FF;--ember:#FF8A00;--img-bg:rgba(26,26,26,0.04)}
[data-theme="dark"]{--bg:#1a1a1a;--surface:rgba(255,255,255,0.04);--surface-s:rgba(255,255,255,0.07);--surface-w:rgba(255,240,220,0.05);--surface-card:rgba(32,32,32,1);--border:rgba(255,255,255,0.08);--border-s:rgba(255,255,255,0.15);--text:#F6F7F9;--text-s:rgba(246,247,249,0.72);--text-m:rgba(246,247,249,0.45);--text-d:rgba(246,247,249,0.28);--void:#0a0a0a;--pulse:#00C2FF;--ember:#FF8A00;--img-bg:rgba(255,255,255,0.04)}

.page{background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif;min-height:100vh;position:relative;overflow-x:hidden;transition:background 600ms ${EASE},color 600ms ${EASE}}

/* NAV */
.nav-wrap{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;justify-content:center;padding:22px 16px;transition:padding 600ms ${EASE};pointer-events:none}
.nav-wrap.scrolled{padding:14px 16px}
.nav{pointer-events:auto;display:flex;align-items:center;justify-content:space-between;gap:24px;width:100%;max-width:720px;padding:10px 12px 10px 24px;background:var(--surface);backdrop-filter:blur(20px) saturate(140%);border:1px solid var(--border);border-radius:999px;box-shadow:0 12px 32px -14px rgba(0,0,0,.12);transition:all 600ms ${EASE}}
.nav-wrap.scrolled .nav{max-width:660px;background:var(--surface-s)}
.nav-logo{font-family:'BC',sans-serif;font-size:26px;letter-spacing:.04em;color:var(--text);line-height:1;transition:color 600ms ${EASE}}
.nav-links{display:flex;gap:26px}
.nav-link{font-size:13px;color:var(--text);opacity:.65;cursor:pointer;transition:opacity 260ms ${EASE}}
.nav-link:hover{opacity:1}
.nav-link.active{opacity:1;font-weight:500;border-bottom:1px solid var(--text);padding-bottom:2px}
.nav-cta{font-size:12px;font-weight:500;color:var(--bg);background:var(--text);padding:9px 18px;border-radius:999px;cursor:pointer;transition:all 280ms ${EASE}}
.nav-cta:hover{transform:translateY(-1px)}
.nav-mobile{display:none;background:transparent;border:none;cursor:pointer;padding:8px;color:var(--text)}
@media(max-width:760px){.nav-links,.nav-cta{display:none}.nav-mobile{display:inline-flex}}

/* HEADER */
.shop-header{padding:180px 40px 0;max-width:1280px;margin:0 auto;display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:24px;margin-bottom:48px}
@media(max-width:760px){.shop-header{padding:140px 24px 0}}
.shop-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:clamp(48px,8vw,88px);line-height:.92;letter-spacing:-.005em;transition:color 600ms ${EASE}}
.shop-filters{display:flex;gap:8px;flex-wrap:wrap}
.shop-filter{font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;padding:8px 20px;border-radius:999px;border:1px solid var(--border);background:transparent;color:var(--text-m);cursor:pointer;transition:all 280ms ${EASE}}
.shop-filter:hover{color:var(--text);border-color:var(--border-s)}
.shop-filter.active{background:var(--text);color:var(--bg);border-color:var(--text)}

/* PRODUCT GRID */
.product-grid{padding:0 40px 140px;max-width:1280px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
@media(max-width:960px){.product-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.product-grid{grid-template-columns:1fr;padding:0 24px 100px}}

/* PRODUCT CARD — Card System v2 Lookbook */
.product-card{background:var(--surface);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid var(--border);border-radius:26px;overflow:hidden;transition:all 500ms ${EASE};cursor:pointer}
.product-card:hover{transform:translateY(-4px);box-shadow:0 22px 50px -22px rgba(0,0,0,.18)}
[data-theme="dark"] .product-card:hover{box-shadow:0 22px 50px -22px rgba(0,0,0,.50)}

/* Image area */
.product-img{aspect-ratio:1/1;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;background:var(--surface-s)}
.product-img-inner{width:100%;height:100%;transition:transform 700ms ${EASE}}
.product-card:hover .product-img-inner{transform:scale(1.03)}

/* Glass pill badge */
.product-badge{position:absolute;top:14px;left:14px;display:flex;align-items:center;gap:7px;padding:6px 12px;background:var(--surface-s);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-radius:999px;z-index:2;border:1px solid var(--border)}
.product-badge-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.product-badge-label{font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;color:var(--text);letter-spacing:.02em;transition:color 600ms ${EASE}}

/* Meta area */
.product-meta{padding:22px 24px 24px;display:flex;flex-direction:column;gap:6px}
.product-name{font-family:'Outfit',sans-serif;font-size:14px;font-weight:500;transition:color 600ms ${EASE}}
.product-material{font-family:'Epilogue',sans-serif;font-size:11px;font-weight:300;color:var(--text-m);transition:color 600ms ${EASE}}
.product-status{font-family:'Epilogue',sans-serif;font-size:11px;font-weight:300;color:var(--text-m);display:flex;align-items:center;gap:6px;transition:color 600ms ${EASE}}
.product-status-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.product-price-row{display:flex;justify-content:space-between;align-items:baseline;margin-top:10px;padding-top:12px;border-top:1px solid var(--border);transition:border-color 600ms ${EASE}}
.product-price{font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;transition:color 600ms ${EASE}}
.product-action{font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--text-m);transition:color 240ms ${EASE}}
.product-card:hover .product-action{color:var(--text)}

/* FOOTER */
.footer{padding:80px 40px 56px;max-width:1280px;margin:0 auto;border-top:1px solid var(--border);transition:border-color 600ms ${EASE}}
@media(max-width:760px){.footer{padding:60px 24px 40px}}
.footer-top{display:grid;grid-template-columns:1fr auto;gap:48px;align-items:flex-start;margin-bottom:64px}
@media(max-width:760px){.footer-top{grid-template-columns:1fr;gap:40px}}
.footer-wordmark{font-family:'BC',sans-serif;font-size:clamp(48px,9vw,96px);letter-spacing:.04em;line-height:.9;transition:color 600ms ${EASE}}
.footer-tagline{font-family:'Epilogue',sans-serif;font-style:italic;font-size:13px;font-weight:300;color:var(--text-s);margin-top:10px;transition:color 600ms ${EASE}}
.footer-made{font-family:'Epilogue',sans-serif;font-size:12px;color:var(--text-m);line-height:1.6;max-width:280px;transition:color 600ms ${EASE}}
.footer-mid{display:flex;justify-content:space-between;align-items:center;padding:24px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);flex-wrap:wrap;gap:16px;transition:border-color 600ms ${EASE}}
.footer-links{display:flex;gap:24px;flex-wrap:wrap}
.footer-link{font-size:13px;color:var(--text);opacity:.65;cursor:pointer;transition:opacity 260ms ${EASE}}
.footer-link:hover{opacity:1}
.footer-socials{display:flex;gap:12px}
.footer-social{font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--text-m);cursor:pointer;transition:color 260ms ${EASE}}
.footer-social:hover{color:var(--text)}
.footer-bottom{padding-top:20px;display:flex;justify-content:space-between;font-family:'Epilogue',sans-serif;font-size:10px;color:var(--text-m);flex-wrap:wrap;gap:12px;transition:color 600ms ${EASE}}

/* THEME TOGGLER */
.tt{position:fixed;bottom:28px;left:28px;z-index:60;background:transparent;border:none;cursor:pointer;padding:8px;color:var(--text);opacity:.65;transition:opacity 280ms ${EASE},transform 280ms ${EASE},color 600ms ${EASE}}
.tt:hover{opacity:1;transform:scale(1.08)}.tt:active{transform:scale(.92)}
.ti{transition:transform 600ms ${EASE}}.tt.dk .ti{transform:rotate(280deg)}
.bc{transition:r 500ms ${EASE}}.tt:not(.dk) .bc{r:5}.tt.dk .bc{r:9}
.mc{transition:cx 500ms ${EASE},cy 500ms ${EASE}}.tt:not(.dk) .mc{cx:33;cy:0}.tt.dk .mc{cx:17;cy:8}
.ry{transform-origin:12px 12px;transition:opacity 500ms ${EASE},transform 500ms ${EASE}}.tt:not(.dk) .ry{opacity:1;transform:scale(1) rotate(0deg)}.tt.dk .ry{opacity:0;transform:scale(0) rotate(-30deg)}

/* MOBILE MENU */
.mob-menu{position:fixed;inset:0;z-index:55;background:var(--bg);padding:96px 32px 48px;display:flex;flex-direction:column;gap:4px;transform:translateX(100%);transition:transform 620ms ${EASE},background 600ms ${EASE};pointer-events:none}
.mob-menu.open{transform:translateX(0);pointer-events:auto}
.mob-close{position:absolute;top:28px;right:22px;background:transparent;border:none;cursor:pointer;padding:10px;color:var(--text);border-radius:999px;font-size:22px}
.mob-link{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:44px;line-height:1.1;color:var(--text);text-decoration:none;padding:14px 0;border-bottom:1px solid var(--border);transition:opacity 240ms ${EASE}}
.mob-link:hover{opacity:.6}
.mob-cta{font-size:14px;font-weight:500;color:var(--bg);background:var(--text);padding:16px;border-radius:999px;text-align:center;margin-top:24px;display:block;text-decoration:none;transition:all 600ms ${EASE}}

/* Grain overlay on product images */
.product-grain{position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");opacity:.5;pointer-events:none;mix-blend-mode:overlay;border-radius:16px;z-index:1}

/* Empty state */
.empty{grid-column:1/-1;padding:80px 0;text-align:center;font-family:'Epilogue',sans-serif;color:var(--text-m);font-size:14px;font-weight:300}

@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.fade-in{opacity:0;animation:fadeUp 600ms ${EASE} forwards}
      `}</style>

      <div className="page" data-theme={isDark ? "dark" : "light"}>
        <ThemeToggler isDark={isDark} onToggle={() => setIsDark(d => !d)} />

        {/* NAV */}
        <div className={`nav-wrap ${scrolled ? "scrolled" : ""}`}>
          <nav className="nav">
            <span className="nav-logo">BAAR</span>
            <div className="nav-links">
              <Link className="nav-link" to="/">Home</Link>
              <Link className="nav-link" to="/work">Work</Link>
              <Link className="nav-link active" to="/shop">Shop</Link>
              <Link className="nav-link" to="/resources">About</Link>
            </div>
            <span className="nav-cta">Configure</span>
            <button className="nav-mobile" onClick={() => setMobileMenu(true)} aria-label="Menu"><Menu size={20} strokeWidth={1.5} /></button>
          </nav>
        </div>

        {/* MOBILE MENU */}
        <div className={`mob-menu ${mobileMenu ? "open" : ""}`}>
          <button className="mob-close" onClick={() => setMobileMenu(false)}>✕</button>
          {["Home", "Work", "Shop", "About", "Resources"].map(item =>
            <a key={item} href="#" className="mob-link" onClick={() => setMobileMenu(false)}>{item}</a>
          )}
          <a href="#" className="mob-cta" onClick={() => setMobileMenu(false)}>Discord</a>
        </div>

        {/* HEADER */}
        <header className="shop-header fade-in">
          <h1 className="shop-title">Shop</h1>
          <div className="shop-filters">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`shop-filter ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        {/* PRODUCT GRID */}
        <div className="product-grid">
          {filtered.length === 0 && (
            <div className="empty">No products in this category yet.</div>
          )}
          {filtered.map((p, i) => (
            <article
              key={p.id}
              className="product-card fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Image */}
              <div className="product-img">
                <div className="product-img-inner" style={{ background: p.image }} />
                {/* Glass pill badge */}
                <div className="product-badge">
                  <span
                    className="product-badge-dot"
                    style={{
                      background: dotColor(p.status),
                      boxShadow: `0 0 8px ${dotColor(p.status)}80`,
                    }}
                  />
                  <span className="product-badge-label">{p.statusLabel}</span>
                </div>
              </div>

              {/* Meta — v2 lookbook format */}
              <div className="product-meta">
                <div className="product-name">{p.name}</div>
                <div className="product-material">{p.material}</div>
                <div className="product-status">
                  <span
                    className="product-status-dot"
                    style={{
                      background: dotColor(p.status),
                      boxShadow: `0 0 6px ${dotColor(p.status)}60`,
                    }}
                  />
                  {p.lead}
                </div>
                <div className="product-price-row">
                  <span className="product-price">${p.price}</span>
                  <span className="product-action">{p.cta}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-top">
            <div>
              <div className="footer-wordmark">BAAR</div>
              <p className="footer-tagline">Be Authentic and Real.</p>
            </div>
            <p className="footer-made">
              Every piece is made when ordered. Wearing it signals belonging inside institutions where vulnerability is rarely rewarded.
            </p>
          </div>
          <div className="footer-mid">
            <div className="footer-links">
              <span className="footer-link">Home</span>
              <span className="footer-link">Work</span>
              <span className="footer-link">Shop</span>
              <span className="footer-link">About</span>
              <span className="footer-link" style={{ fontWeight: 500 }}>Resources</span>
              <span className="footer-link">Discord</span>
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
      </div>
    </>
  );
}
