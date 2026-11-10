"use strict";
/* ANATOMY — close-up drawings
   Anterior neck/chest view, sagittal cutaway along the vein, sterile gloved hand.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

/* ---------- 5. Anatomy drawings ---------- */
const NECK = { k:1.2, xRef:270, yTop:200, ySpan:84 };       // anterior view: 1 mm = 1.2 svg units; patient’s right = screen left
const uFromX = x => (NECK.xRef - x)/NECK.k;                  // + = lateral
const xFromU = u => NECK.xRef - u*NECK.k;
const LFromY = y => clamp((y-NECK.yTop)/NECK.ySpan,0,1);
const yFromL = L => NECK.yTop + L*NECK.ySpan;

function anterior(pane, vb="0 0 600 640"){
  const s=sv("svg",{viewBox:vb, preserveAspectRatio:"xMidYMid meet"}, pane);
  s.innerHTML=`
  <defs>
   <radialGradient id="aSkin" cx=".5" cy=".35" r=".75"><stop offset="0" stop-color="#d8c3b0"/><stop offset=".7" stop-color="#b39783"/><stop offset="1" stop-color="#6e5a4e"/></radialGradient>
   <linearGradient id="aGown" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b8196"/><stop offset="1" stop-color="#2c3a4a"/></linearGradient>
   <clipPath id="aBody"><path d="M236 170C236 210 232 240 226 258C180 262 110 270 76 296C58 360 54 520 50 640H550C546 520 542 360 524 296C490 270 420 262 374 258C368 240 364 210 364 170Z"/></clipPath>
   <filter id="aSoft"><feGaussianBlur stdDeviation="2"/></filter>
  </defs>
  <rect x="-200" y="-200" width="1000" height="1100" fill="#04080e"/>
  <ellipse cx="300" cy="96" rx="130" ry="40" fill="#b9c6d0" opacity=".55"/>
  <g id="aBodyG">
   <path d="M236 170C236 210 232 240 226 258C180 262 110 270 76 296C58 360 54 520 50 640H550C546 520 542 360 524 296C490 270 420 262 374 258C368 240 364 210 364 170Z" fill="url(#aSkin)"/>
   <g clip-path="url(#aBody)" opacity=".55" fill="none" stroke="#7a6052">
     <path d="M232 150C246 190 266 240 288 292" stroke-width="2.4"/><path d="M232 150C240 196 244 240 244 288" stroke-width="2"/>
     <path d="M368 150C354 190 334 240 312 292" stroke-width="2.4"/><path d="M368 150C360 196 356 240 356 288" stroke-width="2"/>
     <path d="M296 296C250 284 170 280 96 294M304 296C350 284 430 280 504 294" stroke="#8f7464" stroke-width="5" stroke-linecap="round" opacity=".7"/>
     <path d="M284 300c8 8 24 8 32 0" stroke-width="2"/>
     <path d="M300 300V470" stroke-width="1.2" opacity=".6"/>
   </g>
   <circle cx="190" cy="430" r="7" fill="#8e6c5e"/><circle cx="410" cy="430" r="7" fill="#8e6c5e"/>
   <path d="M50 488C200 470 400 470 550 488V640H50Z" fill="url(#aGown)"/>
  </g>
  <g id="aPrep" clip-path="url(#aBody)"></g>
  <g id="aHead">
   <ellipse cx="300" cy="96" rx="78" ry="96" fill="url(#aSkin)"/>
   <path d="M224 70C230 10 370 10 376 70C360 40 240 40 224 70Z" fill="#8c8f94"/>
   <g id="aFace">
    <path d="M268 92c8-4 16-4 22 0M310 92c8-4 16-4 22 0" stroke="#5a4a42" stroke-width="2" fill="none"/>
    <path d="M300 100c-6 22-8 30 0 34" stroke="#8a6e60" stroke-width="2" fill="none"/>
    <path d="M284 156c10 6 22 6 32 0" stroke="#6e4c46" stroke-width="2.2" fill="none"/>
    <ellipse cx="290" cy="70" rx="14" ry="4" fill="#fff" opacity=".25"/>
   </g>
   <ellipse cx="222" cy="104" rx="8" ry="18" fill="#a88f7c"/><ellipse cx="378" cy="104" rx="8" ry="18" fill="#a88f7c"/>
  </g>
  <g id="aDrape"></g><g id="aSite"></g><g id="aDev"></g><g id="aTop"></g>`;
  return s;
}
function setHeadRot(svg, deg){ const f=svg.querySelector("#aFace"); f.setAttribute("transform",`translate(${deg*0.75} 0)`); }

