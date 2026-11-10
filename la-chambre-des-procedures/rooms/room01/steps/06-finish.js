"use strict";
/* ROOM 01 — Phases 6–7: securing and confirmation
   Securement, dressing, chest radiograph, completion.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

/* ===== PHASE 6 — SECURING THE LINE ===== */
function siteArt(pane){ const e=G.entry; const s=anterior(pane,`${e[0]-55} ${e[1]-40} 110 80`); drapeOn(s,true);
  const c=sv("g",{id:"cathArt"},s.querySelector("#aSite"));
  c.innerHTML=`<path d="M${e[0]} ${e[1]}L${e[0]-14} ${e[1]-13}C${e[0]-30} ${e[1]-28} ${e[0]-52} ${e[1]-8} ${e[0]-34} ${e[1]+2}C${e[0]-24} ${e[1]+8} ${e[0]-60} ${e[1]+24} ${e[0]-80} ${e[1]+20}" stroke="#f2f4f6" stroke-width="2.4" fill="none"/>
   <rect x="${e[0]-19}" y="${e[1]-19}" width="9" height="7" rx="1.5" fill="#62e6f2" fill-opacity=".55" stroke="#62e6f2" stroke-width=".4" transform="rotate(45 ${e[0]-14} ${e[1]-15})"/>`;
  return s; }
async function step24(){
  await bubble("b_keep","a-neck");
  const w=openWS("single",["Fixation"]); const s=siteArt(w.panes[0]); const e=G.entry, top=s.querySelector("#aTop");
  const sites=[[e[0]-14,e[1]-15],[e[0]-34,e[1]+2]];
  say("Il réagit peu : anesthésiez d’abord les deux sites de suture.",undefined,4800);
  await Promise.all(sites.map(([x,y])=>{ const c=sv("circle",{cx:x,cy:y,r:4,fill:"transparent",stroke:"#62e6f2","stroke-width":.6,class:"pulseStroke hot"},top); return waitClick(c).then(()=>{ c.remove(); sv("circle",{cx:x,cy:y,r:2.6,fill:"#e7c9b6",opacity:.8},s.querySelector("#aSite")); AudioFX.tone(500,.1,"sine",.05); }); }));
  say("Placez le disque de chlorhexidine au point d’insertion.");
  const disk=sv("g",{},top); disk.innerHTML=`<circle r="5" fill="#c9a8d8" opacity=".85"/><circle r="1.2" fill="#523"/>`;
  await new Promise(res=>{ svgDrag(s,disk,{start:[e[0]+30,e[1]+25],onEnd:(x,y)=>{ if(Math.hypot(x-e[0],y-e[1])<6){ disk.remove(); sv("circle",{cx:e[0],cy:e[1],r:5,fill:"#c9a8d8",opacity:.75},s.querySelector("#aSite")); res(); } }}); });
  say("Suturez l’ailette de fixation, puis le second site avec une boucle entre les deux.",undefined,4800);
  for(const [x,y] of sites){ const c=sv("circle",{cx:x,cy:y,r:4.5,fill:"transparent",stroke:"#ffb547","stroke-width":.6,class:"pulseStroke hot"},top); await waitClick(c); c.remove();
    const st=sv("path",{d:`M${x-3} ${y+2}C${x-3} ${y-4} ${x+3} ${y-4} ${x+3} ${y+2}`,stroke:"#1a2a6a","stroke-width":.6,fill:"none","stroke-dasharray":"20","stroke-dashoffset":"20"},s.querySelector("#aSite")); st.animate([{strokeDashoffset:20},{strokeDashoffset:0}],{duration:600,fill:"forwards"}); AudioFX.tone(900,.06,"sine",.05); await sleep(600); }
  say("Cathéter stabilisé sans traction.","good"); await sleep(1600); G.siteW=w; G.siteS=s;
}
async function step25(){
  await bubble("b_cover","a-neck");
  const w=G.siteW, s=G.siteS, e=G.entry, top=s.querySelector("#aTop");
  const dr=sv("g",{},top); dr.innerHTML=`<rect x="-20" y="-16" width="40" height="32" rx="5" fill="#dff4fa" fill-opacity=".25" stroke="#9fdbe6" stroke-width=".6"/>`;
  say("Glissez le pansement transparent sur le site.");
  await new Promise(res=>{ svgDrag(s,dr,{start:[e[0]+36,e[1]-26],onEnd:(x,y)=>{ if(Math.hypot(x-(e[0]-10),y-(e[1]-6))<10){ dr.setAttribute("transform",`translate(${e[0]-10} ${e[1]-6})`); res(); } else say("Couvrez le site d’insertion et l’ailette.","info",2000); }}); });
  const wr=dr.querySelector("rect"); wr.setAttribute("stroke-dasharray","3 2");
  await holdBtn("Le lisser en place",w.ctrls,1600,f=>{ wr.setAttribute("fill-opacity",.25-f*.12); wr.setAttribute("stroke-dasharray",f>.95?"none":"3 2"); }); w.ctrls.lastChild.remove();
  say("Site couvert, cathéter fixé.","good"); await sleep(1600); closeWS();
  setOp("cvcWorld",1); $("#neckSpot").setAttribute("opacity",.5); await camTo("face",1800);
}

