"use strict";
/* PATIENT — bedside monitor
   ECG and pleth traces, vital signs, alarm, ectopy.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

const Monitor = {
  on:false, leads:false, buf:[], pbuf:[], phase:0, last:0, beatAcc:0, N:150,
  ecgShape(ph, pvc){ // ph 0..1 within a cardiac cycle
    if(pvc){ if(ph>.1&&ph<.28) return Math.sin((ph-.1)/.18*Math.PI)*-1.1 + (ph<.19?0:.4); if(ph>.35&&ph<.55) return Math.sin((ph-.35)/.2*Math.PI)*.45; return 0; }
    const g=(c,w,a)=>a*Math.exp(-((ph-c)**2)/(2*w*w));
    return g(.12,.025,.12)+g(.26,.006,-.12)+g(.28,.008,1)+g(.30,.007,-.25)+g(.48,.04,.25);
  },
  start(){ if(this.on) return; this.on=true; setOp("monScreen",1); $("#monScreen").setAttribute("opacity",1); for(let i=0;i<this.N;i++){this.buf.push(0);this.pbuf.push(0);} requestAnimationFrame(t=>this.tick(t)); },
  pvcNext:false,
  tick(t){ if(!this.last) this.last=t; const dt=Math.min(.05,(t-this.last)/1000); this.last=t;
    const hr=G.vitals.hr; const rate=hr/60; const steps=Math.max(1,Math.round(dt*90));
    for(let s=0;s<steps;s++){ this.phase+= rate/90; if(this.phase>=1){ this.phase-=1; this.pvcNext = G.ectopy && Math.random()<.45; if(this.on) AudioFX.ecg(); }
      const v=this.leads? this.ecgShape(this.phase, this.pvcNext) : (Math.random()-.5)*.03; this.buf.push(v); this.buf.shift();
      const pp=(this.phase+.82)%1; const pl=Math.exp(-((pp-.18)**2)/.006)+.35*Math.exp(-((pp-.42)**2)/.008); this.pbuf.push(pl); this.pbuf.shift(); }
    const e=this.buf.map((v,i)=>`${180+i*1.3},${262-v*30}`).join(" "); $("#ecgW").setAttribute("points",e);
    const p=this.pbuf.map((v,i)=>`${180+i*1.3},${350-v*18}`).join(" "); $("#plethW").setAttribute("points",p);
    if(this._holo) this._holo(this.buf,this.pbuf);
    requestAnimationFrame(t2=>this.tick(t2)); },
  set(v){ Object.assign(G.vitals,v); $("#mHR").textContent=G.vitals.hr; $("#mBP").textContent=G.vitals.bp; $("#mMAP").textContent="("+G.vitals.map+")"; $("#mSp").textContent=G.vitals.sp+" %"; $("#mRR").textContent="FR "+G.vitals.rr; $("#mT").textContent="T "+G.vitals.t;
    const low=G.vitals.map<65; ["mBP","mMAP"].forEach(id=>$("#"+id).setAttribute("fill", low?"#ff4a5a":"#5ef2a8")); $("#monAlarm").setAttribute("opacity", low?1:0); }
};
/* breathing */
setInterval(()=>{ const a=$("#monAlarm"); if(G.vitals.map<65 && Monitor.on) a.setAttribute("fill-opacity", a.getAttribute("fill-opacity")==="0.2"?"1":"0.2"); }, 500);
