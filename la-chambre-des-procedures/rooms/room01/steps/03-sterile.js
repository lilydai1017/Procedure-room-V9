"use strict";
/* ROOM 01 — Phase 3: sterile preparation
   Barrier precautions, skin antisepsis, draping, catheter priming, sterile probe cover.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

/* ===== PHASE 3 — STERILE PREPARATION ===== */
async function step07(){
  await bubble("b_protect",[50,40]);
  const w=openWS("single",["Barrière stérile maximale"]);
  const s=sv("svg",{viewBox:"0 0 800 420"},w.panes[0]);
  s.innerHTML=`<rect width="800" height="420" fill="#050b12"/><g id="hh" opacity="0"><path d="M300 420C300 330 330 300 380 290L420 300C440 330 420 380 400 420Z" fill="#c7a993"/><path d="M500 420C500 330 470 300 420 290L380 300C360 330 380 380 400 420Z" fill="#b89a86"/><g fill="#d8f2fa" opacity=".6"><circle cx="390" cy="300" r="6"/><circle cx="410" cy="312" r="4"/><circle cx="398" cy="326" r="5"/></g></g>
  <g id="gl" opacity="0"><path d="M240 420C250 330 280 290 330 270C350 262 366 276 360 296L340 340L360 420Z" fill="#e9dfc4" stroke="#b8a986"/><path d="M560 420C550 330 520 290 470 270C450 262 434 276 440 296L460 340L440 420Z" fill="#e9dfc4" stroke="#b8a986"/><path d="M230 420L250 360H350L370 420Z" fill="#3f6f8c"/><path d="M570 420L550 360H450L430 420Z" fill="#3f6f8c"/></g>
  <text id="ppeT" x="400" y="80" text-anchor="middle" fill="#7590a3" font-family="Saira" font-size="18"></text>`;
  const seq=[["Hygiène des mains",async()=>{ setOp("hh",1); for(let i=0;i<6;i++){ $("#hh",s).setAttribute("transform",`translate(${i%2?8:-8} 0)`); AudioFX.noise(.25,2200,.05); await sleep(260);} setOp("hh",0); }],
    ["Bonnet, masque, protection oculaire",async()=>{ $("#ppeT",s).textContent="Bonnet · masque · écran facial"; AudioFX.noise(.3,900,.06); await sleep(700); }],
    ["Blouse stérile",async()=>{ $("#ppeT",s).textContent="Blouse stérile, attachée par votre assistant"; AudioFX.noise(.6,600,.08); await sleep(900); }],
    ["Gants stériles",async()=>{ $("#ppeT",s).textContent=""; setOp("gl",1); $("#gl",s).style.transition="transform .9s"; $("#gl",s).style.transform="translateY(60px)"; await sleep(30); $("#gl",s).style.transform="translateY(0)"; AudioFX.tone(300,.3,"triangle",.05,500); await sleep(900); }]];
  for(const [label,fn] of seq){ const b=tool(label,w.ctrls,{glow:true}); b.focus(); await waitClick(b); b.disabled=true; await fn(); b.remove(); }
  G.sterile=true; say("Précautions de barrière stérile maximale en place.","good"); await sleep(1600); closeWS();
}
function pointInPoly(x,y,P){ let c=false; for(let i=0,j=P.length-1;i<P.length;j=i++){ const [xi,yi]=P[i],[xj,yj]=P[j]; if(((yi>y)!==(yj>y)) && (x < (xj-xi)*(y-yi)/(yj-yi)+xi)) c=!c; } return c; }
const PREP_ZONE=[[226,146],[306,158],[312,300],[318,462],[120,464],[84,330],[108,284],[220,262]];
async function step08(){
  await camTo("neck",1200);
  await bubble("b_skin","a-neck");
  const w=openWS("single",["Antisepsie cutanée"]); const s=anterior(w.panes[0],"40 100 420 420"); setHeadRot(s,G.headRot);
  const prep=s.querySelector("#aPrep"), top=s.querySelector("#aTop");
  sv("polygon",{points:PREP_ZONE.map(p=>p.join(",")).join(" "),fill:"none",stroke:"#62e6f2","stroke-dasharray":"6 6","stroke-width":1.5,class:"pulseStroke"},top);
  const pts=[]; for(let y=150;y<464;y+=12) for(let x=84;x<320;x+=12) if(pointInPoly(x,y,PREP_ZONE)) pts.push([x,y,false]);
  const app=sv("g",{opacity:0},top); app.innerHTML=`<rect x="-10" y="-60" width="20" height="44" rx="4" fill="#e9e2c8"/><rect x="-14" y="-18" width="28" height="18" rx="6" fill="#f2a64a"/>`;
  let covered=0, painting=false, doneP=false;
  const meter=el("div",{class:"rng"},w.ctrls,"Couverture <output>0 %</output>"); const mo=meter.querySelector("output");
  await new Promise(res=>{
    const paint=e=>{ const q=svgPoint(s,e); app.setAttribute("transform",`translate(${q.x} ${q.y})`); app.setAttribute("opacity",1); if(!painting||doneP) return;
      sv("circle",{cx:q.x,cy:q.y,r:17,fill:"#e9a04c","fill-opacity":.16},prep);
      for(const p of pts){ if(!p[2] && Math.hypot(p[0]-q.x,p[1]-q.y)<18){ p[2]=true; covered++; } }
      const f=covered/pts.length; mo.textContent=Math.round(f*100)+" %"; if(Math.random()<.15) AudioFX.noise(.12,3000,.03);
      if(f>.92){ doneP=true; res(); } };
    s.addEventListener("pointerdown",e=>{ painting=true; s.setPointerCapture(e.pointerId); paint(e); }); s.addEventListener("pointermove",paint); s.addEventListener("pointerup",()=>painting=false);
    say("Frottez la zone délimitée : cou, clavicule et thorax jusque sous le mamelon.",undefined,5000);
  });
  app.setAttribute("opacity",0); top.querySelector("polygon").remove();
  meter.innerHTML=`Laissez sécher l’antiseptique <output>60 s</output>`; const o=meter.querySelector("output");
  const early=tool("Installer le champ maintenant",w.ctrls); early.addEventListener("click",()=>say("Attendez : l’antiseptique doit sécher au moins 1 minute.","warn"));
  for(let t=60;t>=0;t-=2){ o.textContent=t+" s"; prep.setAttribute("opacity", .4+.6*t/60); await sleep(200); }
  o.textContent="sec"; say("Sec (1 minute, accélérée pour la simulation).","good"); await sleep(1400); closeWS();
}
function drapeOn(s, instant){ const d=s.querySelector("#aDrape"); d.innerHTML="";
  const p=sv("path",{d:"M-200 -200H800V900H-200Z M210 175C250 168 296 176 312 196C322 230 318 270 300 296C270 306 230 304 214 290C200 260 198 210 210 175Z","fill-rule":"evenodd",fill:"#2a7680",stroke:"#62e6f2","stroke-opacity":.25},d);
  sv("path",{d:"M-200 120H800M-200 360H800M120 -200V900M480 -200V900",stroke:"#1f5c64","stroke-width":3,opacity:.6},d);
  if(!instant){ d.style.transition="opacity 1.4s, transform 1.4s"; d.style.opacity=0; d.style.transform="translateY(-120px)"; requestAnimationFrame(()=>{ d.style.opacity=1; d.style.transform="none"; }); } }