/* ===== PHASE 7 — FINAL CONFIRMATION ===== */
function cxrArt(pane){ const s=sv("svg",{viewBox:"0 0 600 520"},pane);
  const ribs=Array.from({length:9},(_,i)=>{ const y=150+i*34; return `<path d="M296 ${y}C230 ${y-24} 150 ${y-8} 110 ${y+30}" /><path d="M304 ${y}C370 ${y-24} 450 ${y-8} 490 ${y+30}"/>`; }).join("");
  s.innerHTML=`<rect width="600" height="520" fill="#020407"/>
   <path d="M150 110C90 160 70 300 80 470H520C530 300 510 160 450 110C400 90 200 90 150 110Z" fill="#141c22"/>
   <path d="M170 140C120 200 110 330 130 450C190 470 260 460 285 430L280 170C250 140 200 130 170 140Z" fill="#05080b"/>
   <path d="M430 140C480 200 490 330 470 450C410 470 340 460 315 430L320 170C350 140 400 130 430 140Z" fill="#05080b"/>
   <path d="M285 300C250 330 250 420 300 450C370 470 420 430 410 360C400 320 350 300 315 300Z" fill="#3a4650" opacity=".8"/>
   <rect x="288" y="40" width="24" height="460" fill="#55606a" opacity=".55"/>
   <g stroke="#8b98a2" stroke-width="5" fill="none" opacity=".45">${ribs}</g>
   <path d="M296 120C240 100 170 104 120 120M304 120C360 100 430 104 480 120" stroke="#a9b4bc" stroke-width="9" fill="none" opacity=".6"/>
   <path d="M300 40V200M300 200L270 228M300 200L330 228" stroke="#0a0f14" stroke-width="12" fill="none"/>
   <path id="xcath" d="M250 30C258 70 266 110 276 150C282 190 284 230 285 268" stroke="#f4f8fb" stroke-width="3" fill="none"/>
   <circle id="xtip" cx="285" cy="270" r="14" fill="transparent" stroke="#62e6f2" stroke-opacity=".0" class="hot"/>
   <circle id="xapex" cx="190" cy="160" r="30" fill="transparent" class="hot"/>
   <text x="20" y="30" font-size="13" fill="#7590a3" font-family="Saira">AP portable · D</text>`;
  return s; }
