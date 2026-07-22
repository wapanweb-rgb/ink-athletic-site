import React, { useState, useEffect, useRef } from "react";
import { configured, loadData, saveData, adminSignIn, uploadImage } from "./store.js";
import { DEFAULT_PRODUCTS, CATEGORIES } from "./catalog.js";

/* ============================================================
   INK ATHLETIC LTD — premium build
   Orb cinematic → ambient storefront. Products are data.
   All animation is transform/opacity + rAF canvas (GPU-friendly).
   ============================================================ */

/* ----------------------------- DATA ----------------------------- */

const ART_TYPES = ["kiosk", "qr", "printer", "laser", "ai"];

const PROCESS = [
  { t: "Consultation", d: "We learn how your business runs and where it hurts. Every build is specced around you — never a template." },
  { t: "Design", d: "A spec and visual you can hold before anything is built, with AI-powered intelligence designed in from day one." },
  { t: "Development", d: "Hardware, software, and finish — built in-house on premium hardware made for years of all-day public use." },
  { t: "Installation", d: "We deliver, install, and configure on-site. Local-first options keep your data yours." },
  { t: "Ongoing Support", d: "We stay after installation. Real humans, fast — updates, tuning, and help whenever you need it." },
  { t: "Built to Last", d: "Independently owned and operated out of Northern British Columbia — engineering that sticks around." }
];

const SITE_DEFAULTS = {
  titleLine: "Ink Athletic Ltd. — AI Solutions & Interactive Kiosks",
  heroH1a: "AI Engineered", heroH1b: "Products.",
  heroSub1: "That work for you. ",
  heroStrong: "Engineered in Northern BC",
  heroSub2: " — kiosks and AI systems built for businesses that want to feel like the future.",
  hint: "Scroll to break the orb",
  caps: [
    { k: "00 / Mission", h: "Built for outcomes.", p: "AI engineered products, designed to work for your business — not the other way around." },
    { k: "01 / Ownership", h: "Independently built.", p: "Ink Athletic Ltd. is founder-led and independently owned — engineering our own path forward." },
    { k: "02 / Craft", h: "Precision, inside and out.", p: "Every system we ship is built to a standard: hardware that lasts, software that works quietly in the background." }
  ],
  storeEyebrow: "Featured Products", storeTitle: "The Store",
  storeSub: "One standard: make a small business feel like a technology company.",
  storeSoon: "Online ordering is coming soon — keychains, 3D prints, and more. Kiosks and AI builds are available by quote today.",
  processEyebrow: "Our Process", processTitle: "How it works",
  process: PROCESS,
  ctaA: "Build the", ctaEm: "future-feel.",
  ctaP: "Tell us what your business needs to do. We'll spec it, quote it, and build it.",
  ctaBtn: "Start a conversation",
  email: "brandon@inkathletic.ca",
  footerBlurb: "Kiosks and custom AI, built for real-world businesses.",
  address: "9711 100th Ave, Unit 208 (upstairs)",
  city: "Fort St. John, British Columbia", postal: "V1J 1Y2", country: "Canada",
  bottomLine: "Built in the North. Engineered for the future.",
  socials: {
    facebook: "https://facebook.com/inkathletic",
    instagram: "https://instagram.com/inkathletic",
    tiktok: "https://tiktok.com/@inkathletic"
  },
  founder: {
    eyebrow: "The Team",
    heading: "Meet the founder",
    name: "Brandon Cameron",
    role: "Founder & Owner",
    bio: "A member of Saulteau First Nations in Moberly Lake, BC, Brandon Cameron founded Ink Athletic to bring big-technology thinking to everyday businesses. With an education in Marketing and Advertising from UBC and extensive experience in web design and AI architecture, he leads every build from first concept through on-site install.",
    email: "brandon@inkathletic.ca",
    photo: "/founder.jpg"
  }
};

/* ----------------------------- CSS ----------------------------- */

const CSS = `:root{--bg:#060506;--paper:#F2F3F5;--steel:#9BA1AA;--cyan:#FF4650;--blue:#C1121F;--line:rgba(160,164,172,.18);--mono:'JetBrains Mono',monospace;--disp:'Anton',sans-serif;--body:'Archivo',sans-serif;--brand:'Michroma',sans-serif;}*{margin:0;padding:0;box-sizing:border-box}html,body,#root{background:var(--bg)}body{background:var(--bg);color:var(--paper);font-family:var(--body);line-height:1.6;overflow-x:hidden}::selection{background:var(--cyan);color:#060506}#gl{position:fixed;inset:0;z-index:0;display:block;width:100%;height:100%}main{position:relative;z-index:2}button{font:inherit;cursor:pointer;background:none;border:none;color:inherit}a:focus-visible,button:focus-visible{outline:2px solid var(--cyan);outline-offset:3px}.reveal{opacity:0;transform:translateY(28px);transition:opacity .9s cubic-bezier(.16,.84,.28,1),transform .9s cubic-bezier(.16,.84,.28,1)}.reveal.in{opacity:1;transform:none}@media (prefers-reduced-motion:reduce){.reveal{transition:none;opacity:1;transform:none}}#logo{position:fixed;inset:0;z-index:1;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transform:scale(.9);will-change:opacity,transform}#logo .rays{position:absolute;width:135vmin;height:135vmin;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,68,82,.06) 0deg 3deg,transparent 3deg 21deg);-webkit-mask:radial-gradient(circle,transparent 22%,#000 34%,transparent 60%);mask:radial-gradient(circle,transparent 22%,#000 34%,transparent 60%);animation:spinRays 34s linear infinite}#logo .rays.r2{width:110vmin;height:110vmin;animation-duration:48s;animation-direction:reverse;background:repeating-conic-gradient(from 8deg,rgba(255,172,178,.04) 0deg 2deg,transparent 2deg 29deg)}#logo .lockup{position:relative;display:inline-flex;flex-direction:column;align-items:center}#logo .lgimg{width:clamp(240px,34vw,400px);height:auto;filter:drop-shadow(0 4px 9px rgba(0,3,8,.9)) drop-shadow(0 0 22px rgba(255,68,82,.3))}main section{position:relative;z-index:2}.wordmark .nmark{width:19px;height:auto;margin-right:8px;vertical-align:-3px;filter:drop-shadow(0 0 6px rgba(255,68,82,.35))}#logo .lg{position:relative;font-family:var(--brand);font-weight:400;text-transform:uppercase;white-space:nowrap;font-size:clamp(22px,4.6vw,66px);letter-spacing:.12em;color:#F6FAFF;-webkit-text-stroke:.5px rgba(255,68,82,.35);text-shadow:0 0 2px rgba(255,255,255,.9),0 0 22px rgba(255,68,82,.55),0 2px 18px rgba(0,4,10,.8)}#logo .rule{position:relative;margin-top:14px;width:64%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,68,82,.75),transparent);overflow:hidden}#logo .tagline{margin-top:13px;font-family:var(--mono);font-size:clamp(9px,1.5vw,14px);letter-spacing:.32em;text-transform:uppercase;text-align:center;white-space:nowrap;color:#FF4650;text-shadow:0 0 16px rgba(255,68,82,.55)}#logo .beam{position:absolute;top:50%;left:-30%;width:22%;height:2px;transform:translateY(-50%) rotate(0deg);background:linear-gradient(90deg,transparent,rgba(255,255,255,.9),transparent);filter:blur(.5px);animation:glint 6.2s ease-in-out infinite}@keyframes spinRays{to{transform:rotate(360deg)}}@keyframes glint{0%,58%,100%{left:-30%;opacity:0}64%{opacity:1}82%{left:106%;opacity:0}}@media (prefers-reduced-motion:reduce){#logo .rays,#logo .beam{animation:none}}nav{position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:60;display:flex;align-items:center;gap:24px;padding:13px 24px;border-radius:999px;background:rgba(13,12,13,.5);backdrop-filter:blur(12px) saturate(1.2);border:1px solid rgba(160,164,172,.22);box-shadow:0 12px 44px rgba(3,3,4,.45);max-width:calc(100vw - 28px);transition:padding .45s cubic-bezier(.2,.7,.2,1),background .45s ease,box-shadow .45s ease}nav.scrolled{padding:9px 20px;background:rgba(10,10,12,.75);backdrop-filter:blur(22px) saturate(1.35);box-shadow:0 8px 34px rgba(3,3,4,.6),0 0 30px rgba(193,18,31,.08)}.wordmark{font-family:var(--brand);font-size:12.5px;letter-spacing:.16em;color:var(--paper);text-decoration:none;text-transform:uppercase;white-space:nowrap}.wordmark span{color:var(--cyan)}nav .links{display:flex;gap:20px;align-items:center}nav .links a,nav .links button{color:var(--steel);text-decoration:none;font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;transition:color .25s;white-space:nowrap}nav .links a:hover,nav .links button:hover{color:var(--paper)}nav .links a.active{color:var(--cyan)}.quote-btn{position:relative}.quote-btn .badge{position:absolute;top:-11px;right:-13px;min-width:17px;height:17px;border-radius:9px;background:var(--cyan);color:#060506;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 4px}.navprog{position:absolute;left:18px;right:18px;bottom:5px;height:2px;border-radius:2px;background:rgba(160,164,172,.14);overflow:hidden}.navprog i{display:block;height:100%;width:0;border-radius:2px;background:linear-gradient(90deg,var(--blue),var(--cyan))}@media(max-width:680px){nav .links a.hidemobile{display:none}nav{gap:16px}}section{min-height:100vh;display:flex;align-items:center;padding:0 6vw;position:relative}.tall{min-height:88vh}.hero{align-items:flex-end;padding-bottom:9vh}.hero-inner{width:100%;transform-origin:left bottom;will-change:transform,opacity}.eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:var(--steel);margin-bottom:16px;display:flex;align-items:center;gap:10px}.eyebrow::before{content:"";width:34px;height:1px;background:var(--cyan)}h1{font-family:var(--disp);font-weight:400;text-transform:uppercase;font-size:clamp(56px,12vw,180px);line-height:.9;will-change:text-shadow}h1 .ghost{display:block;color:transparent;-webkit-text-stroke:1px rgba(160,164,172,.55)}.hero-sub{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-top:26px;flex-wrap:wrap}.hero-sub p{max-width:400px;color:var(--steel);font-size:15px}.hint{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--paper);display:flex;gap:10px;align-items:center}.hint::after{content:"↓";color:var(--cyan)}@media (prefers-reduced-motion:no-preference){.hint::after{animation:dip 1.6s ease-in-out infinite}@keyframes dip{50%{transform:translateY(5px)}}}.cap{max-width:430px}.cap.right{margin-left:auto}.glass{background:linear-gradient(160deg,rgba(26,26,30,.55),rgba(10,10,12,.38));border:1px solid var(--line);border-top:1px solid rgba(255,68,82,.35);backdrop-filter:blur(10px);padding:34px 32px;border-radius:4px;clip-path:polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,22px 100%,0 calc(100% - 22px))}.k{font-family:var(--mono);font-size:11px;letter-spacing:.22em;color:var(--cyan);text-transform:uppercase;display:block;margin-bottom:10px}.cap h2{font-family:var(--disp);font-weight:400;font-size:clamp(32px,4.6vw,56px);line-height:.95;text-transform:uppercase;margin-bottom:10px}.cap p{color:var(--steel);font-size:15px}.sec-head{max-width:760px;margin:0 auto 8vh;text-align:center}.sec-head .eyebrow{justify-content:center}.sec-head .eyebrow::after{content:"";width:34px;height:1px;background:var(--cyan)}.sec-head h2{font-family:var(--disp);font-weight:400;text-transform:uppercase;font-size:clamp(40px,6.5vw,88px);line-height:.92}.sec-head p{color:var(--steel);margin-top:16px;font-size:16px;max-width:520px;margin-left:auto;margin-right:auto}#why{display:block;padding:18vh 6vw 8vh}.why-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:18px;max-width:1240px;margin:0 auto}.wcard{position:relative;overflow:hidden;background:linear-gradient(160deg,#34363B 0%,#1C1D21 34%,#26282D 52%,#121316 100%);border:1px solid rgba(190,195,204,.30);border-radius:18px;padding:30px 28px;height:100%;box-shadow:inset 0 1px 0 rgba(255,255,255,.10),inset 0 -1px 0 rgba(0,0,0,.55),0 14px 40px rgba(3,3,4,.5);transition:transform .45s cubic-bezier(.2,.7,.2,1),border-color .35s,box-shadow .35s}.wcard::after{content:"";position:absolute;inset:-40%;pointer-events:none;background:linear-gradient(115deg,transparent 32%,rgba(255,255,255,.08) 45%,rgba(255,168,176,.13) 50%,rgba(255,255,255,.08) 55%,transparent 68%);transform:translateX(-75%)}.reveal.in .wcard::after{animation:cardSheen 1.7s cubic-bezier(.3,.6,.3,1) .2s 1 both}.wcard:hover::after{animation:cardSheen 1.25s cubic-bezier(.3,.6,.3,1) both}@keyframes cardSheen{from{transform:translateX(-75%)}to{transform:translateX(75%)}}@media (prefers-reduced-motion:reduce){.wcard::after,.reveal.in .wcard::after,.wcard:hover::after{animation:none}}.wcard svg,.wcard h3,.wcard p{position:relative;z-index:1}.wcard:hover{transform:translateY(-6px);border-color:rgba(255,68,82,.5);box-shadow:inset 0 1px 0 rgba(255,255,255,.12),inset 0 -1px 0 rgba(0,0,0,.55),0 22px 60px rgba(3,3,4,.55),0 0 30px rgba(193,18,31,.14)}.wcard svg{width:38px;height:38px;margin-bottom:18px}.wcard h3{font-family:var(--disp);font-weight:400;font-size:19px;text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}.wcard p{color:var(--steel);font-size:13.5px}#store{display:block;min-height:auto;padding:14vh 6vw 0}.pgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:26px;max-width:1400px;margin:0 auto;align-items:stretch}.pcard{position:relative;display:flex;flex-direction:column;height:100%;background:linear-gradient(165deg,rgba(28,28,32,.55),rgba(11,11,13,.42));border:1px solid var(--line);border-radius:22px;backdrop-filter:blur(14px);box-shadow:0 24px 60px rgba(3,3,4,.5);will-change:transform;transition:box-shadow .4s ease,border-color .4s ease}.pcard:hover{border-color:rgba(255,68,82,.35);box-shadow:0 34px 90px rgba(3,3,4,.65),0 0 44px rgba(193,18,31,.16)}.pcard.expanding{transition:transform .26s cubic-bezier(.2,.7,.2,1),box-shadow .26s;transform:scale(1.035)!important;box-shadow:0 40px 110px rgba(3,3,4,.7),0 0 70px rgba(255,68,82,.28);z-index:5}.pborder{position:absolute;inset:0;border-radius:22px;padding:1.2px;pointer-events:none;opacity:0;transition:opacity .45s ease;overflow:hidden;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude}.pborder::before{content:"";position:absolute;inset:-42%;background:conic-gradient(from 0deg,transparent 0deg,rgba(255,68,82,.9) 40deg,transparent 90deg,transparent 180deg,rgba(193,18,31,.8) 220deg,transparent 270deg);animation:borderSpin 4.5s linear infinite}.pcard:hover .pborder{opacity:1}@keyframes borderSpin{to{transform:rotate(360deg)}}@media (prefers-reduced-motion:reduce){.pborder::before{animation:none}}.spot{position:absolute;inset:0;border-radius:22px;pointer-events:none;opacity:0;transition:opacity .35s;background:radial-gradient(260px circle at var(--gx,50%) var(--gy,50%),rgba(255,68,82,.13),transparent 62%)}.pcard:hover .spot{opacity:1}.pcard-art{aspect-ratio:16/10;display:flex;align-items:center;justify-content:center;background:radial-gradient(80% 90% at 50% 20%,rgba(44,45,50,.85),rgba(10,10,12,.85));border-bottom:1px solid var(--line);border-radius:22px 22px 0 0;overflow:hidden}.pcard-art svg,.pcard-art img{width:100%;height:100%;object-fit:cover;transition:transform .7s cubic-bezier(.16,.84,.28,1)}.pcard:hover .pcard-art svg,.pcard:hover .pcard-art img{transform:scale(1.045)}.pbody{padding:26px 26px 28px;display:flex;flex-direction:column;flex:1}.pcard h3{font-family:var(--disp);font-weight:400;font-size:23px;text-transform:uppercase;letter-spacing:.03em}.outcome{color:var(--paper);font-size:15.5px;font-weight:600;line-height:1.45;margin:8px 0 12px}.minichips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px}.minichip{font-family:var(--mono);font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--steel);border:1px solid rgba(160,164,172,.28);border-radius:999px;padding:5px 10px}.prow{margin-top:auto;padding-top:6px;display:flex;align-items:baseline;gap:8px;margin-bottom:16px}.price{font-family:var(--disp);font-size:25px;letter-spacing:.02em}.price-from{font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--steel)}.pbtns{display:flex;gap:10px}.btn{flex:1;font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;padding:14px 10px;border-radius:11px;text-align:center;transition:all .28s ease}.btn.solid{background:linear-gradient(100deg,var(--blue),var(--cyan));color:#04121C;font-weight:700}.btn.solid:hover{filter:brightness(1.15);box-shadow:0 0 26px rgba(255,68,82,.42)}.btn.ghost{border:1px solid rgba(160,164,172,.4);color:var(--paper)}.btn.ghost:hover{border-color:var(--cyan);color:var(--cyan);box-shadow:inset 0 0 18px rgba(255,68,82,.08)}#process{display:block;min-height:auto;padding:30px 6vw 30px}#process .sec-head{margin-bottom:30px}.steps{max-width:720px;margin:0 auto;position:relative;padding-left:22px}.pline{position:absolute;left:43px;top:14px;bottom:26px;width:1.5px;background:linear-gradient(180deg,var(--blue),var(--cyan),transparent);transform:scaleY(0);transform-origin:top;transition:transform 1.6s cubic-bezier(.2,.7,.2,1)}.steps.in .pline{transform:scaleY(1)}.step{display:grid;grid-template-columns:44px 1fr;gap:26px;align-items:start;padding:24px 0}.step .num{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--disp);font-size:17px;background:#151518;border:1px solid rgba(255,68,82,.4);color:var(--cyan);position:relative;z-index:2;box-shadow:0 0 22px rgba(193,18,31,.16)}.step h3{font-family:var(--disp);font-weight:400;font-size:22px;text-transform:uppercase;letter-spacing:.03em}.step p{color:var(--steel);font-size:14.5px;max-width:460px}.ppage{position:relative;z-index:2;padding:16vh 6vw 8vh;min-height:100vh}.pp-back{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--steel);margin-bottom:34px;display:inline-flex;gap:8px}.pp-back:hover{color:var(--cyan)}.pp-grid{display:grid;grid-template-columns:1.15fr 1fr;gap:56px;max-width:1300px;margin:0 auto;align-items:start}@media(max-width:900px){.pp-grid{grid-template-columns:1fr}}.pp-art{border-radius:24px;overflow:hidden;border:1px solid var(--line);background:radial-gradient(80% 90% at 50% 20%,rgba(44,45,50,.85),rgba(10,10,12,.85));box-shadow:0 30px 90px rgba(3,3,4,.6);aspect-ratio:4/3;display:flex}.pp-art svg,.pp-art img{width:100%;height:100%;object-fit:cover}.pp-info h1{font-size:clamp(38px,5vw,68px);line-height:.94;margin-bottom:10px;font-family:var(--disp);font-weight:400;text-transform:uppercase}.pp-outcome{font-size:19px;font-weight:600;color:var(--paper);line-height:1.5;margin-bottom:14px}.pp-line{color:var(--steel);font-size:15px;margin-bottom:20px}.pp-price{display:flex;align-items:baseline;gap:10px;margin:4px 0 22px}.pp-price .price{font-size:32px}.chiplist{display:flex;flex-wrap:wrap;gap:9px;margin:0 0 28px}.chip{font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--paper);border:1px solid rgba(255,68,82,.35);background:rgba(255,68,82,.07);border-radius:999px;padding:8px 15px}.pp-cta{display:flex;gap:12px;max-width:440px}.related{max-width:1300px;margin:12vh auto 0}.related h2{font-family:var(--disp);font-weight:400;text-transform:uppercase;font-size:clamp(26px,3.5vw,44px);margin-bottom:30px}.drawer{position:fixed;top:0;right:0;bottom:0;width:min(400px,92vw);z-index:80;background:rgba(12,12,14,.92);backdrop-filter:blur(18px);border-left:1px solid var(--line);transform:translateX(102%);transition:transform .5s cubic-bezier(.2,.8,.2,1);display:flex;flex-direction:column;padding:32px 28px;overflow-y:auto;overscroll-behavior:contain}.drawer.open{transform:none}.drawer h3{font-family:var(--disp);font-weight:400;font-size:26px;text-transform:uppercase;margin-bottom:6px}.drawer .sub{font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--steel);margin-bottom:24px}.qitem{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:15px 0;border-bottom:1px solid var(--line)}.qitem .qn{font-weight:600;font-size:14px}.qitem .qm{font-family:var(--mono);font-size:10px;color:var(--steel)}.qitem button{color:var(--steel);font-size:16px;padding:4px}.qitem button:hover{color:#FF6B76}.qempty{color:var(--steel);font-size:14px;padding:30px 0}.drawer .btn.solid{margin-top:auto;text-decoration:none;display:block}.drawer .close{position:absolute;top:22px;right:22px;color:var(--steel);font-size:20px}.drawer .close:hover{color:var(--paper)}.scrim{position:fixed;inset:0;z-index:79;background:rgba(4,4,5,.5);opacity:0;pointer-events:none;transition:opacity .4s}.scrim.open{opacity:1;pointer-events:auto}.toast{position:fixed;bottom:28px;left:50%;transform:translate(-50%,80px);z-index:90;background:rgba(18,18,20,.95);border:1px solid rgba(255,68,82,.5);border-radius:12px;padding:13px 26px;font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--cyan);box-shadow:0 12px 40px rgba(3,3,4,.6);transition:transform .5s cubic-bezier(.2,.8,.2,1);pointer-events:none}.toast.show{transform:translate(-50%,0)}.cta{flex-direction:column;justify-content:center;text-align:center;min-height:64vh}.cta h2{font-family:var(--disp);font-weight:400;text-transform:uppercase;font-size:clamp(46px,9vw,130px);line-height:.9}.cta h2 em{font-style:normal;background:linear-gradient(100deg,var(--blue),var(--cyan));-webkit-background-clip:text;background-clip:text;color:transparent}.cta p{color:var(--steel);max-width:420px;margin:20px auto 34px}.cta .btn{flex:none;padding:17px 44px;text-decoration:none}footer{position:relative;z-index:2;display:block;padding:0 6vw 34px;background:linear-gradient(180deg,transparent,rgba(5,5,6,.85) 40%)}.f-sep{height:1px;margin-bottom:52px;background:linear-gradient(90deg,transparent,rgba(255,68,82,.65),rgba(193,18,31,.5),transparent);background-size:200% 100%;transform:scaleX(0);transition:transform 1.4s cubic-bezier(.2,.7,.2,1)}.f-sep.in{transform:scaleX(1)}@media (prefers-reduced-motion:no-preference){.f-sep{animation:sepflow 7s linear infinite}@keyframes sepflow{to{background-position:200% 0}}}.f-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:34px;max-width:1240px;margin:0 auto 54px}@media(max-width:820px){.f-grid{grid-template-columns:1fr 1fr}}@media(max-width:520px){.f-grid{grid-template-columns:1fr 1fr;gap:26px 18px;margin-bottom:34px}.f-brand{grid-column:1 / -1}.f-brand p{margin-top:8px}}.f-brand .wordmark{font-size:15px}.f-brand p{color:var(--steel);font-size:13px;margin-top:12px;max-width:280px}.f-col h4{font-family:var(--mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--steel);margin-bottom:16px}.f-col a,.f-col span{display:block;color:var(--paper);text-decoration:none;font-size:13.5px;margin-bottom:10px;transition:color .25s}.f-col a:hover{color:var(--cyan)}.f-bottom{max-width:1240px;margin:0 auto;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--steel)}#why,#store,#process,.cta,footer{content-visibility:auto;contain-intrinsic-size:auto 900px}.hero-sub p strong{color:var(--cyan);font-weight:700}.admin-link{font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:rgba(155,161,170,.5);text-decoration:none;transition:color .2s}.admin-link:hover{color:var(--cyan)}.admin-wrap{position:relative;z-index:2;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:14vh 6vw 8vh}.admin-card{width:100%;max-width:380px;background:linear-gradient(165deg,rgba(28,28,32,.7),rgba(11,11,13,.55));border:1px solid var(--line);border-radius:20px;backdrop-filter:blur(14px);padding:36px 32px;box-shadow:0 24px 70px rgba(3,3,4,.55)}.admin-card h2{font-family:var(--disp);font-weight:400;text-transform:uppercase;font-size:28px;margin-bottom:6px}.admin-card .sub{font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--steel);margin-bottom:22px}.field{margin-bottom:14px}.field label{display:block;font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--steel);margin-bottom:7px}.field input,.field textarea,.field select{width:100%;background:rgba(6,5,6,.55);border:1px solid var(--line);border-radius:9px;padding:11px 13px;color:var(--paper);font-family:var(--body);font-size:14px}.field input:focus,.field textarea:focus,.field select:focus{outline:none;border-color:var(--cyan)}.field textarea{resize:vertical;min-height:64px}.admin-error{color:var(--cyan);font-size:12.5px;margin-bottom:14px}.admin-panel{position:relative;z-index:2;min-height:100vh;padding:14vh 6vw 10vh}.admin-head{display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap;max-width:1100px;margin:0 auto 40px}.admin-head h1{font-family:var(--disp);font-weight:400;text-transform:uppercase;font-size:clamp(30px,4vw,48px)}.admin-list{max-width:1100px;margin:0 auto 48px;display:flex;flex-direction:column;gap:14px}.admin-row{background:linear-gradient(165deg,rgba(24,24,28,.6),rgba(10,10,12,.45));border:1px solid var(--line);border-radius:16px;padding:20px 22px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}.admin-row .an{font-weight:600;font-size:15px}.admin-row .am{font-family:var(--mono);font-size:11px;color:var(--steel);margin-top:4px}.admin-row .abtns{display:flex;gap:8px}.admin-form{max-width:1100px;margin:0 auto;background:linear-gradient(165deg,rgba(24,24,28,.6),rgba(10,10,12,.45));border:1px solid var(--line);border-radius:20px;padding:30px 30px 26px}.admin-form h3{font-family:var(--disp);font-weight:400;text-transform:uppercase;font-size:22px;margin-bottom:18px}.admin-form .grid2{display:grid;grid-template-columns:1fr 1fr;gap:0 18px}@media(max-width:640px){.admin-form .grid2{grid-template-columns:1fr}}.admin-form .formbtns{display:flex;gap:10px;margin-top:6px}.btn.small{padding:9px 16px;font-size:10px;flex:none}.btn.danger{border:1px solid rgba(255,68,82,.5);color:var(--cyan)}.btn.danger:hover{background:rgba(255,68,82,.12)}.admin-tabs{max-width:1100px;margin:0 auto 26px;display:flex;gap:8px}.atab{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;padding:11px 22px;border-radius:999px;border:1px solid var(--line);color:var(--steel);transition:all .25s}.atab.on{border-color:rgba(255,68,82,.55);color:var(--cyan);background:rgba(255,68,82,.08)}.atab:hover{color:var(--paper)}#team{display:block;min-height:auto;padding:0 6vw 8vh}.team-card{max-width:1040px;margin:0 auto;display:grid;grid-template-columns:300px 1fr;gap:44px;align-items:center;background:linear-gradient(165deg,rgba(28,28,32,.55),rgba(11,11,13,.42));border:1px solid var(--line);border-top:1px solid rgba(255,68,82,.35);border-radius:24px;backdrop-filter:blur(14px);box-shadow:0 24px 60px rgba(3,3,4,.5);padding:38px}@media(max-width:760px){.team-card{grid-template-columns:1fr;gap:26px;text-align:center;padding:30px 26px}}.tronmask{position:relative;aspect-ratio:1/1;border-radius:26px;overflow:hidden}.tronframe{position:absolute;inset:0;border-radius:24px;padding:3px;overflow:hidden;background:#0B0B0D;transform:translateX(108%);will-change:transform}.tronframe::before{content:"";position:absolute;inset:-40%;background:conic-gradient(from 0deg,transparent 0deg,rgba(255,68,82,.12) 30deg,rgba(255,68,82,.95) 62deg,#FFDADD 74deg,rgba(255,68,82,.95) 86deg,rgba(255,68,82,.12) 120deg,transparent 150deg,transparent 210deg,rgba(193,18,31,.55) 255deg,rgba(255,120,130,.7) 268deg,rgba(193,18,31,.55) 282deg,transparent 320deg);animation:borderSpin 4.2s linear infinite}@media(max-width:760px){.tronframe{transform:translateY(108%)}}@media (prefers-reduced-motion:reduce){.tronframe{transform:none;transition:none}.tronframe::before{animation:none}}.team-photo{position:relative;z-index:1;width:100%;height:100%;border-radius:21px;overflow:hidden;background:radial-gradient(80% 90% at 50% 20%,rgb(38,39,44),rgb(10,10,12))}.team-photo img{width:100%;height:100%;object-fit:cover}.team-ph{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}.team-ph span{font-family:var(--disp);font-size:64px;letter-spacing:.04em;color:transparent;-webkit-text-stroke:1px rgba(255,68,82,.5)}.team-ph em{font-family:var(--mono);font-style:normal;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--steel)}.team-info h3{font-family:var(--disp);font-weight:400;text-transform:uppercase;font-size:clamp(30px,4vw,46px);line-height:.95}.team-role{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--cyan);margin:10px 0 18px}.team-info p{color:var(--steel);font-size:15px;line-height:1.7;margin-bottom:22px}.team-mail{display:inline-flex;text-decoration:none;padding:13px 26px;flex:none}@media(max-width:760px){.team-mail{width:100%;justify-content:center}}.admin-panel>*:not(#gl),.ppage>*:not(#gl),.greenpage>*:not(#gl){position:relative;z-index:1}.greenpage{position:relative;z-index:2;padding:16vh 6vw 10vh;min-height:100vh}.eco-link{display:inline-flex;align-items:center;gap:7px;color:#46BE79 !important;transition:color .25s,filter .25s}.eco-link svg{width:14px;height:14px}.eco-link:hover{color:#63D993 !important;filter:drop-shadow(0 0 8px rgba(70,190,121,.5))}.eco-nav{font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;white-space:nowrap}@media(max-width:680px){.eco-nav .eco-txt{display:none}}.f-col .eco-link{margin-top:2px}.eco-head{max-width:760px;margin:0 auto 7vh;text-align:center}.eco-eyebrow{justify-content:center;color:#46BE79}.eco-eyebrow::before{background:#46BE79}.eco-eyebrow svg{width:15px;height:15px}.eco-head h1{font-family:var(--disp);font-weight:400;text-transform:uppercase;font-size:clamp(44px,8vw,104px);line-height:.92}.eco-head h1 em{font-style:normal;background:linear-gradient(100deg,#2E9E5B,#63D993);-webkit-background-clip:text;background-clip:text;color:transparent}.eco-head p{color:var(--steel);margin-top:18px;font-size:16px;max-width:540px;margin-left:auto;margin-right:auto}.eco-hint{margin-top:26px;font-family:var(--mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#46BE79}.eco-hint::after{content:" ↓"}.eco-grid{display:flex;flex-direction:column;gap:16vh;max-width:1060px;margin:12vh auto 0;padding-bottom:8vh}.eco-card{position:relative;width:min(440px,90vw);background:linear-gradient(160deg,rgba(20,26,22,.68),rgba(8,10,9,.55));border:1px solid rgba(160,172,164,.22);border-radius:16px;padding:28px 26px;backdrop-filter:blur(12px);box-shadow:inset 0 1px 0 rgba(255,255,255,.07),0 14px 40px rgba(3,4,3,.5);transition:opacity .9s cubic-bezier(.16,.84,.28,1),transform .9s cubic-bezier(.16,.84,.28,1),border-color .3s,box-shadow .3s}.eco-card.right{align-self:flex-end}.eco-card:hover{border-color:rgba(70,190,121,.45);box-shadow:inset 0 1px 0 rgba(255,255,255,.09),0 22px 56px rgba(3,4,3,.55),0 0 30px rgba(46,158,91,.16)}.eco-card p{color:#B7C0BA;font-size:14.5px}.eco-ring{border-radius:16px;padding:1.8px}.eco-ring::before{background:conic-gradient(from 0deg,transparent 0deg,rgba(70,190,121,.95) 22deg,#E4FFEF 34deg,rgba(70,190,121,.95) 46deg,rgba(70,190,121,.25) 70deg,transparent 95deg 360deg);animation-duration:7s}.dust.gd{background:radial-gradient(circle,#DCFFE9 0%,#57C87F 45%,rgba(70,190,120,0) 78%);box-shadow:0 0 6px rgba(96,220,146,.9)}.eco-card h3,.eco-card p,.eco-card .eco-leaf{position:relative;z-index:2}.eg-clip{position:absolute;inset:0;overflow:hidden;border-radius:16px;pointer-events:none;z-index:1}.eg-clip .sglyph{opacity:0;transition:opacity 1.3s ease}.eg-clip.lit .sglyph{opacity:1;animation:markBurn 1.15s ease-out}.eg-clip .g-heat{color:#37C878}.eg-clip .g-edge{color:#3ED47F;filter:drop-shadow(0 0 6px rgba(62,212,127,.85))}.eg-clip .g-core{color:#03130A}.eg-clip .dust.ember{background:radial-gradient(circle,#E2FFE9 0%,#4ED488 45%,rgba(60,200,120,0) 78%);box-shadow:0 0 7px rgba(80,220,140,.95)}@keyframes markBurn{0%{filter:brightness(3.2) saturate(1.6)}55%{filter:brightness(1.6)}100%{filter:none}}@media(max-width:720px){.eco-grid{gap:18vh}.eco-card,.eco-card.right{align-self:center}}.eco-card .eco-leaf{display:block;width:30px;height:30px;color:#46BE79;margin-bottom:16px;filter:drop-shadow(0 0 8px rgba(70,190,121,.4))}.eco-card .eco-leaf svg{width:100%;height:100%}.eco-card h3{font-family:var(--disp);font-weight:400;font-size:20px;text-transform:uppercase;letter-spacing:.04em;margin-bottom:8px}.eco-card p{color:var(--steel);font-size:14px;line-height:1.7}.eco-cta{text-align:center;margin-top:8vh}.eco-cta p{color:var(--steel);margin-bottom:20px}.eco-cta .btn{display:inline-flex;padding:15px 36px;text-decoration:none;background:linear-gradient(100deg,#2E9E5B,#46BE79);color:#04140B}.eco-cta .btn:hover{filter:brightness(1.12);box-shadow:0 0 26px rgba(70,190,121,.45)}.qty{display:flex;align-items:center;gap:8px}.qty button{width:26px;height:26px;border-radius:7px;border:1px solid var(--line);color:var(--paper);font-size:15px;line-height:1;display:flex;align-items:center;justify-content:center;padding:0}.qty button:hover{border-color:var(--cyan);color:var(--cyan)}.qty span{min-width:20px;text-align:center;font-family:var(--mono);font-size:13px}.qty .qty-x{border:none;color:var(--steel);font-size:13px;margin-left:2px}.qty .qty-x:hover{color:#FF6B76}.shipbox{display:flex;flex-direction:column;gap:4px;padding-top:6px}.shiprow{display:grid;grid-template-columns:1.6fr 1fr;gap:0 10px}.shiperr{color:var(--cyan);font-size:12.5px;margin:8px 0 2px}.rateopt{display:flex;align-items:center;gap:9px;padding:11px 12px;margin-top:8px;border:1px solid var(--line);border-radius:11px;cursor:pointer;transition:border-color .2s}.rateopt.on{border-color:rgba(255,68,82,.6);background:rgba(255,68,82,.06)}.rateopt input{accent-color:#FF4650}.ratename{font-size:13px;font-weight:600;flex:1}.ratemeta{font-family:var(--mono);font-size:10px;color:var(--steel)}.rateamt{font-family:var(--mono);font-size:13px;color:var(--paper)}.store-soon{max-width:640px;margin:30px auto 0;text-align:center;font-family:var(--mono);font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;line-height:2;color:var(--steel);border:1px dashed rgba(255,70,80,.35);border-radius:14px;padding:18px 22px}.imgfield{display:flex;align-items:center;gap:14px}.imgthumb{width:74px;height:74px;object-fit:cover;border-radius:12px;border:1px solid var(--line);background:rgba(6,5,6,.55)}.imgthumb.empty{display:flex;align-items:center;justify-content:center;color:var(--steel);font-size:18px}.imgbtns{display:flex;gap:8px;flex-wrap:wrap}.social-row{display:flex;gap:16px;margin-top:6px}.f-col a.sicon{display:flex;margin-bottom:0}.sicon{position:relative;width:50px;height:50px;display:flex;align-items:center;justify-content:center;background:none;border:none;box-shadow:none;transition:transform .35s cubic-bezier(.2,.7,.2,1)}.sicon .emboss{position:absolute;left:50%;top:50%;width:50px;height:50px;transform:translate(-50%,-50%);transition:transform .35s cubic-bezier(.2,.7,.2,1)}.sicon .lg-sh{transform:translate(2px,2.8px);filter:blur(1.4px);color:rgba(0,0,0,.15)}.sicon .lg-hi{transform:translate(-1px,-1.4px)}.sicon .lg-main{animation:none;filter:drop-shadow(0 2px 2px rgba(0,0,0,.15))}.sicon:hover{transform:translateY(-4px)}.sicon:hover .emboss{transform:translate(-50%,-50%) scale(1.06)}.sicon:hover .lg-main{filter:drop-shadow(0 2px 2px rgba(0,0,0,.15)) drop-shadow(0 0 16px rgba(255,68,82,.6))}@media (prefers-reduced-motion:reduce){.sicon,.sicon .emboss{transition:none}}@media(max-width:520px){.social-row{justify-content:flex-start}}.carousel-wrap{max-width:1240px;margin:30px auto 0;width:100%}.carousel-wrap .gstage{margin-top:calc(-1*clamp(58px,9vw,92px))}.cat-row{display:flex;justify-content:center;gap:clamp(5px,1.4vw,10px);width:min(100% - 24px,640px);margin:0 auto 8px;padding:8px 0}.cat-pill{position:relative;flex:1 1 0;min-width:0;height:clamp(112px,34vw,158px);transform:skewX(-35deg);border-radius:7px;border:1px solid rgba(255,255,255,.14);color:var(--steel);background:linear-gradient(160deg,rgba(255,255,255,.07),rgba(255,255,255,.02) 55%,rgba(193,18,31,.05));backdrop-filter:blur(8px);padding:0;overflow:visible;transition:transform .3s cubic-bezier(.2,.7,.2,1),color .3s,border-color .3s,box-shadow .3s}.cat-pill .cp-label{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;transform:skewX(35deg) rotate(-55deg);font-family:var(--mono);font-size:clamp(8.5px,2.5vw,11px);letter-spacing:.11em;text-transform:uppercase;white-space:nowrap;pointer-events:none}.cat-pill .cp-ring{position:absolute;inset:0;border-radius:7px;padding:1.5px;pointer-events:none;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude;overflow:hidden}.cat-pill .cp-ring::before{content:"";position:absolute;inset:-45%;background:conic-gradient(from 0deg,transparent 0deg,rgba(255,68,82,.85) 25deg,#FFD9DC 35deg,rgba(255,68,82,.85) 45deg,transparent 78deg 360deg);animation:borderSpin 6s linear infinite;animation-delay:var(--rd,0s)}.cat-pill .cp-dust{position:absolute;inset:0;pointer-events:none;overflow:visible}.cat-pill:hover{color:var(--paper);border-color:rgba(255,255,255,.32);transform:skewX(-35deg) translateY(-2px)}.cat-pill.on{color:var(--cyan);border-color:rgba(255,68,82,.55);background:rgba(255,68,82,.09);box-shadow:0 0 20px rgba(193,18,31,.22)}@media (prefers-reduced-motion:reduce){.cat-pill .cp-ring::before{animation:none}}.scrollbox{max-width:720px;margin:0 auto}.scrollbtn{position:relative;display:block;width:100%;height:96px;perspective:900px;background:none;border:none;padding:0;cursor:pointer}.sb-under,.sb-face{position:absolute;inset:0;border-radius:18px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}.sb-under{background:linear-gradient(165deg,#191A1E,#0D0D10);border:1px solid rgba(255,255,255,.10);box-shadow:inset 0 2px 12px rgba(0,0,0,.7)}.sb-under span{font-family:var(--disp);font-size:26px;text-transform:uppercase;letter-spacing:.04em;color:rgba(242,243,245,.30)}.sb-under em,.sb-face em{font-style:normal;font-family:var(--mono);font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--cyan)}.sb-face{background:repeating-linear-gradient(115deg,rgba(255,255,255,.03) 0 1px,transparent 1px 3px),linear-gradient(160deg,#3A3C43 0%,#1F2025 34%,#2C2E35 52%,#141518 100%);border:1px solid rgba(190,195,204,.32);box-shadow:inset 0 1px 0 rgba(255,255,255,.14),inset 0 -1px 0 rgba(0,0,0,.6),0 18px 44px rgba(3,3,4,.5);transform-origin:50% 100%;transition:transform .9s cubic-bezier(.3,.7,.3,1),opacity .7s ease .15s,border-color .3s,box-shadow .3s;overflow:hidden}.sb-face::after{content:"";position:absolute;inset:-40%;pointer-events:none;background:linear-gradient(115deg,transparent 32%,rgba(255,255,255,.13) 45%,rgba(255,170,178,.15) 50%,rgba(255,255,255,.13) 55%,transparent 68%);transform:translateX(-75%)}.scrollbtn:hover .sb-face::after{animation:cardSheen 1.15s cubic-bezier(.3,.6,.3,1) both}.sb-face span{font-family:var(--disp);font-size:26px;text-transform:uppercase;letter-spacing:.04em}.scrollbtn:hover .sb-face{border-color:rgba(255,68,82,.5);box-shadow:inset 0 1px 0 rgba(255,255,255,.18),inset 0 -1px 0 rgba(0,0,0,.6),0 22px 54px rgba(3,3,4,.6),0 0 30px rgba(193,18,31,.2)}.scrollbtn.sopen .sb-face{transform:rotateX(-102deg);opacity:0;pointer-events:none}.scrollwrap{overflow:hidden;max-height:0;transition:max-height 1s cubic-bezier(.4,.6,.4,1) .25s}.scrollwrap.sopen{max-height:2400px;transition:max-height 1.7s cubic-bezier(.2,.7,.2,1)}.scrollwrap.noanim{transition:none}.scrollwrap.noanim .scard{transition:none}.scardwrap{perspective:1000px;padding-top:30px}.scard{position:relative;display:grid;grid-template-columns:52px 1fr;gap:20px;align-items:center;min-height:218px;overflow:hidden;padding:26px 28px 26px 24px;border-radius:18px;background:repeating-linear-gradient(115deg,rgba(255,255,255,.024) 0 1px,transparent 1px 3px),linear-gradient(160deg,#33353B 0%,#1C1D21 34%,#26282D 52%,#121316 100%);border:1px solid rgba(190,195,204,.3);box-shadow:inset 0 1px 0 rgba(255,255,255,.10),inset 0 -1px 0 rgba(0,0,0,.55),0 14px 40px rgba(3,3,4,.5);transform-origin:50% 0;transform:rotateX(-88deg);opacity:0;transition:transform .8s cubic-bezier(.34,.72,.34,1.03),opacity .55s ease}.scard.sopen{transform:none;opacity:1}.scard .num{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--disp);font-size:17px;background:#151518;border:1px solid rgba(255,68,82,.4);color:var(--cyan);box-shadow:0 0 22px rgba(193,18,31,.16)}.scard h3{font-family:var(--disp);font-weight:400;font-size:21px;text-transform:uppercase;letter-spacing:.03em}.scard p{color:var(--steel);font-size:14.5px;max-width:min(56%,460px);margin-top:4px}.scard h3{max-width:min(60%,480px)}.scard .hinge{position:absolute;top:-22px;left:12px;right:12px;height:18px;display:flex;align-items:center}.scard .hinge .rod{flex:1;height:3px;background:linear-gradient(90deg,#3E4147,#9BA1AA 15%,#C9CDD5 50%,#9BA1AA 85%,#3E4147);border-radius:2px;box-shadow:0 1px 3px rgba(0,0,0,.7)}.scard .hinge .pin{width:11px;height:18px;border:2.2px solid #9BA1AA;border-radius:50%;background:#17181C;box-shadow:inset 0 1px 2px rgba(255,255,255,.15),0 2px 4px rgba(0,0,0,.7);flex:none}.sglyph{position:absolute;pointer-events:none}.sglyph .g-rot{position:absolute;inset:0}.sglyph .g-rot>span{position:absolute;inset:0}.sglyph svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round}.g-heat{color:#FF7038;opacity:.2;filter:blur(4px) drop-shadow(0 0 12px rgba(255,100,50,.6));animation:heatPulse 6.5s ease-in-out infinite alternate}.g-heat svg{stroke-width:6px}.g-heat svg .fine{stroke-width:3.4px}@keyframes heatPulse{from{opacity:.12}to{opacity:.32}}.g-lip{color:rgba(228,233,242,.28);transform:translate(1px,1.9px)}.g-lip svg{stroke-width:3px}.g-lip svg .fine{stroke-width:1.6px}.g-edge{color:#FF5A30;opacity:.55;filter:drop-shadow(0 0 6px rgba(255,90,45,.85));animation:glyphPulse 5s ease-in-out infinite alternate}.g-edge svg{stroke-width:4.2px}.g-edge svg .fine{stroke-width:2.3px}@keyframes glyphPulse{from{opacity:.38}to{opacity:.82}}.g-core{color:#0B0203;opacity:.92}.g-core svg{stroke-width:2px}.g-core svg .fine{stroke-width:1px}.dust.ember{background:radial-gradient(circle,#FFE2B0 0%,#FF8A3C 45%,rgba(255,80,40,0) 78%);box-shadow:0 0 7px rgba(255,120,50,.95)}.scard .num,.scard .scard-txt{position:relative;z-index:1}@media(max-width:560px){.sb-face span,.sb-under span{font-size:20px}.scard{grid-template-columns:40px 1fr;gap:14px;padding:22px 16px;min-height:236px}.scard p{max-width:62%}.scard h3{max-width:66%}}@media (prefers-reduced-motion:reduce){.sb-face,.scard,.scrollwrap{transition:none}.sglyph{animation:none}.scrollbtn:hover .sb-face::after{animation:none}}.gstage{position:relative;height:clamp(400px,52vw,500px);perspective:1350px;touch-action:pan-y;user-select:none;-webkit-user-select:none;cursor:grab}.gstage.dragging{cursor:grabbing}.gcard{position:absolute;left:50%;top:50%;width:clamp(230px,60vw,300px);will-change:transform,opacity;border-radius:24px;overflow:hidden;background:linear-gradient(165deg,rgba(255,255,255,.10),rgba(255,255,255,.03) 38%,rgba(193,18,31,.05) 78%,rgba(255,255,255,.05));border:1px solid rgba(255,255,255,.20);backdrop-filter:blur(12px) saturate(1.25);box-shadow:inset 0 1px 0 rgba(255,255,255,.32),inset 0 -1.5px 0 rgba(255,255,255,.10),0 34px 80px rgba(2,2,3,.6);cursor:pointer}.gcard::before{content:"";position:absolute;inset:0;pointer-events:none;z-index:2;background:linear-gradient(105deg,transparent calc(var(--shine,50%) - 18%),rgba(255,255,255,.15) var(--shine,50%),rgba(255,170,178,.10) calc(var(--shine,50%) + 6%),transparent calc(var(--shine,50%) + 20%))}.gcard::after{content:"";position:absolute;left:8%;right:8%;bottom:0;height:1.5px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.45),transparent)}.gcard .gart{aspect-ratio:16/11;display:flex;border-bottom:1px solid rgba(255,255,255,.12);background:radial-gradient(80% 90% at 50% 20%,rgba(44,45,50,.5),rgba(10,10,12,.35))}.gcard .gart svg,.gcard .gart img{width:100%;height:100%;object-fit:cover;pointer-events:none}.gcard .gname{padding:15px 18px 4px;font-family:var(--disp);font-weight:400;font-size:19px;text-transform:uppercase;letter-spacing:.03em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.gcard .gprice{padding:0 18px 15px;font-family:var(--mono);font-size:11px;letter-spacing:.12em;color:var(--cyan)}.gcard.front{border-color:rgba(255,68,82,.38);box-shadow:inset 0 1px 0 rgba(255,255,255,.42),inset 0 -1.5px 0 rgba(255,255,255,.12),0 42px 100px rgba(2,2,3,.7),0 0 46px rgba(193,18,31,.22)}.gnav{position:absolute;top:50%;transform:translateY(-50%);z-index:130;width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--paper);font-size:20px;line-height:1;background:rgba(16,16,19,.55);border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(10px);transition:all .25s}.gnav:hover{color:var(--cyan);border-color:rgba(255,68,82,.5);box-shadow:0 0 18px rgba(193,18,31,.28)}.gnav.prev{left:max(8px,3%)}.gnav.next{right:max(8px,3%)}.gdetail{max-width:560px;margin:6px auto 0;text-align:center;animation:gdIn .5s cubic-bezier(.16,.84,.28,1)}@keyframes gdIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}.gdetail h3{font-family:var(--disp);font-weight:400;font-size:clamp(22px,3vw,30px);text-transform:uppercase;letter-spacing:.03em}.gdetail p{color:var(--steel);font-size:14.5px;margin:6px auto 12px;max-width:460px}.gdetail .gships,.pp-ship{font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--steel);margin-bottom:14px}.gdetail .pbtns{max-width:400px;margin:0 auto}.gdetail.slim{margin:-56px auto 0;position:relative;z-index:140;max-width:400px}.gdetail.slim .gships{margin-bottom:10px}@media(max-width:620px){.gdetail.slim{margin-top:-24px}}@media (prefers-reduced-motion:reduce){.gdetail{animation:none}}.siteform{max-width:1100px;margin:0 auto}.asec{border:1px solid var(--line);border-radius:16px;margin-bottom:12px;background:linear-gradient(165deg,rgba(24,24,28,.6),rgba(10,10,12,.45));overflow:hidden;transition:border-color .25s}.asec[open]{border-color:rgba(255,68,82,.28)}.asec>summary{list-style:none;cursor:pointer;padding:16px 22px;font-family:var(--disp);font-weight:400;font-size:16px;letter-spacing:.05em;text-transform:uppercase;display:flex;justify-content:space-between;align-items:center;user-select:none;transition:color .2s}.asec>summary::-webkit-details-marker{display:none}.asec>summary::after{content:"+";font-family:var(--mono);color:var(--cyan);font-size:16px;transition:transform .25s}.asec[open]>summary::after{transform:rotate(45deg)}.asec>summary:hover{color:var(--cyan)}.asec .asec-body{padding:6px 22px 20px}.savebar{position:sticky;bottom:14px;z-index:6;display:flex;gap:10px;margin-top:16px;padding:12px 14px;border-radius:14px;background:rgba(10,10,12,.88);backdrop-filter:blur(16px);border:1px solid var(--line);box-shadow:0 14px 40px rgba(3,3,4,.5)}.savebar .btn{flex:none;padding:13px 28px}.btn.oos{background:none;border:1px solid rgba(155,161,170,.35);color:var(--steel);cursor:not-allowed;font-weight:400}.btn.oos:hover{filter:none;box-shadow:none}.buildform{max-width:640px;margin:30px auto 0;background:linear-gradient(165deg,rgba(255,255,255,.09),rgba(255,255,255,.03) 40%,rgba(193,18,31,.05) 80%,rgba(255,255,255,.04));border:1px solid rgba(255,255,255,.20);border-radius:26px;backdrop-filter:blur(14px) saturate(1.2);box-shadow:inset 0 1px 0 rgba(255,255,255,.30),inset 0 -1.5px 0 rgba(255,255,255,.08),0 34px 80px rgba(2,2,3,.55);padding:36px 34px 30px}@media(max-width:560px){.buildform{padding:28px 22px 24px}}.buildform h3{font-family:var(--disp);font-weight:400;font-size:clamp(24px,3.4vw,34px);text-transform:uppercase;letter-spacing:.03em}.buildform .bf-sub{color:var(--steel);font-size:14.5px;margin:8px 0 22px;line-height:1.65}.buildform .field input,.buildform .field textarea,.buildform .field select{background:rgba(6,5,6,.45);border:1px solid rgba(255,255,255,.16)}.buildform .field input:focus,.buildform .field textarea:focus,.buildform .field select:focus{border-color:var(--cyan)}.buildform .bf-btn{width:100%;margin-top:6px;padding:15px}.buildform .bf-btn:disabled{opacity:.45;cursor:not-allowed}.buildform .bf-note{margin-top:12px;text-align:center;font-family:var(--mono);font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--steel)}.socialpyr{display:block;min-height:auto;padding:8vh 6vw 6vh}.sp-stage{position:relative;max-width:760px;margin:0 auto;height:430px;perspective:1250px;touch-action:pan-y;user-select:none}.pyr{position:absolute;left:50%;top:54%;width:0;height:0;transform:translate(-50%,-50%)}.pyr-rotor{position:absolute;left:0;top:0;transform-style:preserve-3d;transform:rotateX(-9deg) rotateY(var(--rot,0deg));transition:transform 1s cubic-bezier(.22,.75,.25,1)}.pface{position:absolute;left:-150px;top:-140px;width:300px;height:293px;transform-origin:50% 100%;transform:rotateY(var(--fa)) translateZ(calc(86.6px + var(--pop,0px))) rotateX(17.2deg);transition:transform .5s cubic-bezier(.2,.7,.2,1),filter .3s;backface-visibility:hidden;clip-path:polygon(50% 0,100% 100%,0 100%);overflow:hidden;padding:0;background:repeating-linear-gradient(115deg,rgba(255,255,255,.026) 0 1px,transparent 1px 3px),linear-gradient(155deg,#3A3C43 0%,#1F2025 30%,#2C2E35 48%,#131417 76%,#212228 100%);border:none;color:var(--paper)}.pface::before{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.10) 45%,rgba(255,170,178,.08) 50%,rgba(255,255,255,.10) 55%,transparent 70%);background-size:260% 100%;background-position:120% 0;animation:faceSheen 8s ease-in-out infinite}.pf1::before{animation-delay:2.6s}.pf2::before{animation-delay:5.2s}@keyframes faceSheen{0%{background-position:120% 0}55%{background-position:-40% 0}100%{background-position:-40% 0}}.pface::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.13),transparent 32%,transparent 60%,rgba(4,4,6,.6));pointer-events:none;z-index:2}.pf-logo{position:absolute;left:50%;top:54%;width:104px;height:104px;transform:translate(-50%,-50%);transition:transform .35s cubic-bezier(.2,.7,.2,1);z-index:1}.emboss{position:relative;display:block;width:100%;height:100%}.emboss>span{position:absolute;inset:0}.emboss svg{width:100%;height:100%;display:block}.lg-sh{color:rgba(0,0,0,.72);transform:translate(4px,6px);filter:blur(3px)}.lg-hi{color:rgba(255,255,255,.32);transform:translate(-2px,-2.5px)}.lg-main{filter:drop-shadow(0 1px 1px rgba(0,0,0,.55));animation:embGlow 3.6s ease-in-out infinite alternate}@keyframes embGlow{from{filter:drop-shadow(0 1px 1px rgba(0,0,0,.55)) drop-shadow(0 0 6px rgba(255,70,80,.10))}to{filter:drop-shadow(0 1px 1px rgba(0,0,0,.55)) drop-shadow(0 0 15px rgba(255,70,80,.45))}}.pface.isfront:hover .pf-logo{transform:translate(-50%,-50%) scale(1.07)}.dustlayer{position:absolute;inset:0;z-index:3}.dust{position:absolute;border-radius:50%;background:radial-gradient(circle,#FFFFFF 0%,#FFC9CE 45%,rgba(255,70,80,0) 78%);box-shadow:0 0 6px rgba(255,150,160,.85);animation:dustFloat 1.2s ease-out forwards;pointer-events:none}@keyframes dustFloat{0%{opacity:.95;transform:translate(0,0) scale(1)}55%{opacity:.75}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.15)}}@media (prefers-reduced-motion:reduce){.dust{animation-duration:.4s}}.pface .pf-tag{position:absolute;left:0;right:0;bottom:14px;display:flex;align-items:center;justify-content:center;gap:7px;font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--paper);text-shadow:0 1px 8px rgba(0,0,0,.8);z-index:2}.pface .pf-tag svg{width:14px;height:14px}.pface.isfront{cursor:pointer}.pface:not(.isfront){pointer-events:none}.pface.isfront:hover{filter:brightness(1.22) drop-shadow(0 0 26px rgba(255,68,82,.55))}.pseam{position:absolute;left:-7.5px;top:-140px;width:15px;height:329px;transform-origin:50% 100%;transform:rotateY(var(--sa)) translateZ(calc(173.2px + var(--pop,0px)*1.3)) rotateX(31.7deg);transition:transform .5s cubic-bezier(.2,.7,.2,1);backface-visibility:hidden;background:linear-gradient(180deg,#141519,#0A0A0C 60%,#101116);overflow:hidden}.pseam::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent 3px,rgba(255,68,82,.22) 3px,rgba(255,68,82,.22) 4px,transparent 4px),linear-gradient(90deg,transparent 10px,rgba(255,68,82,.14) 10px,rgba(255,68,82,.14) 11px,transparent 11px)}.pseam::after{content:"";position:absolute;left:3px;top:0;width:1px;height:30px;background:linear-gradient(180deg,transparent,#FFB6BC,#FF4650,transparent);filter:drop-shadow(0 0 4px rgba(255,70,80,.95));animation:chipRun 4.6s linear infinite}.ps1::after{left:10px;animation-duration:5.8s;animation-delay:1.3s}.ps2::after{animation-duration:5.1s;animation-delay:2.4s}@keyframes chipRun{0%{transform:translateY(350px)}100%{transform:translateY(-46px)}}.pyr.turning{--pop:26px}.socialpyr .sec-head{margin-bottom:2.5vh}.sp-current{margin-top:6px;text-align:center;font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--steel);animation:gdIn .45s cubic-bezier(.16,.84,.28,1)}.socialpyr .gnav{z-index:150}@media(max-width:620px){.sp-stage{height:360px}.pyr{transform:translate(-50%,-50%) scale(.74)}}@media (prefers-reduced-motion:reduce){.pseam::after{animation:none}.pface::before{animation:none}.lg-main{animation:none}.sp-current{animation:none}}`;

