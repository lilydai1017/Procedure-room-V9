"use strict";
/* CORE — utilities and shared game state
   DOM/SVG helpers, timing, and the G object that carries state between steps.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

const $ = (s, r=document) => r.querySelector(s);
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const sleep = ms => new Promise(r => setTimeout(r, REDUCED ? Math.min(ms, 400) : ms));
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const NS = "http://www.w3.org/2000/svg";
function el(tag, attrs={}, parent, html){ const e=document.createElement(tag); for(const k in attrs){ if(k==="class") e.className=attrs[k]; else e.setAttribute(k,attrs[k]); } if(html!==undefined) e.innerHTML=html; if(parent) parent.appendChild(e); return e; }
function sv(tag, attrs={}, parent){ const e=document.createElementNS(NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); if(parent) parent.appendChild(e); return e; }
function setOp(id, v){ const e=document.getElementById(id); if(e) e.setAttribute("opacity", v); }
function svgPoint(svg, evt){ const p=svg.createSVGPoint(); p.x=evt.clientX; p.y=evt.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
function waitClick(node){ return new Promise(res => { const h = e => { node.removeEventListener("click", h); res(e); }; node.addEventListener("click", h); }); }

/* Simple game state shared across steps */
const G = { step:0, tilt:0, headRot:0, attempts:0, vitals:{bp:"82/46",map:58,hr:128,rr:30,t:"39,4",sp:93}, ectopy:false, sterile:false };
