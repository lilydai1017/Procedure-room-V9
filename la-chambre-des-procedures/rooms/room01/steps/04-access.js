"use strict";
/* ROOM 01 — Phase 4: ultrasound-guided venous access
   Target, local anesthetic, introducer needle (with arterial-puncture recovery), venous confirmation.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

/* ===== PHASE 4 — ULTRASOUND-GUIDED VENOUS ACCESS ===== */
async function step11(){
  await camTo("neck",1200);
  await bubble("b_target","a-neck");
  const {w,s,us}=scanRig(true);
  let probe; await new Promise(res=>{ probe=attachProbe(s,us,res); say("Placez la sonde stérile sur le cou droit."); });
  const pr=range(w.ctrls,{label:"Pression de la sonde",min:0,max:100,value:0,fmt:v=>v<15?"légère":v<55?"modérée":"ferme"});
  pr.input.addEventListener("input",()=>us.S.pressure=pr.v/100);
  say("Centrez la veine, vérifiez qu’elle se comprime, puis revenez à une pression légère.",undefined,5200);
  await suitability(w,us,pr,true);
  G.probePos=[...probe.pos];
  await bubble("b_depth", us.canvas);
  say("Cliquez sur le centre de la veine sur l’image échographique.");
  await new Promise(res=>{ const h=e=>{ const m=us.mm(e); const A=us.S.A; if(Math.abs(m.u-A.uv)<2.4 && Math.abs(m.z-A.zv)<2.4){ us.canvas.removeEventListener("click",h); us.S.caliper={u:m.u,z:m.z}; G.D=Math.round(m.z*10)/10; G.uv=A.uv; res(); } else say("Mesurez jusqu’au centre de la lumière veineuse.","info",2200); }; us.canvas.addEventListener("click",h); });
  AudioFX.ok(); say(`Profondeur jusqu’au centre de la veine : ${(G.D/10).toFixed(1).replace(".",",")} cm.`,"good");
  await sleep(1200);
  say("Où l’aiguille entre-t-elle? Cliquez sur la peau : dans l’axe du milieu de la sonde, à une distance égale à la profondeur de la veine.",undefined,7000);
  const [px,py]=G.probePos; const ent=[px, py-G.D*NECK.k];
  sv("path",{d:`M${px} ${py-8}V${py-60}`,stroke:"#62e6f2","stroke-opacity":.25,"stroke-dasharray":"3 4"},s.querySelector("#aTop"));
  await new Promise(res=>{ const h=e=>{ const q=svgPoint(s,e); const err=Math.hypot(q.x-ent[0],q.y-ent[1])/NECK.k; if(err<3.5){ s.removeEventListener("click",h); res(); } else say(`Environ ${(G.D/10).toFixed(1).replace(".",",")} cm en direction crânienne de la sonde, sur sa ligne médiane.`,"info",3000); }; s.addEventListener("click",h); });
  G.entry=ent; sv("path",{d:`M${ent[0]-5} ${ent[1]}h10M${ent[0]} ${ent[1]-5}v10`,stroke:"#62e6f2","stroke-width":2},s.querySelector("#aSite"));
  say("Point d’entrée marqué. "+teach("target"),"good",6000); await sleep(2600); closeWS();
}
/* sagittal geometry helpers (mm → px) */
async function step12(){
  await bubble("b_before",[50,36]);
  await holo(`<p>Anesthésiez la peau et le trajet prévu de l’aiguille.</p>`,{pos:[50,40]});
  const w=openWS("split",["Trajet de l’aiguille · sagittal","Échographie · petit axe"]); const s=sagittal(w.panes[0],G.D);
  const us=makeUS(w.panes[1],{sterile:true}); us.S.probeU=G.site.u; us.S.L=G.site.L; us.S.flip=false;
  const syr=tool("Seringue de lidocaïne 1 %",w.ctrls,{glow:true}); await waitClick(syr); syr.remove();
  const dev=s.querySelector("#sDev"); let n=needleGroup(dev,0.5,{thin:true,len:30,fill:.9,fillCol:"#e7f6fb"});
  const wheal=sv("ellipse",{cx:SG.ex(),cy:SAG.skin,rx:0,ry:0,fill:"#e7c9b6"},s.querySelector("#sTract"));
  await holdBtn("Faire une papule",w.ctrls,1600,f=>{ wheal.setAttribute("rx",4+f*22); wheal.setAttribute("ry",f*9); wheal.setAttribute("cy",SAG.skin-f*4); });
  w.ctrls.lastChild.remove(); say("Infiltrez maintenant le long du trajet à 45°. Gardez la pointe visible, loin de la veine.",undefined,5000);
  const A0=anatomyAt(G.site.L,0); const safe=(G.D-A0.b-2.5)*Math.SQRT2;
  const r=range(w.ctrls,{label:"Infiltrer",min:0,max:Math.round((G.D)*Math.SQRT2),step:.5,value:.5,fmt:v=>v.toFixed(1).replace(".",",")+" mm"});
  const tract=sv("path",{stroke:"#e7c9b6","stroke-opacity":.35,"stroke-width":10,fill:"none"},s.querySelector("#sTract"));
  us.S.needle={s:.5,aim:A0.uv,D:G.D,dent:0}; us.S.mode="SA";
  const tiltR=range(w.ctrls,{label:"Inclinaison de la sonde",min:-12,max:6,step:.5,value:0,fmt:v=>(v<0?"crânienne ":v>0?"caudale ":"")+Math.abs(v)});
  tiltR.input.addEventListener("input",()=>us.S.planeX=tiltR.v);
  await new Promise(res=>{ r.input.addEventListener("input",()=>{ let v=r.v; if(v>safe){ v=safe; r.v=v; say("Gardez l’aiguille d’anesthésie loin de la veine.","warn",2500); }
    n.remove(); n=needleGroup(dev,v,{thin:true,len:30,fill:.9-v/safe*.6,fillCol:"#e7f6fb"}); us.S.needle.s=v; const [x,y]=SG.at(v); tract.setAttribute("d",`M${SG.ex()} ${SAG.skin}L${x} ${y}`);
    if(v>=safe*.85) res(); }); r.input.focus(); });
  say(teach("lido"),"good",5000); await sleep(2200); closeWS();
}
/* introducer needle — one attempt; resolves "vein" or "artery" */
async function needleAttempt(guided){
  const w=openWS("split",["Aiguille d’introduction · sagittal","Échographie"]); const s=sagittal(w.panes[0],G.D);
  const us=makeUS(w.panes[1],{sterile:true}); us.S.probeU=G.site.u; us.S.L=G.site.L; us.S.flip=false;
  const A0=anatomyAt(G.site.L,0); const dev=s.querySelector("#sDev");
  const N={s:0,aim:A0.uv-2.6,D:G.D,dent:0}; us.S.needle=N;
  let nG=needleGroup(dev,0,{});
  const sR=range(w.ctrls,{label:"Avancer",min:0,max:48,step:.25,value:0,fmt:v=>v.toFixed(1).replace(".",",")+" mm"});
  const aR=range(w.ctrls,{label:"Direction",min:-8,max:8,step:.25,value:-2.6,fmt:v=>v<-.3?"médial "+(-v).toFixed(1).replace(".",","):v>.3?"latéral "+v.toFixed(1).replace(".",","):"centre"});
  const tR=range(w.ctrls,{label:"Inclinaison de la sonde",min:-12,max:8,step:.25,value:0,fmt:v=>(v<0?"crânienne ":v>0?"caudale ":"")+Math.abs(v).toFixed(1).replace(".",",")});
  const modeB=tool("Tourner la sonde de 90° (grand axe)",w.ctrls);
  modeB.addEventListener("click",()=>{ us.S.mode=us.S.mode==="SA"?"LA":"SA"; modeB.textContent= us.S.mode==="SA"?"Tourner la sonde de 90° (grand axe)":"Revenir au petit axe"; AudioFX.ui(); });
  if(guided){ sv("path",{d:`M${SG.ex()} ${SAG.skin}L${SAG.px} ${SAG.skin+G.D*SAG.k}`,stroke:"#5ef2a8","stroke-dasharray":"5 6",opacity:.6},s.querySelector("#sTop")); say("Superviseur : gardez la pointe au-dessus du centre de la veine; ralentissez en approchant de la paroi.","info",6000); }
  let hintShaft=false, hintStray=false, hintBack=false, popped=false;
  const beat=setInterval(()=>AudioFX.beat(), 700);
  const result = await new Promise(res=>{
    const update=()=>{
      N.s=sR.v; N.aim=A0.uv+aR.v; us.S.planeX=tR.v;
      const A=us.S.A||A0; const tipX=-N.D+N.s/Math.SQRT2, z=N.s/Math.SQRT2, u=N.aim;
      const top=A.zv-A.b; const latIn=Math.abs(u-A.uv)<A.a*.8;
      N.dent = (!popped && latIn && z>top-1.8 && z<top+0.8)? clamp(z-(top-1.8),0,2.6):0;
      const inVein = ((u-A.uv)/A.a)**2+((z-A.zv)/A.b)**2<1 && z>top+0.8;
      const inArt = Math.hypot(u-A.ua,z-A.za)<A.ra+0.3;
      nG.remove(); nG=needleGroup(dev,N.s,{fill:popped?.6:.25,fillCol:popped?"#5a1018":"#9fe6f2"});
      if(inArt){ clearInterval(beat); res("artery"); return; }
      if(inVein && !popped){ popped=true; AudioFX.tone(180,.12,"square",.1); AudioFX.thud(.4,90); nG.remove(); nG=needleGroup(dev,N.s,{fill:.6,fillCol:"#5a1018"}); say("Perte de résistance — reflux de sang foncé. Ne bougez plus et confirmez que la pointe est dans la lumière (inclinez la sonde ou passez en grand axe).","good",5200); }
      if(popped && !inVein){ popped=false; say("La pointe est sortie de la lumière. Repositionnez lentement.","warn"); }
      if(z>A.zv+A.b-.2 && latIn && !hintBack){ hintBack=true; say("Pointe contre la paroi postérieure. Reculez lentement dans la lumière.","warn",4200); }
      if(!hintStray && z>top-4 && Math.abs(u-A.uv)>A.a*.6){ hintStray=true; say("La pointe s’écarte du centre de la veine : ajustez la direction.","warn"); }
      if(!hintShaft && us.S.mode==="SA" && tipX-us.S.planeX>4){ hintShaft=true; say("Vous regardez peut-être le corps de l’aiguille, pas la pointe. Inclinez la sonde jusqu’à ce que le point disparaisse, puis revenez.","info",6000); }
      if(popped && inVein && N.visibleIsTip){ clearInterval(beat); res("vein"); }
    };
    [sR,aR,tR].forEach(r=>r.input.addEventListener("input",update));
    us.S.onFrame=()=>{ if(popped && N.visibleIsTip){ update(); } };
    sR.input.focus(); say("Avancez lentement. Suivez la pointe à l’échographie.",undefined,4000);
  });
  us.S.onFrame=null; [sR,aR,tR].forEach(r=>r.input.disabled=true); modeB.disabled=true;
  return {result, w, s, us, N};
}
async function arterialPuncture(ctx){
  $("#redWash").setAttribute("opacity",1); AudioFX.warn();
  const dev=ctx.s.querySelector("#sDev"); dev.innerHTML=""; needleGroup(dev,ctx.N.s,{fill:.9,fillCol:"#e8202e"});
  const h=await holo(`<h2 class="flashRed">Ponction artérielle</h2><p>Retour rouge vif et pulsatile : l’aiguille est dans l’artère carotide. Arrêtez.</p>${checklist(["Retirer l’aiguille","Compression ferme avec des compresses pendant 10 minutes","Nouvel équipement pour toute nouvelle tentative"])}<p style="font-size:14px;color:#ffb7bf">Si un dilatateur ou un cathéter pénètre dans l’artère : laissez-le en place et demandez d’urgence la chirurgie vasculaire.</p>`,{red:true,noCont:true,pos:[50,46]});
  const b1=tool("Retirer l’aiguille",h,{glow:true}); b1.focus(); await waitClick(b1); b1.remove(); dev.innerHTML=""; tick(h,0);
  const p=el("div",{class:"rng",style:"margin-top:8px"},h,"Compression <output>10:00</output>"); const o=p.querySelector("output");
  await holdBtn("Maintenir la compression",h,6000,f=>{ const t=Math.round(600*(1-f)); o.textContent=`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`; }); tick(h,1);
  await sleep(500); tick(h,2); G.attempts++;
  const msg = G.attempts>=3 ? "Troisième tentative infructueuse : arrêtez et appelez un opérateur expérimenté. Votre superviseur guidera la dernière tentative." : `Tentative ${G.attempts} infructueuse. Refaites l’échographie, puis réessayez avec une nouvelle aiguille.`;
  el("p",{style:"font-size:16px"},h,msg);
  const c=el("button",{class:"cont",type:"button","aria-label":"Continuer"},h,"◈"); c.focus(); await waitClick(c); holoClose(h);
  $("#redWash").setAttribute("opacity",0); closeWS(true);
}
let ACCESS=null;
async function step13(){
  await bubble("b_access","a-neck");
  while(true){ const r=await needleAttempt(G.attempts>=3); if(r.result==="vein"){ ACCESS=r; break; } await arterialPuncture(r); }
  say(teach("needle"),"good",5000); await sleep(1800);
}
async function step14(){
  const {w,s,us,N}=ACCESS; w.ctrls.innerHTML="";
  await bubble("b_invein", us.canvas);
  const h=await holo(`<h3>Confirmer la position veineuse</h3>${checklist(["Pointe de l’aiguille dans la lumière veineuse à l’échographie","Flux sanguin : foncé, régulier, non pulsatile","Embase obturée : aucune entrée d’air","Manométrie : colonne basse, variation respiratoire, aucune pulsation"])}<p style="font-size:14px;color:var(--dim)">La couleur seule ne prouve rien : le sang artériel peut être foncé en état de choc ou d’hypoxie.</p>`,{noCont:true,pos:[50,13],width:"min(460px,92vw)"});
  h.style.top="auto"; h.style.bottom="96px"; h.style.left="auto"; h.style.right="3vw"; h.style.transform="none";
  tick(h,0); await sleep(500);
  const dev=s.querySelector("#sDev"), top=s.querySelector("#sTop");
  const b1=tool("Détacher la seringue (embase immobile)",w.ctrls,{glow:true}); await waitClick(b1); b1.remove();
  dev.innerHTML=""; needleGroup(dev,N.s,{syringe:false}); const hub=SG.tail(60-N.s);
  const hand=gloveHand(s.querySelector("#sHands"),hub[0]+8,hub[1]+30,-30,.9);
  const drip=sv("g",{},top); let dripOn=true; (async()=>{ while(dripOn){ const d=sv("circle",{cx:hub[0]-6,cy:hub[1]-4,r:3.5,fill:"#4a0c14"},drip); d.animate([{transform:"translate(0,0)"},{transform:"translate(0,70px)",opacity:0}],{duration:900}); setTimeout(()=>d.remove(),900); await sleep(420);} })();
  tick(h,1); await sleep(1600);
  const b2=tool("Couvrir l’embase avec le pouce",w.ctrls,{glow:true}); await waitClick(b2); b2.remove(); dripOn=false; sv("circle",{cx:hub[0]-6,cy:hub[1]-6,r:8,fill:"#e9dfc4",stroke:"#b8a986"},top); tick(h,2);
  const b3=tool("Brancher la tubulure de manométrie",w.ctrls,{glow:true}); await waitClick(b3); b3.remove();
  const col=sv("g",{},top); col.innerHTML=`<path d="M${hub[0]-6} ${hub[1]-6}C${hub[0]-40} ${hub[1]-40} ${hub[0]-60} ${hub[1]-60} 60 60V-60" stroke="#cfe" stroke-opacity=".6" stroke-width="5" fill="none"/><rect x="54" y="40" width="12" height="0" fill="#5a1018" id="colF"/><text x="74" y="30" font-size="11" fill="#7590a3" font-family="Saira">colonne</text>`;
  const cf=col.querySelector("#colF"); const t0=performance.now();
  await new Promise(r=>{ const f=t=>{ const k=Math.min(1,(t-t0)/1800); const hgt=k*34+4*Math.sin((t-t0)/1000*2*Math.PI*G.vitals.rr/60); cf.setAttribute("y",60-hgt); cf.setAttribute("height",hgt); if(t-t0<4200) requestAnimationFrame(f); else r(); }; requestAnimationFrame(f); });
  tick(h,3);
  const b4=tool("Confirmer la position veineuse",w.ctrls,{glow:true}); await waitClick(b4); b4.remove(); col.remove();
  h.insertAdjacentHTML("beforeend",`<div class="okc" style="margin-top:6px">◆ Accès veineux confirmé</div>`); AudioFX.ok();
  say("Confirmez la position veineuse avant d’avancer le guide et de dilater.","good",5000); await sleep(2400); holoClose(h);
  hand.remove(); closeWS();
}
