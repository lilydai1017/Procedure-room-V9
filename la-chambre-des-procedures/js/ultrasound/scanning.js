"use strict";
/* ULTRASOUND — scanning interactions
   Probe placement on the neck, orientation, and the vein-suitability checks used by several steps.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

function scanRig(sterile, vb){
  const w=openWS("split",[sterile?"Cou droit · champ stérile":"Cou droit","Échographie · sonde linéaire"]);
  const s=anterior(w.panes[0], vb||"150 110 260 260"); setHeadRot(s,G.headRot);
  if(sterile) drapeOn(s,true);
  const us=makeUS(w.panes[1], {flip:!sterile, sterile, probeU:14, L:.1}); us.S.blank=true;
  return {w,s,us};
}
function attachProbe(s, us, onPlaced){
  const g=probeShape(s.querySelector("#aDev"), us.S.sterile);
  const region=[xFromU(16), yFromL(0), xFromU(-12), yFromL(1)];
  let onNeck=false;
  const d=svgDrag(s,g,{start:[360,150], onMove:(x,y)=>{ const inside = x>region[0]-4 && x<region[2]+4 && y>region[1]-6 && y<region[3]+6;
      if(inside){ us.S.probeU=uFromX(x); us.S.L=LFromY(y); us.S.blank=false; if(!onNeck){ onNeck=true; AudioFX.tone(520,.2,"triangle",.06); onPlaced&&onPlaced(); } } else { us.S.blank=true; } }});
  return d;
}
async function suitability(w,us,pr,sterile){
  const items=sterile? ["Veine centrée sous le milieu de la sonde","Pression légère : taille et forme réelles","Compressible"] :
    ["Perméable et compressible","Aucune thrombose visible","Diamètre adéquat","Aucune artère sus-jacente : trajet sécuritaire","Veine centrée : site d’image optimale en petit axe"];
  const h=await holo(`<h3>${sterile?"Cible":"La veine est-elle adéquate?"}</h3>${checklist(items)}`, {pos:[50,13], noCont:true, width:"min(440px,90vw)"});
  h.style.top="auto"; h.style.bottom="96px"; h.style.left="auto"; h.style.right="3vw"; h.style.transform="none";
  const done=new Set(); let artT=0, ejT=0, pT=0, compressed=false;
  await new Promise(res=>{
    us.S.onFrame=(A)=>{
      const S=us.S; const cv=Math.abs(A.uv-S.probeU), ca=Math.abs(A.ua-S.probeU), ce=Math.abs(A.uej-S.probeU);
      if(S.blank) return;
      if(S.pressure>.6 && cv<A.a){ if(!compressed){ compressed=true; say("La veine jugulaire s’affaisse sous une pression douce. L’artère carotide reste pulsatile.","good",5000);} }
      if(ca<2.2 && cv>4){ artT++; if(artT===40) say("C’est l’artère carotide. Repérez à nouveau la veine compressible.","warn",4000); } else artT=0;
      if(ce<2.5){ ejT++; if(ejT===40) say("Trop petite et superficielle : c’est la jugulaire externe. Regardez plus profondément.","warn",4200); } else ejT=0;
      if(compressed && S.pressure>.9 && cv<4){ pT++; if(pT===60) say("La veine jugulaire s’affaisse. Réduisez la pression.","warn"); } else pT=0;
      const noOverlap = Math.abs(A.uv-A.ua) > (A.a*0.65 + A.ra) && G.headRot<=30;
      const centred = cv<2.5 && S.pressure<.25;
      if(!sterile){
        if(compressed){ tick(h,0); tick(h,1); done.add(0); done.add(1); }
        if(S.L>=.3 && cv<5){ tick(h,2); done.add(2); }
        if(noOverlap && S.L>=.3 && cv<5){ tick(h,3); done.add(3); }
        if(centred && S.L>=.3 && S.L<=.9 && noOverlap){ tick(h,4); done.add(4); }
        if(done.size===5 && centred){ G.site={u:S.probeU,L:S.L}; S.onFrame=null; res(); }
      } else {
        if(centred && S.L>=.25){ tick(h,0); tick(h,1); done.add(0); done.add(1); }
        if(compressed){ tick(h,2); done.add(2); }
        if(done.size===3 && centred){ G.site={u:S.probeU,L:S.L}; S.onFrame=null; res(); }
      }
    };
  });
  AudioFX.ok(); say(sterile?"Veine centrée. Le milieu de la sonde marque maintenant le centre de la lumière.":"Veine adéquate. Région d’insertion optimale repérée.","good",4200);
  h.insertAdjacentHTML("beforeend",`<div class="okc" style="margin-top:6px">◆ ${sterile?"Cible acquise":"Région d’insertion confirmée"}</div>`);
  await sleep(2600); holoClose(h);
}
