"use strict";
/* ROOM 01 — Phase 2: equipment
   Step 5: open the cart and assemble the equipment.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

async function step05(){
  await camTo("cart",1700);
  $("#cartDoorL").style.transition=$("#cartDoorR").style.transition="transform 1.2s cubic-bezier(.6,0,.2,1)";
  await bubble("b_needs","a-cart");
  AudioFX.noise(.9,500,.12); $("#cartDoorL").style.transform="translateX(-96px)"; $("#cartDoorR").style.transform="translateX(96px)"; setOp("cartGlow",.8);
  await sleep(1100);
  const w=openWS("split",["Chariot d’équipement","Espace de travail"]);
  const tray=el("div",{class:"tray"},w.panes[0]); const drop=el("div",{class:"drop"},w.panes[1]); drop.style.height="100%"; drop.style.border="0";
  let count=0;
  await new Promise(res=>{
    EQUIPMENT.forEach(it=>{
      const d=el("div",{class:"item",tabindex:0,role:"button","aria-label":it.n},tray, icon(it.k)+`<div>${it.n}</div>`);
      const take=()=>{ if(d.classList.contains("used")) return; d.classList.add("used"); el("span",{class:"chip"},drop,it.n); AudioFX.tone(700+count*40,.08,"sine",.07); count++; if(count===EQUIPMENT.length) res(); };
      let ghost=null, sx=0, sy=0, moved=false;
      d.addEventListener("pointerdown",e=>{ sx=e.clientX; sy=e.clientY; moved=false; d.setPointerCapture(e.pointerId); });
      d.addEventListener("pointermove",e=>{ if(!d.hasPointerCapture(e.pointerId)) return; if(!moved && Math.hypot(e.clientX-sx,e.clientY-sy)>6){ moved=true; ghost=d.cloneNode(true); ghost.style.cssText=`position:fixed;width:${d.offsetWidth}px;pointer-events:none;z-index:99;opacity:.9`; document.body.appendChild(ghost);} if(ghost){ ghost.style.left=(e.clientX-50)+"px"; ghost.style.top=(e.clientY-40)+"px"; const r=drop.getBoundingClientRect(); drop.classList.toggle("hover", e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom);} });
      d.addEventListener("pointerup",e=>{ const r=drop.getBoundingClientRect(); if(ghost){ ghost.remove(); ghost=null; drop.classList.remove("hover"); if(e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom) take(); } else if(!moved) take(); });
      d.addEventListener("keydown",e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); take(); } });
    });
    say("Glissez chaque article vers l’espace de travail, ou cliquez dessus.");
  });
  drop.style.boxShadow="inset 0 0 60px rgba(98,230,242,.25)"; say("Équipement prêt. "+teach("equipment"),"good",5200); await sleep(2600); closeWS(); setOp("cartGlow",0);
}