/* ============================================================
   AMBIENT BACKGROUND — moving gradients, particles, streaks,
   faint grid, occasional flare. Shared by engine + product pages.
   ============================================================ */

const AMB = {
  dots: Array.from({ length: 34 }, () => ({
    x: Math.random(), y: Math.random(), r: 0.5 + Math.random() * 1.5,
    d: 0.3 + Math.random() * 0.7, ph: Math.random() * 6.283, cy: Math.random() < 0.3
  })),
  embers: Array.from({ length: 12 }, () => ({
    x: Math.random(), ph: Math.random(), sp: 0.5 + Math.random() * 0.9,
    r: 0.8 + Math.random() * 1.3, wob: Math.random() * 6.283
  })),
  streaks: [
    { sp: 34, y: 0.3, a: -0.32, ph: 0 }
  ]
};

function drawSacredGeometry(ctx, W, H, time) {
  const cx = W * (0.5 + 0.04 * Math.sin(time * 0.023));
  const cy = H * (0.46 + 0.03 * Math.cos(time * 0.019));
  const R = Math.min(W, H) * 0.22;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(time * 0.01);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(255,68,82,0.055)";
  ctx.beginPath(); ctx.arc(0, 0, R, 0, 6.283); ctx.stroke();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * R, Math.sin(a) * R, R, 0, 6.283);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(255,68,82,0.032)";
  ctx.beginPath(); ctx.arc(0, 0, R * 2.02, 0, 6.283); ctx.stroke();
  ctx.strokeStyle = "rgba(193,18,31,0.02)";
  ctx.beginPath(); ctx.arc(0, 0, R * 2.9, 0, 6.283); ctx.stroke();
  ctx.restore();
}

