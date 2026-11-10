"use strict";
/* CORE — audio
   Synthesised sound (room hum, ventilation, ECG beeps, heartbeat, locks). No audio files needed.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

const AudioFX = {
  ctx:null, on:true, master:null,
  init(){ if(this.ctx) return; try{ this.ctx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return; }
    const c=this.ctx; this.master=c.createGain(); this.master.gain.value=this.on?0.55:0; this.master.connect(c.destination);
    // room hum
    const h=c.createGain(); h.gain.value=0.05; h.connect(this.master);
    [48,48.6,96.3].forEach(f=>{ const o=c.createOscillator(); o.type="sawtooth"; o.frequency.value=f; const lp=c.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=180; o.connect(lp); lp.connect(h); o.start(); });
    // ventilation noise
    const n=c.createBufferSource(), buf=c.createBuffer(1,c.sampleRate*2,c.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
    n.buffer=buf; n.loop=true; const bp=c.createBiquadFilter(); bp.type="bandpass"; bp.frequency.value=420; bp.Q.value=.6; const ng=c.createGain(); ng.gain.value=0.025; n.connect(bp); bp.connect(ng); ng.connect(this.master); n.start();
    this.noiseBuf=buf;
  },
  set(on){ this.on=on; if(this.master) this.master.gain.setTargetAtTime(on?0.55:0, this.ctx.currentTime, .1); },
  tone(f, dur=.12, type="sine", vol=.18, slide){ if(!this.ctx||!this.on) return; const c=this.ctx, o=c.createOscillator(), g=c.createGain(); o.type=type; o.frequency.value=f; if(slide) o.frequency.exponentialRampToValueAtTime(slide, c.currentTime+dur);
    g.gain.setValueAtTime(0,c.currentTime); g.gain.linearRampToValueAtTime(vol,c.currentTime+.01); g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+dur); o.connect(g); g.connect(this.master); o.start(); o.stop(c.currentTime+dur+.05); },
  thud(vol=.4, f=55){ this.tone(f,.5,"sine",vol,30); },
  noise(dur=.4, freq=800, vol=.2){ if(!this.ctx||!this.on) return; const c=this.ctx, s=c.createBufferSource(); s.buffer=this.noiseBuf; const bp=c.createBiquadFilter(); bp.type="bandpass"; bp.frequency.value=freq; const g=c.createGain(); g.gain.setValueAtTime(vol,c.currentTime); g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+dur); s.connect(bp); bp.connect(g); g.connect(this.master); s.start(); s.stop(c.currentTime+dur); },
  ui(){ this.tone(1320,.08,"sine",.08); this.tone(1980,.12,"sine",.05); },
  ok(){ this.tone(880,.12,"sine",.12); setTimeout(()=>this.tone(1320,.2,"sine",.1),110); },
  warn(){ this.tone(330,.25,"square",.08); setTimeout(()=>this.tone(262,.3,"square",.08),220); },
  lock(){ this.noise(.25,300,.35); this.thud(.5,70); setTimeout(()=>this.tone(140,.6,"sawtooth",.06,60),120); },
  beat(){ this.tone(62,.18,"sine",.35,40); setTimeout(()=>this.tone(55,.16,"sine",.25,36),160); },
  ecg(){ this.tone(G.ectopy?740:980,.07,"sine",.06); }
};
$("#sndBtn").addEventListener("click", ()=>{ AudioFX.init(); AudioFX.set(!AudioFX.on); const b=$("#sndBtn"); b.setAttribute("aria-pressed", AudioFX.on); b.textContent = AudioFX.on?T("sound_on"):T("sound_off"); });
document.addEventListener("pointerdown", ()=>AudioFX.init(), {once:true});
