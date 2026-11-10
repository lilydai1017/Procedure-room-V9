"use strict";
/* CORE — procedure workspace and controls
   Close-up panes, instrument buttons, sliders, hold-to-act buttons, SVG dragging.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

/* ---------- Workspace (procedural close-ups) ---------- */
const WS = { activeUS:[] };
function openWS(layout="single", tags=[]){
  closeWS(true);
  const ws=$("#ws"); ws.innerHTML=""; ws.classList.add("on");
  const panes=el("div",{class:"panes"}, ws); const out={root:ws, panes:[]};
  const n = layout==="split"?2:1;
  for(let i=0;i<n;i++){ const p=el("div",{class:"pane"},panes); if(tags[i]) el("div",{class:"tag"},p,tags[i]); out.panes.push(p); }
  out.ctrls=el("div",{class:"ctrls"}, ws);
  return out;
}
function closeWS(instant){ WS.activeUS.forEach(u=>u.stop()); WS.activeUS=[]; const ws=$("#ws"); if(instant){ ws.classList.remove("on"); ws.innerHTML=""; return; } ws.style.transition="opacity .6s"; ws.style.opacity=0; setTimeout(()=>{ ws.classList.remove("on"); ws.innerHTML=""; ws.style.opacity=""; ws.style.transition=""; },600); }
function tool(label, parent, opts={}){ const b=el("button",{class:"tool"+(opts.glow?" glow":""),type:"button"}, parent, label); if(opts.disabled) b.disabled=true; return b; }
function range(parent, {label, min=0, max=100, step=1, value=0, fmt=v=>v}){ const w=el("label",{class:"rng"},parent); el("span",{},w,label); const r=el("input",{type:"range",min,max,step,value},w); const o=el("output",{},w,fmt(+value)); r.addEventListener("input",()=>o.textContent=fmt(+r.value)); return {wrap:w, input:r, out:o, get v(){return +r.value;}, set v(x){ r.value=x; o.textContent=fmt(+x);} }; }
/* hold-to-act button: resolves after cumulative holding ms; onTick(fraction) */
function holdBtn(label, parent, ms, onTick){ return new Promise(res=>{ const b=tool(label,parent,{glow:true}); b.style.position="relative"; let acc=0, t=null, last=0;
  const bar=el("span",{},b); bar.style.cssText="position:absolute;left:0;bottom:0;height:2px;width:0;background:var(--cyan);box-shadow:0 0 8px var(--cyan)";
  const step=now=>{ acc+=now-last; last=now; const f=clamp(acc/ms,0,1); bar.style.width=(f*100)+"%"; onTick&&onTick(f); if(f>=1){ t=null; b.disabled=true; res(b); return;} t=requestAnimationFrame(step); };
  const down=e=>{ e.preventDefault(); if(t||b.disabled) return; last=performance.now(); t=requestAnimationFrame(step); };
  const up=()=>{ if(t){ cancelAnimationFrame(t); t=null; } };
  b.addEventListener("pointerdown",down); ["pointerup","pointerleave","pointercancel"].forEach(ev=>b.addEventListener(ev,up));
  b.addEventListener("keydown",e=>{ if(e.key===" "||e.key==="Enter"){ if(!t){ last=performance.now(); t=requestAnimationFrame(step);} } });
  b.addEventListener("keyup",up);
}); }
/* make an SVG group draggable inside its SVG; cb(x,y) during drag, returns {release} */
function svgDrag(svg, g, {onMove, onEnd, start=[0,0], bounds}){ let p=[...start], drag=false, off=[0,0];
  g.style.cursor="grab"; g.setAttribute("transform",`translate(${p[0]} ${p[1]})`);
  const down=e=>{ e.preventDefault(); drag=true; g.setPointerCapture(e.pointerId); const q=svgPoint(svg,e); off=[q.x-p[0], q.y-p[1]]; g.style.cursor="grabbing"; };
  const move=e=>{ if(!drag) return; const q=svgPoint(svg,e); let x=q.x-off[0], y=q.y-off[1]; if(bounds){ x=clamp(x,bounds[0],bounds[2]); y=clamp(y,bounds[1],bounds[3]); } p=[x,y]; g.setAttribute("transform",`translate(${x} ${y})`); onMove&&onMove(x,y); };
  const up=e=>{ if(!drag) return; drag=false; g.style.cursor="grab"; onEnd&&onEnd(p[0],p[1]); };
  g.addEventListener("pointerdown",down); g.addEventListener("pointermove",move); g.addEventListener("pointerup",up); g.addEventListener("pointercancel",up);
  return { get pos(){return p;}, set(x,y){ p=[x,y]; g.setAttribute("transform",`translate(${x} ${y})`); onMove&&onMove(x,y);} , kill(){ g.replaceWith(g.cloneNode(true)); } };
}
