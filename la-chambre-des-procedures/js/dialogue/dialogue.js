"use strict";
/* DIALOGUE — bubbles, holograms, feedback, title cards
   One story bubble at a time; holographic panels; bottom feedback line; checklists.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

/* ---------- Bubbles: exactly one at a time ---------- */
let bubbleBusy=null;
function anchorPos(at){
  if(!at || at==="center") return [innerWidth/2, innerHeight/2];
  if(typeof at==="string"){ const r=document.getElementById(at).getBoundingClientRect(); return [r.left+r.width/2, r.top+r.height/2-14]; }
  if(at instanceof Element){ const r=at.getBoundingClientRect(); return [r.left+r.width/2, r.top-10]; }
  return [at[0]*innerWidth/100, at[1]*innerHeight/100];   // [x%, y%]
}
function bubble(key, at, opts={}){
  return new Promise(res=>{
    $("#bubbleLayer").innerHTML="";
    const [x,y]=anchorPos(at);
    const b=el("button",{class:"bubble"+(opts.task?" task":""),type:"button"}, $("#bubbleLayer"), T(key));
    b.style.left=clamp(x,120,innerWidth-120)+"px"; b.style.top=clamp(y,90,innerHeight-40)+"px";
    AudioFX.tone(1560,.15,"sine",.05);
    b.addEventListener("click", ()=>{ AudioFX.ui(); b.classList.add("out"); setTimeout(()=>b.remove(),450); res(); }, {once:true});
    if(opts.focus!==false) setTimeout(()=>b.focus({preventScroll:true}),60);
  });
}

/* ---------- Holographic panels ---------- */
function holo(html, opts={}){
  return new Promise(res=>{
    const h=el("div",{class:"holo"+(opts.red?" red":""),role:"dialog"}, $("#holoLayer"), html);
    const [x,y]=opts.pos||[50,50];
    h.style.left=x+"%"; h.style.top=y+"%"; h.style.transform="translate(-50%,-50%)";
    if(opts.width) h.style.width=opts.width;
    AudioFX.tone(660,.3,"triangle",.06,1320);
    const done=()=>{ h.classList.add("out"); setTimeout(()=>h.remove(),500); res(h); };
    if(opts.noCont){ res(h); return; }
    const c=el("button",{class:"cont",type:"button","aria-label":"Continuer"}, h, "◈");
    setTimeout(()=>c.focus({preventScroll:true}), 300);
    c.addEventListener("click", ()=>{ AudioFX.ui(); done(); }, {once:true});
  });
}
function holoClose(h){ if(!h) return; h.classList.add("out"); setTimeout(()=>h.remove(),500); }

/* ---------- Feedback line ---------- */
let fbTimer;
function say(text, kind="info", ms=3600){ const f=$("#feedback"); f.textContent=text; f.className="on "+(kind==="info"?"":kind); clearTimeout(fbTimer); if(kind==="warn") AudioFX.warn(); if(kind==="good") AudioFX.ok(); fbTimer=setTimeout(()=>f.className="", ms); }
function progress(p){ $("#progress i").style.width=(p*100).toFixed(1)+"%"; }
function teach(id){ const m=MEDICAL_CONTENT[id]; return m? m.teach : ""; }


function titleCard(a,b,c,ms=3200){ return new Promise(res=>{ const t1=$("#t1"),t2=$("#t2"),t3=$("#t3"); [t1,t2,t3].forEach(e=>{e.classList.remove("reveal"); e.style.opacity=0;}); t1.textContent=a||""; t2.textContent=b||""; t3.textContent=c||"";
  requestAnimationFrame(()=>{ t1.classList.add("reveal"); setTimeout(()=>t2.classList.add("reveal"),300); setTimeout(()=>t3.classList.add("reveal"),800); });
  setTimeout(()=>{ [t1,t2,t3].forEach(e=>{ e.classList.remove("reveal"); e.style.transition="opacity 1s"; e.style.opacity=0; }); setTimeout(()=>{[t1,t2,t3].forEach(e=>e.style.transition=""); res();},1000); }, ms); }); }
function checklist(items){ return `<ul>${items.map((x,i)=>`<li data-i="${i}">${x}</li>`).join("")}</ul>`; }
function tick(h, i){ const li=h.querySelector(`li[data-i="${i}"]`); if(li && !li.classList.contains("done")){ li.classList.add("done"); AudioFX.tone(1180,.1,"sine",.07); } }