function drawAmbient(ctx, W, H, time, scroll, alpha) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  const g1x = W * (0.3 + 0.15 * Math.sin(time * 0.05));
  const g1y = H * (0.25 + 0.1 * Math.cos(time * 0.04));
  const g1 = ctx.createRadialGradient(g1x, g1y, 0, g1x, g1y, Math.max(W, H) * 0.7);
  g1.addColorStop(0, "rgba(52,14,18,0.36)"); g1.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
  const g2x = W * (0.75 + 0.12 * Math.cos(time * 0.037));
  const g2y = H * (0.75 + 0.1 * Math.sin(time * 0.05));
  const g2 = ctx.createRadialGradient(g2x, g2y, 0, g2x, g2y, Math.max(W, H) * 0.6);
  g2.addColorStop(0, "rgba(36,11,14,0.32)"); g2.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(160,164,172,0.028)";
  ctx.lineWidth = 1;
  const G = 120;
  const ox = (time * 1.5) % G, oy = ((-scroll * 0.06 + time * 0.8) % G + G) % G;
  ctx.beginPath();
  for (let x = ox - G; x < W + G; x += G) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
  for (let y = oy - G; y < H + G; y += G) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
  ctx.stroke();
  drawSacredGeometry(ctx, W, H, time);
  ctx.globalCompositeOperation = "lighter";
  for (const d of AMB.dots) {
    const x = ((d.x + time * 0.004 * d.d) % 1) * W;
    const y = (((d.y - scroll * 0.00012 * d.d) % 1 + 1) % 1) * H + Math.sin(time * d.d + d.ph) * 6;
    const a = 0.16 + 0.14 * Math.sin(time * 1.1 + d.ph);
    ctx.fillStyle = d.cy ? `rgba(255,68,82,${a})` : `rgba(206,209,215,${a * 0.75})`;
    ctx.beginPath(); ctx.arc(x, y, d.r, 0, 6.283); ctx.fill();
  }
  // slow-rising red embers — small warm particles drifting up through the sections
  for (const em of AMB.embers) {
    const prog = (time * 0.014 * em.sp + em.ph) % 1;
    const x = (em.x + Math.sin(time * 0.4 + em.wob) * 0.015) * W;
    const y = (1 - prog) * (H + 40) - 20;
    const a = Math.sin(prog * Math.PI) * 0.30;
    ctx.fillStyle = `rgba(255,96,108,${a.toFixed(3)})`;
    ctx.beginPath(); ctx.arc(x, y, em.r, 0, 6.283); ctx.fill();
  }
  for (const s of AMB.streaks) {
    const prog = ((time + s.ph) % s.sp) / s.sp;
    const x = prog * (W + 500) - 250;
    const y = s.y * H;
    ctx.save();
    ctx.translate(x, y); ctx.rotate(s.a);
    const lg = ctx.createLinearGradient(-170, 0, 170, 0);
    lg.addColorStop(0, "rgba(255,68,82,0)");
    lg.addColorStop(0.5, "rgba(255,146,156,0.06)");
    lg.addColorStop(1, "rgba(255,68,82,0)");
    ctx.fillStyle = lg;
    ctx.fillRect(-170, -1.4, 340, 2.8);
    ctx.restore();
  }
  const fl = Math.pow(Math.max(0, Math.sin(time * 0.2205)), 8) * 0.7;
  if (fl > 0.02) {
    const fx = W * 0.5, fy = H * 0.34;
    const fg = ctx.createLinearGradient(fx - W * 0.3, fy, fx + W * 0.3, fy);
    fg.addColorStop(0, "rgba(255,68,82,0)");
    fg.addColorStop(0.5, `rgba(255,164,172,${0.12 * fl})`);
    fg.addColorStop(1, "rgba(255,68,82,0)");
    ctx.fillStyle = fg;
    ctx.fillRect(fx - W * 0.3, fy - 1.6, W * 0.6, 3.2);
    const fc = ctx.createRadialGradient(fx, fy, 0, fx, fy, 90);
    fc.addColorStop(0, `rgba(255,178,184,${0.10 * fl})`);
    fc.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = fc;
    ctx.beginPath(); ctx.arc(fx, fy, 90, 0, 6.283); ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

/* ============================================================
   ORB ENGINE — cinematic hero (fades into ambient background)
   ============================================================ */

function startOrbEngine(canvas, refs, cinemaEl) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d");
  const { logoEl, heroEl, heroTitleEl } = refs;

  const V=(x=0,y=0,z=0)=>({x,y,z});
  const add=(a,b)=>V(a.x+b.x,a.y+b.y,a.z+b.z);
  const sub=(a,b)=>V(a.x-b.x,a.y-b.y,a.z-b.z);
  const mul=(a,s)=>V(a.x*s,a.y*s,a.z*s);
  const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
  const cross=(a,b)=>V(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x);
  const len=a=>Math.sqrt(dot(a,a));
  const norm=a=>{const l=len(a)||1;return V(a.x/l,a.y/l,a.z/l)};
  function rotAA(v,k,t){
    const c=Math.cos(t),s=Math.sin(t);
    const kxv=cross(k,v),kdv=dot(k,v);
    return V(v.x*c+kxv.x*s+k.x*kdv*(1-c), v.y*c+kxv.y*s+k.y*kdv*(1-c), v.z*c+kxv.z*s+k.z*kdv*(1-c));
  }
  const rotY=(v,t)=>{const c=Math.cos(t),s=Math.sin(t);return V(v.x*c+v.z*s,v.y,-v.x*s+v.z*c)};
  const rotX=(v,t)=>{const c=Math.cos(t),s=Math.sin(t);return V(v.x,v.y*c-v.z*s,v.y*s+v.z*c)};
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const seg=(v,a,b)=>clamp((v-a)/(b-a),0,1);
  const smooth=t=>t*t*(3-2*t);
  const lerp=(a,b,t)=>a+(b-a)*t;
  const hex2rgb=h=>[(h>>16)&255,(h>>8)&255,h&255];
  const mixRGB=(a,b,t)=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];
  const css=c=>`rgb(${c[0]|0},${c[1]|0},${c[2]|0})`;

  const STEEL_LIT=hex2rgb(0xDCDFE4), STEEL_BASE=hex2rgb(0x82878F), STEEL_DEEP=hex2rgb(0x27292E),
        STEEL_SHADE=hex2rgb(0x0F1012), CYAN=hex2rgb(0xFF4650), BLUE=hex2rgb(0xC1121F),
        EDGE_LINE=hex2rgb(0x1B1C20);
  const BG_STOPS=[
    [0.00,hex2rgb(0x060506)],[0.20,hex2rgb(0x150708)],[0.42,hex2rgb(0x2E0C12)],
    [0.62,hex2rgb(0x220A0E)],[0.82,hex2rgb(0x160B0D)],[1.00,hex2rgb(0x060506)]
  ];
  function sampleBg(p){
    for(let i=0;i<BG_STOPS.length-1;i++){
      const a=BG_STOPS[i],b=BG_STOPS[i+1];
      if(p>=a[0]&&p<=b[0]) return mixRGB(a[1],b[1],(p-a[0])/(b[0]-a[0]));
    }
    return BG_STOPS[BG_STOPS.length-1][1];
  }

  // Shard texture: the pyramid's brushed-steel finish (fine grain + baked
  // light sheen) with glowing microchip traces routed across EVERY face.
  // 256px for crispness on large shards.
  function makeTexture(variant, inlay){
    const S=256, c=document.createElement("canvas"); c.width=c.height=S;
    const g=c.getContext("2d");
    // brushed dark steel, matching the pyramid faces
    const grad=g.createLinearGradient(0,0,S*0.8,S);
    grad.addColorStop(0,"#2B2D33");grad.addColorStop(0.34,"#16171B");
    grad.addColorStop(0.52,"#212329");grad.addColorStop(0.78,"#0E0F12");grad.addColorStop(1,"#1A1B20");
    g.fillStyle=grad;g.fillRect(0,0,S,S);
    // regular brushed grain — the pyramid faces' 115° 1px/3px stripe pattern
    g.strokeStyle="rgba(255,255,255,0.028)";g.lineWidth=1;
    for(let x=-S*0.6;x<S*1.2;x+=3){
      g.beginPath();g.moveTo(x,0);g.lineTo(x+S*0.47,S);g.stroke();
    }
    // a little organic scuffing on top of the regular grain
    for(let i=0;i<70;i++){
      g.strokeStyle=`rgba(8,9,12,${(0.03+Math.random()*0.04).toFixed(3)})`;
      g.lineWidth=0.6+Math.random()*0.7;
      const x=Math.random()*S*1.4-S*0.2, y=Math.random()*S, len=8+Math.random()*22;
      g.beginPath();g.moveTo(x,y);g.lineTo(x+len*0.42,y+len);g.stroke();
    }
    // baked light sheen band (angle/offset varies per variant)
    const so=(variant*0.17+(inlay?0.32:0))%1;
    const sh=g.createLinearGradient(S*(so-0.5),0,S*(so+0.7),S);
    sh.addColorStop(0,"rgba(255,255,255,0)");sh.addColorStop(0.45,"rgba(255,255,255,0.10)");
    sh.addColorStop(0.52,"rgba(255,170,178,0.07)");sh.addColorStop(0.6,"rgba(255,255,255,0.09)");sh.addColorStop(1,"rgba(255,255,255,0)");
    g.fillStyle=sh;g.fillRect(0,0,S,S);
    // glassy top-light, exactly like the pyramid faces' overhead lighting
    const tl=g.createLinearGradient(0,0,0,S);
    tl.addColorStop(0,"rgba(255,255,255,0.13)");tl.addColorStop(0.32,"rgba(255,255,255,0)");
    tl.addColorStop(0.6,"rgba(0,0,0,0)");tl.addColorStop(1,"rgba(4,4,6,0.55)");
    g.fillStyle=tl;g.fillRect(0,0,S,S);
    // microchip traces: orthogonal glowing runs with pads and vias
    const trace=(hot)=>{
      const pts=[];
      let x=Math.random()<0.5?(Math.random()<0.5?8:S-8):Math.random()*S;
      let y=(x===8||x===S-8)?Math.random()*S:(Math.random()<0.5?8:S-8);
      let horiz=Math.random()<0.5;
      pts.push([x,y]);
      const bends=2+(Math.random()*3|0);
      for(let b=0;b<bends;b++){
        const len=(30+Math.random()*80)*(Math.random()<0.5?-1:1);
        if(horiz)x=Math.max(10,Math.min(S-10,x+len));else y=Math.max(10,Math.min(S-10,y+len));
        pts.push([x,y]);horiz=!horiz;
      }
      const stroke=(w,col,blur)=>{
        g.save();if(blur){g.shadowColor="rgba(255,68,82,0.95)";g.shadowBlur=blur;}
        g.strokeStyle=col;g.lineWidth=w;g.lineCap="square";g.lineJoin="miter";
        g.beginPath();g.moveTo(pts[0][0],pts[0][1]);
        for(let i=1;i<pts.length;i++)g.lineTo(pts[i][0],pts[i][1]);
        g.stroke();g.restore();
      };
      if(hot){
        stroke(4.5,"rgba(255,68,82,0.55)",12);
        stroke(2.4,"rgba(255,68,82,0.95)",6);
        stroke(1,"rgba(255,214,220,0.95)",0);
      } else {
        stroke(2.6,"rgba(160,164,172,0.16)",0);
        stroke(1,"rgba(200,205,214,0.14)",0);
      }
      // pads at ends, vias at bends
      for(let i=0;i<pts.length;i++){
        const [px,py]=pts[i];
        if(i===0||i===pts.length-1){
          g.save();if(hot){g.shadowColor="rgba(255,68,82,0.95)";g.shadowBlur=8;}
          g.fillStyle=hot?"rgba(255,90,100,0.95)":"rgba(190,195,204,0.25)";
          g.fillRect(px-4,py-4,8,8);
          g.fillStyle=hot?"rgba(255,224,228,0.95)":"rgba(220,224,232,0.3)";
          g.fillRect(px-1.5,py-1.5,3,3);g.restore();
        } else {
          g.fillStyle=hot?"rgba(255,150,158,0.9)":"rgba(200,205,214,0.2)";
          g.beginPath();g.arc(px,py,2.2,0,6.283);g.fill();
        }
      }
    };
    const hotN=inlay?4:2+(variant%2);
    for(let t=0;t<hotN;t++)trace(true);
    for(let t=0;t<2;t++)trace(false);
    // ---- mirror inset: a polished dark pane set ~10px inside the face ----
    const mPath=()=>{g.beginPath();g.moveTo(128,46);g.lineTo(217,215);g.lineTo(39,215);g.closePath();};
    g.save();mPath();g.clip();
    const mg=g.createLinearGradient(56,46,222,215);
    mg.addColorStop(0,"#181B23");mg.addColorStop(0.44,"#232833");
    mg.addColorStop(0.56,inlay?"#3A2530":"#2B3140");mg.addColorStop(1,"#111420");
    g.fillStyle=mg;g.fillRect(0,0,S,S);
    // faint reflection streaks in the glass
    for(let i=0;i<6;i++){
      g.strokeStyle=`rgba(214,222,235,${(0.03+Math.random()*0.05).toFixed(3)})`;
      g.lineWidth=1+Math.random()*4;
      const x=30+Math.random()*200;
      g.beginPath();g.moveTo(x,30);g.lineTo(x-64,230);g.stroke();
    }
    g.restore();
    // bevel: dark outer cut + light inner lip
    mPath();g.strokeStyle="rgba(6,7,10,0.85)";g.lineWidth=3;g.stroke();
    g.save();g.translate(-1,-1);mPath();g.strokeStyle="rgba(216,222,232,0.30)";g.lineWidth=1.1;g.stroke();g.restore();
    // small red triangle at the heart of the mirror (echoes the logo mark)
    const tri=()=>{g.beginPath();g.moveTo(128,116);g.lineTo(159,178);g.lineTo(97,178);g.closePath();};
    g.save();g.shadowColor="rgba(255,68,82,0.95)";g.shadowBlur=16;
    tri();g.fillStyle="rgba(255,68,82,0.16)";g.fill();
    tri();g.strokeStyle="rgba(255,68,82,0.9)";g.lineWidth=3;g.stroke();g.restore();
    tri();g.strokeStyle="rgba(255,216,222,0.9)";g.lineWidth=1.1;g.stroke();
    // rivets at the face corners
    for(const [rx,ry] of [[128,36],[224,220],[32,220]]){
      g.fillStyle="rgba(12,13,17,0.9)";g.beginPath();g.arc(rx,ry,5,0,6.283);g.fill();
      g.fillStyle="rgba(212,214,220,0.5)";g.beginPath();g.arc(rx-1.6,ry-1.6,1.8,0,6.283);g.fill();
    }
    return c;
  }
  const TEXTURES=[0,1,2,3,4].map(v=>makeTexture(v,false));
  const TEX_INLAY=[0,3].map(v=>makeTexture(v,true));
  const UV=[[128,28],[232,224],[24,224]];
  // scrolling code strip for the mirror surfaces (red, glowing)
  const CODE_TEX=(()=>{
    const c=document.createElement("canvas");c.width=256;c.height=512;
    const g=c.getContext("2d");
    // real code, large enough to read, tight line spacing
    const LINES=[
      "const orb = new Engine({",
      "  faces: 60, mode:'ink'",
      "});",
      "function ignite(t) {",
      "  const p = phase(t);",
      "  return p * 0.618;",
      "}",
      "if (core.online) {",
      "  mesh.rotate(dt);",
      "  emit('pulse', p);",
      "}",
      "for(let i=0;i<n;i++){",
      "  shards[i].update(t);",
      "}",
      "await forge.load();",
      "export default Ink;",
      "let heat = 0xFF4650;",
      "sys.boot('athletic');",
      "return mirror.sync();",
      "class Shard extends T",
      "render(ctx, uv) {",
      "  this.glow += dt;",
      "node.link(a, b, 42);",
      "// engineered north",
      "watch(()=> reforge())",
      "db.push({id, price});",
      "camera.orbit(0.22);",
      "light.cast('north');",
    ];
    g.font="12px 'JetBrains Mono',monospace";g.textBaseline="top";
    let y=3, li=(Math.random()*LINES.length)|0;
    while(y<500){
      const ln=LINES[li%LINES.length]; li+=1+((Math.random()*3)|0);
      const bright=Math.random()<0.18;
      if(bright){g.save();g.shadowColor="rgba(255,68,82,0.9)";g.shadowBlur=6;
        g.fillStyle="rgba(255,178,186,0.95)";g.fillText(ln,6,y);g.restore();}
      else{g.fillStyle=`rgba(255,88,100,${(0.5+Math.random()*0.3).toFixed(2)})`;
        g.fillText(ln,6,y);}
      if(Math.random()<0.12){
        g.fillStyle="rgba(255,220,224,0.9)";
        g.fillRect(6+g.measureText(ln).width+3,y+1,7,11);
      }
      y+=15;
    }
    return c;
  })();
  // travelling light band for the mirror sheen (same feel as the pyramid icons)
  const SHEEN_TEX=(()=>{
    const c=document.createElement("canvas");c.width=440;c.height=256;
    const g=c.getContext("2d");
    g.translate(220,128);g.rotate(-0.35);
    const sg=g.createLinearGradient(-90,0,90,0);
    sg.addColorStop(0,"rgba(255,255,255,0)");sg.addColorStop(0.42,"rgba(255,255,255,0.16)");
    sg.addColorStop(0.5,"rgba(255,170,178,0.13)");sg.addColorStop(0.58,"rgba(255,255,255,0.16)");
    sg.addColorStop(1,"rgba(255,255,255,0)");
    g.fillStyle=sg;g.fillRect(-160,-260,320,520);
    return c;
  })();

  const ORB_R=2.05;
  const shards=[];
  {
    const t=(1+Math.sqrt(5))/2;
    const vs=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]]
      .map(a=>norm(V(a[0],a[1],a[2])));
    const fs=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
              [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
    // Triakis stellation: each base face splits into 3 facets meeting at a
    // slightly raised apex — a faceted sacred-geometry solid (60 plates).
    const baseFaces=fs.map(f=>[vs[f[0]],vs[f[1]],vs[f[2]]]);
    const faces=[];
    for(const bf of baseFaces){
      const cen=norm(mul(add(add(bf[0],bf[1]),bf[2]),1/3));
      const apex=mul(cen,1.10);
      faces.push([bf[0],bf[1],apex],[bf[1],bf[2],apex],[bf[2],bf[0],apex]);
    }
    for(const f of faces){
      const a=mul(f[0],ORB_R),b=mul(f[1],ORB_R),c=mul(f[2],ORB_R);
      const centroid=mul(add(add(a,b),c),1/3);
      const n=norm(centroid);
      const th=0.13+Math.random()*0.09;
      const la=sub(a,centroid),lb=sub(b,centroid),lc=sub(c,centroid);
      const off=mul(n,-th);
      const verts=[la,lb,lc,add(la,off),add(lb,off),add(lc,off)];
      const polys=[[0,1,2],[5,4,3],[0,2,5,3],[2,1,4,5],[1,0,3,4]];
      const r=Math.random();
      const kind=r<0.72?0:(r<0.9?1:2);
      shards.push({
        verts,polys,base:centroid,
        dir:norm(add(n,V((Math.random()-.5)*.9,(Math.random()-.5)*.9,(Math.random()-.5)*.9))),
        dist:2.7+Math.random()*3.6,
        delay:(Math.acos(Math.max(-1,Math.min(1,n.y)))/Math.PI)*0.16+Math.random()*0.06,
        rotAxis:norm(V(Math.random()-.5,Math.random()-.5,Math.random()-.5)),
        rotAmt:(Math.random()-.5)*5.6,
        ledPh:Math.random()*6.283,
        kind,
        tex: kind===2 ? TEX_INLAY[(Math.random()*TEX_INLAY.length)|0]
                      : TEXTURES[(Math.random()*TEXTURES.length)|0]
      });
    }
  }

  const rings=[];
  {
    const mk=(R,w,tilt,spd,glow,stepped)=>{
      const pts=[];
      if(stepped){
        const steps=16;
        for(let i=0;i<steps;i++){
          const a0=i/steps*Math.PI*2,a1=(i+0.5)/steps*Math.PI*2,a2=(i+1)/steps*Math.PI*2;
          const r1=R*0.94,r2=R*1.07;
          const rA=i%2?r1:r2,rB=i%2?r2:r1;
          pts.push(V(Math.cos(a0)*rA,0,Math.sin(a0)*rA));
          pts.push(V(Math.cos(a1)*rA,0,Math.sin(a1)*rA));
          pts.push(V(Math.cos(a1)*rB,0,Math.sin(a1)*rB));
          pts.push(V(Math.cos(a2)*rB,0,Math.sin(a2)*rB));
        }
      } else {
        for(let i=0;i<38;i++){
          const a=i/38*Math.PI*2;
          pts.push(V(Math.cos(a)*R,0,Math.sin(a)*R));
        }
      }
      rings.push({pts,w,tilt,spd,glow,phase:Math.random()*6});
    };
    mk(2.9,2.6,[1.25,0.15],0.14,false,false);
    mk(3.45,1.8,[0.35,1.05],-0.19,true,true);
    mk(4.0,3.2,[0.75,0.45],0.10,false,false);
  }

  const farParts=[];
  for(let i=0;i<70;i++){
    const rr=6+Math.random()*13,th=Math.random()*6.283,ph=Math.acos(2*Math.random()-1);
    farParts.push({p:V(rr*Math.sin(ph)*Math.cos(th),rr*Math.sin(ph)*Math.sin(th)*0.7,rr*Math.cos(ph)),s:0.5+Math.random()});
  }
  const motes=[];
  for(let i=0;i<14;i++){
    motes.push({x:Math.random(),y:Math.random(),r:1+Math.random()*2.6,sp:0.2+Math.random()*0.8,ph:Math.random()*6.283,cy:Math.random()<0.4});
  }
  const mechSparks=[];
  for(let i=0;i<18;i++){
    const a=Math.random()*6.283;
    const targetR=30+Math.random()*150;
    mechSparks.push({
      a, targetR,
      tx:Math.cos(a)*targetR*(0.3+Math.random()*0.8),
      ty:Math.sin(a)*targetR*(0.3+Math.random()*0.8),
      startR:420+Math.random()*260,
      delay:Math.random()*0.55,
      size:0.8+Math.random()*1.8,
      cy:Math.random()<0.55
    });
  }
  const fogBlobs=[];
  for(let i=0;i<4;i++){
    fogBlobs.push({x:Math.random(),y:0.3+Math.random()*0.4,r:0.35+Math.random()*0.4,sp:0.01+Math.random()*0.02,ph:Math.random()*6.283,front:i>1});
  }
  const grain=document.createElement("canvas");grain.width=grain.height=96;
  {
    const g=grain.getContext("2d");
    const id=g.createImageData(160,160);
    for(let i=0;i<id.data.length;i+=4){
      const v=(Math.random()*255)|0;
      id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=22;
    }
    g.putImageData(id,0,0);
  }
  let grainPattern=null;

  let L_KEY=norm(V(0.55,0.7,0.6)),L_CYN=norm(V(-0.7,0.15,-0.4)),L_BLU=norm(V(0.5,-0.6,-0.3));

  let W=0,H=0,DPR=1,CX=0,CY=0,FL=800;
  let target=0,p=0,mouseX=0,mouseY=0,mx=0,my=0,camD=8.4;

  function resize(){
    const wNew=innerWidth,hNew=innerHeight;
    // mobile URL-bar jitter: same width + small height shrink -> keep canvas
    if(W===wNew&&H>0&&hNew<=H&&H-hNew<160)return;
    DPR=Math.min(devicePixelRatio||1, wNew<820?1.5:2);
    const hUse=(wNew===W&&H>0)?Math.max(hNew,H):hNew;
    W=wNew;H=hUse;
    canvas.width=W*DPR;canvas.height=H*DPR;
    ctx.setTransform(DPR,0,0,DPR,0,0);
    CX=W/2;CY=H/2;
    FL=Math.min(W,H)*1.32;
    grainPattern=ctx.createPattern(grain,"repeat");
  }
  function cinemaSpan(){
    return Math.max(1,(cinemaEl?cinemaEl.offsetHeight:innerHeight*4)-innerHeight);
  }
  function onScroll(){target=clamp(scrollY/cinemaSpan(),0,1);}
  function onMove(e){
    mouseX=(e.clientX/innerWidth-0.5)*2;
    mouseY=(e.clientY/innerHeight-0.5)*2;
  }
  addEventListener("resize",resize);
  addEventListener("scroll",onScroll,{passive:true});
  addEventListener("pointermove",onMove,{passive:true});
  resize();onScroll();

  function project(v){
    const depth=camD-v.z;
    if(depth<0.25)return null;
    const s=FL/depth;
    return {x:CX+v.x*s,y:CY-v.y*s,s,depth};
  }

  function gearPath(g,R,teeth,toothH,hubR){
    g.beginPath();
    const n=teeth*2;
    for(let i=0;i<=n;i++){
      const a=i/n*Math.PI*2;
      const r=(i%2===0)?R:R-toothH;
      const x=Math.cos(a)*r,y=Math.sin(a)*r;
      i===0?g.moveTo(x,y):g.lineTo(x,y);
    }
    g.moveTo(hubR,0);
    g.arc(0,0,hubR,0,Math.PI*2,true);
  }
  // spline-smooth gear silhouette: every tooth tip and valley rounded with
  // quadratic curves through edge midpoints — reads as a sculpted 3D object
  function gearPathSmooth(g,R,teeth,toothH,hubR){
    const n=teeth*2,pts=[];
    for(let i=0;i<n;i++){
      const a=i/n*Math.PI*2;
      const r=(i%2===0)?R:R-toothH;
      pts.push([Math.cos(a)*r,Math.sin(a)*r]);
    }
    g.beginPath();
    const mid=(p,q)=>[(p[0]+q[0])/2,(p[1]+q[1])/2];
    const m0=mid(pts[n-1],pts[0]);
    g.moveTo(m0[0],m0[1]);
    for(let i=0;i<n;i++){
      const p=pts[i],m=mid(p,pts[(i+1)%n]);
      g.quadraticCurveTo(p[0],p[1],m[0],m[1]);
    }
    g.closePath();
    g.moveTo(hubR,0);
    g.arc(0,0,hubR,0,Math.PI*2,true);
  }
  function drawMechSparks(assembleT,fadeOutT,scale){
    // assembleT: 0 -> 1 as sparks fly inward and gather. fadeOutT: 0 -> 1 once the
    // mechanism itself has solidified, dissolving the sparks back to nothing.
    if(assembleT<=0.002)return;
    ctx.save();
    ctx.translate(CX,CY);
    ctx.scale(scale,scale);
    ctx.globalCompositeOperation="lighter";
    for(const s of mechSparks){
      const local=smooth(clamp((assembleT-s.delay)/(1-s.delay*0.7),0,1));
      if(local<=0.001)continue;
      const ease=smooth(local);
      const rx=lerp(Math.cos(s.a)*s.startR,s.tx,ease);
      const ry=lerp(Math.sin(s.a)*s.startR,s.ty,ease);
      const trailBack=ease-0.10;
      const rx2=lerp(Math.cos(s.a)*s.startR,s.tx,clamp(trailBack,0,1));
      const ry2=lerp(Math.sin(s.a)*s.startR,s.ty,clamp(trailBack,0,1));
      const a=(0.15+0.55*local)*(1-fadeOutT);
      if(a<=0.003)continue;
      const col=s.cy?`rgba(255,158,166,${a})`:`rgba(220,235,250,${a*0.8})`;
      ctx.strokeStyle=col;
      ctx.lineWidth=s.size*0.5;
      ctx.beginPath();ctx.moveTo(rx2,ry2);ctx.lineTo(rx,ry);ctx.stroke();
      ctx.fillStyle=col;
      ctx.beginPath();ctx.arc(rx,ry,s.size*0.7,0,6.283);ctx.fill();
    }
    ctx.restore();
  }
  function drawMechanism(time,alpha,scale){
    if(alpha<=0.005)return;
    ctx.save();
    ctx.translate(CX,CY);
    ctx.scale(scale,scale);
    ctx.globalAlpha=alpha;
    const bronzeD="rgb(122,125,132)",bronzeDD="rgb(46,47,51)";
    ctx.save();
    ctx.shadowColor="rgba(255,68,82,0.55)";ctx.shadowBlur=16*alpha;
    const plate=ctx.createRadialGradient(0,-14,10,0,0,150);
    plate.addColorStop(0,"#2A2B2F");plate.addColorStop(0.7,"#19191C");plate.addColorStop(1,"#0D0D0F");
    ctx.fillStyle=plate;
    ctx.beginPath();ctx.arc(0,0,148,0,6.283);ctx.fill();
    ctx.restore();
    ctx.lineWidth=2.4;ctx.strokeStyle="rgba(226,54,66,0.9)";
    ctx.beginPath();ctx.arc(0,0,148,0,6.283);ctx.stroke();
    for(let i=0;i<72;i++){
      const a=i/72*Math.PI*2;
      const big=i%6===0;
      ctx.strokeStyle=big?"rgba(236,238,241,0.85)":"rgba(160,164,172,0.55)";
      ctx.lineWidth=big?2.2:1;
      const r0=big?128:136,r1=146;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a)*r0,Math.sin(a)*r0);
      ctx.lineTo(Math.cos(a)*r1,Math.sin(a)*r1);
      ctx.stroke();
    }
    ctx.save();
    ctx.rotate(time*0.03);
    ctx.strokeStyle="rgba(255,68,82,0.75)";
    ctx.lineWidth=2.6;ctx.lineJoin="miter";
    ctx.beginPath();
    const NB=22;
    for(let i=0;i<NB;i++){
      const a0=i/NB*Math.PI*2,a1=(i+0.5)/NB*Math.PI*2,a2=(i+1)/NB*Math.PI*2;
      const r1=104,r2=118;
      const rA=i%2?r1:r2,rB=i%2?r2:r1;
      const P0=[Math.cos(a0)*rA,Math.sin(a0)*rA],P1=[Math.cos(a1)*rA,Math.sin(a1)*rA],
            P2=[Math.cos(a1)*rB,Math.sin(a1)*rB],P3=[Math.cos(a2)*rB,Math.sin(a2)*rB];
      i===0?ctx.moveTo(P0[0],P0[1]):ctx.lineTo(P0[0],P0[1]);
      ctx.lineTo(P1[0],P1[1]);ctx.lineTo(P2[0],P2[1]);ctx.lineTo(P3[0],P3[1]);
    }
    ctx.closePath();ctx.stroke();
    ctx.restore();
    // ---- Leonardo clockwork: one fixed upper-left light source; every part
    // casts a shadow, has machined thickness, and moves with purpose ----
    function drawGear(gr,rot){
      ctx.save();
      ctx.translate(gr.x,gr.y);
      // cast shadow onto the plate (light from upper-left)
      ctx.save();
      ctx.rotate(rot);
      ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=13;
      ctx.shadowOffsetX=5;ctx.shadowOffsetY=7;
      ctx.fillStyle="rgba(8,8,10,0.85)";
      gearPathSmooth(ctx,gr.R,gr.teeth,gr.tooth,gr.hub);
      ctx.fill("evenodd");
      ctx.restore();
      // extruded side wall — the wheel has thickness
      ctx.save();
      ctx.translate(2.4,3.2);ctx.rotate(rot);
      const side=ctx.createLinearGradient(-gr.R,-gr.R,gr.R,gr.R);
      side.addColorStop(0,`rgba(96,100,110,${0.95*gr.w})`);
      side.addColorStop(1,`rgba(26,27,32,${0.95*gr.w})`);
      ctx.fillStyle=side;
      gearPathSmooth(ctx,gr.R,gr.teeth,gr.tooth,gr.hub);
      ctx.fill("evenodd");
      ctx.restore();
      // top face: each gear is its own metal (platinum, silver, nickel...)
      ctx.save();
      ctx.rotate(rot);
      const T=gr.tone||[255,255,255];
      const cs=(f,a)=>`rgba(${Math.round(T[0]*f)},${Math.round(T[1]*f)},${Math.round(T[2]*f)},${a})`;
      const met=ctx.createRadialGradient(-gr.R*0.38,-gr.R*0.38,gr.R*0.05,0,0,gr.R*1.02);
      met.addColorStop(0,cs(1,0.98*gr.w));
      met.addColorStop(0.22,cs(0.90,0.96*gr.w));
      met.addColorStop(0.48,cs(0.66,0.92*gr.w));
      met.addColorStop(0.74,cs(0.44,0.92*gr.w));
      met.addColorStop(1,cs(0.23,0.92*gr.w));
      ctx.fillStyle=met;
      gearPathSmooth(ctx,gr.R,gr.teeth,gr.tooth,gr.hub);
      ctx.fill("evenodd");
      // spun-metal finish: fine radial machining streaks, unique per gear,
      // rotating with the wheel like a real lathe-turned face
      const seed=gr.x*3.7+gr.y*1.3;
      ctx.save();
      gearPathSmooth(ctx,gr.R,gr.teeth,gr.tooth,gr.hub);
      ctx.clip("evenodd");
      const NS=gr.R>=28?64:26;
      for(let i=0;i<NS;i++){
        const a=(i/NS)*6.283+Math.sin(i*7.3+seed)*0.05;
        const al=0.02+0.05*Math.abs(Math.sin(i*2.7+seed));
        ctx.strokeStyle=i%2?`rgba(255,255,255,${al.toFixed(3)})`:`rgba(10,11,14,${(al*1.25).toFixed(3)})`;
        ctx.lineWidth=0.8;
        ctx.beginPath();ctx.moveTo(Math.cos(a)*(gr.hub+1),Math.sin(a)*(gr.hub+1));
        ctx.lineTo(Math.cos(a)*(gr.R-1),Math.sin(a)*(gr.R-1));ctx.stroke();
      }
      ctx.restore();
      // tooth bevels: lit flank / shaded flank
      ctx.save();ctx.translate(-0.8,-0.8);
      gearPathSmooth(ctx,gr.R,gr.teeth,gr.tooth,gr.hub);
      ctx.strokeStyle=`rgba(255,255,255,${0.35*gr.w})`;ctx.lineWidth=1;ctx.stroke();ctx.restore();
      ctx.save();ctx.translate(0.8,0.8);
      gearPathSmooth(ctx,gr.R,gr.teeth,gr.tooth,gr.hub);
      ctx.strokeStyle="rgba(10,11,14,0.55)";ctx.lineWidth=1;ctx.stroke();ctx.restore();
      const r1=gr.R-gr.tooth-4,r0=gr.hub+7;
      if(gr.R>=28&&r1-r0>10){
        // carved spoke windows — four annular cutouts with beveled edges
        for(let k=0;k<4;k++){
          const a0=k*1.5708+0.28,a1=(k+1)*1.5708-0.28;
          const win=()=>{ctx.beginPath();ctx.arc(0,0,r1-3,a0,a1);
            ctx.arc(0,0,r0+3,a1,a0,true);ctx.closePath();};
          win();ctx.fillStyle="rgba(13,13,16,0.92)";ctx.fill();
          // ambient occlusion inside the cutout
          ctx.save();win();ctx.clip();
          ctx.shadowColor="rgba(0,0,0,0.85)";ctx.shadowBlur=6;ctx.shadowOffsetX=2;ctx.shadowOffsetY=3;
          win();ctx.strokeStyle="rgba(0,0,0,0.6)";ctx.lineWidth=2.5;ctx.stroke();ctx.restore();
          win();ctx.strokeStyle="rgba(0,0,0,0.55)";ctx.lineWidth=1.6;ctx.stroke();
          ctx.save();ctx.translate(-0.7,-0.7);win();
          ctx.strokeStyle="rgba(255,255,255,0.2)";ctx.lineWidth=0.9;ctx.stroke();ctx.restore();
        }
        // dome-head bolts on the four spokes — tiny polished spheres
        for(let k=0;k<4;k++){
          const a=k*1.5708,rB=(r0+r1)/2;
          const bx=Math.cos(a)*rB,by=Math.sin(a)*rB;
          ctx.fillStyle="rgba(0,0,0,0.4)";
          ctx.beginPath();ctx.arc(bx+1,by+1.4,3.2,0,6.283);ctx.fill();
          const bg2=ctx.createRadialGradient(bx-1.1,by-1.1,0.3,bx,by,3.4);
          bg2.addColorStop(0,"rgba(255,255,255,0.98)");
          bg2.addColorStop(0.45,"rgba(190,195,206,0.96)");
          bg2.addColorStop(1,"rgba(46,48,56,0.95)");
          ctx.fillStyle=bg2;
          ctx.beginPath();ctx.arc(bx,by,3.2,0,6.283);ctx.fill();
          ctx.strokeStyle="rgba(14,15,18,0.7)";ctx.lineWidth=0.9;
          ctx.beginPath();ctx.moveTo(bx-2,by);ctx.lineTo(bx+2,by);ctx.stroke();
        }
        // engraved index ticks on the outer rim band
        ctx.strokeStyle="rgba(16,17,20,0.5)";ctx.lineWidth=0.8;
        for(let i=0;i<gr.teeth*2;i++){
          const a=i/(gr.teeth*2)*6.283;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a)*(r1-1),Math.sin(a)*(r1-1));
          ctx.lineTo(Math.cos(a)*(r1+2.5),Math.sin(a)*(r1+2.5));
          ctx.stroke();
        }
      }
      // machined groove circles: dark cut + lit lip
      for(const rr of [r1,r0]){
        if(rr<=gr.hub+2)continue;
        ctx.strokeStyle="rgba(16,17,21,0.75)";ctx.lineWidth=1.4;
        ctx.beginPath();ctx.arc(0,0,rr,0,6.283);ctx.stroke();
        ctx.strokeStyle="rgba(255,255,255,0.2)";ctx.lineWidth=0.7;
        ctx.beginPath();ctx.arc(0,0,rr-1.1,0,6.283);ctx.stroke();
      }
      ctx.restore();
      // fixed specular shimmer — stays put while the wheel spins beneath it,
      // breathing slowly like light playing on chrome
      const sa=-2.4+Math.sin(time*0.5+gr.x*0.11)*0.16;
      ctx.save();
      ctx.shadowColor="rgba(255,255,255,0.6)";ctx.shadowBlur=6;
      ctx.strokeStyle=`rgba(255,255,255,${0.5*gr.w})`;ctx.lineWidth=2.6;ctx.lineCap="round";
      ctx.beginPath();ctx.arc(0,0,gr.R*0.62,sa,sa+1.05);ctx.stroke();
      ctx.strokeStyle=`rgba(255,255,255,${0.2*gr.w})`;ctx.lineWidth=1.2;
      ctx.beginPath();ctx.arc(0,0,gr.R*0.8,sa+2.9,sa+3.6);ctx.stroke();
      ctx.restore();
      // slow sweeping gleam wedge — a soft sheet of light crossing the face
      const wa=-2.2+Math.sin(time*0.23+seed)*0.55;
      const wg2=ctx.createRadialGradient(0,0,gr.hub,0,0,gr.R);
      wg2.addColorStop(0,"rgba(255,255,255,0)");
      wg2.addColorStop(0.7,`rgba(255,255,255,${0.11*gr.w})`);
      wg2.addColorStop(1,"rgba(255,255,255,0)");
      ctx.save();ctx.globalCompositeOperation="lighter";
      ctx.fillStyle=wg2;
      ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,gr.R,wa,wa+0.85);ctx.closePath();ctx.fill();
      // red environment light reflected on the shadow side — two-light setup
      ctx.strokeStyle=`rgba(255,68,82,${0.2*gr.w})`;ctx.lineWidth=2;
      ctx.shadowColor="rgba(255,68,82,0.6)";ctx.shadowBlur=6;
      ctx.beginPath();ctx.arc(0,0,gr.R-1.5,0.5,1.6);ctx.stroke();
      ctx.restore();
      // hub: a raised platinum torus with a domed ruby set in its center
      ctx.fillStyle="rgba(0,0,0,0.4)";
      ctx.beginPath();ctx.arc(1.2,1.8,gr.hub*0.72,0,6.283);ctx.fill();
      const hubG=ctx.createRadialGradient(-gr.hub*0.25,-gr.hub*0.25,1,0,0,gr.hub*0.78);
      hubG.addColorStop(0,"rgba(255,255,255,0.98)");
      hubG.addColorStop(0.5,"rgba(196,201,212,0.96)");
      hubG.addColorStop(1,"rgba(70,73,84,0.95)");
      ctx.fillStyle=hubG;ctx.beginPath();ctx.arc(0,0,gr.hub*0.72,0,6.283);ctx.fill();
      ctx.strokeStyle="rgba(20,21,26,0.7)";ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(0,0,gr.hub*0.72,0,6.283);ctx.stroke();
      // torus inner shadow ring
      ctx.strokeStyle="rgba(0,0,0,0.45)";ctx.lineWidth=1.6;
      ctx.beginPath();ctx.arc(0.6,0.8,gr.hub*0.42,0,6.283);ctx.stroke();
      // domed ruby: deep red sphere with a hot specular point
      ctx.save();ctx.shadowColor="rgba(255,68,82,0.95)";ctx.shadowBlur=10;
      const jg=ctx.createRadialGradient(-gr.hub*0.12,-gr.hub*0.12,0.4,0,0,gr.hub*0.34);
      jg.addColorStop(0,"rgba(255,214,219,1)");
      jg.addColorStop(0.35,"rgba(255,84,96,0.98)");
      jg.addColorStop(1,"rgba(136,8,20,0.96)");
      ctx.fillStyle=jg;ctx.beginPath();ctx.arc(0,0,gr.hub*0.34,0,6.283);ctx.fill();ctx.restore();
      ctx.fillStyle="rgba(255,255,255,0.9)";
      ctx.beginPath();ctx.arc(-gr.hub*0.12,-gr.hub*0.13,gr.hub*0.07+0.4,0,6.283);ctx.fill();
      ctx.restore();
    }
    const gears=[
      {x:0,y:0,R:86,teeth:26,tooth:9,hub:16,spd:0.22,w:1,tone:[255,255,255]},      // platinum
      {x:-58,y:-46,R:44,teeth:14,tooth:7,hub:9,spd:-0.41,w:0.92,tone:[226,236,252]}, // cool silver
      {x:62,y:-38,R:36,teeth:11,tooth:6.5,hub:8,spd:-0.53,w:0.88,tone:[255,240,226]},// warm nickel
      {x:34,y:66,R:30,teeth:9,tooth:6,hub:7,spd:0.64,w:0.85,tone:[206,212,228]},   // gunmetal
      {x:-20,y:-92,R:18,teeth:8,tooth:4.5,hub:5,spd:0.98,w:0.8,tone:[255,232,238]}, // rose platinum
      {x:98,y:26,R:16,teeth:7,tooth:4,hub:4.5,spd:-1.1,w:0.8,tone:[240,246,255]},  // bright silver
      {x:-104,y:-8,R:14,teeth:7,tooth:4,hub:4,spd:1.3,w:0.78,tone:[226,236,252]},
      {x:-76,y:-86,R:13,teeth:6,tooth:3.6,hub:3.6,spd:-1.45,w:0.76,tone:[255,240,226]},
      {x:24,y:-114,R:15,teeth:7,tooth:4,hub:4.2,spd:1.15,w:0.78,tone:[240,246,255]},
      {x:108,y:-62,R:13,teeth:6,tooth:3.6,hub:3.6,spd:-1.5,w:0.76,tone:[206,212,228]},
      {x:-30,y:104,R:16,teeth:8,tooth:4.2,hub:4.5,spd:-0.95,w:0.8,tone:[255,232,238]},
      {x:64,y:108,R:14,teeth:7,tooth:4,hub:4,spd:1.25,w:0.78,tone:[226,236,252]},
      {x:-128,y:32,R:11,teeth:6,tooth:3.2,hub:3.2,spd:1.7,w:0.74,tone:[255,255,255]},
      {x:132,y:-30,R:11,teeth:6,tooth:3.2,hub:3.2,spd:-1.75,w:0.74,tone:[255,240,226]}
    ];
    for(const gr of gears)drawGear(gr,time*gr.spd+(gr.x+gr.y));
    // ---- trapped-plasma capsules: tiny tesla-coil electronics, live arcs
    // dancing inside dark glass with copper windings at the base ----
    function drawPlasma(px,py,pr,ph){
      ctx.save();ctx.translate(px,py);
      ctx.fillStyle="rgba(0,0,0,0.45)";
      ctx.beginPath();ctx.arc(1.5,2,pr+1,0,6.283);ctx.fill();
      const shg=ctx.createRadialGradient(-pr*0.3,-pr*0.3,1,0,0,pr);
      shg.addColorStop(0,"rgba(70,40,48,0.9)");shg.addColorStop(0.7,"rgba(28,14,20,0.95)");shg.addColorStop(1,"rgba(10,6,10,0.98)");
      ctx.fillStyle=shg;ctx.beginPath();ctx.arc(0,0,pr,0,6.283);ctx.fill();
      ctx.save();ctx.beginPath();ctx.arc(0,0,pr-0.8,0,6.283);ctx.clip();
      ctx.globalCompositeOperation="lighter";
      for(let f=0;f<4;f++){
        const baseA=ph+f*1.57+Math.sin(time*2.3+ph*3+f)*0.9;
        ctx.strokeStyle="rgba(255,120,132,0.85)";ctx.lineWidth=1.1;
        ctx.shadowColor="rgba(255,68,82,0.9)";ctx.shadowBlur=5;
        ctx.beginPath();ctx.moveTo(0,0);
        let fx=0,fy=0;
        for(let s3=1;s3<=3;s3++){
          const rr2=(pr-1)*s3/3;
          const a2=baseA+Math.sin(time*13+f*7+s3*5+ph)*0.5;
          fx=Math.cos(a2)*rr2;fy=Math.sin(a2)*rr2;
          ctx.lineTo(fx,fy);
        }
        ctx.stroke();
        ctx.fillStyle="rgba(255,220,224,0.9)";
        ctx.beginPath();ctx.arc(fx,fy,1.2,0,6.283);ctx.fill();
      }
      ctx.shadowBlur=8;ctx.fillStyle="rgba(255,190,196,0.95)";
      ctx.beginPath();ctx.arc(0,0,1.8,0,6.283);ctx.fill();
      ctx.restore();
      // glass specular + copper windings at the base
      ctx.fillStyle="rgba(255,255,255,0.5)";
      ctx.beginPath();ctx.arc(-pr*0.35,-pr*0.4,pr*0.16,0,6.283);ctx.fill();
      ctx.strokeStyle="rgba(228,238,248,0.8)";ctx.lineWidth=1;
      for(let w2=0;w2<3;w2++){
        ctx.beginPath();ctx.moveTo(-pr*0.5,pr+1.5+w2*1.8);ctx.lineTo(pr*0.5,pr+1.5+w2*1.8);ctx.stroke();
      }
      ctx.restore();
    }
    drawPlasma(0,-130,9,0.5);
    drawPlasma(-134,-40,8,2.1);
    drawPlasma(96,72,8.5,4.2);
    // ---- escapement: sawtooth escape wheel + rocking pallet anchor ----
    {
      const ex=-96,ey=58,er=20;
      const erot=time*0.5;
      ctx.save();
      ctx.translate(ex,ey);
      // wheel shadow + body
      ctx.save();ctx.rotate(erot);
      ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=10;
      ctx.shadowOffsetX=4;ctx.shadowOffsetY=5;
      ctx.fillStyle="rgba(8,8,10,0.8)";
      ctx.beginPath();
      for(let i=0;i<12;i++){
        const a=i/12*6.283,a2=a+0.30;
        ctx.lineTo(Math.cos(a)*er,Math.sin(a)*er);
        ctx.lineTo(Math.cos(a2)*(er-6),Math.sin(a2)*(er-6));
      }
      ctx.closePath();ctx.fill();
      const eg=ctx.createRadialGradient(-6,-6,1,0,0,er);
      eg.addColorStop(0,"rgba(252,253,255,0.95)");eg.addColorStop(0.5,"rgba(190,195,206,0.92)");eg.addColorStop(1,"rgba(84,88,98,0.92)");
      ctx.fillStyle=eg;ctx.shadowColor="transparent";ctx.shadowBlur=0;ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;
      ctx.beginPath();
      for(let i=0;i<12;i++){
        const a=i/12*6.283,a2=a+0.30;
        ctx.lineTo(Math.cos(a)*er,Math.sin(a)*er);
        ctx.lineTo(Math.cos(a2)*(er-6),Math.sin(a2)*(er-6));
      }
      ctx.closePath();ctx.fill();
      ctx.strokeStyle="rgba(14,15,18,0.7)";ctx.lineWidth=1;ctx.stroke();
      ctx.restore();
      // hub
      ctx.fillStyle="rgba(60,63,72,0.95)";ctx.beginPath();ctx.arc(0,0,4.5,0,6.283);ctx.fill();
      ctx.fillStyle="rgba(240,243,248,0.8)";ctx.beginPath();ctx.arc(-1.2,-1.2,1.4,0,6.283);ctx.fill();
      // rocking anchor above the wheel, jewel pallets kissing the teeth
      const rock=Math.sin(time*6)*0.13;
      ctx.save();
      ctx.translate(0,-er-14);
      ctx.rotate(rock);
      ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=8;ctx.shadowOffsetX=3;ctx.shadowOffsetY=5;
      ctx.strokeStyle="rgba(206,211,222,0.95)";ctx.lineWidth=4.4;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(-14,16);ctx.quadraticCurveTo(0,2,14,16);ctx.stroke();
      ctx.shadowColor="transparent";
      ctx.strokeStyle="rgba(255,255,255,0.5)";ctx.lineWidth=1.4;
      ctx.beginPath();ctx.moveTo(-14,15);ctx.quadraticCurveTo(0,1,14,15);ctx.stroke();
      // pallet jewels
      for(const px of [-14,14]){
        ctx.save();ctx.shadowColor="rgba(255,68,82,0.9)";ctx.shadowBlur=7;
        ctx.fillStyle="#FF4650";ctx.beginPath();ctx.arc(px,16.5,2.4,0,6.283);ctx.fill();ctx.restore();
      }
      // stem and counterweight
      ctx.strokeStyle="rgba(206,211,222,0.9)";ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(0,4);ctx.lineTo(0,-10);ctx.stroke();
      const cwg=ctx.createRadialGradient(-1.5,-11.5,0.5,0,-10,5);
      cwg.addColorStop(0,"rgba(255,255,255,0.95)");cwg.addColorStop(1,"rgba(96,100,110,0.95)");
      ctx.fillStyle=cwg;ctx.beginPath();ctx.arc(0,-10,4.6,0,6.283);ctx.fill();
      ctx.restore();
      ctx.restore();
    }
    // ---- crank + connecting rod + piston sliding in a vertical rail ----
    {
      const gx=62,gy=-38,crankR=14,L=64,railX=118;
      const ca=time*-0.53+(gx+gy);
      const pinX=gx+Math.cos(ca)*crankR,pinY=gy+Math.sin(ca)*crankR;
      const dx=railX-pinX;
      const pistY=pinY+Math.sqrt(Math.max(16,L*L-dx*dx));
      // rail groove
      ctx.strokeStyle="rgba(12,13,16,0.9)";ctx.lineWidth=6;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(railX,-28);ctx.lineTo(railX,46);ctx.stroke();
      ctx.strokeStyle="rgba(190,195,206,0.35)";ctx.lineWidth=1.4;
      ctx.beginPath();ctx.moveTo(railX-2,-28);ctx.lineTo(railX-2,46);ctx.stroke();
      // connecting rod (chrome, lit edge)
      ctx.save();
      ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=7;ctx.shadowOffsetX=3;ctx.shadowOffsetY=4;
      ctx.strokeStyle="rgba(210,215,226,0.95)";ctx.lineWidth=4.6;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(pinX,pinY);ctx.lineTo(railX,pistY);ctx.stroke();
      ctx.shadowColor="transparent";
      ctx.strokeStyle="rgba(255,255,255,0.55)";ctx.lineWidth=1.3;
      ctx.beginPath();ctx.moveTo(pinX-0.8,pinY-0.8);ctx.lineTo(railX-0.8,pistY-0.8);ctx.stroke();
      // piston block
      const pg=ctx.createLinearGradient(railX-6,pistY-8,railX+6,pistY+8);
      pg.addColorStop(0,"rgba(250,252,255,0.95)");pg.addColorStop(0.5,"rgba(176,181,192,0.95)");pg.addColorStop(1,"rgba(70,74,84,0.95)");
      ctx.fillStyle=pg;
      ctx.beginPath();
      if(ctx.roundRect)ctx.roundRect(railX-5.5,pistY-8,11,16,2.5);
      else ctx.rect(railX-5.5,pistY-8,11,16);
      ctx.fill();
      ctx.strokeStyle="rgba(16,17,20,0.7)";ctx.lineWidth=1;ctx.stroke();
      // pins
      for(const [qx,qy] of [[pinX,pinY],[railX,pistY]]){
        ctx.fillStyle="rgba(40,42,48,0.95)";ctx.beginPath();ctx.arc(qx,qy,2.6,0,6.283);ctx.fill();
        ctx.fillStyle="rgba(240,243,248,0.8)";ctx.beginPath();ctx.arc(qx-0.8,qy-0.8,1,0,6.283);ctx.fill();
      }
      ctx.restore();
    }
    ctx.save();
    ctx.rotate(time*0.14);
    ctx.shadowColor="rgba(255,68,82,0.9)";ctx.shadowBlur=8;
    ctx.strokeStyle="rgba(255,164,172,0.95)";ctx.lineWidth=2.6;
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-142);ctx.stroke();
    ctx.fillStyle="rgba(255,164,172,0.95)";
    ctx.beginPath();ctx.moveTo(0,-142);ctx.lineTo(-5,-126);ctx.lineTo(5,-126);ctx.closePath();ctx.fill();
    ctx.restore();
    ctx.restore();
  }

  function anamorphicFlare(alpha){
    if(alpha<=0.01)return;
    ctx.save();
    ctx.globalCompositeOperation="lighter";
    const w=W*0.85;
    const g=ctx.createLinearGradient(CX-w/2,CY,CX+w/2,CY);
    g.addColorStop(0,"rgba(193,18,31,0)");
    g.addColorStop(0.5,`rgba(255,142,152,${0.5*alpha})`);
    g.addColorStop(1,"rgba(193,18,31,0)");
    ctx.fillStyle=g;
    ctx.fillRect(CX-w/2,CY-2.2,w,4.4);
    for(const [d,r,a] of [[0.18,14,0.28],[-0.24,9,0.2],[0.34,20,0.14],[-0.4,26,0.1]]){
      ctx.fillStyle=`rgba(255,68,82,${a*alpha})`;
      ctx.beginPath();
      for(let k=0;k<6;k++){
        const an=k/6*Math.PI*2+0.4;
        const x=CX+W*d+Math.cos(an)*r,y=CY+Math.sin(an)*r;
        k===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.closePath();ctx.fill();
    }
    ctx.restore();
  }
  function godRays(time,alpha){
    if(alpha<=0.01)return;
    ctx.save();
    ctx.globalCompositeOperation="lighter";
    ctx.translate(CX,CY);
    ctx.rotate(time*0.02);
    const R=Math.max(W,H)*0.75;
    for(let i=0;i<6;i++){
      const a0=i/6*Math.PI*2,spread=0.10;
      const g=ctx.createLinearGradient(0,0,Math.cos(a0)*R,Math.sin(a0)*R);
      g.addColorStop(0,`rgba(255,68,82,${0.10*alpha})`);
      g.addColorStop(1,"rgba(255,68,82,0)");
      ctx.fillStyle=g;
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.arc(0,0,R,a0-spread,a0+spread);
      ctx.closePath();ctx.fill();
    }
    ctx.restore();
  }
  function fogLayer(time,front,bgc){
    for(const f of fogBlobs){
      if(f.front!==front)continue;
      const x=(f.x+Math.sin(time*f.sp+f.ph)*0.08)*W;
      const y=(f.y+Math.cos(time*f.sp*0.8+f.ph)*0.05)*H;
      const r=f.r*Math.max(W,H);
      const g=ctx.createRadialGradient(x,y,0,x,y,r);
      const a=front?0.05:0.10;
      g.addColorStop(0,`rgba(${Math.min(255,bgc[0]+72)},${Math.min(255,bgc[1]+24)},${Math.min(255,bgc[2]+28)},${a})`);
      g.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=g;
      ctx.fillRect(x-r,y-r,r*2,r*2);
    }
  }

  function texTri(pts,tex,shade,rim,edgeGlow,seamGlow,spec){
    const [u0,v0]=UV[0],[u1,v1]=UV[1],[u2,v2]=UV[2];
    const x0=pts[0].x,y0=pts[0].y,x1=pts[1].x,y1=pts[1].y,x2=pts[2].x,y2=pts[2].y;
    const det=u0*(v1-v2)+u1*(v2-v0)+u2*(v0-v1);
    if(Math.abs(det)<1e-6)return;
    const a=(x0*(v1-v2)+x1*(v2-v0)+x2*(v0-v1))/det;
    const b=(y0*(v1-v2)+y1*(v2-v0)+y2*(v0-v1))/det;
    const c=(x0*(u2-u1)+x1*(u0-u2)+x2*(u1-u0))/det;
    const d=(y0*(u2-u1)+y1*(u0-u2)+y2*(u1-u0))/det;
    const e=x0-a*u0-c*v0,f=y0-b*u0-d*v0;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.lineTo(x2,y2);ctx.closePath();
    ctx.clip();
    ctx.save();
    ctx.transform(a,b,c,d,e,f);
    ctx.drawImage(tex,0,0);
    // living mirror: red code scrolls up the inset pane while a light band
    // sweeps across it (per-face phase so the shards never sync)
    const tN=performance.now()*0.001, phx=(x0*0.013+y0*0.007)%6.283;
    // silver shimmer over the ENTIRE face — slow, each shard on its own time
    ctx.globalCompositeOperation="lighter";
    ctx.globalAlpha=0.55;
    const sx=(((tN*21)+phx*90)%740)-500;
    ctx.drawImage(SHEEN_TEX,sx,0);
    ctx.globalAlpha=1;ctx.globalCompositeOperation="source-over";
    // scrolling code stays inside the inner mirror triangle
    ctx.beginPath();ctx.moveTo(128,46);ctx.lineTo(217,215);ctx.lineTo(39,215);ctx.closePath();ctx.clip();
    const off=(tN*20+phx*40)%512;
    ctx.globalAlpha=0.88;
    ctx.drawImage(CODE_TEX,0,off-512);
    ctx.drawImage(CODE_TEX,0,off);
    ctx.globalAlpha=1;
    ctx.restore();
    const bx=Math.min(x0,x1,x2)-1,by=Math.min(y0,y1,y2)-1,
          bw=Math.abs(Math.max(x0,x1,x2)-Math.min(x0,x1,x2))+2,
          bh=Math.abs(Math.max(y0,y1,y2)-Math.min(y0,y1,y2))+2;
    if(shade>0.01){
      ctx.fillStyle=`rgba(6,10,17,${Math.min(0.9,shade)})`;
      ctx.fillRect(bx,by,bw,bh);
    }
    if(rim>0.01){
      ctx.globalCompositeOperation="lighter";
      ctx.fillStyle=`rgba(255,68,82,${Math.min(0.5,rim)})`;
      ctx.fillRect(bx,by,bw,bh);
      ctx.globalCompositeOperation="source-over";
    }
    if(spec>0.01){
      // a sharp moving glint — this is what makes brushed steel look shiny as it turns,
      // as opposed to just growing darker/lighter with diffuse angle
      ctx.globalCompositeOperation="lighter";
      ctx.fillStyle=`rgba(255,255,255,${Math.min(0.42,spec)})`;
      ctx.fillRect(bx,by,bw,bh);
      ctx.globalCompositeOperation="source-over";
    }
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.lineTo(x2,y2);ctx.closePath();
    ctx.lineWidth=1;
    ctx.strokeStyle=edgeGlow?"rgba(255,68,82,0.85)":css(EDGE_LINE);
    ctx.stroke();
    if(seamGlow>0.003){
      ctx.lineWidth=3.4;
      ctx.strokeStyle=`rgba(255,68,82,${(0.30*seamGlow).toFixed(3)})`;
      ctx.stroke();
      ctx.lineWidth=1+0.9*seamGlow;
      ctx.strokeStyle=`rgba(255,178,186,${(0.20+0.55*seamGlow).toFixed(3)})`;
      ctx.stroke();
    }
  }

  const drawList=[];
  let raf=0,killed=false;

  function tick(now){
    if(killed)return;
    raf=requestAnimationFrame(tick);
    const time=now/1000;
    const dt=Math.min(tick.last?(now-tick.last)/1000:0.016,0.05);tick.last=now;

    p=reduced?target:p+(target-p)*(1-Math.exp(-4.6*dt));
    if(Math.abs(target-p)<0.0004)p=target;
    mx+=(mouseX-mx)*(reduced?1:0.06);
    my+=(mouseY-my)*(reduced?1:0.06);

    const over=scrollY-cinemaSpan();
    const fade=smooth(1-clamp(over/(innerHeight*1.15),0,1));

    /* soft idle pulse every ~10s — a smooth breath in and out, never a hard flash */
    const pulsePhase=(time%10)/10;
    const pulseEnvelope=Math.exp(-Math.pow((pulsePhase-0.5)*4.2,2));
    const pulse=reduced?0:pulseEnvelope*clamp(1-p*2.4,0,1)*fade;

    /* slow orbiting light rig — the key light circles the scene so highlights
       sweep continuously across the plates instead of sitting at a threshold */
    const orbA=time*0.11;
    L_KEY=norm(V(Math.cos(orbA)*0.78,0.55,Math.sin(orbA)*0.78));
    L_CYN=norm(V(Math.cos(orbA+2.5)*0.8,0.18,Math.sin(orbA+2.5)*0.8));
    L_BLU=norm(V(Math.cos(orbA-2.1)*0.6,-0.6,Math.sin(orbA-2.1)*0.6));

    /* Tron LED framing: faint animated glow living in the seams while at rest */
    const rest=clamp(1-p*3.2,0,1)*fade;

    const openRaw=seg(p,0.10,0.60);
    const reveal=smooth(seg(p,0.32,0.62));
    const pop=smooth(seg(p,0.34,0.62));
    const settle=smooth(seg(p,0.70,0.95));
    const cooldown=smooth(seg(p,0.46,0.64));
    const seamGlow=smooth(seg(p,0.08,0.24))*(1-cooldown);
    const crackHeat=smooth(seg(openRaw,0.06,0.5))*(1-cooldown);
    const HOT=[255,214,216];
    camD=8.4-reveal*2.2+settle*1.8;

    /* hero shrink + glow reflected onto the headline */
    if(heroEl){
      const hs=smooth(seg(p,0,0.35));
      heroEl.style.transform=`translate3d(0,${(-46*hs).toFixed(1)}px,0) scale(${(1-0.16*hs).toFixed(3)})`;
      heroEl.style.opacity=String(1-seg(p,0.16,0.42));
    }
    if(heroTitleEl){
      const g=Math.max(pulse*0.6,crackHeat*0.85,reveal*0.25)*fade;
      heroTitleEl.style.textShadow=
        `0 0 ${(16+34*g).toFixed(0)}px rgba(255,68,82,${(0.10+0.45*g).toFixed(2)}),0 0 90px rgba(193,18,31,${(0.28*g).toFixed(2)})`;
    }

    const bgc=mixRGB(sampleBg(p),[6,5,6],1-fade);
    ctx.fillStyle=css(bgc);
    ctx.fillRect(0,0,W,H);
    document.body.style.backgroundColor=css(bgc);

    if(fade>0.002){
      ctx.save();
      ctx.globalAlpha=fade;

      const vg=ctx.createRadialGradient(CX,CY,0,CX,CY,Math.max(W,H)*0.6);
      vg.addColorStop(0,`rgba(193,18,31,${0.10+reveal*0.10+pulse*0.08})`);
      vg.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);

      godRays(time,crackHeat*1.25+reveal*0.35*(1-crackHeat)+pulse*0.25);
      fogLayer(time,false,bgc);
      // something inside wants out: random faint rays slip through the seams
      {
        ctx.save();ctx.translate(CX,CY);ctx.globalCompositeOperation="lighter";
        for(let i=0;i<6;i++){
          const period=6.5+i*1.9;
          const cyc=Math.floor(time/period);
          const lt=time-cyc*period;
          if(lt>1.8)continue;
          const hsh=Math.sin((i*57.3+cyc*91.7)*12.9898)*43758.5453;
          const ang=(hsh-Math.floor(hsh))*6.283;
          const env=Math.sin(Math.PI*lt/1.8);
          const a=0.09*env;
          if(a<=0.004)continue;
          const r0=Math.min(W,H)*0.16,r1=Math.min(W,H)*0.85;
          const rg=ctx.createLinearGradient(Math.cos(ang)*r0,Math.sin(ang)*r0,Math.cos(ang)*r1,Math.sin(ang)*r1);
          rg.addColorStop(0,`rgba(255,230,232,${a.toFixed(3)})`);
          rg.addColorStop(0.4,`rgba(255,120,130,${(a*0.6).toFixed(3)})`);
          rg.addColorStop(1,"rgba(0,0,0,0)");
          ctx.fillStyle=rg;
          const sp=0.018+((hsh*7)%1)*0.02;
          ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,r1,ang-sp,ang+sp);ctx.closePath();ctx.fill();
        }
        ctx.restore();
      }

      const wy=time*0.07+p*0.5+mx*0.16;
      const wx=Math.sin(time*0.12)*0.06+my*0.10;
      const xf=v=>rotX(rotY(v,wy),wx);

      for(const pt of farParts){
        const v=xf(rotY(pt.p,time*0.015));
        const pr=project(v);
        if(!pr)continue;
        const a=clamp(1.6-pr.depth/14,0.05,0.6);
        ctx.fillStyle=`rgba(170,174,182,${a})`;
        ctx.beginPath();ctx.arc(pr.x,pr.y,Math.max(0.4,pt.s*pr.s*0.012),0,6.283);ctx.fill();
      }

      if(seamGlow>0.01||crackHeat>0.01){
        ctx.save();
        ctx.globalCompositeOperation="lighter";
        const heat=Math.max(seamGlow*0.5,crackHeat);
        const fr=FL/camD*(1.9+crackHeat*1.1+Math.sin(time*3.1)*0.08*heat);
        const fg=ctx.createRadialGradient(CX,CY,0,CX,CY,fr);
        fg.addColorStop(0,`rgba(255,255,255,${0.95*heat})`);
        fg.addColorStop(0.25,`rgba(255,214,216,${0.8*heat})`);
        fg.addColorStop(0.55,`rgba(255,68,82,${0.35*heat})`);
        fg.addColorStop(1,"rgba(0,0,0,0)");
        ctx.fillStyle=fg;
        ctx.beginPath();ctx.arc(CX,CY,fr,0,6.283);ctx.fill();
        ctx.translate(CX,CY);
        ctx.rotate(time*0.05);
        const RR=Math.max(W,H)*0.8;
        for(let i=0;i<12;i++){
          const a0=i/12*Math.PI*2+Math.sin(i*7.3)*0.1;
          const sp=0.012+0.02*Math.abs(Math.sin(i*3.7));
          const rg=ctx.createLinearGradient(0,0,Math.cos(a0)*RR,Math.sin(a0)*RR);
          rg.addColorStop(0,`rgba(255,196,200,${0.5*crackHeat})`);
          rg.addColorStop(0.5,`rgba(255,68,82,${0.12*crackHeat})`);
          rg.addColorStop(1,"rgba(0,0,0,0)");
          ctx.fillStyle=rg;
          ctx.beginPath();
          ctx.moveTo(0,0);
          ctx.arc(0,0,RR,a0-sp,a0+sp);
          ctx.closePath();ctx.fill();
        }
        ctx.restore();
      }

      drawList.length=0;

      const pulseScl=1; // geometry stays solid — only the glow (rim/seam/bloom) breathes with pulse
      for(const s of shards){
        const e=smooth(seg(openRaw,s.delay,1));
        const led=rest*(0.28+0.24*Math.sin(time*1.15+s.ledPh));
        const d=e*(s.dist+settle*2.4);
        const pos=add(s.base,mul(s.dir,d));
        const ang=e*s.rotAmt;
        const scl=(1-settle*0.28)*pulseScl;
        const wv=[];
        for(const lv of s.verts){
          let v=rotAA(lv,s.rotAxis,ang);
          v=mul(v,scl);
          v=add(v,mul(pos,pulseScl));
          wv.push(xf(v));
        }
        for(let pi=0;pi<s.polys.length;pi++){
          if(pi>0 && e<=0.02) continue; // sealed: hide interior walls, they only matter once a gap opens
          const poly=s.polys[pi];
          const A=wv[poly[0]],B=wv[poly[1]],C=wv[poly[2]];
          let nrm=norm(cross(sub(B,A),sub(C,A)));
          const midp=mul(poly.reduce((acc,i)=>add(acc,wv[i]),V()),1/poly.length);
          const toCam=norm(sub(V(0,0,camD),midp));
          if(dot(nrm,toCam)<0)nrm=mul(nrm,-1);
          const pts=[];let ok=true,zsum=0;
          for(const i of poly){
            const pr=project(wv[i]);
            if(!pr){ok=false;break;}
            pts.push(pr);zsum+=pr.depth;
          }
          if(!ok)continue;
          const zavg=zsum/poly.length;
          const kd=Math.max(0,dot(nrm,L_KEY));
          const cy=Math.max(0,dot(nrm,L_CYN));
          const bl=Math.max(0,dot(nrm,L_BLU));
          const fog=clamp((zavg-6)/12,0,0.78);
          if(pi===0){
            drawList.push({
              z:zavg,t:"tex",pts,tex:s.tex,
              shade:clamp((1-(0.30+kd*0.85))*0.9+fog*0.55,0,0.88),
              rim:cy*0.30+crackHeat*0.22+pulse*0.10+(s.kind===2?0.18+reveal*0.15:0),
              edgeGlow:s.kind===2,
              seam:Math.max(seamGlow,pulse*0.22,led),
              spec:Math.pow(kd,4.5)*0.36
            });
          } else {
            let base=s.kind===1?STEEL_DEEP:STEEL_BASE;
            let col=mixRGB(STEEL_SHADE,base,0.32+kd*0.68);
            col=mixRGB(col,STEEL_LIT,Math.pow(kd,3)*0.8);
            const spec=Math.pow(kd,5)*0.32;
            col=[col[0]+255*spec,col[1]+255*spec,col[2]+255*spec];
            col=[col[0]+CYAN[0]*cy*0.26,col[1]+CYAN[1]*cy*0.26,col[2]+CYAN[2]*cy*0.26];
            col=[col[0]+BLUE[0]*bl*0.2,col[1]+BLUE[1]*bl*0.2,col[2]+BLUE[2]*bl*0.2];
            if(s.kind===2)col=mixRGB(col,CYAN,0.4);
            col=mixRGB(col,HOT,crackHeat*0.6*(1-fog));
            col=mixRGB(col,bgc,fog);
            drawList.push({z:zavg,t:"poly",pts,col,edge:s.kind===2});
          }
        }
      }

      rings.forEach(r=>{
        const rs=(1+reveal*0.12+settle*0.32)*pulseScl;
        const a1=r.phase+time*r.spd*(1+p*1.6);
        const N=r.pts.length;
        const wvs=r.pts.map(pt=>{
          let v=rotAA(pt,V(1,0,0),r.tilt[0]);
          v=rotAA(v,V(0,1,0),r.tilt[1]+a1);
          return xf(mul(v,rs));
        });
        for(let i=0;i<N;i++){
          const A=wvs[i],B=wvs[(i+1)%N];
          const pa=project(A),pb=project(B);
          if(!pa||!pb)continue;
          const zavg=(pa.depth+pb.depth)/2;
          const fog=clamp((zavg-6)/12,0,0.8);
          let col=r.glow?mixRGB(CYAN,bgc,fog*0.7):mixRGB(hex2rgb(0x9CA1A9),bgc,fog);
          drawList.push({z:zavg,t:"line",a:pa,b:pb,col,w:r.w*(FL/zavg)*0.004,glow:r.glow});
        }
      });

      drawList.sort((a,b)=>b.z-a.z);
      for(const d of drawList){
        if(d.t==="tex"){
          texTri(d.pts,d.tex,d.shade,d.rim,d.edgeGlow,d.seam||0,d.spec||0);
        } else if(d.t==="poly"){
          ctx.beginPath();
          ctx.moveTo(d.pts[0].x,d.pts[0].y);
          for(let i=1;i<d.pts.length;i++)ctx.lineTo(d.pts[i].x,d.pts[i].y);
          ctx.closePath();
          ctx.fillStyle=css(d.col);ctx.fill();
          ctx.lineWidth=1;
          ctx.strokeStyle=d.edge?"rgba(255,68,82,0.8)":css(EDGE_LINE);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(d.a.x,d.a.y);ctx.lineTo(d.b.x,d.b.y);
          if(d.glow){
            ctx.lineWidth=Math.max(0.6,d.w)*2.8;
            ctx.strokeStyle="rgba(255,68,82,0.26)";
            ctx.stroke();
          }
          ctx.lineWidth=Math.max(0.6,d.w);
          ctx.strokeStyle=css(d.col);
          ctx.stroke();
        }
      }

      const mechEase=smooth(smooth(seg(p,0.28,0.68)));           // extra-gentle ease, no pop
      const mechAlpha=mechEase*(1-seg(p,0.90,1)*0.4);
      const popZ=pop*2.1;
      const mechScale=(FL/(camD-popZ))*0.0122*(0.06+0.94*mechEase);   // grows from near-nothing
      const sparkAssemble=smooth(seg(p,0.20,0.56));
      const sparkFadeOut=smooth(seg(p,0.48,0.66));
      drawMechSparks(sparkAssemble,sparkFadeOut,mechScale);
      drawMechanism(time,mechAlpha,mechScale);

      if(reveal>0.01||crackHeat>0.01||pulse>0.02){
        ctx.globalCompositeOperation="lighter";
        const heat=Math.max(crackHeat,reveal*0.5*(1-crackHeat),pulse*0.35);
        const gr=FL/camD*(1.5+crackHeat*0.9+Math.sin(time*1.7)*0.07)*(0.4+Math.max(reveal,crackHeat,pulse*0.5)*0.6);
        const g=ctx.createRadialGradient(CX,CY,0,CX,CY,gr);
        g.addColorStop(0,`rgba(255,${lerp(90,244,crackHeat)|0},${lerp(96,238,crackHeat)|0},${0.3+0.5*heat})`);
        g.addColorStop(0.35,`rgba(193,18,31,${0.14+0.2*heat})`);
        g.addColorStop(1,"rgba(0,0,0,0)");
        ctx.fillStyle=g;
        ctx.beginPath();ctx.arc(CX,CY,gr,0,6.283);ctx.fill();
        ctx.globalCompositeOperation="source-over";
      }

      anamorphicFlare(crackHeat*0.9+reveal*(0.5+Math.sin(time*1.3)*0.12)*(1-crackHeat));
      if(crackHeat>0.01){
        ctx.globalCompositeOperation="lighter";
        ctx.fillStyle=`rgba(255,172,178,${0.06*crackHeat*crackHeat})`;
        ctx.fillRect(0,0,W,H);
        ctx.globalCompositeOperation="source-over";
      }
      fogLayer(time,true,bgc);

      /* cursor-reactive motes */
      const curX=(mx*0.5+0.5)*W,curY=(my*0.5+0.5)*H;
      ctx.globalCompositeOperation="lighter";
      for(const m of motes){
        let x=((m.x+time*0.008*m.sp)%1)*W;
        let y=(m.y+Math.sin(time*m.sp+m.ph)*0.03)*H;
        const ddx=x-curX,ddy=y-curY;
        const dist=Math.sqrt(ddx*ddx+ddy*ddy)||1;
        if(dist<170){
          const push=(1-dist/170)*26;
          x+=ddx/dist*push;y+=ddy/dist*push;
        }
        const a=0.10+0.10*Math.sin(time*1.4+m.ph);
        ctx.fillStyle=m.cy?`rgba(255,68,82,${a})`:`rgba(208,210,216,${a*0.8})`;
        ctx.beginPath();ctx.arc(x,y,m.r,0,6.283);ctx.fill();
      }
      ctx.globalCompositeOperation="source-over";

      if(grainPattern&&fade>0.15){
        ctx.save();
        ctx.globalAlpha=0.26*fade;
        ctx.translate((Math.random()*160)|0,(Math.random()*160)|0);
        ctx.fillStyle=grainPattern;
        ctx.fillRect(-160,-160,W+320,H+320);
        ctx.restore();
      }

      const vig=ctx.createRadialGradient(CX,CY,Math.min(W,H)*0.42,CX,CY,Math.max(W,H)*0.78);
      vig.addColorStop(0,"rgba(0,0,0,0)");
      vig.addColorStop(1,"rgba(3,3,4,0.34)");
      ctx.fillStyle=vig;ctx.fillRect(0,0,W,H);

      ctx.restore();
    }

    /* ambient background rises as the cinematic fades */
    drawAmbient(ctx,W,H,time,scrollY,1-fade);

    const lo=smooth(seg(p,0.42,0.58))*(1-seg(p,0.86,0.98)*0.65)*fade;
    if(logoEl){
      logoEl.style.opacity=lo;
      logoEl.style.transform=`scale(${0.9+lo*0.1})`;
    }
  }
  raf=requestAnimationFrame(tick);

  return function cleanup(){
    killed=true;
    cancelAnimationFrame(raf);
    removeEventListener("resize",resize);
    removeEventListener("scroll",onScroll);
    removeEventListener("pointermove",onMove);
    document.body.style.backgroundColor="#060506";
  };
}