async function step09(){
  await bubble("b_drape","a-neck");
  const w=openWS("single",["Champ stérile"]); const s=anterior(w.panes[0],"40 60 520 560"); setHeadRot(s,G.headRot);
  s.querySelector("#aPrep").innerHTML=`<polygon points="${PREP_ZONE.map(p=>p.join(",")).join(" ")}" fill="#e9a04c" fill-opacity=".22"/>`;
  const top=s.querySelector("#aTop"); const target=sv("rect",{x:150,y:250,width:300,height:240,fill:"none",stroke:"#62e6f2","stroke-dasharray":"6 6",class:"pulseStroke"},top);
  const g=sv("g",{},top); g.innerHTML=icon("drape","0 0 100 80").replace("<svg",'<svg x="-60" y="-48" width="120" height="96"');
  await new Promise(res=>{ svgDrag(s,g,{start:[480,560],onEnd:(x,y)=>{ if(x>150&&x<450&&y>250&&y<490){ g.remove(); target.remove(); res(); } else say("Glissez le champ sur le patient.","info",2000); }}); say("Glissez le champ sur le patient."); });
  AudioFX.noise(1.2,400,.15); drapeOn(s,false); await sleep(1500);
  $("#ovh").setAttribute("opacity",.15); say("Champ stérile installé. Le cou droit reste exposé.","good"); await sleep(2000); closeWS();
}
/* triple-lumen catheter close-up (shared by priming and lumen checks) */
async function step06(){
  await bubble("b_prime",[50,40]);
  const w=openWS("single",["Cathéter à trois lumières"]); const s=catheterArt(w.panes[0]);
  const syrBtn=tool("Seringue de 10 mL de solution saline",w.ctrls,{glow:true}); const done=new Set();
  say("Prenez la seringue de solution saline, puis cliquez sur un port.");
  while(done.size<3){
    await waitClick(syrBtn); syrBtn.classList.remove("glow"); say("Cliquez sur un port pour la fixer.");
    const i=await new Promise(res=>{ PORTS.forEach((p,k)=>{ if(done.has(k)) return; const r=s.querySelector(`#port${k} rect`); r.classList.add("pulseStroke"); r.onclick=()=>{ PORTS.forEach((_,j)=>{ const rr=s.querySelector(`#port${j} rect`); rr.onclick=null; rr.classList.remove("pulseStroke"); }); res(k); }; }); });
    const sg=s.querySelector("#syr"+i); sg.setAttribute("transform","translate(4 0)"); syringeAt(sg,PORTS[i].y,"#9fe6f2",1);
    const fl=s.querySelector("#flow"+i);
    await holdBtn("Rincer 3–5 mL",w.ctrls,1400,f=>{ fl.setAttribute("stroke-dashoffset",900*(1-f)); syringeAt(sg,PORTS[i].y,"#9fe6f2",1-f*.45); });
    w.ctrls.lastChild.remove();
    sg.innerHTML=""; s.querySelector("#cap"+i).innerHTML=`<rect x="84" y="${PORTS[i].y-12}" width="14" height="24" rx="3" fill="#ddd"/>`; s.querySelector("#led"+i).setAttribute("fill","#5ef2a8"); AudioFX.ok();
    done.add(i); if(done.size<3){ syrBtn.classList.add("glow"); say("Lumière "+PORTS[i].n.toLowerCase()+" amorcée et bouchée. Port suivant."); }
  }
  syrBtn.remove(); say("Toutes les lumières sont amorcées.","good");
  const l=tool("Prélever la lidocaïne 1 % (5 mL)",w.ctrls,{glow:true}); await waitClick(l); l.disabled=true; AudioFX.tone(500,.4,"sine",.05,800);
  const n=tool("Introducteur sur seringue de 5 mL, 1–2 mL de solution saline, biseau aligné",w.ctrls,{glow:true}); await waitClick(n); n.disabled=true;
  say(teach("prime"),"good",6000); await sleep(2400); closeWS();
}
async function step10(){
  await bubble("b_us","a-usm");
  const w=openWS("single",["Gaine stérile de sonde"]); const s=sv("svg",{viewBox:"0 0 800 440"},w.panes[0]);
  s.innerHTML=`<rect width="800" height="440" fill="#050b12"/><path d="M470 0V440" stroke="#ffb547" stroke-dasharray="8 8" opacity=".6"/><text x="480" y="24" font-size="13" fill="#ffb547" font-family="Saira" opacity=".8">limite du champ stérile</text>
  <path d="M560 130C560 240 600 300 640 440" stroke="#555" stroke-width="7" fill="none" id="cord"/>
  <g id="prb"><rect x="530" y="70" width="60" height="64" rx="12" fill="#dfe4e8"/><rect x="526" y="56" width="68" height="18" rx="4" fill="#eef1f3"/><ellipse cx="560" cy="58" rx="30" ry="6" fill="#bfe9f4" opacity=".8"/></g>
  <path d="M580 160C600 170 640 160 660 140L700 150C690 180 640 200 590 190Z" fill="#5d7fe0" opacity=".85"/><text x="680" y="210" font-size="12" fill="#7590a3" font-family="Saira">assistant (non stérile)</text>
  <path id="cov" d="" fill="#bfe9f4" fill-opacity=".28" stroke="#9fdbe6"/><g id="bub"></g><g id="bands"></g><g id="hand"></g><g id="covPack"></g>`;
  const cord=s.querySelector("#cord"), L=cord.getTotalLength();
  const resetCover=()=>{ s.querySelector("#cov").setAttribute("d",""); s.querySelector("#hand").innerHTML=""; };
  let ok=false;
  while(!ok){
    const pk=s.querySelector("#covPack"); pk.innerHTML=`<g class="hot" transform="translate(240 260)"><rect x="-40" y="-60" width="80" height="120" rx="6" fill="#bfe9f4" fill-opacity=".3" stroke="#9fdbe6"/><text y="80" text-anchor="middle" font-size="12" fill="#7590a3" font-family="Saira">gaine stérile</text></g>`;
    say("Insérez votre main gantée dans la gaine stérile."); await waitClick(pk.firstChild); pk.innerHTML="";
    gloveHand(s.querySelector("#hand"),300,260,-20,1.3); s.querySelector("#cov").setAttribute("d","M240 200h120v120h-120z");
    say("Saisissez l’extrémité de la sonde à travers la gaine."); const tipHot=sv("ellipse",{cx:560,cy:58,rx:40,ry:16,fill:"transparent",stroke:"#62e6f2",class:"pulseStroke hot"},s);
    await waitClick(tipHot); tipHot.remove(); s.querySelector("#hand").innerHTML=""; gloveHand(s.querySelector("#hand"),600,46,160,1.1);
    s.querySelector("#cov").setAttribute("d","M524 50h72v40h-72z");
    say("Déroulez la gaine le long du câble. Ne touchez pas le câble.",undefined,4200);
    const handle=sv("circle",{cx:560,cy:96,r:13,fill:"#62e6f2","fill-opacity":.5,stroke:"#62e6f2",class:"hot"},s);
    ok = await new Promise(res=>{ let dragging=false, prog=0;
      handle.addEventListener("pointerdown",e=>{ dragging=true; handle.setPointerCapture(e.pointerId); });
      handle.addEventListener("pointermove",e=>{ if(!dragging) return; const q=svgPoint(s,e);
        let best=prog, bd=1e9; for(let l=Math.max(0,prog-20); l<=Math.min(L,prog+60); l+=3){ const pt=cord.getPointAtLength(l); const dd=Math.hypot(pt.x-q.x,pt.y-q.y); if(dd<bd){bd=dd;best=l;} }
        if(bd>34){ dragging=false; handle.remove(); say("Champ stérile compromis. Remplacez l’équipement touché.","warn",4200); resetCover(); res(false); return; }
        prog=Math.max(prog,best); const pt=cord.getPointAtLength(prog); handle.setAttribute("cx",pt.x); handle.setAttribute("cy",pt.y);
        const pts=[]; for(let l=0;l<=prog;l+=8){ const a=cord.getPointAtLength(l); pts.push(a); }
        const left=pts.map(p=>`${p.x-16},${p.y}`), right=pts.reverse().map(p=>`${p.x+16},${p.y}`);
        s.querySelector("#cov").setAttribute("d",`M524 50h72v${40}L${right.join("L")}L${left.reverse().join("L")}Z`);
        if(prog>L-12){ dragging=false; handle.remove(); res(true); } });
      handle.addEventListener("pointerup",()=>dragging=false);
    });
    if(!ok) await sleep(1200);
  }
  s.querySelector("#hand").innerHTML="";
  say("Tendez la gaine : éliminez les bulles d’air à l’extrémité.");
  const bub=s.querySelector("#bub"); const bubs=[[548,62],[566,58],[578,64]].map(([x,y])=>sv("circle",{cx:x,cy:y,r:5,fill:"#fff","fill-opacity":.5,class:"hot"},bub));
  await Promise.all(bubs.map(b=>waitClick(b).then(()=>{ b.remove(); AudioFX.tone(1600,.05,"sine",.05); })));
  say("Fixez la gaine avec deux élastiques stériles.");
  const bandSpots=[[560,104],[560,128]].map(([x,y])=>sv("rect",{x:x-34,y:y-4,width:68,height:8,rx:3,fill:"transparent",stroke:"#62e6f2","stroke-dasharray":"4 3",class:"pulseStroke hot"},s.querySelector("#bands")));
  await Promise.all(bandSpots.map(b=>waitClick(b).then(()=>{ b.setAttribute("fill","#1fb3a6"); b.removeAttribute("stroke-dasharray"); b.classList.remove("pulseStroke"); AudioFX.tone(400,.08,"square",.04); })));
  const g=tool("Appliquer le gel stérile",w.ctrls,{glow:true}); await waitClick(g); g.remove(); sv("ellipse",{cx:560,cy:48,rx:26,ry:7,fill:"#9fe6f2","fill-opacity":.7},s);
  say("Sonde stérile prête.","good"); await sleep(1800); closeWS();
}
