"use strict";
/* ROOM 01 — Phase 5: Seldinger technique
   Guidewire, needle removal, skin nick, dilation, catheter, wire removal, lumen checks.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

/* ===== PHASE 5 — SELDINGER TECHNIQUE ===== */
async function step15(){
  await bubble("b_next","a-neck");
  const {w,s,us}=seldingerRig(["Guide · sagittal","Échographie · grand axe"]); us.S.mode="LA";
  const Ns=ACCESS.N.s; const dev=s.querySelector("#sDev"); needleGroup(dev,Ns,{syringe:false});
  const hub=SG.tail(60-Ns); const hands=s.querySelector("#sHands"); gloveHand(hands,hub[0]+8,hub[1]+30,-30,.9);
  const inset=sv("g",{transform:"translate(70 330)"},s.querySelector("#sTop")); inset.innerHTML=`<circle r="34" fill="#0a1622" stroke="#62e6f2" stroke-opacity=".4"/><g id="bev"><path d="M-18 0H18" stroke="#dfe6ec" stroke-width="5"/><path d="M18 -4L6 4" stroke="#62e6f2" stroke-width="2"/></g><text y="50" text-anchor="middle" font-size="11" fill="#7590a3" font-family="Saira">biseau</text>`;
  const b1=tool("Tourner le biseau en direction médiale",w.ctrls,{glow:true}); await waitClick(b1); b1.remove(); inset.querySelector("#bev").style.transition="transform .8s"; inset.querySelector("#bev").style.transform="rotate(180deg)"; AudioFX.ui(); say("Le biseau fait face en direction médiale, vers le cœur.");
  const b2=tool("Extrémité en J dans l’embase, courbure médiale",w.ctrls,{glow:true}); await waitClick(b2); b2.remove();
  const hold=gloveHand(hands,hub[0]-60,hub[1]-50,-45,.85);
  say("Avancez le guide. Il doit glisser sans résistance.",undefined,4200);
  const r=range(w.ctrls,{label:"Guide à l’embase",min:0,max:20,step:.1,value:0,fmt:v=>v.toFixed(1).replace(".",",")+" cm"});
  const fix=tool("Reculer légèrement et tourner",w.ctrls,{disabled:true}); const done=tool("Maintenir le guide ici",w.ctrls,{disabled:true});
  let resisted=false, cleared=false;
  const upd=()=>{ let cm=r.v;
    if(!cleared && cm>4.5){ cm=4.5; r.v=4.5; if(!resisted){ resisted=true; say("Arrêtez. Ne forcez jamais le guide.","warn",5000); fix.disabled=false; fix.classList.add("glow"); r.input.disabled=true; } }
    const inMm=Ns+(cm*10-60); drawWire(s, inMm, 60-Ns+8);
    us.S.wire = inMm>G.D*Math.SQRT2+4;
    if(cm>16 && !G.ectopy){ G.ectopy=true; $("#redWash").setAttribute("opacity",.35); say("Ectopie au moniteur : le guide est dans le cœur. Reculez jusqu’à ce qu’elle cesse.","warn",5000); }
    if(G.ectopy && cm<=15){ G.ectopy=false; $("#redWash").setAttribute("opacity",0); say("Ectopie résolue.","good"); }
    const okZ = cm>=10 && cm<=15 && !G.ectopy; done.disabled=!okZ; done.classList.toggle("glow",okZ); };
  r.input.addEventListener("input",upd);
  fix.addEventListener("click",()=>{ cleared=true; fix.disabled=true; fix.classList.remove("glow"); r.input.disabled=false; r.v=3.5; upd(); say("Légèrement reculé et tourné. Avancez de nouveau doucement."); });
  r.input.focus(); await waitClick(done); r.input.disabled=true; done.disabled=true;
  G.wireCm=r.v; say(`Guide à ${G.wireCm.toFixed(1).replace(".",",")} cm. Ne le lâchez plus à partir de maintenant.`,"good",4200); await sleep(2200); closeWS();
}
async function step16(){
  await bubble("b_wire","a-neck");
  const w=openWS("split",["Cou droit · champ stérile","Échographie · petit axe"]); const s=anterior(w.panes[0],"150 110 260 260"); setHeadRot(s,G.headRot); drapeOn(s,true);
  sv("circle",{cx:G.entry[0],cy:G.entry[1],r:2.5,fill:"#dfe7ee"},s.querySelector("#aSite"));
  const us=makeUS(w.panes[1],{sterile:true}); us.S.wire=true; us.S.blank=true; us.S.flip=false;
  await new Promise(res=>{ attachProbe(s,us,res); say("Placez la sonde sur la veine."); });
  say("Cliquez sur le guide dans la veine.");
  await new Promise(res=>{ const h=e=>{ const m=us.mm(e), A=us.S.A; if(Math.abs(m.u-A.uv)<3 && Math.abs(m.z-A.zv)<A.b+1 && Math.abs(us.S.probeU-A.uv)<A.a){ us.canvas.removeEventListener("click",h); res(); } else say("Trouvez le point échogène brillant dans la veine.","info",2400); }; us.canvas.addEventListener("click",h); });
  say("Guide visualisé dans la veine.","good"); await sleep(2000); closeWS();
}
/* two-stage withdrawal of a device over the wire (needle, dilator) */
async function withdrawOver(w,s,label,drawDev,devLenMm,startInMm){
  const hands=s.querySelector("#sHands"); hands.innerHTML="";
  let hand=gloveHand(hands,...SG.tail(devLenMm-startInMm+18).map((v,i)=>v+(i?24:6)),-45,.85);
  const r=range(w.ctrls,{label,min:0,max:100,value:0,fmt:v=>v+" %"}); const grip=tool("Déplacer la prise à la peau",w.ctrls,{disabled:true});
  let moved=false;
  await new Promise(res=>{ r.input.addEventListener("input",()=>{ let v=r.v; if(!moved && v>50){ v=50; r.v=50; say("Gardez le contrôle du guide en tout temps : déplacez d’abord votre prise à la peau.","warn",4200); }
      if(v>=50 && !moved){ grip.disabled=false; grip.classList.add("glow"); }
      const out = v<=50 ? startInMm*(1-v/50) : 0; const slide = v>50 ? (v-50)/50 : 0; drawDev(out, slide);
      if(v>=100) res(); });
    grip.addEventListener("click",()=>{ moved=true; grip.disabled=true; grip.classList.remove("glow"); hands.innerHTML=""; hand=gloveHand(hands,SG.ex()+10,SAG.skin-4,-40,.85); AudioFX.ui(); say("Guide tenu à la peau. Faites glisser le reste."); });
    r.input.focus(); });
  r.input.disabled=true; grip.remove();
}
async function step17(){
  await bubble("b_rmneedle","a-neck");
  const {w,s,us}=seldingerRig(["Retrait de l’aiguille · sagittal","Échographie · grand axe"]); us.S.mode="LA"; us.S.wire=true;
  const Ns=ACCESS.N.s; const inW=Ns+(G.wireCm*10-60); drawWire(s,inW,70);
  const dev=s.querySelector("#sDev"); let ng=null;
  await withdrawOver(w,s,"Retirer l’aiguille",(out,slide)=>{ if(ng) ng.remove(); if(slide>=1){ ng=null; return; } ng=needleGroup(dev,out-slide*40,{syringe:false}); if(slide>0) ng.setAttribute("opacity",1-slide*.6); },60,Ns);
  say("Aiguille retirée. Le guide reste dans la veine.","good"); await sleep(1800); closeWS();
}
async function step18(){
  await bubble("b_entry","a-neck");
  const w=openWS("single",["Point d’entrée"]); const e=G.entry; const s=anterior(w.panes[0],`${e[0]-30} ${e[1]-22} 60 44`); drapeOn(s,true);
  const top=s.querySelector("#aTop");
  sv("path",{d:`M${e[0]} ${e[1]}l-40 -40`,stroke:"#dfe7ee","stroke-width":.6},top); sv("circle",{cx:e[0],cy:e[1],r:.9,fill:"#dfe7ee"},top);
  gloveHand(top,e[0]-14,e[1]-18,-45,.12);
  const cut=sv("path",{stroke:"#7a1d26","stroke-width":.7,fill:"none","stroke-linecap":"round"},s.querySelector("#aSite"));
  const blade=sv("g",{opacity:0},top); blade.innerHTML=`<path d="M0 0l2.4 -6.5h1.6l-1 6.5z" fill="#eef3f6"/><path d="M3.2 -6.5l2 -10" stroke="#9aa6b0" stroke-width="1.6"/>`;
  say("Faites une petite incision (≈4 mm) au point d’entrée du guide, lame orientée à l’opposé du guide.",undefined,6000);
  await new Promise(res=>{ let st=null, minD=9;
    s.addEventListener("pointermove",ev=>{ const q=svgPoint(s,ev); blade.setAttribute("opacity",1); blade.setAttribute("transform",`translate(${q.x} ${q.y})`); if(st){ minD=Math.min(minD,Math.hypot(q.x-e[0],q.y-e[1])/NECK.k); cut.setAttribute("d",`M${st.x} ${st.y}L${q.x} ${q.y}`);} });
    s.addEventListener("pointerdown",ev=>{ const q=svgPoint(s,ev); const d0=Math.hypot(q.x-e[0],q.y-e[1])/NECK.k; if(d0>3){ say("Commencez juste à côté du point d’entrée du guide.","info",2400); return;} st=q; minD=d0; s.setPointerCapture(ev.pointerId); });
    s.addEventListener("pointerup",ev=>{ if(!st) return; const q=svgPoint(s,ev); const len=Math.hypot(q.x-st.x,q.y-st.y)/NECK.k; const away=((q.x-st.x)*(st.x-e[0])+(q.y-st.y)*(st.y-e[1]))>=0;
      if(minD<0.45 || !away){ say("Lame sur le guide : évitez le contact. Coupez à l’opposé.","warn"); cut.setAttribute("d",""); st=null; return; }
      if(len>6.5){ say("Trop longue. Gardez-la petite (≈4 mm).","warn"); cut.setAttribute("d",""); st=null; return; }
      if(len<2.5){ say("Un peu plus longue : le dilatateur doit passer.","info"); cut.setAttribute("d",""); st=null; return; }
      AudioFX.noise(.15,4000,.06); res(); });
  });
  blade.remove(); say("Incision cutanée faite : place pour le dilatateur et le cathéter.","good"); await sleep(1800); closeWS();
}
async function step19(){
  await bubble("b_room","a-neck");
  const {w,s,us}=seldingerRig(["Dilatation · sagittal","Échographie · grand axe"]); us.S.mode="LA"; us.S.wire=true;
  const Ns=ACCESS.N.s, inW=Ns+(G.wireCm*10-60); drawWire(s,inW,70);
  const dv=sv("g",{},s.querySelector("#sDev")); const tr=s.querySelector("#sTract");
  const tgt=(G.D-anatomyAt(G.site.L,0).b+1.2)*Math.SQRT2; const DL=80;
  const drawDil=(inMm,fade=0)=>{ const [x0,y0]=SG.tail(DL-inMm), [x1,y1]=SG.at(Math.max(0,inMm)); dv.innerHTML=`<path d="M${x0} ${y0}L${x1} ${y1}" stroke="#e8f2f8" stroke-width="9" stroke-linecap="round" opacity="${1-fade}"/><path d="M${x0} ${y0}l-10 -10" stroke="#4aa" stroke-width="12" opacity="${1-fade}"/>`; };
  const b=tool("Enfiler le dilatateur sur le guide",w.ctrls,{glow:true}); await waitClick(b); b.remove();
  for(let t=-30;t<=0;t+=3){ drawDil(t); await sleep(30); }
  gloveHand(s.querySelector("#sHands"),...SG.tail(DL+12).map((v,i)=>v+(i?22:4)),-45,.85);
  say("Avancez avec un mouvement de vrille, juste à travers la paroi veineuse.",undefined,4200);
  const rot=sv("text",{x:SG.ex()-70,y:SAG.skin-60,"font-size":16,fill:"#62e6f2","font-family":"Saira"},s.querySelector("#sTop"));
  await holdBtn("Avancer (vrille)",w.ctrls,3200,f=>{ const d=f*tgt; drawDil(d); rot.textContent=["↻","↺"][Math.floor(f*20)%2]; const [x1,y1]=SG.at(d); tr.innerHTML=`<path d="M${SG.ex()} ${SAG.skin}L${x1} ${y1}" stroke="#2a161a" stroke-width="${6+f*6}"/>`; if(Math.random()<.2) AudioFX.noise(.08,700,.05); });
  w.ctrls.lastChild.remove(); rot.remove(); say("À travers la paroi veineuse. N’avancez pas davantage.","good",3000);
  await sleep(900);
  await withdrawOver(w,s,"Retirer le dilatateur",(out,slide)=>drawDil(out-slide*50, slide*.8),DL,tgt);
  dv.innerHTML=""; say("Trajet dilaté. Le guide est toujours en place.","good"); await sleep(1800); closeWS();
}
async function step20(){
  await bubble("b_cath","a-neck");
  const {w,s,us}=seldingerRig(["Cathéter · sagittal","Échographie · grand axe"]); us.S.mode="LA"; us.S.wire=true;
  const Ns=ACCESS.N.s, inW=Ns+(G.wireCm*10-60); let tail=40; drawWire(s,inW,tail);
  const cg=sv("g",{},s.querySelector("#sDev")); const CL=160;
  const drawCath=inMm=>{ const [x0,y0]=SG.tail(Math.min(CL-inMm,60)); const pts=[[x0,y0],...SG.route(Math.max(0,inMm))]; cg.innerHTML=`<polyline points="${poly(pts)}" fill="none" stroke="#f2f4f6" stroke-width="7" stroke-linejoin="round"/><circle cx="${x0}" cy="${y0}" r="8" fill="#8a5a3c"/>`; };
  const hubInfo=sv("text",{x:20,y:410,"font-size":13,fill:"#ffb547","font-family":"Saira"},s.querySelector("#sTop"));
  const b=tool("Enfiler le cathéter sur le guide",w.ctrls,{glow:true}); await waitClick(b); b.remove();
  for(let t=-40;t<=0;t+=4){ drawCath(t); await sleep(30); }
  hubInfo.textContent="Le guide ne sort pas de l’embase distale (brune)."; say("Le guide doit sortir de l’embase avant que le cathéter n’entre dans la peau.","warn",4800);
  await holdBtn("Faire ressortir le guide de la peau",w.ctrls,1800,f=>{ tail=40+f*26; drawWire(s,inW-f*26,tail); });
  w.ctrls.lastChild.remove(); hubInfo.textContent="Le guide sort de l’embase.";
  const g=tool("Saisir le guide à l’embase",w.ctrls,{glow:true}); await waitClick(g); g.remove();
  gloveHand(s.querySelector("#sHands"),...SG.tail(70).map((v,i)=>v+(i?20:0)),-45,.85); hubInfo.textContent="Guide contrôlé à l’embase. Profondeur prévue : 15 cm.";
  const r=range(w.ctrls,{label:"Cathéter à la peau",min:0,max:20,step:.1,value:0,fmt:v=>v.toFixed(1).replace(".",",")+" cm"}); const hold=tool("Maintenir le cathéter ici",w.ctrls,{disabled:true});
  r.input.addEventListener("input",()=>{ const cm=r.v; drawCath(cm*10); if(Math.random()<.2) AudioFX.noise(.06,700,.04);
    if(cm>17 && !G.ectopy){ G.ectopy=true; $("#redWash").setAttribute("opacity",.35); say("Ectopie : cathéter trop profond. Reculez lentement jusqu’à ce qu’elle cesse.","warn",4800); }
    if(G.ectopy && cm<=16.5){ G.ectopy=false; $("#redWash").setAttribute("opacity",0); say("Ectopie résolue.","good"); }
    const ok=cm>=14 && cm<=16 && !G.ectopy; hold.disabled=!ok; hold.classList.toggle("glow",ok); us.S.cath=cm>4; });
  r.input.focus(); await waitClick(hold); r.input.disabled=true; G.cathCm=r.v;
  say(`Cathéter à ${G.cathCm.toFixed(1).replace(".",",")} cm. Guide toujours tenu.`,"good"); await sleep(1800); closeWS();
}
async function step21(){
  await bubble("b_cathus","a-neck");
  const w=openWS("split",["Cou droit · champ stérile","Échographie · petit axe"]); const s=anterior(w.panes[0],"150 110 260 260"); setHeadRot(s,G.headRot); drapeOn(s,true);
  const us=makeUS(w.panes[1],{sterile:true}); us.S.cath=true; us.S.wire=true; us.S.blank=true;
  await new Promise(res=>{ attachProbe(s,us,res); say("Placez la sonde sur la veine."); });
  const lb=tool("Grand axe",w.ctrls); lb.addEventListener("click",()=>{ us.S.mode=us.S.mode==="SA"?"LA":"SA"; lb.textContent=us.S.mode==="SA"?"Grand axe":"Petit axe"; });
  say("Cliquez sur le cathéter dans la veine.");
  await new Promise(res=>{ const h=e=>{ const m=us.mm(e), A=us.S.A; const ok= us.S.mode==="LA" ? Math.abs(m.z-A.zv)<A.b+1 : (Math.abs(m.u-A.uv)<3.5 && Math.abs(m.z-A.zv)<A.b+1.5); if(ok && Math.abs(us.S.probeU-A.uv)<A.a){ us.canvas.removeEventListener("click",h); res(); } else say("Le cathéter : parois brillantes dans la lumière veineuse.","info",2400); }; us.canvas.addEventListener("click",h); });
  say("Cathéter dans la veine jugulaire interne.","good"); await sleep(1800); closeWS();
}
async function step22(){
  await bubble("b_forget","a-neck");
  const {w,s,us}=seldingerRig(["Retrait du guide","—"]); us.stop(); w.panes[1].remove();
  const cg=sv("g",{},s.querySelector("#sDev")); const cm=G.cathCm*10;
  const [hx,hy]=SG.tail(50); cg.innerHTML=`<polyline points="${poly([[hx,hy],...SG.route(cm)])}" fill="none" stroke="#f2f4f6" stroke-width="7"/><circle cx="${hx}" cy="${hy}" r="8" fill="#8a5a3c"/>`;
  const wg=sv("g",{},s.querySelector("#sDev")); const coil=sv("g",{},s.querySelector("#sTop"));
  const holdC=tool("Tenir le cathéter à la peau",w.ctrls,{glow:true}); const r=range(w.ctrls,{label:"Retirer le guide",min:0,max:100,value:0,fmt:v=>v+" %"});
  let held=false; holdC.addEventListener("click",()=>{ held=true; holdC.disabled=true; holdC.classList.remove("glow"); gloveHand(s.querySelector("#sHands"),SG.ex()+16,SAG.skin-2,-40,.85); AudioFX.ui(); });
  const draw=f=>{ const inMm=(cm+8)*(1-f); wg.innerHTML=`<polyline points="${poly([SG.tail(50+f*30),...SG.route(inMm)])}" fill="none" stroke="#dfe7ee" stroke-width="1.8"/>`;
    coil.innerHTML = f>0? `<g transform="translate(110 330)">${Array.from({length:Math.ceil(f*4)},(_,i)=>`<circle r="${18+i*7}" fill="none" stroke="#dfe7ee" stroke-width="1.6" opacity=".8"/>`).join("")}</g>`:""; };
  draw(0);
  await new Promise(res=>{ r.input.addEventListener("input",()=>{ if(!held){ r.v=0; say("Stabilisez d’abord le cathéter.","warn"); return; } draw(r.v/100); if(r.v>=100) res(); }); });
  r.input.disabled=true; wg.innerHTML="";
  coil.innerHTML=`<g transform="translate(110 330)"><circle r="40" fill="none" stroke="#dfe7ee" stroke-width="1.8"/><path d="M40 0c14 0 16 -14 6 -16" stroke="#dfe7ee" stroke-width="1.8" fill="none"/><text y="64" text-anchor="middle" font-size="12" fill="#5ef2a8" font-family="Saira">intact, extrémité en J présente</text></g>`;
  const acc=tool("Vérifier le guide",w.ctrls,{glow:true}); await waitClick(acc); acc.remove();
  say("Guide retiré et vérifié.","good",4200); await sleep(2000); closeWS();
}
async function step23(){
  await bubble("b_lumens","a-neck");
  const w=openWS("single",["Vérification des lumières"]); const s=catheterArt(w.panes[0]);
  const st=el("div",{class:"rng",style:"flex-direction:column;align-items:flex-start;gap:2px"},w.ctrls,PORTS.map((p,i)=>`<span id="pst${i}">${p.n} — en attente</span>`).join(""));
  const done=new Set(); say("Cliquez sur un port pour fixer une seringue de 10 mL.");
  while(done.size<3){
    const i=await new Promise(res=>{ PORTS.forEach((p,k)=>{ if(done.has(k)) return; const rr=s.querySelector(`#port${k} rect`); rr.classList.add("pulseStroke"); rr.onclick=()=>{ PORTS.forEach((_,j)=>{ const q=s.querySelector(`#port${j} rect`); q.onclick=null; q.classList.remove("pulseStroke"); }); res(k); }; }); });
    const sg=s.querySelector("#syr"+i); s.querySelector("#cap"+i).innerHTML=""; syringeAt(sg,PORTS[i].y,"#9fe6f2",0);
    await holdBtn("Aspirer",w.ctrls,1800,f=>{ syringeAt(sg,PORTS[i].y, f<.35?"#ffffff":"#4a0c14", f*.4); }); w.ctrls.lastChild.remove();
    say("Air retiré, retour de sang veineux foncé.","info",2400);
    const fl=s.querySelector("#flow"+i); fl.setAttribute("stroke-dashoffset",900);
    await holdBtn("Rincer avec la solution saline",w.ctrls,1800,f=>{ syringeAt(sg,PORTS[i].y,"#9fe6f2",.9*(1-f)); fl.setAttribute("stroke-dashoffset",900*(1-f)); }); w.ctrls.lastChild.remove();
    const c=tool("Bouchon",w.ctrls,{glow:true}); await waitClick(c); c.remove(); sg.innerHTML=""; s.querySelector("#cap"+i).innerHTML=`<rect x="84" y="${PORTS[i].y-12}" width="14" height="24" rx="3" fill="#ddd"/>`;
    s.querySelector("#led"+i).setAttribute("fill","#5ef2a8"); w.ctrls.querySelector("#pst"+i).innerHTML=`<span class="okc">${PORTS[i].n} — Confirmée</span>`; AudioFX.ok(); done.add(i);
  }
  say(teach("flush"),"good",5200); await sleep(2400); closeWS();
}