/* ============================================================
   AMBIENT-ONLY CANVAS (product pages)
   ============================================================ */

function AmbientBG() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, raf = 0, killed = false;
    const resize = () => {
      const wNew = innerWidth, hNew = innerHeight;
      if (W === wNew && H > 0 && hNew <= H && H - hNew < 160) return; // URL-bar jitter
      const DPR = Math.min(devicePixelRatio || 1, wNew < 820 ? 1.5 : 2);
      const hUse = (wNew === W && H > 0) ? Math.max(hNew, H) : hNew;
      W = wNew; H = hUse;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    addEventListener("resize", resize); resize();
    const tick = (now) => {
      if (killed) return;
      raf = requestAnimationFrame(tick);
      ctx.fillStyle = "#060506"; ctx.fillRect(0, 0, W, H);
      drawAmbient(ctx, W, H, now / 1000, scrollY, 1);
    };
    raf = requestAnimationFrame(tick);
    return () => { killed = true; cancelAnimationFrame(raf); removeEventListener("resize", resize); };
  }, []);
  return <canvas id="gl" ref={ref} />;
}

/* ============================================================
   PRODUCT ART + ICONS
   ============================================================ */

function ProductArt({ type }) {
  const defs = (id) => (
    <defs>
      <linearGradient id={id + "g"} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#C1121F" /><stop offset="1" stopColor="#FF4650" />
      </linearGradient>
      <linearGradient id={id + "s"} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3C3F45" /><stop offset="1" stopColor="#161719" />
      </linearGradient>
    </defs>
  );
  const common = { viewBox: "0 0 400 250", fill: "none", role: "img" };
  switch (type) {
    case "kiosk":
      return (
        <svg {...common} aria-label="AI Business Kiosk">
          {defs("k")}
          <rect x="150" y="30" width="100" height="150" rx="10" fill="url(#ks)" stroke="rgba(160,164,172,.5)" />
          <rect x="160" y="42" width="80" height="110" rx="5" fill="#0C0C0E" stroke="url(#kg)" strokeWidth="1.5" />
          <circle cx="200" cy="80" r="16" stroke="url(#kg)" strokeWidth="2" />
          <path d="M188 116 h24 M184 126 h32" stroke="rgba(255,68,82,.8)" strokeWidth="2" strokeLinecap="round" />
          <rect x="185" y="180" width="30" height="34" fill="url(#ks)" stroke="rgba(160,164,172,.4)" />
          <rect x="160" y="214" width="80" height="8" rx="4" fill="url(#ks)" stroke="rgba(160,164,172,.4)" />
          <circle cx="200" cy="80" r="30" stroke="rgba(255,68,82,.25)" strokeWidth="1" />
          <circle cx="200" cy="80" r="44" stroke="rgba(255,68,82,.12)" strokeWidth="1" />
          <path d="M96 70 h36 M96 90 h24 M268 150 h36 M280 170 h24" stroke="rgba(160,164,172,.35)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "qr":
      return (
        <svg {...common} aria-label="QR Display Kiosk">
          {defs("q")}
          <rect x="120" y="40" width="160" height="120" rx="10" fill="url(#qs)" stroke="rgba(160,164,172,.5)" />
          {[0, 1, 2].map(i => (
            <g key={i} transform={`translate(${138 + i * 44},62)`}>
              <rect width="32" height="32" rx="3" fill="#0C0C0E" stroke="url(#qg)" strokeWidth="1.4" />
              <rect x="5" y="5" width="8" height="8" fill="rgba(255,68,82,.85)" />
              <rect x="19" y="5" width="8" height="8" fill="rgba(255,68,82,.55)" />
              <rect x="5" y="19" width="8" height="8" fill="rgba(255,68,82,.55)" />
              <rect x="19" y="19" width="4" height="4" fill="rgba(255,68,82,.85)" />
            </g>
          ))}
          <rect x="138" y="112" width="124" height="12" rx="6" fill="#0C0C0E" stroke="rgba(255,68,82,.35)" />
          <path d="M146 118 h60" stroke="rgba(255,68,82,.8)" strokeWidth="3" strokeLinecap="round" />
          <rect x="150" y="160" width="100" height="10" rx="5" fill="url(#qs)" stroke="rgba(160,164,172,.4)" />
          <rect x="188" y="170" width="24" height="30" fill="url(#qs)" />
          <rect x="164" y="200" width="72" height="7" rx="3.5" fill="url(#qs)" stroke="rgba(160,164,172,.4)" />
        </svg>
      );
    case "printer":
      return (
        <svg {...common} aria-label="3D Manufacturing">
          {defs("p")}
          <path d="M120 60 h160 M120 60 v130 M280 60 v130 M120 190 h160" stroke="rgba(160,164,172,.5)" strokeWidth="3" />
          <rect x="150" y="150" width="100" height="14" fill="url(#ps)" stroke="rgba(160,164,172,.4)" />
          <path d="M200 60 v34" stroke="rgba(160,164,172,.5)" strokeWidth="3" />
          <path d="M190 94 h20 l-4 14 h-12 z" fill="url(#pg)" />
          <path d="M200 112 v30" stroke="rgba(255,68,82,.9)" strokeWidth="2" strokeDasharray="3 4" />
          <g stroke="url(#pg)" strokeWidth="2" fill="rgba(193,18,31,.12)">
            <path d="M175 150 l25 -13 25 13 -25 13 z" />
            <path d="M175 150 v-11 l25 -13 v11 z" opacity=".7" />
            <path d="M225 150 v-11 l-25 -13 v11 z" opacity=".5" />
          </g>
          <path d="M96 200 h56 M248 200 h56" stroke="rgba(160,164,172,.35)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "laser":
      return (
        <svg {...common} aria-label="Laser Engraving">
          {defs("l")}
          <rect x="110" y="150" width="180" height="30" rx="4" fill="url(#ls)" stroke="rgba(160,164,172,.5)" />
          <rect x="176" y="52" width="48" height="34" rx="6" fill="url(#ls)" stroke="rgba(160,164,172,.5)" />
          <path d="M200 86 L200 150" stroke="rgba(255,68,82,.95)" strokeWidth="2.5" />
          <path d="M200 86 L188 150 M200 86 L212 150" stroke="rgba(255,68,82,.3)" strokeWidth="1.5" />
          <circle cx="200" cy="150" r="7" fill="rgba(255,158,166,.9)" />
          <circle cx="200" cy="150" r="16" stroke="rgba(255,68,82,.4)" strokeWidth="1.5" />
          <path d="M140 165 q10 -8 20 0 t20 0" stroke="url(#lg)" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M232 165 h34" stroke="url(#lg)" strokeWidth="2" strokeLinecap="round" />
          <path d="M120 60 h30 M120 74 h20 M264 60 h24 M256 74 h32" stroke="rgba(160,164,172,.35)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...common} aria-label="Custom AI Solutions">
          {defs("a")}
          {[[200, 70], [130, 120], [270, 120], [165, 185], [235, 185], [200, 128]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === 5 ? 16 : 9} fill={i === 5 ? "rgba(193,18,31,.2)" : "#151517"} stroke="url(#ag)" strokeWidth="2" />
          ))}
          <g stroke="rgba(255,68,82,.45)" strokeWidth="1.5">
            <path d="M200 79 L200 112 M138 115 L186 125 M262 115 L214 125 M172 178 L192 142 M228 178 L208 142 M139 127 L158 178 M261 127 L242 178" />
          </g>
          <circle cx="200" cy="128" r="6" fill="rgba(255,150,158,.95)" />
          <circle cx="200" cy="128" r="30" stroke="rgba(255,68,82,.2)" strokeWidth="1" />
          <circle cx="200" cy="128" r="46" stroke="rgba(255,68,82,.1)" strokeWidth="1" />
        </svg>
      );
  }
}

/* ============================================================
   HOOKS + UI
   ============================================================ */

function useInView(threshold = 0.16) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setV(true); o.disconnect(); }
    }, { threshold });
    o.observe(el);
    return () => o.disconnect();
  }, [threshold]);
  return [ref, v];
}

