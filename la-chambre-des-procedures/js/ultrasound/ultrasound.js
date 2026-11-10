"use strict";
/* ULTRASOUND — simulator
   Real-time grayscale image: IJV, carotid, EJV, thyroid; compression, pulsation, respiration; needle, wire and catheter echoes; short/long axis.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

/* ---------- 6. UltrasoundSimulator ----------
   Short-axis (SA) image: horizontal = lateral(+)/medial(−) in mm, vertical = depth in mm.
   Anatomy is a function of probe level L (0 = apex of the anterior cervical triangle region, 1 = near clavicle),
   head rotation, Trendelenburg tilt, respiration and probe pressure. */
function anatomyAt(L, t){
  const rot=G.headRot, tilt=G.tilt;
  const resp=1+0.06*Math.sin(t/1000*2*Math.PI*G.vitals.rr/60);
  const tf=1+clamp(tilt,0,25)/100;
  let uv=4.5+2*L - rot*0.13 - Math.max(0,0.3-L)*16;
  const ua=-5-0.6*L;
  return { uv, zv:14.5+1.2*L, a:(6.2+2.4*L)*tf, b:(4.6+1.8*L)*tf*resp, ua, za:18.5+0.8*L, ra:3.8, uej:14-2*L, zej:3.6 };
}
function makeUS(pane, opts={}){
  const W=400,H=400; const c=el("canvas",{width:W,height:H,"aria-label":"Image échographique"}, pane);
  c.style.background="#000"; c.style.cursor="crosshair";
  const ctx=c.getContext("2d"); const img=ctx.createImageData(W,H);
  // speckle field (fixed to tissue so it slides with probe): 80x80 mm tile at 10 px/mm
  const TS=800; const sp=new Float32Array(TS*TS); for(let i=0;i<sp.length;i++){ sp[i]=Math.random(); }
  const sm=new Float32Array(TS*TS); for(let y=1;y<TS-1;y++) for(let x=1;x<TS-1;x++){ const i=y*TS+x; sm[i]=(sp[i]*2+sp[i-1]+sp[i+1]+sp[i-TS]+sp[i+TS])/6; }
  const S={ probeU:opts.probeU??10, L:opts.L??.15, pressure:0, flip:!!opts.flip, mode:"SA", planeX:0,
    needle:null, wire:false, cath:false, labels:false, caliper:null, blank:false, sterile:!!opts.sterile, pulse:0 };
  let raf=null, alive=true;
  function frame(t){
    if(!alive) return;
    const A=anatomyAt(S.L,t); S.A=A;
    const hrph=(t/1000)*G.vitals.hr/60; const pulse=Math.max(0,Math.sin(hrph*2*Math.PI))**3; S.pulse=pulse;
    const ra=A.ra*(1+0.09*pulse);
    const bv=Math.max(0.25, A.b*(1-0.93*S.pressure));          // vein compresses
    const zvC=A.zv - S.pressure*2.2;                              // whole field shifts a little
    const d=img.data; const sa=S.mode==="SA";
    let dent=0, dentU=0; if(S.needle && S.needle.dent){ dent=S.needle.dent; dentU=S.needle.aim; }
    for(let py=0;py<H;py++){
      const z=py/10;
      for(let px=0;px<W;px++){
        let u, v;
        const lx=(200-px)/10; u = sa ? (S.flip? S.probeU-lx : S.probeU+lx) : A.uv;   // LA: plane through vein centre
        const xl = sa ? 0 : (px-200)/10;
        // base tissue
        if(z<0.5) v=0.02; else if(z<1.7) v=0.78; else if(z<5){ v=0.3 + (Math.abs(Math.sin(z*5.1+u*0.31))>0.97?0.4:0); }
        else if(z<11){ v=0.36+0.14*Math.sin(z*4.2+(sa?u:xl)*0.08); } else v=0.26;
        if(sa && u<-11 && z>5 && z<17) v=0.55;                    // thyroid
        if(z>31 && z<32.2) v=0.85; else if(z>=32.2) v*=0.25;     // prevertebral line + shadow
        let lumen=false, wall=0, enh=1;
        if(sa){
          // vein
          let du=(u-A.uv)/A.a, dz=(z-zvC)/bv; let r2=du*du+dz*dz;
          if(dent && z < zvC-bv+dent*Math.exp(-((u-dentU)**2)/5)) r2=Math.max(r2,1.3);
          if(r2<1) lumen=true; else if(r2<1.18) wall=Math.max(wall,0.62);
          if(Math.abs(u-A.uv)<A.a && z>zvC+bv) enh*=1.38;
          // artery
          const ar=Math.hypot(u-A.ua,z-A.za); if(ar<ra) lumen=true; else if(ar<ra+1.2) wall=Math.max(wall,0.92);
          if(Math.abs(u-A.ua)<ra && z>A.za+ra) enh*=1.3;
          // external jugular (superficial, compresses easily)
          const ej=Math.hypot((u-A.uej)/1.4,(z-A.zej)/Math.max(.2,1.6*(1-S.pressure*1.4))); if(ej<1) lumen=true; else if(ej<1.25) wall=Math.max(wall,.5);
        } else {
          const top=zvC-bv, bot=zvC+bv;
          let topD = top + (dent? dent*Math.exp(-((xl-(S.needle?S.needle.tipX:0))**2)/6):0);
          if(z>topD && z<bot) lumen=true; else if((z>topD-0.7&&z<=topD)||(z>=bot&&z<bot+0.7)) wall=0.6;
          if(z>bot) enh*=1.3;
        }
        if(lumen) v=0.02+0.02*Math.random(); else if(wall) v=wall;
        v*=enh*(1-z/75);
        // speckle anchored to tissue
        const tx=((Math.round((sa?u:xl)*10)+400)%TS+TS)%TS, ty=py%TS;
        v*= 0.45+1.1*sm[ty*TS+tx];
        const g=clamp(v*255,0,255); const i=(py*W+px)*4; d[i]=g; d[i+1]=g; d[i+2]=g*1.02; d[i+3]=255;
      }
    }
    ctx.putImageData(img,0,0);
    drawDevices(A, zvC, bv);
    overlays(A, zvC, bv, ra);
    S.onFrame && S.onFrame(A,{zvC,bv});
    raf=requestAnimationFrame(frame);
  }
  const toPx = (u,z)=>{ const lx = S.flip? (u-S.probeU) : (S.probeU-u); return [200+lx*10, z*10]; };
  function bright(x,y,r){ const g=ctx.createRadialGradient(x,y,0,x,y,r*2.4); g.addColorStop(0,"rgba(255,255,255,1)"); g.addColorStop(.45,"rgba(240,240,240,.85)"); g.addColorStop(1,"rgba(255,255,255,0)"); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r*2.4,0,7); ctx.fill(); }
  function drawDevices(A, zvC, bv){
    const N=S.needle;
    if(S.mode==="SA"){
      if(N && N.s>0){ // needle crosses the imaging plane at x = planeX
        const tipX=-N.D+N.s/Math.SQRT2, tipZ=N.s/Math.SQRT2;
        if(tipX>=S.planeX){ const zc=S.planeX+N.D; const [x,y]=toPx(N.aim,zc); bright(x,y,3.2);
          ctx.fillStyle="rgba(255,255,255,.18)"; for(let k=1;k<6;k++){ ctx.fillRect(x-2,y+k*7,4,3);} N.visibleIsTip = Math.abs(tipX-S.planeX)<1.6; }
        else N.visibleIsTip=false;
      }
      if(S.wire){ const [x,y]=toPx(A.uv+0.4,zvC+bv*.35); bright(x,y,2.6); ctx.fillStyle="rgba(255,255,255,.15)"; for(let k=1;k<5;k++) ctx.fillRect(x-2,y+k*6,4,3); }
      if(S.cath){ const [x,y]=toPx(A.uv+0.3,zvC+bv*.2); ctx.strokeStyle="rgba(255,255,255,.95)"; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(x,y,9,0,7); ctx.stroke(); ctx.fillStyle="rgba(255,255,255,.12)"; ctx.fillRect(x-6,y+12,12,22); }
    } else {
      if(N && N.s>0){ const tipX=-N.D+N.s/Math.SQRT2, tipZ=N.s/Math.SQRT2; const inPlane=Math.abs(N.aim-A.uv)<2.2;
        ctx.strokeStyle=inPlane?"rgba(255,255,255,.95)":"rgba(255,255,255,.25)"; ctx.lineWidth=inPlane?3:2; ctx.setLineDash(inPlane?[]:[6,8]);
        ctx.beginPath(); ctx.moveTo(200+(-N.D)*10,0); ctx.lineTo(200+tipX*10,tipZ*10); ctx.stroke(); ctx.setLineDash([]);
        if(inPlane) bright(200+tipX*10,tipZ*10,2.2); N.visibleIsTip=inPlane; }
      if(S.wire){ ctx.strokeStyle="rgba(255,255,255,.95)"; ctx.lineWidth=2.4; ctx.beginPath(); const y0=(zvC+bv*.3)*10; ctx.moveTo(200-zvC*10, 0); ctx.lineTo(200,y0); ctx.lineTo(400,y0+6); ctx.stroke(); }
      if(S.cath){ const y0=(zvC+bv*.15)*10; ctx.strokeStyle="rgba(255,255,255,.95)"; ctx.lineWidth=2.5; ctx.beginPath(); ctx.moveTo(200,y0-6); ctx.lineTo(400,y0-2); ctx.moveTo(200,y0+6); ctx.lineTo(400,y0+10); ctx.stroke(); }
    }
  }
  function overlays(A, zvC, bv, ra){
    ctx.font="13px Saira, sans-serif"; ctx.textBaseline="middle";
    // orientation marker dot (screen left) and depth scale
    ctx.fillStyle="#62e6f2"; ctx.beginPath(); ctx.arc(14,14,5,0,7); ctx.fill();
    ctx.fillStyle="rgba(200,230,240,.75)"; for(let mm=0;mm<=40;mm+=5){ const y=mm*10; ctx.fillRect(390,y,mm%10?5:9,1.5); if(mm%10===0&&mm) ctx.fillText(mm/10+"",370,y); }
    ctx.fillStyle="rgba(200,230,240,.6)"; ctx.fillText(S.mode==="SA"?"petit axe":"grand axe",14,388); ctx.textAlign="right"; ctx.fillText("4,0 cm",386,388); ctx.textAlign="left";
    if(S.labels && S.mode==="SA"){ const [vx,vy]=toPx(A.uv,zvC); const [ax,ay]=toPx(A.ua,A.za);
      ctx.strokeStyle="#62e6f2"; ctx.fillStyle="#62e6f2"; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(vx,vy-bv*10); ctx.lineTo(vx,vy-bv*10-38); ctx.stroke(); ctx.textAlign="center"; ctx.fillText("Veine jugulaire interne",vx,vy-bv*10-48);
      ctx.strokeStyle="#ff8a95"; ctx.fillStyle="#ff8a95"; ctx.beginPath(); ctx.moveTo(ax,ay+ra*10); ctx.lineTo(ax,ay+ra*10+40); ctx.stroke(); ctx.fillText("Artère carotide",ax,ay+ra*10+52); ctx.textAlign="left"; }
    if(S.caliper){ const [x,y]=toPx(S.caliper.u,S.caliper.z); ctx.strokeStyle="#ffb547"; ctx.setLineDash([4,4]); ctx.beginPath(); ctx.moveTo(x,2); ctx.lineTo(x,y); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle="#ffb547"; ctx.beginPath(); ctx.arc(x,y,4,0,7); ctx.fill(); ctx.fillText((S.caliper.z/10).toFixed(1).replace(".",",")+" cm",x+10,y/2); }
    if(S.blank){ ctx.fillStyle="rgba(0,0,0,.92)"; ctx.fillRect(0,0,W,H); ctx.fillStyle="#7590a3"; ctx.textAlign="center"; ctx.fillText("Aucun contact",200,200); ctx.textAlign="left"; }
  }
  raf=requestAnimationFrame(frame);
  const api={ canvas:c, S, stop(){ alive=false; cancelAnimationFrame(raf);},
    mm(evt){ const r=c.getBoundingClientRect(); const sc=Math.min(r.width/W, r.height/H); const ox=r.left+(r.width-W*sc)/2, oy=r.top+(r.height-H*sc)/2; const px=(evt.clientX-ox)/sc, py=(evt.clientY-oy)/sc; const lx=(200-px)/10; return { u: S.flip? S.probeU-lx : S.probeU+lx, z: py/10, px, py }; } };
  c.style.objectFit="contain";
  WS.activeUS.push(api); return api;
}
/* probe on the anterior view, transverse; marker toward patient’s right (screen left) */
function probeShape(parent, sterile){ const g=sv("g",{},parent);
  g.innerHTML=`<path d="M-24 -8H24V8H-24Z" fill="${sterile?"#cfeef4":"#eef1f3"}" stroke="${sterile?"#62e6f2":"#9aa"}" stroke-width="1.5" ${sterile?'fill-opacity=".8"':''}/><rect x="-20" y="-24" width="40" height="18" rx="6" fill="${sterile?"#bfe6ee":"#dfe4e8"}" ${sterile?'fill-opacity=".85"':''}/><circle cx="-21" cy="-1" r="2.6" fill="#62e6f2"/><path d="M0 -24C0 -60 -40 -90 -90 -120" stroke="${sterile?"#9fdbe6":"#555"}" stroke-width="${sterile?7:4}" fill="none" ${sterile?'stroke-opacity=".7"':''}/>`;
  return g; }
