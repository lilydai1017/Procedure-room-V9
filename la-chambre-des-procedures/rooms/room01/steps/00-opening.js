"use strict";
/* ROOM 01 — opening sequence
   Scenes 01–07: darkness, patient, story, monitor, diagnosis, resuscitation, why central access.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

/* ===== OPENING SEQUENCE ===== */
async function scene01(){
  cam("dark", true); $("#darkness").style.opacity=1;
  await sleep(700);
  $("#darkness").style.transition="opacity 4s"; $("#darkness").style.opacity=.93;
  const fl=$("#floorLights"); for(let i=0;i<6;i++){ fl.setAttribute("opacity", Math.random()*.25); await sleep(160+Math.random()*240); } fl.setAttribute("opacity",.05);
  await sleep(600);
  await bubble("b_whats","center");
  AudioFX.lock();
  $("#darkness").style.transition="opacity 2.6s"; $("#darkness").style.opacity=0;
  const o=$("#ovh"); for(const v of [1,0,.8,0,1]){ o.setAttribute("opacity",v); await sleep(90); }
  await sleep(400); fl.setAttribute("opacity",1); $("#room").setAttribute("opacity",1); $("#haze").setAttribute("opacity",1);
  await sleep(600); $("#bed").setAttribute("opacity",1);
  cam("patient"); await sleep(1200);
  $("#mon").setAttribute("opacity",1); $("#usm").setAttribute("opacity",.85); $("#iv").setAttribute("opacity",1); $("#cart").setAttribute("opacity",1);
  Monitor.start(); Monitor.set({});
  await sleep(1000); $("#hud").classList.add("on");
  await titleCard("Chambre 01","Accès central","La Chambre des Procédures");
}
async function scene02(){
  await camTo("face");
  await bubble("b_who","a-face");
  await holo(`<h3>Identification du patient</h3><h2>Robert Martin</h2><div class="kv"><span>Âge</span><span>68 ans</span><span>Antécédents</span><span>Diabète de type 2, hypertension,<br>hyperplasie bénigne de la prostate</span></div>`, {pos:[70,42]});
}
async function scene03(){
  await bubble("b_what","a-face");
  await holo(`<svg viewBox="0 0 420 70" width="100%" height="64" aria-hidden="true"><g fill="none" stroke="#62e6f2" stroke-opacity=".35"><path d="M20 60V30L60 8L100 30V60ZM46 60V40H74V60"/><path d="M130 36H400" stroke-dasharray="3 5"/></g>
    <g font-family="Saira" font-size="11" fill="#cfe8ee"><circle cx="150" cy="36" r="4" fill="#62e6f2"/><text x="150" y="58" text-anchor="middle">Jour 1 · dysurie</text><circle cx="235" cy="36" r="4" fill="#62e6f2"/><text x="235" y="58" text-anchor="middle">Jour 2 · fièvre</text><circle cx="315" cy="36" r="4" fill="#ffb547"/><text x="315" y="58" text-anchor="middle">Jour 3 · faiblesse</text><circle cx="395" cy="36" r="5" fill="#ff4a5a"/><text x="395" y="22" text-anchor="end">Aujourd’hui</text></g></svg>
    <p>Trois jours de dysurie, de fièvre et de faiblesse croissante. Aujourd’hui, sa femme l’a trouvé confus et à peine réactif.</p>`, {pos:[68,40]});
}
async function scene04(){
  G.vitals.hr=128; await camTo("monitor"); $("#redWash").setAttribute("opacity",.6);
  await bubble("b_unstable","a-mon");
  const h=await holo(`<h3>Signes vitaux</h3><canvas id="hv" width="520" height="150" style="width:100%;height:auto;display:block;margin:4px 0 10px"></canvas>
   <div class="kv" style="grid-template-columns:repeat(3,auto auto);font-size:16px">
   <span>TA</span><span class="flashRed">82/46 mmHg</span><span>PAM</span><span class="flashRed big" style="font-size:24px">58</span><span>FC</span><span>128 bpm</span>
   <span>FR</span><span>30/min</span><span>Temp.</span><span>39,4 °C</span><span>SpO₂</span><span>93 % à l’air ambiant</span></div>`, {pos:[50,50], width:"min(600px,92vw)", noCont:true});
  const cv=h.querySelector("#hv"), cx=cv.getContext("2d");
  Monitor._holo=(e,p)=>{ cx.clearRect(0,0,520,150); cx.lineWidth=2; cx.strokeStyle="#5ef2a8"; cx.beginPath(); e.forEach((v,i)=>{ const x=i*520/e.length, y=60-v*42; i?cx.lineTo(x,y):cx.moveTo(x,y);}); cx.stroke();
    cx.strokeStyle="#62e6f2"; cx.beginPath(); p.forEach((v,i)=>{ const x=i*520/p.length, y=140-v*30; i?cx.lineTo(x,y):cx.moveTo(x,y);}); cx.stroke(); };
  AudioFX.tone(220,.5,"sine",.1,180);
  const c=el("button",{class:"cont",type:"button","aria-label":"Continuer"},h,"◈"); c.focus(); await waitClick(c); AudioFX.ui();
  Monitor._holo=null; holoClose(h); $("#redWash").setAttribute("opacity",0);
}
async function scene05(){
  await camTo("patient",1500);
  await bubble("b_wrong","a-chest");
  await holo(`<h3>Diagnostic de travail</h3><p>Choc septique sur pyélonéphrite obstructive soupçonnée, compliqué d’une insuffisance rénale aiguë et d’une acidose lactique.</p><p style="font-size:15px;color:var(--dim)">Lactate : 5,8 mmol/L.</p>`, {pos:[50,30]});
}
async function scene06(){
  await bubble("b_done","a-chest");
  Monitor.set({bp:"78/42",map:54});
  await holo(`<h3>Réanimation à ce jour</h3><p>Solutés IV et antibiotiques à large spectre administrés. Hypotension persistante malgré la réanimation. Norépinéphrine débutée par une voie IV périphérique.</p><div class="kv" style="margin-top:8px"><span>TA</span><span class="flashRed">78/42 mmHg</span><span>PAM</span><span class="flashRed">54 mmHg</span></div>`, {pos:[50,30]});
}
async function scene07(){
  await camTo("iv");
  const led=$("#pumpLed"); const blink=setInterval(()=>{ led.setAttribute("fill", led.getAttribute("fill")==="#ffb547"?"#3a2a10":"#ffb547"); },400);
  AudioFX.tone(1046,.15,"square",.05); setTimeout(()=>AudioFX.tone(1046,.15,"square",.05),300);
  await bubble("b_need","a-iv");
  clearInterval(blink); led.setAttribute("fill","#ffb547");
  await holo(`<p>Le besoin continu de vasopresseurs et un accès périphérique peu fiable justifient un cathétérisme veineux central.</p><p style="font-style:normal;font-family:var(--ui);font-weight:500">Votre tâche : insérer un cathéter veineux central dans la veine jugulaire interne droite.</p>`, {pos:[40,36]});
  $("#ovh").setAttribute("opacity",.35); await camTo("neck",1400); $("#neckSpot").setAttribute("opacity",1); AudioFX.lock();
  await titleCard("Procédure initialisée","Insertion d’un CVC échoguidée","", 3000);
}