const FINE_POINTER = typeof matchMedia !== "undefined" &&
  matchMedia("(pointer:fine)").matches &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches;

function useTilt() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !FINE_POINTER) return;
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        const ry = (px - 0.5) * 7, rx = (py - 0.5) * -6;
        el.style.transform = `perspective(950px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-5px)`;
        el.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
        el.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transition = "transform .6s cubic-bezier(.2,.7,.2,1)";
      el.style.transform = "";
      setTimeout(() => { el.style.transition = ""; }, 620);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => { el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave); cancelAnimationFrame(raf); };
  }, []);
  return ref;
}

function ProductMedia({ p }) {
  return p.image
    ? <img src={p.image} alt={p.name} loading="lazy" decoding="async" />
    : <ProductArt type={p.art} />;
}

function ProductCard({ p, i, onOpen, onQuote, onBuy }) {
  const [inRef, inView] = useInView();
  const tiltRef = useTilt();
  const [expanding, setExpanding] = useState(false);
  const open = () => {
    setExpanding(true);
    setTimeout(() => onOpen(p.id), 240);
  };
  return (
    <div ref={inRef} className={"reveal" + (inView ? " in" : "")} style={{ transitionDelay: (i % 5) * 90 + "ms", height: "100%" }}>
      <article ref={tiltRef} className={"pcard" + (expanding ? " expanding" : "")}>
        <div className="pborder" aria-hidden="true" />
        <div className="spot" aria-hidden="true" />
        <div className="pcard-art"><ProductMedia p={p} /></div>
        <div className="pbody">
          <h3>{p.name}</h3>
          <p className="outcome">{p.outcome}</p>
          <div className="minichips">
            {p.features.slice(0, 4).map(f => <span className="minichip" key={f}>{f}</span>)}
            {p.buy && p.weightG > 0 && <span className="minichip">⚖ {fmtWeight(p.weightG)}</span>}
          </div>
          {p.addOns && p.addOns.length > 0 && (
            <div className="minichips">
              {p.addOns.map(a => (
                <span className="minichip" key={a.name} style={{ borderColor: "rgba(255,68,82,.4)", color: "var(--cyan)" }}>
                  + {a.name} · ${a.price}
                </span>
              ))}
            </div>
          )}
          <div className="prow">
            <span className="price-from">{p.buy ? "Price" : "From"}</span>
            <span className="price">${p.price.toLocaleString()}</span>
          </div>
          <div className="pbtns">
            <button className="btn ghost" onClick={open}>Learn More</button>
            {p.buy
              ? (p.inStock
                ? <button className="btn solid" onClick={() => onBuy(p.id)}>Add to Cart</button>
                : <button className="btn solid oos" disabled>Not in stock</button>)
              : <button className="btn solid" onClick={() => onQuote(p.id)}>Add to Quote</button>}
          </div>
        </div>
      </article>
    </div>
  );
}

function SectionHead({ eyebrow, title, sub }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={"sec-head reveal" + (inView ? " in" : "")}>
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}


const fmtWeight = (g) => (g >= 1000 ? ((g / 1000).toFixed(1).replace(/\.0$/, "") + " kg") : g + " g");

/* 3D glass carousel — products orbit a ring as thin translucent panes.
   A light reflection sweeps across each pane as it travels (driven by the
   pane's angle, so it reads as a real reflection). Drag, arrows, or click a
   side pane to spin it to the front; idles into a slow rotation. */
function GlassCarousel({ products, onOpen, onQuote, onBuy }) {
  const n = products.length;
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const rot = useRef(0);        // current ring angle (radians)
  const target = useRef(0);     // eased toward this
  const lastTouch = useRef(0);
  const drag = useRef(null);
  const [front, setFront] = useState(0);
  const step = n > 0 ? (Math.PI * 2) / n : 0;

  useEffect(() => {
    rot.current = 0; target.current = 0; setFront(0);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, prev = performance.now();
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(50, now - prev); prev = now;
      if (!reduced && n > 1 && !drag.current && now - lastTouch.current > 5200) {
        target.current -= step * (dt / 7000); // ambient spin: one pane every ~7s
      }
      rot.current += (target.current - rot.current) * Math.min(1, dt * 0.0055);
      const stage = stageRef.current;
      if (!stage) return;
      const R = Math.min(stage.clientWidth * 0.37, 430);
      let bestI = 0, bestC = -2;
      for (let i = 0; i < n; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const th = i * step + rot.current;
        const s = Math.sin(th), c = Math.cos(th);
        const d = (c + 1) / 2; // 1 = front, 0 = back
        if (c > bestC) { bestC = c; bestI = i; }
        el.style.transform =
          "translate(-50%,-50%) translate3d(" + (s * R).toFixed(1) + "px,0,0)" +
          " rotateY(" + (-s * 26).toFixed(2) + "deg) scale(" + (0.58 + 0.42 * d).toFixed(3) + ")";
        el.style.zIndex = String(10 + Math.round(d * 100));
        el.style.opacity = (0.34 + 0.66 * d).toFixed(3);
        el.style.setProperty("--shine", ((s * 62) + 50).toFixed(1) + "%");
        el.classList.toggle("front", c > 0.94);
      }
      setFront(f => (f === bestI ? f : bestI));
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [n, step]);

  const snap = () => { target.current = Math.round(target.current / step) * step; };
  const spin = (dir) => { lastTouch.current = performance.now(); target.current += dir * step; snap(); };
  const toFront = (i) => {
    lastTouch.current = performance.now();
    target.current = -i * step + Math.PI * 2 * Math.round((rot.current + i * step) / (Math.PI * 2));
  };

  const onDown = (e) => {
    lastTouch.current = performance.now();
    drag.current = { x: e.clientX, start: target.current, moved: false };
    stageRef.current && stageRef.current.classList.add("dragging");
  };
  const onMove = (e) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 6) drag.current.moved = true;
    target.current = drag.current.start + (dx / 260) * step;
  };
  const dragEndAt = useRef(0);
  const onUp = () => {
    if (!drag.current) return;
    if (drag.current.moved) dragEndAt.current = performance.now();
    drag.current = null;
    lastTouch.current = performance.now();
    stageRef.current && stageRef.current.classList.remove("dragging");
    snap();
  };
  const cardClick = (i) => () => {
    // ignore the phantom click that follows a drag release
    if (performance.now() - dragEndAt.current < 250) return;
    if (i === front) onOpen(products[i].id);
    else toFront(i);
  };

  if (!n) return <div className="store-soon">No products in this category yet — check back soon.</div>;
  const fp = products[front] || products[0];

  return (
    <div className="carousel-wrap">
      <div
        ref={stageRef} className="gstage"
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
      >
        {products.map((p, i) => (
          <article
            key={p.id}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="gcard"
            onClick={cardClick(i)}
          >
            <div className="gart"><ProductMedia p={p} /></div>
            <div className="gname">{p.name}</div>
            <div className="gprice">{p.buy ? "" : "from "}${Number(p.price).toLocaleString()} CAD</div>
          </article>
        ))}
        {n > 1 && (
          <>
            <button className="gnav prev" aria-label="Previous product" onClick={() => spin(1)}>‹</button>
            <button className="gnav next" aria-label="Next product" onClick={() => spin(-1)}>›</button>
          </>
        )}
      </div>
      <div className="gdetail slim" key={fp.id}>
        {fp.buy && fp.weightG > 0 && (
          <div className="gships">Ships from BC · {fmtWeight(fp.weightG)}{fp.boxL ? ` · ${fp.boxL}×${fp.boxW}×${fp.boxH} cm box` : ""}</div>
        )}
        <div className="pbtns">
          <button className="btn ghost" onClick={() => onOpen(fp.id)}>Learn More</button>
          {fp.buy
            ? (fp.inStock
              ? <button className="btn solid" onClick={() => onBuy(fp.id)}>Add to Cart</button>
              : <button className="btn solid oos" disabled>Not in stock</button>)
            : <button className="btn solid" onClick={() => onQuote(fp.id)}>Add to Quote</button>}
        </div>
      </div>
    </div>
  );
}

const BUSINESS_TYPES = ["Small business owner", "Shop / retail storefront", "Online store", "Commercial business", "Government", "Indigenous organization", "Non-profit", "Other"];

/* "Software & Hardware" tab — a custom-build inquiry. Composes an email with
   the answers so it lands straight in the inbox as a quote request. */
function CustomBuildForm({ email }) {
  const [what, setWhat] = useState("");
  const [reqs, setReqs] = useState("");
  const [biz, setBiz] = useState(BUSINESS_TYPES[0]);
  const submit = () => {
    const body = encodeURIComponent(
      "Hi Ink Athletic,\n\nI'd like a quote for a custom build.\n\n" +
      "WHAT I'M LOOKING TO CREATE:\n" + what.trim() + "\n\n" +
      "REQUIREMENTS:\n" + (reqs.trim() || "—") + "\n\n" +
      "BUSINESS TYPE: " + biz + "\n\nThanks!"
    );
    window.location.href = "mailto:" + email + "?subject=" + encodeURIComponent("Custom build inquiry — quote request") + "&body=" + body;
  };
  return (
    <div className="buildform">
      <h3>Built to order</h3>
      <p className="bf-sub">Custom software, hardware, and AI — engineered around your business. Tell us what you have in mind and we'll reply with a spec and a quote.</p>
      <div className="field">
        <label>What are you looking to create?</label>
        <textarea rows={3} value={what} onChange={e => setWhat(e.target.value)}
          placeholder="e.g. An AI kiosk for my storefront, a booking system, an automation for my shop…" />
      </div>
      <div className="field">
        <label>What are your requirements?</label>
        <textarea rows={3} value={reqs} onChange={e => setReqs(e.target.value)}
          placeholder="Features, hardware, timeline, budget range — anything we should know." />
      </div>
      <div className="field">
        <label>What kind of business are you?</label>
        <select value={biz} onChange={e => setBiz(e.target.value)}>
          {BUSINESS_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <button className="btn solid bf-btn" onClick={submit} disabled={!what.trim()}>Submit for a quote</button>
      <div className="bf-note">Opens your email app with everything filled in — just press send.</div>
    </div>
  );
}

/* Category "domino": a skewed parallelogram tab with a Tron light racing
   its outline. The spark timing mirrors the CSS ring rotation, so when the
   light rounds a corner, 2–6 dust motes burst off that exact corner. */
const PILL_T = 6000; // ring lap time (ms) — keep in sync with --rt below
function CatPill({ label, on, onClick, index }) {
  const ref = useRef(null);
  const [burst, setBurst] = useState([]);
  const idc = useRef(0);
  const delay = index * 750;
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, prevA = null;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const el = ref.current;
      if (!el) return;
      const w = el.offsetWidth, h = el.offsetHeight;
      if (!w || !h) return;
      const aTR = Math.atan2(w / 2, h / 2) * 180 / Math.PI;
      const corners = [
        { a: aTR, x: w, y: 0 }, { a: 180 - aTR, x: w, y: h },
        { a: 180 + aTR, x: 0, y: h }, { a: 360 - aTR, x: 0, y: 0 }
      ];
      const cur = (35 + 360 * ((((now - delay) % PILL_T) + PILL_T) % PILL_T) / PILL_T) % 360;
      if (prevA !== null && prevA !== cur) {
        for (const c of corners) {
          const crossed = prevA < cur ? (c.a > prevA && c.a <= cur) : (c.a > prevA || c.a <= cur);
          if (crossed) {
            const n = 2 + Math.floor(Math.random() * 5);
            setBurst(list => {
              const add = [];
              for (let j = 0; j < n; j++) {
                const ang = Math.atan2(c.y - h / 2, c.x - w / 2) + (Math.random() - 0.5) * 1.2;
                const dist = 14 + Math.random() * 26;
                add.push({
                  id: ++idc.current, x: c.x, y: c.y,
                  dx: Math.cos(ang) * dist, dy: Math.sin(ang) * dist - 8,
                  s: 1.5 + Math.random() * 2.2, dur: 0.7 + Math.random() * 0.8
                });
              }
              return [...list.slice(-28), ...add];
            });
          }
        }
      }
      prevA = cur;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [delay]);
  return (
    <button ref={ref} className={"cat-pill" + (on ? " on" : "")} style={{ "--rd": (-delay / 1000) + "s" }} onClick={onClick}>
      <span className="cp-ring" aria-hidden="true" />
      <span className="cp-label">{label}</span>
      <span className="cp-dust" aria-hidden="true">
        {burst.map(p => (
          <span key={p.id} className="dust"
            style={{ left: p.x + "px", top: p.y + "px", width: p.s + "px", height: p.s + "px", "--dx": p.dx + "px", "--dy": p.dy + "px", animationDuration: p.dur + "s" }}
            onAnimationEnd={() => setBurst(l => l.filter(q => q.id !== p.id))} />
        ))}
      </span>
    </button>
  );
}

function Storefront({ site, products, onOpen, onQuote, onBuy }) {
  const hasShop = products.some(p => p.buy);
  const cats = CATEGORIES; // every category gets a pill; empty ones show a "check back soon" note
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? products : products.filter(p => (p.category || "") === cat);
  return (
    <section id="store">
      <SectionHead eyebrow={site.storeEyebrow} title={site.storeTitle} sub={site.storeSub} />
      {cats.length > 1 && (
        <div className="cat-row">
          {["All", ...cats].map((c, i) => (
            <CatPill key={c} label={c} on={cat === c} onClick={() => setCat(c)} index={i} />
          ))}
        </div>
      )}
      {cat === "Software & Hardware"
        ? <CustomBuildForm email={site.email} />
        : <GlassCarousel key={cat} products={list} onOpen={onOpen} onQuote={onQuote} onBuy={onBuy} />}
      {!hasShop && site.storeSoon && (
        <div className="store-soon">{site.storeSoon}</div>
      )}
    </section>
  );
}

/* ============================================================
   HOW IT WORKS — a chained metal scroll. The section is a single
   metal plate button; click it and the face tips off while the
   step cards unfold downward one after another (chain links at
   each card's top corners, faint ancient glyphs in the metal).
   Click again and it folds back up from the bottom.
   ============================================================ */

/* Hand-daubed marks after cave paintings & hieroglyphs: ibex, hunter,
   handprint, sun-spiral, eye, snake, ibis, river-run. Loose strokes,
   rendered twice — a dark groove plus a hot glowing pass — so they read
   as etched into the steel. */
/* Glyph library after the Göbekli Tepe reliefs — Pillar 43's vulture,
   scorpion and handbag trio, the H-pictogram, fox, boar, aurochs skull,
   descending snake, crane, spider, leopard, headless man, disk-and-
   crescent, duck row. Loose wobbly strokes; .fine = thin detail cuts. */
const GLYPHS = [
  /* vulture, wings spread */
  <g><path d="M38 32c4 1 6.5 5 6 10-.5 4-3 7-6.5 8" /><path d="M38 32c-1-4 1-7 4-7 2.5 0 4 2 3.5 4.5l-2 2" /><path d="M36 34c-6-2-10.5-6.5-11.5-12" /><path d="M44 36c6.5-1 11.5-4.5 13.5-10" /><path className="fine" d="M24.5 23l4 .5M26.5 27.5l4.5 .5M29.5 31.5l4.5 1M57.5 27l-4 .5M55.5 31l-4.5 .5M52.5 34.5l-4.5 1" /><path d="M37 50l-2.5 8.5M40.5 50l1 8.5" /><path className="fine" d="M34.5 58.5l-2.5 2M34.5 58.5l2 2.5M41.5 58.5l-2 2.5M41.5 58.5l2.5 2" /><circle className="fine" cx="42" cy="27.5" r=".9" /></g>,
  /* scorpion */
  <g><path d="M28 46c2.5-2.5 6-3.5 9.5-3M37.5 43c3.5-.5 7 .5 9.5 2.5" /><path d="M26 44c-4-1-7-4-7-8M19 36c0-2.5 2-4 4.5-4M28 42c-3-2-4.5-5-3.5-8" /><path d="M47 45c4 2 6.5 5 6.5 9s-2 7-5 8" /><path d="M48.5 62c-2 .5-4-.5-4.5-2.5" /><path className="fine" d="M44 59.5l-2.5 2.5" /><path className="fine" d="M31 46l-3 5M35 47l-2 5.5M39 47.5l-1 5.5M43 47l1 5M30 44l-4.5 3M46 45l3.5 4" /><path className="fine" d="M33 43.5l.5 3M37 43l.5 3M41 43.5l.5 3" /></g>,
  /* leaping fox */
  <g><path d="M22 46c6-6 14-8 22-6" /><path d="M44 40c3-.5 5.5.5 6.5 3 .8 2-.3 4-2.5 4.5L44 48" /><path className="fine" d="M45 39l-1-4M48.5 39.5l.5-4" /><path d="M27 45l-3 6 4 1M34 46l-2 6 4 .5M41 47l-1 6M46 48l1 5.5" /><path d="M22 46c-5 1-8 5-8 10 0 3 2 5 4.5 5" /><path className="fine" d="M15 52.5l3 1M14 56.5l3 .5" /><circle className="fine" cx="47.5" cy="43" r=".9" /></g>,
  /* boar */
  <g><path d="M24 44c2-6 8-9 15-9 8 0 14 4 15 10 .5 4-2 7-6 7H30c-4 0-6.5-3.5-6-8z" /><path d="M54 45c3 0 5 1.5 5 3.5s-2 3.5-4.5 3.5" /><path className="fine" d="M56 48.5h3" /><path className="fine" d="M53 50.5c1.5 1 3 .8 4-.5" /><path d="M30 52l-1 8M36 52l0 8M44 52l0 8M50 52l1 8" /><path className="fine" d="M28 38l-2-3M33 36l-1-3.5M39 35l0-3.5M45 36l1-3.5M50 38l2-3" /><circle className="fine" cx="49" cy="42" r="1" /><path className="fine" d="M24 44c-2-1-3-3-2-5" /></g>,
  /* aurochs skull */
  <g><path d="M32 34c0 8 3 14 8 14s8-6 8-14" /><path d="M36 44l4 6 4-6" /><path d="M32 34c-6-2-9-8-7-14M48 34c6-2 9-8 7-14" /><path className="fine" d="M25 20l2 3M55 20l-2 3" /><circle className="fine" cx="36.5" cy="38" r="1" /><circle className="fine" cx="43.5" cy="38" r="1" /><path className="fine" d="M38.5 48l1 1M41.5 48l-1 1" /></g>,
  /* descending snake */
  <g><path d="M40 14c-5 4-5 9 0 13s5 9 0 13-5 9 0 13" /><path d="M36.5 53.5L40 61l3.5-7.5" /><path className="fine" d="M40 14l-1.5-3M40 14l1.5-3" /><path className="fine" d="M37.5 20l2 1M40.5 24.5l2 1M37.5 31l2 1M40.5 35.5l2 1M37.5 42l2 1M40.5 46.5l2 1" /><circle className="fine" cx="39" cy="56" r=".8" /></g>,
  /* crane */
  <g><path d="M32 40c2-5 7-7 12-6 4 .8 6 4 5 8-.8 3-3.5 5-7 5h-6" /><path d="M46 36c2-4 2-8 0-12-1.5-3 .5-6 3-6" /><path className="fine" d="M49 18l5.5 1.5" /><path d="M36 47l-1 14M42 47l0 14" /><path className="fine" d="M35 61l-3 2M35 61l3 2M42 61l-3 2M42 61l3 2" /><circle className="fine" cx="48.5" cy="20.5" r=".8" /><path className="fine" d="M34 42c3-2 7-2.5 10-1.5" /></g>,
  /* spider */
  <g><circle cx="40" cy="42" r="6" /><circle cx="40" cy="32" r="3.5" /><path d="M34 40l-10-6M34 44l-10 2M35 47l-8 7M37 48l-3 9M46 40l10-6M46 44l10 2M45 47l8 7M43 48l3 9" /><path className="fine" d="M38 41l4 3M42 41l-4 3" /></g>,
  /* the H pictogram */
  <g><path d="M32 26v28M48 26v28M32 40h16" /><path className="fine" d="M29 26h6M45 26h6M29 54h6M45 54h6" /></g>,
  /* disk and crescent */
  <g><circle cx="40" cy="34" r="8" /><path d="M27 50c4 5 12 7 19 4 4-1.7 6.5-4 7.5-7-3.5 2.5-8 3.5-13 2.5-5.5-1-10.5-1.5-13.5.5z" /><path className="fine" d="M40 22.5v-4M49 26l2.5-3M31 26l-2.5-3" /></g>,
  /* headless man */
  <g><path d="M40 28v22" /><path d="M40 34l-9 6M40 34l9 6" /><path d="M40 50l-7 12M40 50l7 12" /><path className="fine" d="M37 27h6" /><path className="fine" d="M31 40l-3 .5M31 40l-1 3M49 40l3 .5M49 40l1 3" /></g>,
  /* three handbags (Pillar 43) */
  <g><path d="M16 40h12v10H16zM34 40h12v10H34zM52 40h12v10H52z" /><path d="M18 40c0-5 8-5 8 0M36 40c0-5 8-5 8 0M54 40c0-5 8-5 8 0" /><path className="fine" d="M19 45h6M37 45h6M55 45h6" /></g>,
  /* leopard, tail over back */
  <g><path d="M24 48c3-6 10-9 17-8 6 .9 10 4.5 9 9-.7 3.5-3.5 5.5-7.5 5.5H31c-4.5 0-7.5-3-7-6.5z" /><path d="M50 44c3-1.5 6-.5 7 2 .8 2-.5 4-3 4.5l-4 .5" /><path className="fine" d="M51 43l-.5-3M54.5 44l1-2.5" /><path d="M24 48c-3-6-1-12 4-15" /><path d="M29 54l-1 7M36 55l0 6M44 55l0 6M50 54l1 7" /><circle className="fine" cx="32" cy="46" r="1" /><circle className="fine" cx="38" cy="44" r="1" /><circle className="fine" cx="44" cy="46" r="1" /><circle className="fine" cx="35" cy="50" r="1" /><circle className="fine" cx="41" cy="50" r="1" /><circle className="fine" cx="55" cy="47.5" r=".8" /></g>,
  /* duck row on water */
  <g><path d="M14 46c2-3 6-3.5 8-1 1.5 2 .5 4.5-2 5.5l-6 2c-2-2-2-4.5 0-6.5zM34 46c2-3 6-3.5 8-1 1.5 2 .5 4.5-2 5.5l-6 2c-2-2-2-4.5 0-6.5zM54 46c2-3 6-3.5 8-1 1.5 2 .5 4.5-2 5.5l-6 2c-2-2-2-4.5 0-6.5z" /><path className="fine" d="M21 44c1.5-2 1-4-.5-5M41 44c1.5-2 1-4-.5-5M61 44c1.5-2 1-4-.5-5" /><path className="fine" d="M12 58c4-2 8-2 12 0s8 2 12 0 8-2 12 0 8 2 12 0" /></g>
];

/* One etched glyph with a slow "LED inside" pulse, occasionally letting
   off a burst of 4-9 magic dust motes at random intervals. */