/* Sagittal cutaway along the vein: x = craniocaudal (cranial left), y = depth. 9 px per mm. */
const SAG = { k:9, skin:92, px:420 };
function sagittal(pane, D){
  const s=sv("svg",{viewBox:"0 0 640 440",preserveAspectRatio:"xMidYMid meet"}, pane);
  const vy=SAG.skin+D*SAG.k;
  s.innerHTML=`
  <defs><linearGradient id="sSub" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4334"/><stop offset="1" stop-color="#3a2a22"/></linearGradient>
   <pattern id="sMus" width="14" height="6" patternUnits="userSpaceOnUse"><rect width="14" height="6" fill="#4a2228"/><path d="M0 3H14" stroke="#6a3038" stroke-width="1.2"/></pattern>
   <linearGradient id="sVein" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3f7a"/><stop offset="1" stop-color="#16244e"/></linearGradient></defs>
  <rect width="640" height="440" fill="#120c0e"/>
  <rect x="0" y="${SAG.skin}" width="640" height="10" fill="#c7a993"/>
  <rect x="0" y="${SAG.skin+10}" width="640" height="34" fill="url(#sSub)"/>
  <rect x="0" y="${SAG.skin+44}" width="640" height="52" fill="url(#sMus)" opacity=".9"/>
  <rect x="0" y="${SAG.skin+96}" width="640" height="300" fill="#22161a"/>
  <rect id="sVeinR" x="-10" y="${vy-44}" width="660" height="88" fill="url(#sVein)" stroke="#6f8cd6" stroke-width="2" opacity=".95"/>
  <text x="18" y="${vy+5}" font-size="13" fill="#9fb6ff" opacity=".7" font-family="Saira">veine jugulaire interne</text>
  <text x="18" y="${SAG.skin-12}" font-size="12" fill="#7590a3" font-family="Saira">crânien</text><text x="622" y="${SAG.skin-12}" font-size="12" fill="#7590a3" text-anchor="end" font-family="Saira">caudal · vers le cœur</text>
  <g id="sTract"></g><g id="sDev"></g>
  <g id="sProbe" transform="translate(${SAG.px} ${SAG.skin})"><rect x="-22" y="-74" width="44" height="74" rx="8" fill="#e7ecef"/><rect x="-24" y="-8" width="48" height="10" rx="3" fill="#cfd8df"/><path d="M0 -74V-120" stroke="#555" stroke-width="5"/></g>
  <g id="sHands"></g><g id="sTop"></g>`;
  return s;
}
function gloveHand(parent, x, y, rot=0, scale=1){ const g=sv("g",{transform:`translate(${x} ${y}) rotate(${rot}) scale(${scale})`},parent);
  g.innerHTML=`<path d="M-46 -6C-60 -30 -40 -52 -14 -46L18 -40C30 -38 34 -28 26 -22L6 -16L28 -12C38 -10 38 2 28 4L-4 8C-20 14 -40 12 -46 -6Z" fill="#e9dfc4" stroke="#b8a986" stroke-width="1.5"/><path d="M-14 -46L-2 -60C4 -66 14 -62 10 -54L2 -40" fill="#e9dfc4" stroke="#b8a986" stroke-width="1.5"/>`;
  return g; }
