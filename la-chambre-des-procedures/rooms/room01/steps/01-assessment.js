"use strict";
/* ROOM 01 — Phase 1: pre-procedure assessment
   Steps 1–4: clearance, cardiac monitor, positioning, nonsterile ultrasound.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

/* ===== PHASE 1 — PRE-PROCEDURE ===== */
async function step01(){
  await camTo("patient",1500);
  await bubble("b_ready","a-chest");
  const items=["CVC indiqué : vasopresseurs en cours, accès périphérique peu fiable","Plaquettes 145 × 10⁹/L","RNI 1,2","Aucune anticoagulation thérapeutique","Aucune infection locale au site","Identité et consentement / autorisation d’urgence vérifiés"];
  const h=await holo(`<h3>Vérification préprocédurale</h3>${checklist(items)}<div id="clr" style="margin-top:10px"></div>`, {pos:[50,46], noCont:true});
  const b=tool("Lancer la vérification", h, {glow:true}); b.focus();
  await waitClick(b); b.disabled=true;
  for(let i=0;i<items.length;i++){ await sleep(380); tick(h,i); }
  h.querySelector("#clr").innerHTML=`<span class="okc big" style="font-size:20px">◆ Autorisation procédurale</span>`; AudioFX.ok();
  const c=el("button",{class:"cont",type:"button","aria-label":"Continuer"},h,"◈"); c.focus(); await waitClick(c); holoClose(h);
}
async function step02(){
  await bubble("b_monitor","a-chest");
  await camTo("neck",1200);
  const w=openWS("single",["Électrodes"]); const s=anterior(w.panes[0],"30 140 540 520");
  const targets=[{n:"BD",x:92,y:318,c:"#f4f4f4"},{n:"BG",x:508,y:318,c:"#222"},{n:"JG",x:470,y:610,c:"#e0393e"}];
  const top=s.querySelector("#aTop"); let placed=0;
  await new Promise(res=>{
    targets.forEach((t,i)=>{
      const ring=sv("circle",{cx:t.x,cy:t.y,r:16,fill:"none",stroke:"#62e6f2","stroke-width":2,"stroke-dasharray":"4 4",class:"pulseStroke"},top);
      const g=sv("g",{},top); g.innerHTML=`<circle r="11" fill="${t.c}" stroke="#62e6f2" stroke-width="1.5"/><text y="4" font-size="10" text-anchor="middle" font-family="Saira" fill="${t.c==="#222"?"#eee":"#222"}">${t.n}</text><path d="M0 11V40" stroke="#c9d4dc"/>`;
      const d=svgDrag(s,g,{start:[230+i*70,620],onEnd:(x,y)=>{ if(Math.hypot(x-t.x,y-t.y)<30){ d.set(t.x,t.y); g.style.pointerEvents="none"; ring.remove(); placed++; AudioFX.tone(900,.08,"sine",.08); if(placed===3) res(); } else say("Placez l’électrode "+t.n+" sur son site marqué.","info",2200); }});
    });
    say("Glissez les trois électrodes sur leurs sites.");
  });
  const b=tool("Activer le moniteur", w.ctrls, {glow:true}); await waitClick(b);
  closeWS(); setOp("leadsW",1); Monitor.leads=true; await camTo("monitor",1600); say("Moniteur cardiaque en marche. "+teach("monitor"),"good",5200); await sleep(2200);
}
async function step03(){
  await camTo("side",1600);
  await bubble("b_position","a-bedc");
  glowWorld("bedCtrl");
  const h=await holo(`<h3>Commande du lit</h3><p style="font-size:16px">Inclinez la tête vers le bas (Trendelenburg), si toléré.</p>`, {pos:[78,30], noCont:true});
  const r=range(h,{label:"Tête en bas",min:0,max:25,value:0,fmt:v=>v+"°"});
  const lbl=el("div",{class:"warnc",style:"margin-top:8px;font-size:15px"},h,"");
  await new Promise(res=>{ const upd=()=>{ G.tilt=r.v; $("#bedTilt").style.transform=`rotate(${-r.v*0.55}deg)`; lbl.textContent= r.v? `Trendelenburg : ${r.v}°`:""; };
    r.input.addEventListener("input",upd);
    r.input.addEventListener("change",()=>{ if(r.v>=15&&r.v<=20) res(); else if(r.v>20) say("Au-delà de 20°, peu de bénéfice et moins bonne tolérance. Visez 15–20°.","warn"); else say("Pas assez. 15–20° distend la veine.","info"); });
    r.input.focus(); });
  glowWorld("bedCtrl",false); r.input.disabled=true;
  lbl.innerHTML=`<span class="okc">Trendelenburg : ${G.tilt}° · SpO₂ stable à 93 % — toléré</span>`; AudioFX.ok(); await sleep(1600); holoClose(h);
  await camTo("face",1600);
  await bubble("b_head","a-face");
  const h2=await holo(`<h3>Position de la tête</h3><p style="font-size:16px">Tournez légèrement vers la gauche.</p>`, {pos:[74,30], noCont:true});
  const r2=range(h2,{label:"Rotation",min:0,max:70,value:0,fmt:v=>v+"°"});
  await new Promise(res=>{ r2.input.addEventListener("input",()=>{ G.headRot=r2.v; $("#headW").style.transform=`translateX(${-r2.v*0.12}px) scaleX(${1-r2.v/400})`; });
    r2.input.addEventListener("change",()=>{ if(r2.v>=10&&r2.v<=30){ res(); } else if(r2.v>30) say("Évitez une rotation excessive de la tête : la carotide peut passer derrière la veine.","warn",4200); else say("Un peu plus : une légère rotation expose la veine.","info"); });
    r2.input.focus(); });
  r2.input.disabled=true; say("Positionné pour un accès jugulaire interne droit. "+teach("position"),"good",6000); await sleep(1800); holoClose(h2);
}
/* scanning helper used for nonsterile and sterile ultrasound */
async function step04(){
  await camTo("usm",1600);
  await bubble("b_vein","a-usm");
  glowWorld("probeW"); setOp("usmScreen",1);
  await waitClick($("#probeW")); glowWorld("probeW",false); AudioFX.ui(); setOp("probeW",0);
  await camTo("neck",1500);
  const {w,s,us}=scanRig(false);
  const gelB=tool("Appliquer le gel non stérile", w.ctrls, {glow:true}); await waitClick(gelB); gelB.remove();
  sv("ellipse",{cx:262,cy:236,rx:22,ry:14,fill:"#bfe9f4","fill-opacity":.45},s.querySelector("#aSite")); AudioFX.noise(.3,1600,.08);
  say("Glissez la sonde sur le côté droit de son cou.");
  await new Promise(res=>attachProbe(s,us,res));
  // orientation check
  await bubble("b_orient", us.canvas);
  let tapping=false; const origOverlay=us.S; 
  const tapB=tool("Tapoter le bord repéré de la sonde", w.ctrls, {glow:true}); const rotB=tool("Tourner la sonde de 180°", w.ctrls, {disabled:true});
  const shadowDraw = ()=>{ const ctx=us.canvas.getContext("2d"); if(!tapping) return; ctx.fillStyle="rgba(0,0,0,.75)"; const left=!us.S.flip; ctx.fillRect(left?0:330,0,70,400); };
  us.S.onFrame=shadowDraw;
  await new Promise(res=>{
    tapB.addEventListener("click",async()=>{ tapping=true; await sleep(700); tapping=false;
      if(us.S.flip){ say("Le tapotement apparaît à droite de l’écran, mais le point repère est à gauche. Tournez la sonde.","warn",4200); rotB.disabled=false; rotB.classList.add("glow"); }
      else { say("Bord repéré ↔ point à l’écran. Orientation correcte.","good"); res(); } });
    rotB.addEventListener("click",()=>{ us.S.flip=false; rotB.disabled=true; rotB.classList.remove("glow"); AudioFX.ui(); say("Sonde tournée. Tapotez de nouveau pour vérifier."); });
  });
  tapB.remove(); rotB.remove(); us.S.onFrame=null;
  const pr=range(w.ctrls,{label:"Pression de la sonde",min:0,max:100,value:0,fmt:v=>v<15?"légère":v<55?"modérée":"ferme"});
  pr.input.addEventListener("input",()=>us.S.pressure=pr.v/100);
  say("Glissez la sonde du sommet du triangle vers la clavicule.",undefined,4200);
  await sleep(2500);
  await bubble("b_struct", us.canvas);
  us.S.labels=true; say("Veine : plus grosse, à paroi mince, ovale. Artère : ronde, à paroi épaisse, pulsatile.","info",5000); await sleep(4200); us.S.labels=false;
  await bubble("b_suit", us.canvas);
  await suitability(w,us,pr,false);
  closeWS();
}