function GlyphMark({ m, open }) {
  const [dust, setDust] = useState([]);
  const idc = useRef(0);
  useEffect(() => {
    if (!open) { setDust([]); return; }
    let alive = true, t = 0;
    const loop = () => {
      t = setTimeout(() => {
        if (!alive) return;
        const n = 4 + Math.floor(Math.random() * 6); // 4-9 motes
        setDust(list => {
          const add = [];
          for (let j = 0; j < n; j++) {
            const ang = Math.random() * Math.PI * 2;
            add.push({
              id: ++idc.current,
              x: 25 + Math.random() * 50, y: 25 + Math.random() * 50,
              dx: Math.cos(ang) * (10 + Math.random() * 24),
              dy: -(12 + Math.random() * 30),
              s: 1.5 + Math.random() * 2.4,
              dur: 0.9 + Math.random() * 1.2
            });
          }
          return [...list.slice(-24), ...add];
        });
        loop();
      }, 1800 + Math.random() * 5200);
    };
    loop();
    return () => { alive = false; clearTimeout(t); };
  }, [open]);
  return (
    <span className="sglyph" aria-hidden="true"
      style={{ left: m.x + "px", top: m.y + "px", width: m.size + "px", height: m.size + "px" }}>
      <span className="g-rot" style={{ transform: "rotate(" + m.rot + "deg) scaleX(" + (m.flip ? -1 : 1) + ")" }}>
        <span className="g-heat" style={{ animationDelay: (m.delay * 1.3) + "s" }}><svg viewBox="0 0 80 80">{GLYPHS[m.g]}</svg></span>
        <span className="g-lip"><svg viewBox="0 0 80 80">{GLYPHS[m.g]}</svg></span>
        <span className="g-edge" style={{ animationDelay: m.delay + "s", animationDuration: m.dur + "s" }}><svg viewBox="0 0 80 80">{GLYPHS[m.g]}</svg></span>
        <span className="g-core"><svg viewBox="0 0 80 80">{GLYPHS[m.g]}</svg></span>
      </span>
      {dust.map(p => (
        <span key={p.id} className="dust ember"
          style={{ left: p.x + "%", top: p.y + "%", width: p.s + "px", height: p.s + "px", "--dx": p.dx + "px", "--dy": p.dy + "px", animationDuration: p.dur + "s" }}
          onAnimationEnd={() => setDust(l => l.filter(q => q.id !== p.id))} />
      ))}
    </span>
  );
}

function ProcessCard({ s, i, open, total }) {
  const delay = open ? i * 0.22 : (total - 1 - i) * 0.14;
  const cardRef = useRef(null);
  const numRef = useRef(null);
  const txtRef = useRef(null);
  const [marks, setMarks] = useState([]);
  // Measure the card and its text block, then scatter large glyphs anywhere
  // on the card EXCEPT a 10px halo around the number + paragraph, with no
  // glyph-on-glyph overlap. Re-runs on resize.
  const placedRef = useRef(false);
  useEffect(() => {
    const place = () => {
      const card = cardRef.current, txt = txtRef.current, num = numRef.current;
      if (!card || !txt || !num) return false;
      const cr = card.getBoundingClientRect();
      // content-visibility:auto keeps off-screen sections unmeasured (0-size);
      // placement must wait until the card is actually rendered.
      if (cr.width < 60 || cr.height < 60) return false;
      // Exclusion halo from the ACTUAL text elements (h3 + p + number badge),
      // not their wrapper column (which stretches the full card width).
      const parts = [num, txt.querySelector("h3"), txt.querySelector("p")].filter(Boolean);
      let exl = Infinity, ext = Infinity, exr = -Infinity, exb = -Infinity;
      for (const el of parts) {
        const r = el.getBoundingClientRect();
        exl = Math.min(exl, r.left); ext = Math.min(ext, r.top);
        exr = Math.max(exr, r.right); exb = Math.max(exb, r.bottom);
      }
      const ex = { l: exl - cr.left - 10, t: ext - cr.top - 10, r: exr - cr.left + 10, b: exb - cr.top + 10 };
      const placed = [];
      const target = 4 + Math.floor(Math.random() * 4); // 4-7 marks
      // Shuffled pool -> every glyph on a card is unique.
      const pool = GLYPHS.map((_, gi) => gi);
      for (let k = pool.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [pool[k], pool[j]] = [pool[j], pool[k]]; }
      const tryPlace = (minS, maxS, budget) => {
        for (let tries = 0; placed.length < target && tries < budget; tries++) {
          const size = minS + Math.pow(Math.random(), 1.5) * (maxS - minS);
          if (size > cr.height * 1.3) continue;
          // Marks may overhang the card edge by up to 35% — the card clips
          // them, so they "stop at the border" like worn stone carvings.
          const over = size * 0.35;
          const x = -over + Math.random() * (cr.width - size + over * 2);
          const y = -over + Math.random() * (cr.height - size + over * 2);
          if (!(x + size < ex.l || x > ex.r || y + size < ex.t || y > ex.b)) continue; // in text halo
          let ok = true;
          for (const p of placed) {
            if (!(x + size + 5 < p.x || x > p.x + p.size + 5 || y + size + 5 < p.y || y > p.y + p.size + 5)) { ok = false; break; }
          }
          if (!ok) continue;
          placed.push({
            x, y, size,
            g: pool[placed.length % pool.length],
            rot: (Math.random() - 0.5) * 50,
            flip: Math.random() < 0.5,
            delay: Math.random() * 4,
            dur: 3.4 + Math.random() * 2.8
          });
        }
      };
      tryPlace(60, 160, 320);         // monumental marks first
      if (placed.length < 4) tryPlace(32, 76, 240); // smaller cuts fill the gaps
      setMarks(placed);
      placedRef.current = placed.length > 0;
      return placed.length > 0;
    };
    let t = 0, tries = 0;
    const attempt = () => {
      if (placedRef.current) return;
      if (!place() && tries++ < 8) t = setTimeout(attempt, 250);
    };
    if (open || !placedRef.current) attempt();
    const onR = () => { clearTimeout(t); placedRef.current = false; tries = 0; t = setTimeout(attempt, 250); };
    addEventListener("resize", onR);
    return () => { removeEventListener("resize", onR); clearTimeout(t); };
  }, [open]);
  return (
    <div className="scardwrap">
      <div ref={cardRef} className={"scard" + (open ? " sopen" : "")} style={{ transitionDelay: delay + "s" }}>
        <span className="hinge" aria-hidden="true"><i className="pin" /><i className="rod" /><i className="pin" /></span>
        {marks.map((m, k) => <GlyphMark key={k} m={m} open={open} />)}
        <div className="num" ref={numRef}>{i + 1}</div>
        <div className="scard-txt" ref={txtRef}>
          <h3>{s.t}</h3>
          <p>{s.d}</p>
        </div>
      </div>
    </div>
  );
}