async function step26(){
  await bubble("b_finished","a-face");
  await holo(`<p>Pas encore. Confirmez la position de l’extrémité du cathéter et excluez les complications.</p>`,{pos:[50,40]});
  await camTo("monitor",1400);
  const con=tool("Activer la console de radiologie",document.body,{glow:true}); con.style.cssText="position:fixed;left:50%;top:70%;transform:translateX(-50%);z-index:70"; await waitClick(con); con.remove();
  AudioFX.tone(300,.8,"sawtooth",.04,900);
  const w=openWS("single",["Radiographie pulmonaire"]); const s=cxrArt(w.panes[0]); w.panes[0].style.boxShadow="0 0 60px rgba(98,230,242,.15)";
  const tip=s.querySelector("#xtip"), apex=s.querySelector("#xapex"); tip.setAttribute("stroke-opacity",.6); tip.classList.add("pulseStroke");
  say("Cliquez sur l’extrémité du cathéter.");
  await waitClick(tip); tip.classList.remove("pulseStroke");
  const mag=sv("g",{},s); mag.innerHTML=`<circle cx="450" cy="390" r="92" fill="#05080b" stroke="#62e6f2"/><clipPath id="mc"><circle cx="450" cy="390" r="90"/></clipPath><g clip-path="url(#mc)"><g transform="translate(450 390) scale(2.6) translate(-286 -262)"><rect x="200" y="180" width="200" height="200" fill="#141c22"/><path d="M285 300C250 330 250 420 300 450C370 470 420 430 410 360C400 320 350 300 315 300Z" fill="#3a4650"/><rect x="288" y="180" width="24" height="200" fill="#55606a" opacity=".55"/><path d="M262 180C272 220 280 250 285 268" stroke="#f4f8fb" stroke-width="2" fill="none"/><path d="M262 298H312" stroke="#5ef2a8" stroke-width=".8" stroke-dasharray="3 2"/></g></g><path d="M300 272L364 340" stroke="#62e6f2" stroke-opacity=".5"/><text x="450" y="500" text-anchor="middle" font-size="13" fill="#5ef2a8" font-family="Saira">extrémité dans la VCS, au-dessus de la jonction cavo-atriale</text>`;
  AudioFX.ok(); say("Position de l’extrémité acceptable : pas dans l’oreillette droite.","good",4200); await sleep(1600);
  apex.setAttribute("stroke","#62e6f2"); apex.classList.add("pulseStroke"); say("Vérifiez maintenant l’apex pulmonaire droit.");
  await waitClick(apex); apex.classList.remove("pulseStroke"); apex.setAttribute("stroke","#5ef2a8");
  say("La trame pulmonaire atteint la paroi thoracique : aucun pneumothorax.","good",4200); await sleep(2200);
  const ok=sv("text",{x:300,y:505,"text-anchor":"middle","font-size":18,fill:"#5ef2a8","font-family":"Saira"},s); ok.textContent="Position de l’extrémité du cathéter acceptable";
  await sleep(1800); closeWS();
}
async function step27(){
  $("#neckSpot").setAttribute("opacity",0); $("#ovh").setAttribute("opacity",.7);
  await camTo("patient",2200);
  await bubble("b_now","a-chest");
  Monitor.set({bp:"102/64",map:77,hr:105,rr:22,sp:95});
  await holo(`<div class="kv" style="font-size:17px"><span>TA</span><span class="okc">102/64 mmHg</span><span>PAM</span><span class="okc">77 mmHg</span><span>FC</span><span>105 bpm</span></div>
   <p>La pression s’améliore grâce à la norépinéphrine et à la réanimation en cours, et non parce qu’un cathéter a été posé. Les voies urinaires obstruées et infectées nécessitent toujours un contrôle urgent de la source.</p>`,{pos:[50,30]});
  await camTo("pull",2200);
  await bubble("b_complete",[50,30]);
  AudioFX.ok();
  await titleCard("Accès central établi","Chambre 01 terminée","Patient stabilisé pour la suite des soins critiques.",4200);
  $("#ovh").style.transition="opacity 4s"; $("#ovh").setAttribute("opacity",.1); $("#floorLights").setAttribute("opacity",.3); $("#haze").setAttribute("opacity",.5);
  await sleep(1800); AudioFX.lock(); $("#doorLock").setAttribute("fill","#5ef2a8");
  const dg=$("#doorGlow"); dg.style.transition="opacity 3s"; dg.setAttribute("opacity",.9); progress(1);
  await camTo("door",3000);
}
