"use strict";
/* EQUIPMENT — instruments
   Tray icons and list, triple-lumen catheter art, syringes, introducer needle, guidewire geometry.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

const ICONS = {
  probe:`<path d="M30 54h40v8H30z" fill="#e8edf0"/><rect x="34" y="30" width="32" height="26" rx="8" fill="#dfe4e8"/><path d="M50 30C50 12 70 8 86 6" stroke="#666" stroke-width="3" fill="none"/><circle cx="36" cy="58" r="2" fill="#62e6f2"/>`,
  cover:`<path d="M24 10h52l-8 56H32z" fill="#bfe9f4" fill-opacity=".35" stroke="#9fdbe6"/><path d="M30 16h40" stroke="#9fdbe6"/><circle cx="76" cy="58" r="8" fill="#1fb3a6" opacity=".8"/><text x="76" y="61" font-size="7" text-anchor="middle" fill="#fff">gel</text>`,
  chg:`<rect x="40" y="8" width="20" height="38" rx="4" fill="#e9e2c8"/><rect x="34" y="46" width="32" height="16" rx="5" fill="#f2a64a" opacity=".85"/><rect x="44" y="2" width="12" height="8" fill="#d0c8a8"/>`,
  ppe:`<path d="M20 60l8-40h44l8 40z" fill="#5d8aa8"/><path d="M38 20c4-10 20-10 24 0" fill="#9cc7dc"/><ellipse cx="80" cy="18" rx="12" ry="7" fill="#e9dfc4"/><rect x="10" y="10" width="20" height="12" rx="4" fill="#d6ecf5"/>`,
  drape:`<path d="M10 22h80v36H10z" fill="#2f7f88"/><path d="M10 34h80M10 46h80" stroke="#226068"/><circle cx="34" cy="40" r="6" fill="#0a1a20" stroke="#62e6f2" stroke-opacity=".4"/>`,
  lido:`<rect x="14" y="20" width="18" height="34" rx="4" fill="#d7eef4" stroke="#9ab"/><rect x="14" y="14" width="18" height="8" fill="#8899aa"/><path d="M42 40h40" stroke="#dde" stroke-width="7"/><path d="M82 40h12" stroke="#ccc" stroke-width="1.5"/><text x="23" y="42" font-size="7" text-anchor="middle" fill="#345">1%</text>`,
  intro:`<path d="M8 40h50" stroke="#dde" stroke-width="10"/><rect x="58" y="36" width="8" height="8" fill="#7ab"/><path d="M66 40h28" stroke="#d8dde2" stroke-width="2"/><path d="M30 37h20" stroke="#62e6f2" stroke-width="3" opacity=".4"/>`,
  wire:`<circle cx="50" cy="38" r="22" fill="none" stroke="#2f6fd1" stroke-width="7"/><path d="M72 38c10 0 14-8 8-12" stroke="#dfe7ee" stroke-width="2" fill="none"/>`,
  scalpel:`<path d="M10 44h46" stroke="#c8d0d8" stroke-width="7" stroke-linecap="round"/><path d="M56 40l26 4-26 4z" fill="#eef3f6"/>`,
  dilator:`<path d="M10 40h66l14 0" stroke="#e8f2f8" stroke-width="8" stroke-linecap="round"/><path d="M76 40l16 0" stroke="#e8f2f8" stroke-width="3"/><rect x="8" y="34" width="12" height="12" rx="2" fill="#4aa"/>`,
  cvc:`<path d="M48 40H94" stroke="#f2f4f6" stroke-width="5"/><path d="M48 40C34 28 22 22 10 20M48 40H10M48 40C34 52 22 58 10 60" stroke="#f2f4f6" stroke-width="2.4" fill="none"/><circle cx="10" cy="20" r="5" fill="#eee"/><circle cx="10" cy="40" r="5" fill="#3d6fd1"/><circle cx="10" cy="60" r="5" fill="#8a5a3c"/><rect x="44" y="34" width="10" height="12" rx="2" fill="#62e6f2" opacity=".6"/>`,
  saline:`<path d="M10 40h56" stroke="#e6f3f8" stroke-width="12"/><path d="M66 40h10" stroke="#ccd" stroke-width="3"/><path d="M14 40h36" stroke="#9fdbe6" stroke-width="7" opacity=".5"/><text x="36" y="28" font-size="9" text-anchor="middle" fill="#9ab">10 mL</text>`,
  gauze:`<rect x="20" y="16" width="44" height="44" fill="#f3f3ee"/><rect x="34" y="26" width="44" height="44" fill="#fafaf6" stroke="#ddd"/><path d="M34 36h44M34 46h44M34 56h44" stroke="#e4e4dc"/>`,
  dressing:`<circle cx="30" cy="40" r="14" fill="#c9a8d8" opacity=".8"/><circle cx="30" cy="40" r="3" fill="#523"/><rect x="50" y="18" width="40" height="44" rx="6" fill="#dff4fa" fill-opacity=".35" stroke="#9fdbe6"/><path d="M8 66c10-8 18-8 26 0" stroke="#226" fill="none"/>`
};
const EQUIPMENT = [
  {k:"probe",n:"Échographe, sonde linéaire"},{k:"cover",n:"Gaine stérile de sonde, gel stérile"},{k:"chg",n:"Chlorhexidine-alcool"},
  {k:"ppe",n:"Bonnet, masque, blouse, gants stériles"},{k:"drape",n:"Champ stérile corps entier"},{k:"lido",n:"Lidocaïne 1 %, aiguille 25 G"},
  {k:"intro",n:"Aiguille d’introduction, seringue de 5 mL à embout lisse"},{k:"wire",n:"Guide métallique à extrémité en J"},{k:"scalpel",n:"Bistouri, lame no 11"},
  {k:"dilator",n:"Dilatateur"},{k:"cvc",n:"CVC à trois lumières"},{k:"saline",n:"Solution saline, seringues de 10 mL"},
  {k:"gauze",n:"Compresses stériles"},{k:"dressing",n:"Fil de suture, disque de chlorhexidine, pansement transparent"}
];
const icon = (k,vb="0 0 100 80") => `<svg viewBox="${vb}" aria-hidden="true">${ICONS[k]}</svg>`;

const PORTS=[{n:"Proximale",c:"#eeeeee",y:120},{n:"Médiane",c:"#3d6fd1",y:210},{n:"Distale",c:"#8a5a3c",y:300}];
function catheterArt(pane){ const s=sv("svg",{viewBox:"0 0 800 420"},pane);
  s.innerHTML=`<rect width="800" height="420" fill="#050b12"/><path d="M380 210H780" stroke="#f2f4f6" stroke-width="12" stroke-linecap="round"/><text x="770" y="240" text-anchor="end" font-size="13" fill="#7590a3" font-family="Saira">extrémité</text>
   <rect x="360" y="192" width="40" height="36" rx="6" fill="#62e6f2" fill-opacity=".35" stroke="#62e6f2"/><text x="380" y="252" text-anchor="middle" font-size="11" fill="#7590a3" font-family="Saira">ailette</text>
   ${[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(i=>`<path d="M${420+i*22} 203v14" stroke="#99a" stroke-width="${i%5?1:2}"/>`).join("")}`;
  PORTS.forEach((p,i)=>{ const g=sv("g",{id:"port"+i},s);
    sv("path",{d:`M360 210C300 210 260 ${p.y} 200 ${p.y}H130`,stroke:"#f2f4f6","stroke-width":6,fill:"none"},g);
    sv("path",{id:"flow"+i,d:`M130 ${p.y}H200C260 ${p.y} 300 210 360 210H780`,stroke:"#9fe6f2","stroke-width":4,fill:"none","stroke-dasharray":"900","stroke-dashoffset":"900",opacity:.9},g);
    sv("rect",{x:96,y:p.y-14,width:36,height:28,rx:5,fill:p.c,stroke:"#62e6f2","stroke-opacity":.4,class:"hot"},g);
    sv("text",{x:114,y:p.y+40,"text-anchor":"middle","font-size":12,fill:"#7590a3","font-family":"Saira"},g).textContent=p.n;
    sv("circle",{id:"led"+i,cx:70,cy:p.y,r:6,fill:"#1a2a36",stroke:"#62e6f2","stroke-opacity":.4},g);
    sv("g",{id:"cap"+i},g); sv("g",{id:"syr"+i},g); });
  return s; }
function syringeAt(g, y, fillCol, frac){ g.innerHTML=`<rect x="0" y="${y-11}" width="88" height="22" rx="3" fill="#e6f3f8" fill-opacity=".35" stroke="#cfe"/><rect x="2" y="${y-9}" width="${84*frac}" height="18" fill="${fillCol}" opacity=".8"/><path d="M88 ${y}H96" stroke="#ccd" stroke-width="3"/><rect x="-14" y="${y-14}" width="14" height="28" fill="#cfd8df"/>`; }

const SG = { ex:()=>SAG.px-G.D*SAG.k, at(sMm){ return [this.ex()+sMm*SAG.k/Math.SQRT2, SAG.skin+sMm*SAG.k/Math.SQRT2]; },
  route(lenMm){ const sv_=G.D*Math.SQRT2; const pts=[[this.ex(),SAG.skin]]; if(lenMm<=sv_){ pts.push(this.at(lenMm)); return pts; } pts.push(this.at(sv_)); const rest=lenMm-sv_; pts.push([SAG.px+Math.min(rest,40)*SAG.k*.98, SAG.skin+G.D*SAG.k+Math.min(rest,40)*.6]); return pts; },
  tail(tMm){ const [x,y]=[this.ex(),SAG.skin]; return [x-tMm*SAG.k/Math.SQRT2, y-tMm*SAG.k/Math.SQRT2]; } };
const poly = pts => pts.map(p=>p.join(",")).join(" ");
function needleGroup(parent, sMm, opts={}){ const g=sv("g",{transform:`translate(${SG.ex()} ${SAG.skin}) rotate(45)`},parent);
  const k=SAG.k, L=(opts.len||60); const tip=sMm*k, hub=(sMm-L)*k;
  g.innerHTML=`<path d="M${hub} 0H${tip}" stroke="#dfe6ec" stroke-width="${opts.thin?1.6:3}"/><path d="M${tip-6} -1.5L${tip} 0L${tip-6} 1.5" fill="#fff"/>`+
   (opts.syringe===false?`<rect x="${hub-14}" y="-6" width="14" height="12" rx="2" fill="#7ab"/>`:`<rect x="${hub-14}" y="-6" width="14" height="12" rx="2" fill="#7ab"/><rect x="${hub-134}" y="-15" width="120" height="30" rx="3" fill="#e6f3f8" fill-opacity=".3" stroke="#cfe"/><rect id="barrel" x="${hub-130}" y="-12" width="${(opts.fill??.25)*112}" height="24" fill="${opts.fillCol||"#9fe6f2"}" opacity=".75" transform="translate(${112*(1-(opts.fill??.25))} 0)"/><rect x="${hub-150}" y="-18" width="16" height="36" fill="#cfd8df"/>`);
  return g; }

function seldingerRig(tags, D){ const w=openWS("split",tags); const s=sagittal(w.panes[0],G.D); const us=makeUS(w.panes[1],{sterile:true}); us.S.probeU=G.site.u; us.S.L=G.site.L; us.S.flip=false; return {w,s,us}; }
function drawWire(s, inMm, tailMm, col="#dfe7ee"){ let g=s.querySelector("#wireG"); if(!g){ g=sv("g",{id:"wireG"},s.querySelector("#sDev")); }
  const inside=SG.route(Math.max(0,inMm)); const t=SG.tail(tailMm);
  g.innerHTML=`<polyline points="${poly([t,...inside])}" fill="none" stroke="${col}" stroke-width="2.2"/>`+(inMm<=G.D*Math.SQRT2+0.1 && inMm>0?"":`<path d="M${inside[inside.length-1][0]} ${inside[inside.length-1][1]}m0 0c8 0 10 -10 2 -12" stroke="${col}" stroke-width="2.2" fill="none"/>`); return g; }