function Process({ site }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  return (
    <section id="process">
      <div style={{ width: "100%" }}>
        <div className="sec-head"><div className="eyebrow" style={{ justifyContent: "center" }}>{site.processEyebrow}</div></div>
        <div className="scrollbox">
          <button className={"scrollbtn" + (open ? " sopen" : "")} onClick={() => setOpen(o => !o)} aria-expanded={open}>
            <span className="sb-under"><span>{site.processTitle}</span><em>{open ? "fold it back up" : ""}</em></span>
            <span className="sb-face"><span>{site.processTitle}</span><em>tap to unroll</em></span>
          </button>
          <div ref={wrapRef} className={"scrollwrap" + (open ? " sopen" : "")}>
            {site.process.map((s, i) => (
              <ProcessCard key={s.t + i} s={s} i={i} open={open} total={site.process.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Founder({ site }) {
  const f = site.founder || {};
  const [ref, inView] = useInView(0.15);
  const cardRef = useRef(null);
  const frameRef = useRef(null);
  const initials = (f.name || "").trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const photo = f.photo || "/founder.jpg"; // bundled default; CMS URL overrides

  // Scroll-driven reveal: the photo's position tracks scroll. Fully out when the
  // bio card is off-center, fully in when centered; reverses smoothly when
  // scrolling past in either direction. Mobile slides up; desktop slides left.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transform = "none";
      return;
    }
    // Continuous loop: each frame compute where the photo SHOULD be from the
    // scroll position, then ease the actual position toward it. No CSS
    // transitions involved, so there is nothing to fight the scroll — motion
    // stays fluid in both directions with a slight, pleasing lag.
    let raf = 0, cur = 108, prev = performance.now();
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(50, now - prev); prev = now;
      const card = cardRef.current, frame = frameRef.current;
      if (!card || !frame) return;
      const r = card.getBoundingClientRect();
      const vh = innerHeight || 1;
      if (r.bottom < -80 || r.top > vh + 80) return; // far off-screen: skip work
      const center = r.top + r.height / 2;
      const dist = Math.abs(center - vh / 2);
      const hold = vh * 0.16;                       // fully-in zone around center
      const span = vh * 0.40 + r.height * 0.15;     // travel distance to fully-out
      let p = 1 - Math.max(0, dist - hold) / span;
      p = Math.max(0, Math.min(1, p));
      p = p * p * (3 - 2 * p); // ease the curve itself
      const target = (1 - p) * 108;
      cur += (target - cur) * Math.min(1, dt * 0.014); // smooth pursuit
      if (Math.abs(target - cur) < 0.05) cur = target;
      const off = cur.toFixed(2) + "%";
      frame.style.transform = innerWidth <= 760 ? `translateY(${off})` : `translateX(${off})`;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="team">
      <div style={{ width: "100%" }}>
        <SectionHead eyebrow={f.eyebrow} title={f.heading} />
        <div ref={(el) => { ref.current = el; cardRef.current = el; }} className={"team-card reveal" + (inView ? " in" : "")}>
          <div className="tronmask">
            <div className="tronframe" ref={frameRef}>
              <div className="team-photo">
                {photo
                  ? <img src={photo} alt={f.name || "Founder"} loading="lazy" />
                  : <div className="team-ph"><span>{initials || "IA"}</span><em>Photo coming soon</em></div>}
              </div>
            </div>
          </div>
          <div className="team-info">
            <h3>{f.name}</h3>
            <div className="team-role">{f.role}</div>
            <p>{f.bio}</p>
            {f.email && <a className="btn ghost team-mail" href={"mailto:" + f.email}>{f.email}</a>}
          </div>
        </div>
      </div>
    </section>
  );
}

function OrbCinema({ site }) {
  const canvasRef = useRef(null);
  const logoRef = useRef(null);
  const heroRef = useRef(null);
  const heroTitleRef = useRef(null);
  const cinemaRef = useRef(null);
  const tagline = (site.titleLine.split("—")[1] || site.titleLine).trim();

  useEffect(() => {
    let cleanup = null;
    const raf = requestAnimationFrame(() => {
      // one frame later: hero text is already painted before the engine builds
      // its 60 shards + 7 procedural textures and starts the render loop
      cleanup = startOrbEngine(canvasRef.current, {
        logoEl: logoRef.current, heroEl: heroRef.current, heroTitleEl: heroTitleRef.current
      }, cinemaRef.current);
    });
    const io = new IntersectionObserver(es => es.forEach(e =>
      e.target.classList.toggle("in", e.isIntersecting)), { threshold: 0.35 });
    cinemaRef.current.querySelectorAll(".reveal").forEach(el => io.observe(el));
    return () => { cancelAnimationFrame(raf); if (cleanup) cleanup(); io.disconnect(); };
  }, []);

  return (
    <>
      <canvas id="gl" ref={canvasRef} />
      <div id="logo" ref={logoRef} aria-hidden="true">
        <div className="rays" />
        <div className="rays r2" />
        <div className="lockup">
          <img className="lgimg" src="/logo.png" alt="Ink Athletic Ltd." />
          <div className="rule"><div className="beam" /></div>
          <div className="tagline">{tagline}</div>
        </div>
      </div>

      <div ref={cinemaRef}>
        <section className="hero">
          <div className="hero-inner" ref={heroRef}>
            <div className="eyebrow">{site.titleLine}</div>
            <h1 ref={heroTitleRef}>{site.heroH1a}<span className="ghost">{site.heroH1b}</span></h1>
            <div className="hero-sub">
              <p>{site.heroSub1}<strong>{site.heroStrong}</strong>{site.heroSub2}</p>
              <div className="hint">{site.hint}</div>
            </div>
          </div>
        </section>

        {site.caps.map((c, i) => (
          <section className="tall" key={i}>
            <div className={"cap reveal" + (i === 1 ? " right" : "")}>
              <div className="glass">
                <span className="k">{c.k}</span>
                <h2>{c.h}</h2>
                <p>{c.p}</p>
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

function ProductPage({ p, products, onBack, onOpen, onQuote, onBuy, site }) {
  useEffect(() => { window.scrollTo(0, 0); }, [p.id]);
  const related = products.filter(x => x.id !== p.id).slice(0, 3);
  return (
    <div className="ppage">
      <AmbientBG />
      <button className="pp-back" onClick={onBack}>← Back to store</button>
      <div className="pp-grid">
        <div className="pp-art"><ProductMedia p={p} /></div>
        <div className="pp-info">
          <h1>{p.name}</h1>
          <p className="pp-outcome">{p.outcome}</p>
          <p className="pp-line">{p.line}</p>
          <div className="pp-price">
            <span className="price-from">{p.buy ? "Price" : "Starting from"}</span>
            <span className="price">${p.price.toLocaleString()}</span>
          </div>
          {p.buy && p.weightG > 0 && (
            <div className="pp-ship">Ships from BC · {fmtWeight(p.weightG)}{p.boxL ? ` · ${p.boxL}×${p.boxW}×${p.boxH} cm box` : ""}</div>
          )}
          <div className="chiplist">
            {p.features.map(f => <span className="chip" key={f}>{f}</span>)}
          </div>
          {p.addOns && p.addOns.length > 0 && (
            <div className="chiplist">
              {p.addOns.map(a => (
                <span className="chip" key={a.name}>+ {a.name} — ${a.price}</span>
              ))}
            </div>
          )}
          <div className="pp-cta">
            {p.buy
              ? (p.inStock
                ? <button className="btn solid" onClick={() => onBuy(p.id)}>Add to Cart</button>
                : <button className="btn solid oos" disabled>Not in stock</button>)
              : <button className="btn solid" onClick={() => onQuote(p.id)}>Add to Quote</button>}
            <a className="btn ghost" style={{ textDecoration: "none" }}
               href={"mailto:" + site.email + "?subject=" + encodeURIComponent(p.name + " — inquiry")}>Ask a question</a>
          </div>
        </div>
      </div>
      <div className="related">
        <h2>More from the store</h2>
        <div className="pgrid">
          {related.map((r, i) => (
            <ProductCard key={r.id} p={r} i={i} onOpen={onOpen} onQuote={onQuote} />
          ))}
        </div>
      </div>
    </div>
  );
}

function QuoteDrawer({ open, items, onClose, onRemove, email }) {
  const total = items.reduce((s, it) => s + it.p.price * it.qty, 0);
  const body = encodeURIComponent(
    "Hi Ink Athletic,\n\nI'd like a quote for:\n" +
    items.map(it => `• ${it.p.name} × ${it.qty}`).join("\n") +
    "\n\nThanks!"
  );
  return (
    <>
      <div className={"scrim" + (open ? " open" : "")} onClick={onClose} />
      <aside className={"drawer" + (open ? " open" : "")} aria-hidden={!open}>
        <button className="close" onClick={onClose} aria-label="Close quote panel">✕</button>
        <h3>Quote Request</h3>
        <div className="sub">No payment — we reply with a tailored quote</div>
        {items.length === 0 && <div className="qempty">Nothing here yet. Add a product from the store.</div>}
        {items.map(it => (
          <div className="qitem" key={it.p.id}>
            <div>
              <div className="qn">{it.p.name}</div>
              <div className="qm">Qty {it.qty} · from ${(it.p.price * it.qty).toLocaleString()}</div>
            </div>
            <button onClick={() => onRemove(it.p.id)} aria-label={"Remove " + it.p.name}>✕</button>
          </div>
        ))}
        {items.length > 0 && (
          <div className="qitem" style={{ borderBottom: "none" }}>
            <div className="qn">Estimated from</div>
            <div className="qn">${total.toLocaleString()}</div>
          </div>
        )}
        <a className="btn solid" href={"mailto:" + email + "?subject=Quote%20request&body=" + body}
           style={{ opacity: items.length ? 1 : 0.4, pointerEvents: items.length ? "auto" : "none" }}>
          Request Quote
        </a>
      </aside>
    </>
  );
}

const PROVINCES = ["BC", "AB", "SK", "MB", "ON", "QC", "NB", "NS", "PE", "NL", "YT", "NT", "NU"];

function CartDrawer({ open, items, subtotal, cart, onClose, onSetQty, onRemove, onPay, busy }) {
  const [step, setStep] = useState("cart");            // cart → ship
  const [addr, setAddr] = useState({ postalCode: "", city: "", province: "BC" });
  const [rates, setRates] = useState(null);            // null = not fetched
  const [ratesBusy, setRatesBusy] = useState(false);
  const [ratesErr, setRatesErr] = useState("");
  const [chosen, setChosen] = useState("");

  // Reset the flow whenever the drawer closes or the cart contents change.
  useEffect(() => { if (!open) { setStep("cart"); setRates(null); setChosen(""); setRatesErr(""); } }, [open]);
  useEffect(() => { setRates(null); setChosen(""); }, [JSON.stringify(cart)]);

  const fetchRates = async () => {
    if (!addr.postalCode.trim()) { setRatesErr("Please enter your postal code."); return; }
    setRatesBusy(true); setRatesErr(""); setRates(null); setChosen("");
    try {
      const res = await fetch("/api/shipping-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, address: addr })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(data.rates) && data.rates.length) {
        setRates(data.rates);
        setChosen(data.rates[0].serviceToken);
      } else {
        setRatesErr(data.error || data.note || "No rates found — double-check the postal code.");
      }
    } catch (e) {
      setRatesErr("Network error fetching rates. Please try again.");
    } finally {
      setRatesBusy(false);
    }
  };

  const chosenRate = (rates || []).find(r => r.serviceToken === chosen);
  const total = subtotal + (chosenRate ? chosenRate.amount : 0);

  return (
    <>
      <div className={"scrim" + (open ? " open" : "")} onClick={onClose} />
      <aside className={"drawer" + (open ? " open" : "")} aria-hidden={!open}>
        <button className="close" onClick={onClose} aria-label="Close cart">✕</button>
        <h3>Your Cart</h3>
        <div className="sub">{step === "cart" ? "Ships anywhere in Canada" : "Shipping to Canada — pick a service"}</div>
        {items.length === 0 && <div className="qempty">Your cart is empty. Add a product from the store.</div>}

        {step === "cart" && items.map(it => (
          <div className="qitem" key={it.p.id}>
            <div>
              <div className="qn">{it.p.name}</div>
              <div className="qm">${Number(it.p.price).toLocaleString()} each</div>
            </div>
            <div className="qty">
              <button onClick={() => onSetQty(it.p.id, it.qty - 1)} aria-label="Decrease quantity">−</button>
              <span>{it.qty}</span>
              <button onClick={() => onSetQty(it.p.id, it.qty + 1)} aria-label="Increase quantity">+</button>
              <button className="qty-x" onClick={() => onRemove(it.p.id)} aria-label={"Remove " + it.p.name}>✕</button>
            </div>
          </div>
        ))}

        {step === "ship" && items.length > 0 && (
          <div className="shipbox">
            <div className="field"><label>Postal code</label>
              <input value={addr.postalCode} placeholder="V6B 1A1" autoFocus
                onChange={e => setAddr(a => ({ ...a, postalCode: e.target.value.toUpperCase() }))}
                onKeyDown={e => { if (e.key === "Enter") fetchRates(); }} /></div>
            <div className="shiprow">
              <div className="field"><label>City</label>
                <input value={addr.city} placeholder="Vancouver" onChange={e => setAddr(a => ({ ...a, city: e.target.value }))} /></div>
              <div className="field"><label>Province</label>
                <select value={addr.province} onChange={e => setAddr(a => ({ ...a, province: e.target.value }))}>
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select></div>
            </div>
            <button className="btn ghost" style={{ width: "100%" }} onClick={fetchRates} disabled={ratesBusy}>
              {ratesBusy ? "Getting rates…" : (rates ? "Refresh rates" : "Get shipping rates")}
            </button>
            {ratesErr && <div className="shiperr">{ratesErr}</div>}
            {rates && rates.map(r => (
              <label className={"rateopt" + (chosen === r.serviceToken ? " on" : "")} key={r.serviceToken}>
                <input type="radio" name="shiprate" checked={chosen === r.serviceToken} onChange={() => setChosen(r.serviceToken)} />
                <span className="ratename">{r.carrier} — {r.service}</span>
                <span className="ratemeta">{r.days ? `~${r.days} bd` : ""}</span>
                <span className="rateamt">${r.amount.toFixed(2)}</span>
              </label>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div style={{ marginTop: "auto" }}>
            <div className="qitem" style={{ borderBottom: "none" }}>
              <div className="qn">{chosenRate ? "Total (with shipping)" : "Subtotal"}</div>
              <div className="qn">${total.toLocaleString(undefined, { minimumFractionDigits: chosenRate ? 2 : 0 })}</div>
            </div>
            {step === "cart" ? (
              <button className="btn solid" style={{ width: "100%" }} onClick={() => setStep("ship")}>Continue to shipping</button>
            ) : (
              <button className="btn solid" style={{ width: "100%", opacity: busy || !chosenRate ? 0.6 : 1 }}
                onClick={() => onPay(addr, chosen)} disabled={busy || !chosenRate}>
                {busy ? "Starting secure payment…" : "Pay with card"}
              </button>
            )}
            {step === "ship" && (
              <button className="btn ghost" style={{ width: "100%", marginTop: 8 }} onClick={() => setStep("cart")}>Back to cart</button>
            )}
          </div>
        )}
      </aside>
    </>
  );
}

/* ============================================================
   SOCIAL PYRAMID — 3-sided pyramid, one face per network, spun
   with buttons/swipe. Faces pop apart mid-turn revealing gears;
   glowing circuit traces race along the 15px seam bevels.
   Geometry: base 300, height 280 → face slant 293 @ 17.2°,
   seam edges 329 @ 31.7°, face inradius 86.6, vertex radius 173.2.
   ============================================================ */

function SocialGlyph({ net, paint, children }) {
  const c = paint || "currentColor";
  if (net === "instagram") return (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8">
      {children}
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1.2" fill={c} stroke="none" />
    </svg>
  );
  if (net === "facebook") return (
    <svg viewBox="0 0 24 24" fill={c}>
      {children}
      <path d="M13.5 21v-7h2.6l.4-3h-3V9.1c0-.87.24-1.46 1.5-1.46h1.6V5.06c-.28-.04-1.23-.12-2.33-.12-2.31 0-3.89 1.41-3.89 4v2.06H7.8v3h2.58v7h3.12z" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" fill={c}>
      {children}
      <path d="M16.6 3c.35 1.88 1.55 3.14 3.4 3.36v2.62c-1.27.05-2.42-.32-3.55-1.06v5.87c0 3.6-2.5 5.71-5.42 5.71-2.8 0-5.03-2.1-5.03-5.03 0-2.9 2.3-5.02 5.36-4.9v2.7c-.3-.06-.6-.09-.9-.06-1.24.1-2.06 1-2.06 2.26 0 1.32 1.02 2.32 2.33 2.32 1.4 0 2.34-1 2.34-2.6V3h3.53z" />
    </svg>
  );
}

/* Embossed metal glyph: shadow + highlight underlays, then a top copy
   painted with an animated brushed-steel gradient (a light band slowly
   sweeps across the metal), plus a breathing red glow. */
function EmbossGlyph({ net, uid }) {
  const gid = "mg-" + uid;
  return (
    <span className="emboss" aria-hidden="true">
      <span className="lg-sh"><SocialGlyph net={net} /></span>
      <span className="lg-hi"><SocialGlyph net={net} /></span>
      <span className="lg-main">
        <SocialGlyph net={net} paint={"url(#" + gid + ")"}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#767A83" />
              <stop offset="0.30" stopColor="#EDEFF4" />
              <stop offset="0.46" stopColor="#8E939D" />
              <stop offset="0.60" stopColor="#FFD9DC" />
              <stop offset="0.74" stopColor="#A7ACB6" />
              <stop offset="1" stopColor="#5B5E66" />
              <animateTransform attributeName="gradientTransform" type="translate" values="-0.7 0;0.7 0;-0.7 0" dur="6.5s" repeatCount="indefinite" />
            </linearGradient>
          </defs>
        </SocialGlyph>
      </span>
    </span>
  );
}

/* Open a social profile the polite way per device. Desktop: new window,
   site stays. Mobile: navigate in-place — the OS's app links intercept it
   straight into the IG/TikTok/FB app with NO leftover blank tab, and the
   site tab is still here when the user comes back. */
function openSocial(url) {
  if (!url) return;
  const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (mobile) location.href = url;
  else window.open(url, "_blank", "noopener");
}

const PYR_NETS = [
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "facebook", label: "Facebook" }
];

/* Hover "fairy dust": tiny glowing motes spawn under the pointer, drift
   upward, and dissolve. Lives inside the face so the triangle clips it. */
function DustLayer({ active = true, w = 300, h = 293, k = 1 }) {
  const [dust, setDust] = useState([]);
  const idRef = useRef(0);
  const lastSpawn = useRef(0);
  const wrapRef = useRef(null);
  const spawnAt = (x, y, n = 1) => {
    setDust(list => {
      const add = [];
      for (let j = 0; j < n; j++) {
        add.push({
          id: ++idRef.current,
          x: x + (Math.random() - 0.5) * 18 * k,
          y: y + (Math.random() - 0.5) * 18 * k,
          dx: (Math.random() - 0.5) * 52 * k,
          dy: -(26 + Math.random() * 52) * k,
          s: (k < 0.6 ? 1.5 + Math.random() * 2.2 : 2 + Math.random() * 3.5),
          dur: 1 + Math.random() * 1.2
        });
      }
      return [...list.slice(-36), ...add];
    });
  };
  const toLocal = (e) => {
    const r = wrapRef.current.getBoundingClientRect();
    return [(e.clientX - r.left) * (w / Math.max(1, r.width)), (e.clientY - r.top) * (h / Math.max(1, r.height))];
  };
  const onMove = (e) => {
    if (!active || !wrapRef.current) return;
    const now = performance.now();
    if (now - lastSpawn.current < 40) return;
    lastSpawn.current = now;
    const [x, y] = toLocal(e);
    spawnAt(x, y);
  };
  const onEnter = (e) => {
    if (!active || !wrapRef.current) return;
    const [x, y] = toLocal(e);
    spawnAt(x, y, 7);
  };
  const remove = (id) => setDust(list => list.filter(p => p.id !== id));
  return (
    <span ref={wrapRef} className="dustlayer" onPointerMove={onMove} onPointerEnter={onEnter}>
      {dust.map(p => (
        <span key={p.id} className="dust"
          style={{ left: p.x + "px", top: p.y + "px", width: p.s + "px", height: p.s + "px", "--dx": p.dx + "px", "--dy": p.dy + "px", animationDuration: p.dur + "s" }}
          onAnimationEnd={() => remove(p.id)} />
      ))}
    </span>
  );
}

function SocialPyramid({ site }) {
  const [steps, setSteps] = useState(0);
  const [turning, setTurning] = useState(false);
  const turnT = useRef(null);
  const swipe = useRef(null);
  const socials = site.socials || {};
  const front = ((-steps) % 3 + 3) % 3;

  const turn = (dir) => {
    setSteps(s => s + dir);
    setTurning(true);
    clearTimeout(turnT.current);
    turnT.current = setTimeout(() => setTurning(false), 950);
  };
  useEffect(() => () => clearTimeout(turnT.current), []);

  const onDown = (e) => { swipe.current = { x: e.clientX }; };
  const onUp = (e) => {
    if (!swipe.current) return;
    const dx = e.clientX - swipe.current.x;
    swipe.current = null;
    if (dx > 42) turn(1); else if (dx < -42) turn(-1);
  };
  const open = (i) => openSocial(socials[PYR_NETS[i].key]);

  return (
    <section className="socialpyr" id="social">
      <SectionHead eyebrow="Follow along" title="Find Us" sub="Spin the pyramid — tap a face to visit us." />
      <div className="sp-stage" onPointerDown={onDown} onPointerUp={onUp} onPointerLeave={onUp}>
        <div className={"pyr" + (turning ? " turning" : "")} style={{ "--rot": (steps * 120) + "deg" }}>
          <div className="pyr-rotor">
            {PYR_NETS.map((net, i) => (
              <button
                key={net.key}
                className={"pface pf" + i + (front === i ? " isfront" : "")}
                style={{ "--fa": (i * 120) + "deg" }}
                onClick={() => front === i && open(i)}
                aria-label={"Open our " + net.label}
                tabIndex={front === i ? 0 : -1}
              >
                <span className="pf-logo"><EmbossGlyph net={net.key} uid={"pyr-" + net.key} /></span>
                <span className="pf-tag">@inkathletic</span>
                <DustLayer active={front === i} />
              </button>
            ))}
            {[0, 1, 2].map(i => <div key={i} className={"pseam ps" + i} style={{ "--sa": (60 + i * 120) + "deg" }} />)}
          </div>
        </div>
        <button className="gnav prev" aria-label="Spin left" onClick={() => turn(1)}>‹</button>
        <button className="gnav next" aria-label="Spin right" onClick={() => turn(-1)}>›</button>
      </div>
      <div className="sp-current" key={front}>{PYR_NETS[front].label} — tap the face to open</div>
    </section>
  );
}

/* ============================================================
   SUSTAINABILITY — local-first computing, lighter footprint.
   ============================================================ */

/* Scroll-grown bonsai. A seed drops from beneath the nav, then scrolling
   the page drives growth: a procedurally generated trunk (fresh randomness
   every visit) S-curves upward, branches recurse with staggered growth
   windows, buds appear along limbs, and foliage pads bloom at the tips —
   all with a gentle living sway. Organic by construction, not by keyframe. */
function GreenBG() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, DPR = 1, raf = 0, killed = false;
    let tree = null, baseX = 0, baseY = 0, unit = 900;
    let seedStart = performance.now();
    let treeSeed = Math.floor(Math.random() * 1e9);
    const sparks = [];
    const sm = (t) => t * t * (3 - 2 * t);
    // seeded rng: the same tree survives mobile URL-bar resizes; a fresh
    // seed is only planted when the life-cycle loops back to the seed.
    const mkRnd = (s0) => { let s = s0 | 0; return () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };

    /* fine bark texture pattern (flecks + short fissures) */
    let barkPat = null;
    const mkBark = () => {
      const c = document.createElement("canvas"); c.width = c.height = 46;
      const b = c.getContext("2d");
      const r = mkRnd(1234567);
      for (let i = 0; i < 60; i++) {
        const dk = r() < 0.72;
        b.strokeStyle = dk ? "rgba(24,18,12," + (0.10 + r() * 0.22).toFixed(2) + ")" : "rgba(205,190,166," + (0.05 + r() * 0.09).toFixed(2) + ")";
        b.lineWidth = 0.5 + r() * 1.1;
        const x = r() * 46, y = r() * 46, len = 2 + r() * 7, dx = (r() - 0.5) * 2.5;
        b.beginPath(); b.moveTo(x, y); b.quadraticCurveTo(x + dx, y + len * 0.5, x + dx * 0.4, y + len); b.stroke();
      }
      barkPat = ctx.createPattern(c, "repeat");
    };

    /* leaf sprites: pointed leaves with a midrib, five light buckets */
    const leafSprites = [];
    const leafColRGB = (k) => [Math.round(20 + 112 * k), Math.round(66 + 148 * k), Math.round(38 + 110 * k)];
    const mkLeafSprites = () => {
      leafSprites.length = 0;
      for (let bkt = 0; bkt < 5; bkt++) {
        const k = bkt / 4;
        const s = 28, cv = document.createElement("canvas");
        cv.width = s; cv.height = 16;
        const c = cv.getContext("2d");
        const [r0, g0b, b0] = leafColRGB(Math.max(0, k - 0.12));
        const [r1, g1b, b1] = leafColRGB(Math.min(1, k + 0.22));
        const grad = c.createLinearGradient(2, 0, s - 2, 0);
        grad.addColorStop(0, "rgb(" + r0 + "," + g0b + "," + b0 + ")");
        grad.addColorStop(1, "rgb(" + r1 + "," + g1b + "," + b1 + ")");
        c.fillStyle = grad;
        c.beginPath();
        c.moveTo(2, 8);
        c.quadraticCurveTo(s * 0.38, 0.5, s - 2, 8);
        c.quadraticCurveTo(s * 0.38, 15.5, 2, 8);
        c.closePath(); c.fill();
        c.strokeStyle = "rgba(10,30,16,.4)"; c.lineWidth = 0.9;
        c.beginPath(); c.moveTo(3, 8); c.lineTo(s - 4, 8); c.stroke();
        leafSprites.push(cv);
      }
    };

    const build = () => {
      const rnd = mkRnd(treeSeed);
      const J = (a, b) => a + rnd() * (b - a);
      unit = Math.min(H, 1100);
      baseY = H * 0.86;
      const style = Math.floor(rnd() * 4);
      const wind = rnd() < 0.5 ? -1 : 1;
      baseX = (W > 760 ? W * 0.60 : W * 0.5) - (style === 3 ? wind * unit * 0.05 : 0);
      const branches = [], pads = [], grass = [], nodes = [], spine = [];

      const segAngles = [];
      if (style === 0) { const s0 = rnd() < 0.5 ? 1 : -1; segAngles.push(J(-0.08, 0.08), s0 * J(0.35, 0.55), -s0 * J(0.3, 0.5), s0 * J(0.2, 0.35)); }
      else if (style === 1) { segAngles.push(wind * J(0.4, 0.55), wind * J(0.5, 0.65), wind * J(0.35, 0.5), wind * J(0.45, 0.6)); }
      else if (style === 2) { segAngles.push(wind * J(0.5, 0.65), wind * J(0.7, 0.85), wind * J(0.8, 0.95), wind * J(0.9, 1.05)); }
      else { segAngles.push(wind * -0.12, wind * J(0.7, 0.9), wind * J(1.9, 2.2), wind * J(2.4, 2.7)); }
      const segLens = style === 3 ? [0.22, 0.16, 0.16, 0.15] : [0.25, 0.20, 0.155, 0.125];
      let sx = baseX, sy = baseY - unit * 0.006, sw = unit * 0.05, gC = 0.02;
      for (let i = 0; i < 4; i++) {
        const ang = segAngles[i], len = unit * segLens[i];
        const bend = (rnd() - 0.5) * 0.3;
        const a1 = ang + bend * 0.5, a2 = ang + bend;
        const mx = sx + Math.sin(a1) * len * 0.55, my = sy - Math.cos(a1) * len * 0.55;
        const ex = mx + Math.sin(a2) * len * 0.45, ey = my - Math.cos(a2) * len * 0.45;
        const g1 = gC + 0.105, w1 = sw * 0.74;
        for (let k = 0; k < 10; k++) {
          const t = k / 10;
          spine.push({
            x: (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * mx + t * t * ex,
            y: (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * my + t * t * ey,
            w: sw + (w1 - sw) * t, g: gC + (g1 - gC) * t
          });
        }
        sx = ex; sy = ey; sw = w1; gC = g1 - 0.012;
        nodes.push({ x: ex, y: ey, ang: a2, g: g1, i });
      }
      spine.push({ x: sx, y: sy, w: sw, g: gC + 0.012 });
      const strands = [];
      for (let i = 0; i < 5; i++) strands.push({ phase: (i / 5) * 6.283 + J(-0.3, 0.3), freq: J(1.6, 2.3), wf: J(0.30, 0.42), tint: J(-0.1, 0.12) });

      const limb = (x, y, ang, len, w0, w1, g0, g1, z, bendMag) => {
        const bend = (rnd() - 0.5) * bendMag;
        const a1 = ang + bend * 0.6, a2 = ang + bend;
        const mx = x + Math.sin(a1) * len * 0.55, my = y - Math.cos(a1) * len * 0.55;
        const ex = mx + Math.sin(a2) * len * 0.45, ey = my - Math.cos(a2) * len * 0.45;
        const pts = [];
        for (let k = 0; k <= 14; k++) {
          const t = k / 14;
          const ix = (1 - t) * (1 - t) * x + 2 * (1 - t) * t * mx + t * t * ex;
          const iy = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * my + t * t * ey;
          const wob = Math.sin(t * 12 + len * 0.8) * w0 * 0.10;
          pts.push([ix + wob, iy]);
        }
        branches.push({ pts, w0, w1: Math.max(0.8, w1), g0, g1, z, tint: J(-0.08, 0.08) });
        return [ex, ey, a2, g1];
      };
      const mkPad = (x, y, rx, ry, z, g0) => {
        const leaves = [];
        const n = Math.round((rx * ry) / 12) + 50;
        for (let i = 0; i < n; i++) {
          const a = rnd() * 6.283, rr = Math.pow(rnd(), 0.65);
          const dx = Math.cos(a) * rx * rr, dy = Math.sin(a) * ry * rr;
          const k = Math.max(0, Math.min(1, 0.55 - (dx / rx) * 0.2 - (dy / ry) * 0.42 + (rnd() - 0.5) * 0.3));
          leaves.push({ dx, dy, rot: rnd() * 6.28, s: unit * (0.0023 + rnd() * 0.0022), g: Math.min(0.985, g0 + rnd() * 0.07), k });
        }
        pads.push({ x, y, rx, ry, z, g0, leaves, ph: rnd() * 6.28, cv: null, popped: false });
      };

      const tierLen = [0.23, 0.19, 0.155, 0.12];
      nodes.forEach((nd, i) => {
        if (i === 0 && style !== 3) return;
        const nP = style === 2 ? 1 : (i < 2 ? 1 : (rnd() < 0.6 ? 1 : 2));
        for (let p = 0; p < nP; p++) {
          const dir = style === 2 ? wind : ((i + p) % 2 ? -1 : 1) * (rnd() < 0.88 ? 1 : -1);
          const bAng = dir * J(1.25, 1.55) + nd.ang * 0.25;
          const bLen = unit * tierLen[Math.min(i, 3)] * J(0.85, 1.15) * (style === 2 ? 1.25 : 1);
          const g0 = nd.g + 0.02;
          const b1 = limb(nd.x, nd.y, bAng, bLen * 0.6, unit * 0.012, unit * 0.006, g0, g0 + 0.085, dir * 0.35, 0.7);
          const b2 = limb(b1[0], b1[1], b1[2] + dir * J(-0.1, 0.35) - 0.12 * dir, bLen * 0.4, unit * 0.006, unit * 0.0028, b1[3] - 0.02, b1[3] + 0.065, dir * 0.35, 0.6);
          const prx = unit * (0.06 + (3 - Math.min(i, 3)) * 0.009) * J(0.9, 1.12);
          mkPad(b2[0], b2[1] - unit * 0.013, prx, prx * 0.42, dir * 0.35, b2[3]);
          if (rnd() < 0.55) mkPad(b1[0] - dir * unit * 0.012, b1[1] - unit * 0.016, prx * 0.62, prx * 0.27, -dir * 0.3, b2[3] + 0.03);
        }
      });
      const top = nodes[3];
      if (style !== 3) {
        [-0.8, -0.15, 0.5].forEach((sa, i) => {
          const t = limb(top.x, top.y, sa + J(-0.12, 0.12), unit * J(0.08, 0.12), unit * 0.008, unit * 0.0035, top.g + 0.02 + i * 0.02, top.g + 0.11 + i * 0.02, (i % 2 ? -0.3 : 0.3), 0.6);
          mkPad(t[0], t[1] - unit * 0.013, unit * J(0.055, 0.075), unit * J(0.026, 0.033), (i % 2 ? -0.3 : 0.3), t[3]);
        });
        mkPad(top.x, top.y - unit * 0.10, unit * 0.095, unit * 0.042, 0.05, Math.min(0.955, top.g + 0.2));
      } else {
        const t = limb(top.x, top.y, wind * 2.8, unit * 0.11, unit * 0.008, unit * 0.0035, top.g + 0.02, top.g + 0.11, 0.2, 0.5);
        mkPad(t[0], t[1] + unit * 0.005, unit * 0.06, unit * 0.028, 0.2, t[3]);
        mkPad(nodes[1].x - wind * unit * 0.022, nodes[1].y - unit * 0.055, unit * 0.066, unit * 0.03, -0.2, nodes[1].g + 0.15);
      }
      for (let i = 0; i < 12; i++) grass.push({ x: baseX + (rnd() - 0.5) * unit * 0.2, l: unit * (0.009 + rnd() * 0.013), a: (rnd() - 0.5) * 0.9, ph: rnd() * 6.28 });

      /* ---- fit the whole tree inside the viewport, any screen ---- */
      let minX = baseX, maxX = baseX, minY = baseY;
      const consider = (x, y) => { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; };
      for (const s of spine) { consider(s.x - s.w * 1.6, s.y); consider(s.x + s.w * 1.6, s.y); }
      for (const b of branches) for (const p of b.pts) consider(p[0], p[1]);
      for (const p of pads) { consider(p.x - p.rx * 1.15, p.y - p.ry * 1.7); consider(p.x + p.rx * 1.15, p.y); }
      const sTop = (baseY - H * 0.05) / Math.max(1, baseY - minY);
      const sL = (baseX - W * 0.03) / Math.max(1, baseX - minX);
      const sR = (W * 0.97 - baseX) / Math.max(1, maxX - baseX);
      const S = Math.min(1, sTop, sL, sR);
      if (S < 1) {
        const fx = (x) => (x - baseX) * S + baseX, fy = (y) => (y - baseY) * S + baseY;
        for (const s of spine) { s.x = fx(s.x); s.y = fy(s.y); s.w *= S; }
        for (const b of branches) { b.w0 *= S; b.w1 *= S; for (const p of b.pts) { p[0] = fx(p[0]); p[1] = fy(p[1]); } }
        for (const p of pads) {
          p.x = fx(p.x); p.y = fy(p.y); p.rx *= S; p.ry *= S;
          for (const l of p.leaves) { l.dx *= S; l.dy *= S; l.s *= S; }
        }
      }
      for (let j = 0; j < spine.length; j++) {
        const a = spine[Math.max(0, j - 1)], b = spine[Math.min(spine.length - 1, j + 1)];
        const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1;
        spine[j].nx = -dy / L; spine[j].ny = dx / L; spine[j].u = j / (spine.length - 1);
      }
      pads.sort((a, b) => a.z - b.z);
      branches.sort((a, b) => a.z - b.z);
      const mand = buildMandala(treeSeed, baseX, baseY - unit * 0.30, Math.min(unit * 0.27, W * 0.42));
      tree = { spine, strands, branches, pads, grass, style, mand };
    };

    const resize = () => {
      const wNew = innerWidth, hNew = innerHeight;
      // mobile URL-bar jitter: ignore small same-width height shrinks so the
      // tree never rebuilds (and never jumps) mid-scroll
      if (W === wNew && H > 0 && hNew <= H && H - hNew < 160) return;
      DPR = Math.min(devicePixelRatio || 1, 2);
      const hUse = (wNew === W && H > 0) ? Math.max(hNew, H) : hNew;
      W = wNew; H = hUse;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      mkBark(); mkLeafSprites();
      build(); // same seed -> same tree, refit to the new bounds
    };

    const strandCol = (depth, tint) => {
      const l = (0.7 + 0.34 * Math.max(0, depth)) * (1 + tint);
      return "rgb(" + Math.round(126 * l) + "," + Math.round(117 * l) + "," + Math.round(103 * l) + ")";
    };

    /* ---- sacred-geometry mandala: ~800 particles swarm from the seed
       into a figure chosen by the tree's seed — a new one every cycle ---- */
    const buildMandala = (seedNum, cx, cy, R) => {
      const r = mkRnd((seedNum ^ 0x51ED270) | 0);
      const type = Math.abs(seedNum) % 6;
      const pts = [];
      const circle = (ox, oy, rr, n) => { for (let i = 0; i < n; i++) { const a = (i / n) * 6.283; pts.push([ox + Math.cos(a) * rr, oy + Math.sin(a) * rr]); } };
      const line = (x0, y0, x1, y1, n) => { for (let i = 0; i <= n; i++) { const t = i / n; pts.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]); } };
      if (type === 0) { // flower of life
        const rr = 1 / 3; const cs = [[0, 0]];
        for (let k = 0; k < 6; k++) { const a = k * 1.0472; cs.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
        for (let k = 0; k < 6; k++) { const a = k * 1.0472; cs.push([Math.cos(a) * 2 * rr, Math.sin(a) * 2 * rr]); }
        for (let k = 0; k < 6; k++) { const a = k * 1.0472 + 0.5236; cs.push([Math.cos(a) * 1.732 * rr, Math.sin(a) * 1.732 * rr]); }
        for (const c of cs) circle(c[0], c[1], rr, 38);
        circle(0, 0, 1, 60);
      } else if (type === 1) { // seed of life
        const rr = 0.5;
        circle(0, 0, rr, 105);
        for (let k = 0; k < 6; k++) { const a = k * 1.0472; circle(Math.cos(a) * rr, Math.sin(a) * rr, rr, 92); }
        circle(0, 0, 1, 120);
      } else if (type === 2) { // metatron's cube
        const rr = 0.2; const cs = [[0, 0]];
        for (let k = 0; k < 6; k++) { const a = k * 1.0472; cs.push([Math.cos(a) * 2 * rr, Math.sin(a) * 2 * rr]); }
        for (let k = 0; k < 6; k++) { const a = k * 1.0472; cs.push([Math.cos(a) * 4 * rr, Math.sin(a) * 4 * rr]); }
        for (const c of cs) circle(c[0], c[1], rr, 24);
        for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) line(cs[i][0], cs[i][1], cs[j][0], cs[j][1], 5);
      } else if (type === 3) { // phyllotaxis (golden-angle sunflower spiral)
        const GA = 2.39996;
        for (let i = 0; i < 660; i++) {
          const rr2 = 0.985 * Math.sqrt(i / 660);
          const a = i * GA;
          pts.push([Math.cos(a) * rr2, Math.sin(a) * rr2]);
        }
        circle(0, 0, 1, 130);
      } else if (type === 4) { // golden spiral
        const b = Math.log(1.618) / 1.5708;
        for (let i = 0; i < 620; i++) { const th = (i / 620) * 12.4; const rr2 = 0.055 * Math.exp(b * th); if (rr2 > 1) break; pts.push([Math.cos(th) * rr2, Math.sin(th) * rr2]); }
        circle(0, 0, 1, 150);
      } else { // torus mandala
        for (let k = 0; k < 16; k++) { const a = k * 0.3927; circle(Math.cos(a) * 0.5, Math.sin(a) * 0.5, 0.5, 48); }
      }
      while (pts.length > 800) pts.splice(Math.floor(r() * pts.length), 1);
      const parts = pts.map((p2) => ({
        tx: cx + p2[0] * R, ty: cy + p2[1] * R,
        delay: r() * 950, ph: r() * 6.28, sz: 0.9 + r() * 1.5
      }));
      return { parts, cx, cy, R, type };
    };
    const drawMandala = (now, time) => {
      const m = tree.mand; if (!m) return;
      const t0 = seedStart + 1150;
      if (!reduced && now < t0) return;
      const sx = baseX, sy = baseY - unit * 0.012;
      ctx.globalCompositeOperation = "lighter";
      const pulse = 0.05 + 0.03 * Math.sin(time * 1.1);
      const aur = ctx.createRadialGradient(m.cx, m.cy, 0, m.cx, m.cy, m.R * 1.15);
      aur.addColorStop(0, "rgba(70,190,121," + pulse.toFixed(3) + ")");
      aur.addColorStop(1, "rgba(70,190,121,0)");
      ctx.fillStyle = aur; ctx.fillRect(m.cx - m.R * 1.2, m.cy - m.R * 1.2, m.R * 2.4, m.R * 2.4);
      for (const p2 of m.parts) {
        const pp = reduced ? 1 : Math.min(1, Math.max(0, (now - t0 - p2.delay) / 1500));
        let x, y, al;
        if (pp < 1) {
          const e = sm(pp);
          const swirl = Math.sin(pp * 6.283 + p2.ph) * 46 * (1 - pp);
          const dx = p2.tx - sx, dy = p2.ty - sy;
          const L = Math.hypot(dx, dy) || 1;
          x = sx + dx * e + (-dy / L) * swirl;
          y = sy + dy * e + (dx / L) * swirl;
          al = 0.55 * (0.3 + 0.7 * pp);
        } else {
          const br = 1 + 0.02 * Math.sin(time * 1.3 + p2.ph);
          x = m.cx + (p2.tx - m.cx) * br;
          y = m.cy + (p2.ty - m.cy) * br;
          al = 0.26 + 0.22 * (0.5 + 0.5 * Math.sin(time * 1.2 + p2.ph));
        }
        ctx.fillStyle = "rgba(124,232,168," + al.toFixed(3) + ")";
        ctx.fillRect(x - p2.sz / 2, y - p2.sz / 2, p2.sz, p2.sz);
      }
      if (!reduced && Math.random() < 0.25 && sparks.length < 110) {
        const p2 = m.parts[Math.floor(Math.random() * m.parts.length)];
        sparks.push({ x: p2.tx, y: p2.ty, vx: (Math.random() - 0.5) * 0.5, vy: -0.2 - Math.random() * 0.5, life: 1, s: 0.8 + Math.random() * 1.6 });
      }
      ctx.globalCompositeOperation = "source-over";
    };
    const drawGround = () => {
      ctx.fillStyle = "rgba(10,14,11,.7)";
      ctx.beginPath(); ctx.ellipse(baseX, baseY + 4, unit * 0.09, unit * 0.011, 0, 0, 6.283); ctx.fill();
    };

    const drawTrunk = (g) => {
      const S = tree.spine;
      let M = 0;
      while (M < S.length - 1 && S[M + 1].g <= g) M++;
      if (M < 1) return;
      ctx.lineCap = "round";
      for (const pass of [-1, 1]) {
        for (const st of tree.strands) {
          for (let j = 0; j < M; j++) {
            const s0 = S[j], s1 = S[j + 1];
            const th0 = s0.u * st.freq * 6.283 + st.phase;
            const th1 = s1.u * st.freq * 6.283 + st.phase;
            const d0 = Math.cos(th0);
            if ((pass < 0 && d0 >= 0) || (pass > 0 && d0 < 0)) continue;
            const flare0 = 1 + Math.max(0, 1 - s0.u * 7) * 1.1;
            const flare1 = 1 + Math.max(0, 1 - s1.u * 7) * 1.1;
            const o0 = Math.sin(th0) * s0.w * 0.55 * flare0;
            const o1 = Math.sin(th1) * s1.w * 0.55 * flare1;
            if (Math.abs(o1 - o0) > (s0.w + s1.w)) continue; // never draw cross-jumps
            const w = Math.max(1, (s0.w * st.wf) * (0.82 + 0.22 * Math.max(0, d0)));
            const x0 = s0.x + s0.nx * o0, y0 = s0.y + s0.ny * o0;
            const x1 = s1.x + s1.nx * o1, y1 = s1.y + s1.ny * o1;
            ctx.strokeStyle = "rgba(24,19,13,.5)"; ctx.lineWidth = w + 1.6;
            ctx.beginPath(); ctx.moveTo(x0 + 0.8, y0 + 1); ctx.lineTo(x1 + 0.8, y1 + 1); ctx.stroke();
            ctx.strokeStyle = strandCol(d0, st.tint); ctx.lineWidth = w;
            ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
            if (barkPat && w > 2.2) {
              ctx.strokeStyle = barkPat; ctx.lineWidth = w * 0.92; ctx.globalAlpha = 0.55;
              ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
              ctx.globalAlpha = 1;
            }
          }
        }
      }
      if (!reduced && S[M].g < 0.97 && g < S[S.length - 1].g && Math.random() < 0.6 && sparks.length < 90) {
        sparks.push({ x: S[M].x + (Math.random() - 0.5) * 8, y: S[M].y, vx: (Math.random() - 0.5) * 0.8, vy: -0.2 - Math.random() * 0.7, life: 1, s: 1 + Math.random() * 1.4 });
      }
    };

    const drawLimb = (b, g) => {
      const t = (g - b.g0) / (b.g1 - b.g0);
      if (t <= 0) return;
      const e = sm(Math.min(1, t));
      const n = b.pts.length - 1;
      const m = Math.max(1, Math.round(e * n));
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      const col = strandCol(0.35, b.tint);
      const L = 5;
      for (let k = 0; k < L; k++) {
        const end = Math.max(1, Math.round(m * (1 - k / L * 0.85)));
        ctx.strokeStyle = col;
        ctx.lineWidth = Math.max(0.7, b.w1 + (b.w0 - b.w1) * ((k + 1) / L));
        ctx.beginPath(); ctx.moveTo(b.pts[0][0], b.pts[0][1]);
        for (let j = 1; j <= end; j++) ctx.lineTo(b.pts[j][0], b.pts[j][1]);
        ctx.stroke();
      }
      if (barkPat && b.w0 > 2.6) {
        ctx.strokeStyle = barkPat; ctx.lineWidth = b.w0 * 0.75; ctx.globalAlpha = 0.45;
        ctx.beginPath(); ctx.moveTo(b.pts[0][0], b.pts[0][1]);
        for (let j = 1; j <= Math.round(m * 0.7); j++) ctx.lineTo(b.pts[j][0], b.pts[j][1]);
        ctx.stroke(); ctx.globalAlpha = 1;
      }
      if (!reduced && e < 1 && Math.random() < 0.4 && sparks.length < 90) {
        const tip = b.pts[m];
        sparks.push({ x: tip[0], y: tip[1], vx: (Math.random() - 0.5) * 0.8, vy: -0.2 - Math.random() * 0.7, life: 1, s: 1 + Math.random() * 1.2 });
      }
    };

    const padCache = (p) => {
      const padPx = 10;
      const cw = Math.ceil(p.rx * 2 + padPx * 2), ch = Math.ceil(p.ry * 2 + padPx * 2 + p.ry);
      const cv = document.createElement("canvas");
      cv.width = Math.max(1, cw * DPR); cv.height = Math.max(1, ch * DPR);
      const c = cv.getContext("2d"); c.setTransform(DPR, 0, 0, DPR, 0, 0);
      const cx = cw / 2, cy = p.ry + padPx;
      c.fillStyle = "rgba(8,24,14,.5)";
      c.beginPath(); c.ellipse(cx, cy + p.ry * 0.35, p.rx * 1.02, p.ry * 0.95, 0, 0, 6.283); c.fill();
      for (const l of p.leaves) {
        const spr = leafSprites[Math.min(4, Math.floor(l.k * 5))];
        const lw = l.s * 3.4, lh = lw * 0.57;
        c.save(); c.translate(cx + l.dx, cy + l.dy); c.rotate(l.rot);
        c.drawImage(spr, -lw / 2, -lh / 2, lw, lh);
        c.restore();
      }
      p.cv = cv; p.cw = cw; p.ch = ch;
    };
    const drawPads = (list, g, time) => {
      for (const p of list) {
        const t = (g - p.g0) / 0.1;
        if (t <= 0) { p.popped = false; continue; }
        const e = sm(Math.min(1, t));
        const sw = reduced ? 0 : Math.sin(time * 0.55 + p.ph) * 1.6;
        if (!p.popped && !reduced) {
          p.popped = true;
          for (let i = 0; i < 7 && sparks.length < 90; i++) sparks.push({ x: p.x + (Math.random() - 0.5) * p.rx, y: p.y, vx: (Math.random() - 0.5) * 1.2, vy: -0.3 - Math.random() * 0.7, life: 1, s: 1 + Math.random() * 1.6 });
        }
        if (g > p.g0 + 0.19) {
          if (!p.cv) padCache(p);
          ctx.drawImage(p.cv, 0, 0, p.cv.width, p.cv.height, p.x - p.cw / 2 + sw, p.y - (p.ry + 10), p.cw, p.ch);
        } else {
          ctx.fillStyle = "rgba(8,24,14," + (0.5 * e).toFixed(3) + ")";
          ctx.beginPath(); ctx.ellipse(p.x + sw, p.y + p.ry * 0.35, p.rx * 1.02 * e, p.ry * 0.95 * e, 0, 0, 6.283); ctx.fill();
          for (const l of p.leaves) {
            if (g < l.g) continue;
            const ls = l.s * sm(Math.min(1, (g - l.g) / 0.045));
            if (ls < 0.25) continue;
            const [r2, g2b, b2] = leafColRGB(l.k);
            ctx.fillStyle = "rgb(" + r2 + "," + g2b + "," + b2 + ")";
            ctx.beginPath(); ctx.ellipse(p.x + l.dx + sw, p.y + l.dy, ls * 1.4, ls * 0.7, l.rot, 0, 6.283); ctx.fill();
          }
        }
      }
    };

    // init AFTER every helper above is defined (build -> buildMandala etc.)
    addEventListener("resize", resize); resize();

    let g = 0, grew = false;
    let prevSeedT = 0, ripple = null;
    const tick = (now) => {
      if (killed) return;
      raf = requestAnimationFrame(tick);
      const time = now / 1000;
      ctx.fillStyle = "#060506"; ctx.fillRect(0, 0, W, H);
      drawAmbient(ctx, W, H, time, scrollY, 1);
      if (!tree) return;
      const max = document.documentElement.scrollHeight - innerHeight;
      const frac = max > 0 ? Math.min(1, scrollY / max) : 0;
      const raw = Math.min(1, frac / 0.8);
      const seedT = reduced ? 1 : Math.min(1, (now - seedStart) / 1100);
      // the instant the essence drop touches down, the page becomes water:
      // capture every visible element so the wavefronts can push them
      if (!reduced && prevSeedT < 1 && seedT >= 1) {
        ripple = {
          t0: now, x: baseX, y: baseY - unit * 0.018, sy0: scrollY,
          els: Array.from(document.querySelectorAll(".eco-card, .greenpage h1, .greenpage h2, .greenpage p, .greenpage a, nav"))
            .filter(el => el.matches(".eco-card") || !el.closest(".eco-card"))
            .map(el => { const r = el.getBoundingClientRect();
              const cs = getComputedStyle(el).transform;
              return { el, cx: r.left + r.width / 2, cy: r.top + r.height / 2, moved: false,
                base: cs && cs !== "none" ? cs + " " : "",
                prevT: el.style.transform, prevTr: el.style.transition }; })
            .filter(e => e.cy > -300 && e.cy < innerHeight + 500)
        };
      }
      prevSeedT = seedT;
      const target = seedT < 1 ? 0 : raw;
      g = reduced ? target : g + (target - g) * 0.07;
      // life-cycle: fully grown + reaching the very bottom -> dissolve upward;
      // returning to the seed after a full grow plants a NEW tree.
      const fade = frac > 0.86 ? 1 - sm(Math.min(1, (frac - 0.86) / 0.13)) : 1;
      if (g > 0.35) grew = true;
      if (grew && g < 0.015) {
        grew = false;
        treeSeed = Math.floor(Math.random() * 1e9);
        seedStart = now;
        sparks.length = 0;
        build();
      }

      drawGround();
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(0, -(1 - fade) * unit * 0.05);
      drawMandala(now, time);
      const gg = Math.min(1, g / 0.1);
      if (gg > 0.01) {
        ctx.strokeStyle = "rgba(70,190,121,.45)"; ctx.lineWidth = 1.2;
        for (const s of tree.grass) {
          const sway = reduced ? 0 : Math.sin(time * 1.2 + s.ph) * 0.06;
          ctx.beginPath(); ctx.moveTo(s.x, baseY);
          ctx.quadraticCurveTo(s.x + Math.sin(s.a + sway) * s.l * 0.6, baseY - s.l * 0.6 * gg, s.x + Math.sin(s.a + sway) * s.l, baseY - s.l * gg);
          ctx.stroke();
        }
      }
      if (seedT < 1 || g < 0.035) {
        const falling = seedT < 1;
        const sy = falling ? 86 + (baseY - unit * 0.018 - 86) * sm(seedT) : baseY - unit * 0.012;
        const glowR = 22 + (reduced ? 0 : Math.sin(time * 2.4) * 5);
        const gl = ctx.createRadialGradient(baseX, sy, 0, baseX, sy, glowR);
        gl.addColorStop(0, "rgba(190,255,220,.7)"); gl.addColorStop(0.45, "rgba(90,220,150,.28)"); gl.addColorStop(1, "rgba(70,190,121,0)");
        ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(baseX, sy, glowR, 0, 6.283); ctx.fill();
        // a drop of essence: luminous teardrop, white heart fading to emerald
        ctx.save(); ctx.translate(baseX, sy);
        const pul = 1 + (reduced ? 0 : Math.sin(time * 3.2) * 0.07);
        ctx.scale(pul, pul);
        ctx.shadowColor = "rgba(120,240,170,.95)"; ctx.shadowBlur = 16;
        const sg = ctx.createRadialGradient(-1, 1.5, 0.4, 0, 1, 8.5);
        sg.addColorStop(0, "rgba(255,255,255,.98)");
        sg.addColorStop(0.35, "rgba(170,255,205,.95)");
        sg.addColorStop(0.78, "rgba(80,205,135,.9)");
        sg.addColorStop(1, "rgba(70,190,121,.35)");
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.moveTo(0, -9.5);
        ctx.quadraticCurveTo(5.4, -1.6, 3.7, 4.4);
        ctx.quadraticCurveTo(2.2, 7.8, 0, 7.8);
        ctx.quadraticCurveTo(-2.2, 7.8, -3.7, 4.4);
        ctx.quadraticCurveTo(-5.4, -1.6, 0, -9.5);
        ctx.closePath(); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,255,255,.95)";
        ctx.beginPath(); ctx.arc(-1.3, -0.6, 1.15, 0, 6.283); ctx.fill();
        ctx.restore();
        // orbiting sparkle motes
        if (!reduced) for (let m = 0; m < 3; m++) {
          const am = time * 2.6 + m * 2.094;
          const mr = 11 + Math.sin(time * 1.7 + m * 1.3) * 2.5;
          const mx = baseX + Math.cos(am) * mr, my = sy + Math.sin(am) * mr * 0.62;
          const ma = 0.45 + 0.4 * Math.sin(time * 3 + m * 2.1);
          ctx.save(); ctx.shadowColor = "rgba(140,250,180,.9)"; ctx.shadowBlur = 6;
          ctx.fillStyle = `rgba(220,255,235,${Math.max(0.15, ma).toFixed(2)})`;
          ctx.beginPath(); ctx.arc(mx, my, 1.3, 0, 6.283); ctx.fill(); ctx.restore();
        }
      }
      drawPads(tree.pads.filter(p => p.z < 0), g, time);
      drawTrunk(g);
      for (const b of tree.branches) drawLimb(b, g);
      drawPads(tree.pads.filter(p => p.z >= 0), g, time);
      ctx.globalCompositeOperation = "lighter";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.vy -= 0.01; s.life -= 0.022;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.fillStyle = "rgba(140,240,175," + (0.5 * s.life).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(s.x, s.y, s.s * s.life, 0, 6.283); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.restore();
      // ---- the page is water: expanding rings + wavefronts that physically
      // push every captured element outward as they pass ----
      if (ripple) {
        const rt = (now - ripple.t0) / 1000;
        if (rt > 2.3) {
          for (const e of ripple.els) { e.el.style.transform = e.prevT || ""; e.el.style.transition = e.prevTr || ""; }
          ripple = null;
        } else {
          // if the user scrolls mid-wave, element positions go stale — let go
          // of the DOM immediately (the rings finish on their own)
          if (ripple.els.length && Math.abs(scrollY - ripple.sy0) > 30) {
            for (const e of ripple.els) { e.el.style.transform = e.prevT || ""; e.el.style.transition = e.prevTr || ""; }
            ripple.els = [];
          }
          const speed = 860, band = 150;
          for (let i = 0; i < 5; i++) {
            const lt = rt - i * 0.13;
            if (lt <= 0) continue;
            const r = 30 + lt * speed;
            const a = Math.max(0, 1 - lt / 1.7) * 0.4 * (1 - i * 0.13);
            if (a <= 0.004) continue;
            // trough (dark), crest (emerald light), sparkle line — reads as water
            ctx.save();
            ctx.lineWidth = 5;
            ctx.strokeStyle = `rgba(8,24,16,${(a * 0.8).toFixed(3)})`;
            ctx.beginPath(); ctx.arc(ripple.x, ripple.y, Math.max(1, r - 7), 0, 6.283); ctx.stroke();
            ctx.lineWidth = 2.2;
            ctx.strokeStyle = `rgba(170,245,205,${a.toFixed(3)})`;
            ctx.shadowColor = "rgba(70,190,121,0.8)"; ctx.shadowBlur = 12;
            ctx.beginPath(); ctx.arc(ripple.x, ripple.y, r, 0, 6.283); ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.lineWidth = 1;
            ctx.strokeStyle = `rgba(255,255,255,${(a * 0.7).toFixed(3)})`;
            ctx.beginPath(); ctx.arc(ripple.x, ripple.y, r + 3, 0, 6.283); ctx.stroke();
            ctx.restore();
          }
          for (const e of ripple.els) {
            const dx = e.cx - ripple.x, dy = e.cy - ripple.y;
            const d = Math.hypot(dx, dy) || 1;
            let off = 0;
            for (let i = 0; i < 5; i++) {
              const lt = rt - i * 0.13;
              if (lt <= 0) continue;
              const r = 30 + lt * speed;
              const u = (d - r) / band;
              if (u > -1 && u < 1) off += Math.cos(u * 1.5708) * Math.max(0, 1 - lt / 1.7) * (13 - i * 2);
            }
            if (Math.abs(off) > 0.05) {
              const ux = dx / d, uy = dy / d;
              e.el.style.transition = "none";
              e.el.style.transform = e.base + `translate3d(${(ux * off).toFixed(1)}px,${(uy * off).toFixed(1)}px,0)`;
              e.moved = true;
            } else if (e.moved) {
              e.el.style.transform = e.base + "translate3d(0,0,0)";
            }
          }
        }
      }
    };
    raf = requestAnimationFrame(tick);
    return () => { killed = true; cancelAnimationFrame(raf); removeEventListener("resize", resize); };
  }, []);
  return <canvas id="gl" ref={ref} />;
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 20c-1-6 1-11 5-14 3.5-2.6 7.5-3 10-2.5.5 2.5.1 6.5-2.5 10-3 4-8 6-12.5 6.5z" />
      <path d="M6 20c2-5 5.5-9 10.5-12" />
    </svg>
  );
}

const ECO_POINTS = [
  {
    t: "Designed to run local",
    d: "Our systems are designed to run locally for our clients — prompts, tokens, and data staying inside your organization, safeguarding its integrity and security while offering a greener approach to AI than routing every request through distant data centres. Private by design, lighter on the planet by default."
  },
  {
    t: "A smaller footprint",
    d: "Every request that stays local is cloud load that never happens. Local-first processing means less energy burned moving data around the planet, less server overhead, and hardware sized for the job — nothing idling in a warehouse on your behalf."
  },
  {
    t: "Built to last",
    d: "We build with premium components rated for years of all-day public use, and we keep supporting what we ship. A longer service life means fewer replacements — and less electronic waste."
  },
  {
    t: "Rooted in this land",
    d: "Ink Athletic is proudly Indigenous-owned. Founder Brandon Cameron is a member of Saulteau First Nations, raised by his grandmother and his father, who taught him the Indigenous ways of working with the land — take only what you need, tend what you have, and leave things better than you found them. That teaching runs through everything we build: technology made with respect for its place, built to last, close to home in Northern BC."
  }
];

function EcoCard({ p, i }) {
  const [ref, inView] = useInView(0.3);
  const cardRef = useRef(null);
  const [burst, setBurst] = useState([]);
  const [marks, setMarks] = useState([]);
  const [hovered, setHovered] = useState(false);
  const idc = useRef(0);
  const placedRef = useRef(false);
  const T = 7000, delay = i * 900;
  const touch = React.useMemo(() => matchMedia("(hover: none)").matches, []);
  const lit = touch ? inView : hovered;
  // Ancient marks for the card: measured around the text like the scroll
  // cards, revealed by hover (desktop) or by scrolling into view (touch).
  useEffect(() => {
    const place = () => {
      const card = cardRef.current;
      if (!card) return false;
      const cr = card.getBoundingClientRect();
      if (cr.width < 60 || cr.height < 60) return false;
      const parts = ["h3", "p", ".eco-leaf"].map(s => card.querySelector(s)).filter(Boolean);
      let exl = Infinity, ext = Infinity, exr = -Infinity, exb = -Infinity;
      for (const el of parts) {
        const r = el.getBoundingClientRect();
        exl = Math.min(exl, r.left); ext = Math.min(ext, r.top);
        exr = Math.max(exr, r.right); exb = Math.max(exb, r.bottom);
      }
      const ex = { l: exl - cr.left - 10, t: ext - cr.top - 10, r: exr - cr.left + 10, b: exb - cr.top + 10 };
      const placed = [];
      const pool = GLYPHS.map((_, gi) => gi);
      for (let k = pool.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [pool[k], pool[j]] = [pool[j], pool[k]]; }
      const target = 2 + Math.floor(Math.random() * 3);
      for (let tries = 0; placed.length < target && tries < 220; tries++) {
        const size = 36 + Math.pow(Math.random(), 1.4) * 52;
        const over = size * 0.3;
        const x = -over + Math.random() * (cr.width - size + over * 2);
        const y = -over + Math.random() * (cr.height - size + over * 2);
        if (!(x + size < ex.l || x > ex.r || y + size < ex.t || y > ex.b)) continue;
        let ok = true;
        for (const q of placed) { if (!(x + size + 5 < q.x || x > q.x + q.size + 5 || y + size + 5 < q.y || y > q.y + q.size + 5)) { ok = false; break; } }
        if (!ok) continue;
        placed.push({ x, y, size, g: pool[placed.length % pool.length], rot: (Math.random() - 0.5) * 50, flip: Math.random() < 0.5, delay: Math.random() * 4, dur: 3.4 + Math.random() * 2.8 });
      }
      setMarks(placed);
      placedRef.current = placed.length > 0;
      return placed.length > 0;
    };
    let t = 0, tries = 0;
    const attempt = () => { if (!placedRef.current && !place() && tries++ < 8) t = setTimeout(attempt, 250); };
    attempt();
    return () => clearTimeout(t);
  }, []);
  // Same corner-synced dust as the store menu's Tron ring, in green.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, prevA = null;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const el = cardRef.current;
      if (!el) return;
      const w = el.offsetWidth, h = el.offsetHeight;
      if (!w || !h) return;
      const aTR = Math.atan2(w / 2, h / 2) * 180 / Math.PI;
      const corners = [
        { a: aTR, x: w, y: 0 }, { a: 180 - aTR, x: w, y: h },
        { a: 180 + aTR, x: 0, y: h }, { a: 360 - aTR, x: 0, y: 0 }
      ];
      const cur = (35 + 360 * ((((now - delay) % T) + T) % T) / T) % 360;
      if (prevA !== null && prevA !== cur) {
        for (const c of corners) {
          const crossed = prevA < cur ? (c.a > prevA && c.a <= cur) : (c.a > prevA || c.a <= cur);
          if (crossed) {
            const n = 3 + Math.floor(Math.random() * 5);
            setBurst(list => {
              const add = [];
              for (let j = 0; j < n; j++) {
                const ang = Math.atan2(c.y - h / 2, c.x - w / 2) + (Math.random() - 0.5) * 1.2;
                const dist = 14 + Math.random() * 26;
                add.push({
                  id: ++idc.current, x: c.x, y: c.y,
                  dx: Math.cos(ang) * dist, dy: Math.sin(ang) * dist - 8,
                  s: 1.5 + Math.random() * 2.2, dur: 0.7 + Math.random() * 0.8
                });
              }
              return [...list.slice(-26), ...add];
            });
          }
        }
      }
      prevA = cur;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [delay]);
  return (
    <div ref={(el) => { ref.current = el; cardRef.current = el; }}
      className={"eco-card reveal" + (inView ? " in" : "") + (i % 2 ? " right" : "")}
      style={{ "--rd": (-delay / 1000) + "s" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <span className="cp-ring eco-ring" aria-hidden="true" />
      <span className={"eg-clip" + (lit ? " lit" : "")} aria-hidden="true">
        {marks.map((m, k) => <GlyphMark key={k} m={m} open={lit} />)}
      </span>
      <span className="eco-leaf"><LeafIcon /></span>
      <h3>{p.t}</h3>
      <p>{p.d}</p>
      <span className="cp-dust" aria-hidden="true">
        {burst.map(b => (
          <span key={b.id} className="dust gd"
            style={{ left: b.x + "px", top: b.y + "px", width: b.s + "px", height: b.s + "px", "--dx": b.dx + "px", "--dy": b.dy + "px", animationDuration: b.dur + "s" }}
            onAnimationEnd={() => setBurst(l => l.filter(q => q.id !== b.id))} />
        ))}
      </span>
    </div>
  );
}

function GreenPage({ site, onBack }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="greenpage">
      <GreenBG />
      <button className="pp-back" onClick={onBack}>← Back to site</button>
      <div className="eco-head">
        <div className="eyebrow eco-eyebrow"><LeafIcon /> Sustainability</div>
        <h1>Green by <em>design.</em></h1>
        <p>Technology that feels like the future shouldn't cost the planet its own. We build local-first — in every sense of the word.</p>
        <div className="eco-hint">Scroll — watch it grow</div>
      </div>
      <div className="eco-grid">
        {ECO_POINTS.map((p, i) => <EcoCard key={i} p={p} i={i} />)}
      </div>
      <div className="eco-cta">
        <p>Curious how a local-first build could work for your business?</p>
        <a className="btn solid" href={"mailto:" + site.email + "?subject=" + encodeURIComponent("Local-first / sustainability question")}>Ask us about it</a>
      </div>
    </div>
  );
}

function Footer({ site, onAdmin, onGreen }) {
  const [ref, inView] = useInView(0.1);
  return (
    <footer>
      <div ref={ref} className={"f-sep" + (inView ? " in" : "")} />
      <div className="f-grid">
        <div className="f-brand">
          <a className="wordmark" href="#top">Ink<span>/</span>Athletic</a>
          <p>{site.footerBlurb}</p>
        </div>
        <div className="f-col">
          <h4>Contact</h4>
          <a href={"mailto:" + site.email}>{site.email}</a>
          <a href="#store">Request a quote</a>
          <a className="eco-link" href="#green" onClick={(e) => { e.preventDefault(); onGreen(); }}><LeafIcon /> Sustainability</a>
        </div>
        <div className="f-col">
          <h4>Social</h4>
          <div className="social-row">
            {["instagram", "facebook", "tiktok"].map(net => (site.socials?.[net]) && (
              <a key={net} className="sicon" href={site.socials[net]} rel="noreferrer"
                onClick={(e) => { e.preventDefault(); openSocial(site.socials[net]); }}
                aria-label={net} title={net.charAt(0).toUpperCase() + net.slice(1)}>
                <EmbossGlyph net={net} uid={"ft-" + net} />
              </a>
            ))}
          </div>
        </div>
        <div className="f-col">
          <h4>Location</h4>
          {site.address && <span>{site.address}</span>}
          <span>{site.city}</span>
          {site.postal && <span>{site.postal}</span>}
          <span>{site.country}</span>
        </div>
      </div>
      <div className="f-bottom">
        <span>© 2026 Ink Athletic Ltd.</span>
        <span>{site.bottomLine}</span>
        <a className="admin-link" href="#admin" onClick={(e) => { e.preventDefault(); onAdmin(); }}>Admin</a>
      </div>
    </footer>
  );
}

/* ============================================================
   NAV (floating glass, active section, progress)
   ============================================================ */

function Nav({ count, cartCount, showCart, onQuoteOpen, onCartOpen, onHome, onGreen, isHome, ready }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const progRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(scrollY > 60);
        if (progRef.current) {
          const d = document.documentElement;
          const max = d.scrollHeight - innerHeight;
          progRef.current.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
        }
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    if (!isHome) { setActive(""); return; }
    const ids = ["store", "process", "contact"];
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-40% 0px -50% 0px" });
    ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [isHome, ready]);

  const jump = (id) => (e) => {
    e.preventDefault();
    if (!isHome) {
      onHome();
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={scrolled ? "scrolled" : ""}>
      <a className="wordmark" href="#top" onClick={(e) => { e.preventDefault(); onHome(); }}>
        <svg className="nmark" viewBox="0 0 98 88" aria-hidden="true">
          <polygon points="43.2,12.6 57.2,12.6 76,84 62,84" fill="#AEB3BC" />
          <polygon points="22,84 36,84 56,8 42,8" fill="#F2F3F5" />
          <polygon points="42,68 56,68 49,52" fill="#FF4650" />
        </svg>
        Ink<span>/</span>Athletic
      </a>
      <div className="links">
        <a className={active === "store" ? "active" : ""} href="#store" onClick={jump("store")}>Store</a>
        <a className={"hidemobile" + (active === "process" ? " active" : "")} href="#process" onClick={jump("process")}>Process</a>
        <a className={"hidemobile" + (active === "contact" ? " active" : "")} href="#contact" onClick={jump("contact")}>Contact</a>
        <a className="eco-link eco-nav" href="#green" onClick={(e) => { e.preventDefault(); onGreen(); }} title="Sustainability"><LeafIcon /><span className="eco-txt">Green</span></a>
        <button className="quote-btn" onClick={onQuoteOpen}>
          Quote{count > 0 && <span className="badge">{count}</span>}
        </button>
        {showCart && (
          <button className="quote-btn" onClick={onCartOpen} aria-label="Open cart">
            Cart{cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
        )}
      </div>
      <div className="navprog" aria-hidden="true"><i ref={progRef} /></div>
    </nav>
  );
}

/* ============================================================
   APP
   ============================================================ */

/* ============================================================
   ADMIN CMS — password-gated product editor.
   Products persist via the artifact's shared key-value storage,
   so edits are visible to every visitor, not just this browser.
   NOTE: this is a client-side password check only — anyone who
   opens dev tools can read it. Fine for keeping casual visitors
   out of the editor; not a substitute for real auth if this ever
   needs to resist a determined bad actor.
   ============================================================ */

function AdminLogin({ onSuccess, onBack }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (busy) return;
    setBusy(true); setErr("");
    const ok = await adminSignIn(email, pw);
    setBusy(false);
    if (ok) onSuccess();
    else setErr(configured ? "Sign-in failed — check email and password." : "Incorrect password.");
  };
  const onKey = (e) => { if (e.key === "Enter") submit(); };
  return (
    <div className="admin-wrap">
      <AmbientBG />
      <div className="admin-card">
        <h2>Admin</h2>
        <div className="sub">Product catalog & site settings</div>
        {err && <div className="admin-error">{err}</div>}
        {configured && (
          <div className="field">
            <label>Email</label>
            <input type="email" autoFocus value={email} onChange={e => setEmail(e.target.value)} onKeyDown={onKey} />
          </div>
        )}
        <div className="field">
          <label>Password</label>
          <input type="password" autoFocus={!configured} value={pw} onChange={e => setPw(e.target.value)} onKeyDown={onKey} />
        </div>
        <div className="admin-form formbtns" style={{ marginTop: 18 }}>
          <button type="button" className="btn solid" onClick={submit} disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
          <button type="button" className="btn ghost" onClick={onBack}>Back to site</button>
        </div>
      </div>
    </div>
  );
}

// Image picker for the admin: upload straight to Supabase Storage (URL box
// stays for pasting a link by hand if ever needed).
function ImageField({ label, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef(null);
  const pick = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true); setErr("");
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (ex) {
      setErr(ex.message || "Upload failed.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="field">
      <label>{label}</label>
      <div className="imgfield">
        {value
          ? <img className="imgthumb" src={value} alt="" />
          : <div className="imgthumb empty">—</div>}
        <div className="imgbtns">
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={pick} />
          <button type="button" className="btn solid small" onClick={() => fileRef.current && fileRef.current.click()} disabled={busy}>
            {busy ? "Uploading…" : (value ? "Replace photo" : "Upload photo")}
          </button>
          {value && <button type="button" className="btn ghost small" onClick={() => onChange("")}>Remove</button>}
        </div>
      </div>
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="…or paste an image URL" style={{ marginTop: 8 }} />
      {err && <div className="admin-error" style={{ marginTop: 8 }}>{err}</div>}
    </div>
  );
}

const emptyDraft = { id: "", name: "", outcome: "", line: "", price: "", features: "", art: "kiosk", addOns: "", image: "", category: CATEGORIES[0], buy: false, inStock: false, weightG: "", boxL: "", boxW: "", boxH: "" };

const numOrEmpty = (v) => (v != null && v !== "" ? String(v) : "");

function productToDraft(p) {
  return {
    id: p.id, name: p.name, outcome: p.outcome, line: p.line, price: String(p.price),
    features: p.features.join(", "), art: p.art,
    addOns: (p.addOns || []).map(a => `${a.name}:${a.price}`).join("; "),
    image: p.image || "",
    category: p.category || CATEGORIES[0],
    buy: !!p.buy,
    inStock: !!p.inStock,
    weightG: numOrEmpty(p.weightG), boxL: numOrEmpty(p.boxL), boxW: numOrEmpty(p.boxW), boxH: numOrEmpty(p.boxH)
  };
}
function draftToProduct(d, fallbackId) {
  return {
    id: d.id || fallbackId,
    name: d.name.trim(),
    outcome: d.outcome.trim(),
    line: d.line.trim(),
    price: Number(d.price) || 0,
    features: d.features.split(",").map(s => s.trim()).filter(Boolean),
    art: d.art,
    image: d.image || null,
    category: d.category || CATEGORIES[0],
    addOns: d.addOns.split(";").map(s => s.trim()).filter(Boolean).map(pair => {
      const [name, price] = pair.split(":");
      return { name: (name || "").trim(), price: Number((price || "0").trim()) || 0 };
    }).filter(a => a.name),
    buy: !!d.buy,
    inStock: !!d.inStock,
    weightG: Number(d.weightG) || 0,
    boxL: Number(d.boxL) || 0, boxW: Number(d.boxW) || 0, boxH: Number(d.boxH) || 0
  };
}

function AdminForm({ draft, setDraft, onSave, onCancel, isNew }) {
  const set = (k) => (e) => setDraft(d => ({ ...d, [k]: e.target.value }));
  return (
    <div className="admin-form">
      <h3>{isNew ? "Add product" : "Edit product"}</h3>
      <div className="grid2">
        <div className="field"><label>Name</label><input value={draft.name} onChange={set("name")} /></div>
        <div className="field"><label>Price ($)</label><input type="number" value={draft.price} onChange={set("price")} /></div>
      </div>
      <div className="field">
        <label>Category (groups products in the store)</label>
        <select value={draft.category} onChange={set("category")}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <ImageField label="Product photo (shown on the card; falls back to the icon below)" value={draft.image}
        onChange={(url) => setDraft(d => ({ ...d, image: url }))} />
      <div className="field"><label>Outcome (bold headline on the card)</label><input value={draft.outcome} onChange={set("outcome")} /></div>
      <div className="field"><label>Description</label><textarea value={draft.line} onChange={set("line")} /></div>
      <div className="field"><label>Features (comma separated)</label><input value={draft.features} onChange={set("features")} /></div>
      <div className="grid2">
        <div className="field">
          <label>Icon</label>
          <select value={draft.art} onChange={set("art")}>
            {ART_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Add-ons — "Name:Price; Name:Price"</label>
          <input value={draft.addOns} onChange={set("addOns")} placeholder="Laser-engraved logo:90" />
        </div>
      </div>
      <h3 style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--line)" }}>Cart &amp; shipping</h3>
      <div className="field" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input type="checkbox" id="buychk" style={{ width: "auto" }} checked={!!draft.buy}
          onChange={(e) => setDraft(d => ({ ...d, buy: e.target.checked }))} />
        <label htmlFor="buychk" style={{ margin: 0 }}>Sell in cart (buyable &amp; shipped). Unchecked = quote-only item.</label>
      </div>
      {draft.buy && (
        <>
          <div className="field" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" id="stockchk" style={{ width: "auto" }} checked={!!draft.inStock}
              onChange={(e) => setDraft(d => ({ ...d, inStock: e.target.checked }))} />
            <label htmlFor="stockchk" style={{ margin: 0 }}>In stock — can actually be purchased. Unchecked shows "Not in stock" and blocks checkout.</label>
          </div>
          <div className="field"><label>Weight (grams) — used to calculate shipping</label>
            <input type="number" value={draft.weightG} onChange={set("weightG")} placeholder="150" /></div>
          <div className="grid2">
            <div className="field"><label>Box length (cm)</label><input type="number" value={draft.boxL} onChange={set("boxL")} placeholder="20" /></div>
            <div className="field"><label>Box width (cm)</label><input type="number" value={draft.boxW} onChange={set("boxW")} placeholder="15" /></div>
          </div>
          <div className="field"><label>Box height (cm)</label><input type="number" value={draft.boxH} onChange={set("boxH")} placeholder="10" /></div>
        </>
      )}
      <div className="formbtns">
        <button className="btn solid" onClick={onSave}>Save</button>
        <button className="btn ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function SiteForm({ site, setSite }) {
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(site)));
  const set = (k) => (e) => setDraft(d => ({ ...d, [k]: e.target.value }));
  const setObj = (obj, k) => (e) => setDraft(d => ({ ...d, [obj]: { ...d[obj], [k]: e.target.value } }));
  const setArr = (arr, i, k) => (e) => setDraft(d => {
    const copy = { ...d, [arr]: d[arr].map((it, j) => j === i ? { ...it, [k]: e.target.value } : it) };
    return copy;
  });
  const save = () => setSite(draft);
  return (
    <div className="siteform">
      <details className="asec" open>
        <summary>Hero &amp; title</summary>
        <div className="asec-body">
          <div className="field"><label>Title line (tab title, hero eyebrow, logo tagline)</label>
            <input value={draft.titleLine} onChange={set("titleLine")} /></div>
          <div className="grid2">
            <div className="field"><label>Hero headline — solid part</label><input value={draft.heroH1a} onChange={set("heroH1a")} /></div>
            <div className="field"><label>Hero headline — outline part</label><input value={draft.heroH1b} onChange={set("heroH1b")} /></div>
          </div>
          <div className="grid2">
            <div className="field"><label>Hero sub — before highlight</label><input value={draft.heroSub1} onChange={set("heroSub1")} /></div>
            <div className="field"><label>Hero sub — highlighted (red)</label><input value={draft.heroStrong} onChange={set("heroStrong")} /></div>
          </div>
          <div className="field"><label>Hero sub — after highlight</label><input value={draft.heroSub2} onChange={set("heroSub2")} /></div>
          <div className="field"><label>Scroll hint</label><input value={draft.hint} onChange={set("hint")} /></div>
        </div>
      </details>

      <details className="asec">
        <summary>Scroll captions</summary>
        <div className="asec-body">
          {draft.caps.map((c, i) => (
            <div className="grid2" key={i}>
              <div className="field"><label>Caption {i + 1} — kicker</label><input value={c.k} onChange={setArr("caps", i, "k")} /></div>
              <div className="field"><label>Heading</label><input value={c.h} onChange={setArr("caps", i, "h")} /></div>
              <div className="field" style={{ gridColumn: "1 / -1" }}><label>Text</label><textarea value={c.p} onChange={setArr("caps", i, "p")} /></div>
            </div>
          ))}
        </div>
      </details>

      <details className="asec">
        <summary>Store &amp; process</summary>
        <div className="asec-body">
          <div className="grid2">
            <div className="field"><label>Store eyebrow</label><input value={draft.storeEyebrow} onChange={set("storeEyebrow")} /></div>
            <div className="field"><label>Store title</label><input value={draft.storeTitle} onChange={set("storeTitle")} /></div>
          </div>
          <div className="field"><label>Store subtitle</label><input value={draft.storeSub} onChange={set("storeSub")} /></div>
          <div className="field"><label>"Coming soon" note (shows while no products are sellable in the cart)</label><input value={draft.storeSoon} onChange={set("storeSoon")} /></div>
          <div className="grid2">
            <div className="field"><label>Process eyebrow</label><input value={draft.processEyebrow} onChange={set("processEyebrow")} /></div>
            <div className="field"><label>Process title</label><input value={draft.processTitle} onChange={set("processTitle")} /></div>
          </div>
          {draft.process.map((s, i) => (
            <div className="grid2" key={i}>
              <div className="field"><label>Step {i + 1} — title</label><input value={s.t} onChange={setArr("process", i, "t")} /></div>
              <div className="field"><label>Description</label><input value={s.d} onChange={setArr("process", i, "d")} /></div>
            </div>
          ))}
        </div>
      </details>

      <details className="asec">
        <summary>About / Founder</summary>
        <div className="asec-body">
          <div className="grid2">
            <div className="field"><label>Section eyebrow</label><input value={draft.founder.eyebrow} onChange={setObj("founder", "eyebrow")} /></div>
            <div className="field"><label>Section heading</label><input value={draft.founder.heading} onChange={setObj("founder", "heading")} /></div>
          </div>
          <div className="grid2">
            <div className="field"><label>Name</label><input value={draft.founder.name} onChange={setObj("founder", "name")} /></div>
            <div className="field"><label>Title / role</label><input value={draft.founder.role} onChange={setObj("founder", "role")} /></div>
          </div>
          <div className="field"><label>Email</label><input value={draft.founder.email} onChange={setObj("founder", "email")} /></div>
          <div className="field"><label>Bio</label><textarea value={draft.founder.bio} onChange={setObj("founder", "bio")} /></div>
          <ImageField label="Founder photo (blank = the built-in headshot)" value={draft.founder.photo}
            onChange={(url) => setDraft(d => ({ ...d, founder: { ...d.founder, photo: url } }))} />
        </div>
      </details>

      <details className="asec">
        <summary>Contact, CTA &amp; footer</summary>
        <div className="asec-body">
          <div className="grid2">
            <div className="field"><label>CTA line — plain part</label><input value={draft.ctaA} onChange={set("ctaA")} /></div>
            <div className="field"><label>CTA line — gradient part</label><input value={draft.ctaEm} onChange={set("ctaEm")} /></div>
          </div>
          <div className="field"><label>CTA text</label><textarea value={draft.ctaP} onChange={set("ctaP")} /></div>
          <div className="grid2">
            <div className="field"><label>CTA button label</label><input value={draft.ctaBtn} onChange={set("ctaBtn")} /></div>
            <div className="field"><label>Contact email</label><input value={draft.email} onChange={set("email")} /></div>
          </div>
          <div className="field"><label>Footer blurb</label><input value={draft.footerBlurb} onChange={set("footerBlurb")} /></div>
          <div className="field"><label>Street address</label><input value={draft.address} onChange={set("address")} /></div>
          <div className="grid2">
            <div className="field"><label>City / region</label><input value={draft.city} onChange={set("city")} /></div>
            <div className="field"><label>Postal code</label><input value={draft.postal} onChange={set("postal")} /></div>
          </div>
          <div className="field"><label>Country</label><input value={draft.country} onChange={set("country")} /></div>
          <div className="field"><label>Footer bottom line</label><input value={draft.bottomLine} onChange={set("bottomLine")} /></div>
        </div>
      </details>

      <details className="asec">
        <summary>Social links</summary>
        <div className="asec-body">
          <div className="grid2">
            <div className="field"><label>Facebook URL</label><input value={draft.socials?.facebook || ""} onChange={setObj("socials", "facebook")} /></div>
            <div className="field"><label>Instagram URL</label><input value={draft.socials?.instagram || ""} onChange={setObj("socials", "instagram")} /></div>
          </div>
          <div className="field"><label>TikTok URL (blank a field to hide its icon)</label><input value={draft.socials?.tiktok || ""} onChange={setObj("socials", "tiktok")} /></div>
        </div>
      </details>

      <div className="savebar">
        <button className="btn solid" onClick={save}>Save site content</button>
        <button className="btn ghost" onClick={() => setDraft(JSON.parse(JSON.stringify(site)))}>Reset</button>
      </div>
    </div>
  );
}

function AdminPanel({ products, setProducts, site, setSite, onBack }) {
  const [tab, setTab] = useState("products");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [adding, setAdding] = useState(false);

  const startEdit = (p) => { setEditingId(p.id); setDraft(productToDraft(p)); setAdding(false); };
  const startAdd = () => { setAdding(true); setEditingId(null); setDraft(emptyDraft); };
  const cancel = () => { setEditingId(null); setAdding(false); setDraft(emptyDraft); };

  const save = () => {
    if (!draft.name.trim()) return;
    const slug = draft.id || draft.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const next = draftToProduct(draft, slug);
    setProducts(list => {
      const exists = list.some(p => p.id === next.id);
      return exists ? list.map(p => (p.id === next.id ? next : p)) : [...list, next];
    });
    cancel();
  };
  const remove = (id) => {
    if (!window.confirm("Delete this product? This can't be undone.")) return;
    setProducts(list => list.filter(p => p.id !== id));
  };

  return (
    <div className="admin-panel">
      <AmbientBG />
      <div className="admin-head">
        <h1>Site Admin</h1>
        <div style={{ display: "flex", gap: 10 }}>
          {tab === "products" && <button className="btn solid small" onClick={startAdd}>+ Add product</button>}
          <button className="btn ghost small" onClick={onBack}>Back to site</button>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={"atab" + (tab === "products" ? " on" : "")} onClick={() => setTab("products")}>Products</button>
        <button className={"atab" + (tab === "site" ? " on" : "")} onClick={() => setTab("site")}>Site Content</button>
      </div>

      {tab === "products" ? (
        <>
          <div className="admin-list">
            {products.map(p => (
              <div className="admin-row" key={p.id}>
                <div>
                  <div className="an">{p.name}</div>
                  <div className="am">{p.category ? p.category + " · " : ""}${p.price.toLocaleString()} · {p.features.length} features{p.addOns?.length ? ` · ${p.addOns.length} add-on` : ""}{p.buy ? (p.inStock ? " · 🛒 in stock" : " · 🛒 NOT in stock") : ""}</div>
                </div>
                <div className="abtns">
                  <button className="btn ghost small" onClick={() => startEdit(p)}>Edit</button>
                  <button className="btn danger small" onClick={() => remove(p.id)}>Delete</button>
                </div>
              </div>
            ))}
            {products.length === 0 && <div className="admin-row">No products yet — add one below.</div>}
          </div>

          {(adding || editingId) && (
            <AdminForm draft={draft} setDraft={setDraft} onSave={save} onCancel={cancel} isNew={adding} />
          )}
        </>
      ) : (
        <SiteForm site={site} setSite={setSite} />
      )}
    </div>
  );
}

/* ============================================================
   APP
   ============================================================ */

// Map real URLs <-> app routes so pages are crawlable and back/forward work.
const routeFromPath = () => {
  const p = location.pathname;
  if (p === "/green") return { page: "green" };
  if (p === "/admin") return { page: "admin" };
  const m = p.match(/^\/product\/([\w-]+)\/?$/);
  if (m) return { page: "product", id: m[1] };
  return { page: "home" };
};
const pathFromRoute = (r) => {
  if (r.page === "green") return "/green";
  if (r.page === "admin") return "/admin";
  if (r.page === "product") return "/product/" + r.id;
  return "/";
};

export default function App() {
  const [route, setRouteState] = useState(routeFromPath);
  const setRoute = (r) => {
    setRouteState(r);
    const path = pathFromRoute(typeof r === "function" ? r(route) : r);
    if (location.pathname !== path) history.pushState({}, "", path);
  };
  useEffect(() => {
    const onPop = () => setRouteState(routeFromPath());
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, []);
  const [quote, setQuote] = useState({});
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ia_cart") || "{}") || {}; } catch (e) { return {}; }
  });
  const [drawer, setDrawer] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [toast, setToast] = useState("");
  const [belowFold, setBelowFold] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [products, setProductsState] = useState(DEFAULT_PRODUCTS);
  const [site, setSiteState] = useState(SITE_DEFAULTS);
  const toastTimer = useRef(null);

  // Load the shared catalog + site content once on mount — falls back to
  // defaults if nothing has been saved yet.
  useEffect(() => {
    (async () => {
      const p = await loadData("products", null);
      if (Array.isArray(p) && p.length) setProductsState(p);
      const s = await loadData("site", null);
      if (s && typeof s === "object") setSiteState({ ...SITE_DEFAULTS, ...s });
    })();
  }, []);

  // Persist the cart to this browser so it survives reloads.
  useEffect(() => {
    try { localStorage.setItem("ia_cart", JSON.stringify(cart)); } catch (e) { /* ignore */ }
  }, [cart]);

  // While a drawer is open, lock the page behind it so wheel/touch scrolling
  // stays inside the drawer (which scrolls itself when its content is tall).
  useEffect(() => {
    document.body.style.overflow = (cartOpen || drawer) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen, drawer]);

  const setProducts = (updater) => {
    setProductsState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveData("products", next);
      return next;
    });
  };
  const setSite = (updater) => {
    setSiteState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveData("site", next);
      return next;
    });
    setToast("Site content saved");
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  };

  useEffect(() => {
    // mount everything below the hero one frame later — first paint is just
    // nav + hero + canvas, so the page appears immediately
    const raf = requestAnimationFrame(() => setBelowFold(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    document.title = site.titleLine;
    // Non-blocking: page paints immediately on fallback fonts; this swaps in
    // Michroma/Anton/Archivo/JetBrains Mono as soon as they arrive, whenever
    // that is. A CSS @import here would instead pause first paint on the
    // network request, which is what was causing the blank loading delay.
    if (document.getElementById("ia-fonts")) return;
    const link = document.createElement("link");
    link.id = "ia-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Michroma&family=Anton&family=Archivo:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, [site.titleLine]);

  const count = Object.values(quote).reduce((a, b) => a + b, 0);
  const items = Object.entries(quote)
    .map(([id, qty]) => ({ p: products.find(x => x.id === id), qty }))
    .filter(it => it.p);

  const addQuote = (id) => {
    setQuote(q => ({ ...q, [id]: (q[id] || 0) + 1 }));
    const p = products.find(x => x.id === id);
    setToast((p ? p.name : "Item") + " added to quote");
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  };
  const removeQuote = (id) => setQuote(q => { const n = { ...q }; delete n[id]; return n; });

  const flash = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  };
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartItems = Object.entries(cart)
    .map(([id, qty]) => ({ p: products.find(x => x.id === id), qty }))
    .filter(it => it.p && it.p.buy);
  const cartSubtotal = cartItems.reduce((s, it) => s + (Number(it.p.price) || 0) * it.qty, 0);
  const addToCart = (id) => {
    setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
    const p = products.find(x => x.id === id);
    flash((p ? p.name : "Item") + " added to cart");
    setCartOpen(true);
  };
  const setCartQty = (id, qty) => setCart(c => {
    const n = { ...c };
    if (qty <= 0) delete n[id]; else n[id] = qty;
    return n;
  });
  const removeFromCart = (id) => setCart(c => { const n = { ...c }; delete n[id]; return n; });
  const onCheckout = async (address, serviceToken) => {
    if (checkingOut) return;
    setCheckingOut(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, address, serviceToken })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) { window.location.href = data.url; return; }
      flash(data.error || "Checkout is temporarily unavailable. Please try again.");
    } catch (e) {
      flash("Network error starting checkout. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  // Handle the return trip from Stripe Checkout (success_url / cancel_url).
  useEffect(() => {
    const co = new URLSearchParams(window.location.search).get("checkout");
    if (co === "success") {
      setCart({});
      try { localStorage.removeItem("ia_cart"); } catch (e) { /* ignore */ }
      flash("Thank you! Your order is confirmed. 🎉");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (co === "cancel") {
      flash("Checkout canceled — your cart is saved.");
      window.history.replaceState({}, "", window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openProduct = (id) => setRoute({ page: "product", id });
  const goHome = () => { setRoute({ page: "home" }); window.scrollTo(0, 0); };
  const goStore = () => {
    if (route.page !== "home") {
      setRoute({ page: "home" });
      setTimeout(() => document.getElementById("store")?.scrollIntoView(), 80);
    } else document.getElementById("store")?.scrollIntoView({ behavior: "smooth" });
  };
  const goAdmin = () => setRoute({ page: "admin" });
  const goGreen = () => { setRoute({ page: "green" }); window.scrollTo(0, 0); };

  const product = route.page === "product" ? products.find(p => p.id === route.id) : null;
  const isAdminRoute = route.page === "admin";

  // Per-page titles for search engines and browser tabs.
  useEffect(() => {
    if (route.page === "green") document.title = "Sustainability — Local-First AI | Ink Athletic Ltd.";
    else if (product) document.title = product.name + " | Ink Athletic Ltd.";
    else if (isAdminRoute) document.title = "Admin | Ink Athletic Ltd.";
    else document.title = site.titleLine;
  }, [route, product, isAdminRoute, site.titleLine]);

  return (
    <>
      <style>{CSS}</style>
      {!isAdminRoute && (
        <Nav count={count} cartCount={cartCount} showCart={products.some(p => p.buy) || cartCount > 0} onQuoteOpen={() => setDrawer(true)} onCartOpen={() => setCartOpen(true)} onHome={goHome} onGreen={goGreen} isHome={route.page === "home"} ready={belowFold} />
      )}

      {isAdminRoute ? (
        adminAuthed
          ? <AdminPanel products={products} setProducts={setProducts} site={site} setSite={setSite} onBack={goHome} />
          : <AdminLogin onSuccess={() => setAdminAuthed(true)} onBack={goHome} />
      ) : route.page === "green" ? (
        <GreenPage site={site} onBack={goHome} />
      ) : product ? (
        <ProductPage p={product} products={products} onBack={goStore} onOpen={openProduct} onQuote={addQuote} onBuy={addToCart} site={site} />
      ) : (
        <main>
          <OrbCinema site={site} key={site.titleLine + site.heroH1a + site.heroH1b} />
          {belowFold && (
            <>
              <Storefront site={site} products={products} onOpen={openProduct} onQuote={addQuote} onBuy={addToCart} />
              <Process site={site} />
              <Founder site={site} />
              <section className="cta" id="contact">
                <h2>{site.ctaA}<br /><em>{site.ctaEm}</em></h2>
                <p>{site.ctaP}</p>
                <a className="btn solid" href={"mailto:" + site.email}>{site.ctaBtn}</a>
              </section>
              <SocialPyramid site={site} />
            </>
          )}
        </main>
      )}

      {!isAdminRoute && <Footer site={site} onAdmin={goAdmin} onGreen={goGreen} />}
      <QuoteDrawer open={drawer} items={items} onClose={() => setDrawer(false)} onRemove={removeQuote} email={site.email} />
      <CartDrawer open={cartOpen} items={cartItems} subtotal={cartSubtotal} cart={cart} onClose={() => setCartOpen(false)} onSetQty={setCartQty} onRemove={removeFromCart} onPay={onCheckout} busy={checkingOut} />
      <div className={"toast" + (toast ? " show" : "")}>{toast}</div>
    </>
  );
}
