"use strict";
/* ENVIRONMENT — camera
   Named camera views (world x, y, zoom) and smooth moves between them.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

const VIEWS = { wide:[800,470,1], dark:[820,520,1.15], face:[590,500,2.8], patient:[720,505,1.7], monitor:[310,300,2.3], iv:[1080,420,1.6],
  side:[840,540,1.25], cart:[1415,650,2.0], usm:[320,490,2.1], neck:[612,505,3.6], door:[1300,420,1.3], pull:[820,470,.9] };
function cam(view, instant=false){ const [cx,cy,s]=VIEWS[view]; const g=$("#cam"); g.classList.toggle("snap", instant); g.style.transform=`translate(${800-cx*s}px,${450-cy*s}px) scale(${s})`; if(instant){ g.getBoundingClientRect(); g.classList.remove("snap"); } }
async function camTo(view, ms=1900){ cam(view); await sleep(ms); }

function glowWorld(id, on=true){ const e=document.getElementById(id); if(!e) return; e.style.filter = on? "drop-shadow(0 0 6px #62e6f2) drop-shadow(0 0 14px #62e6f2)" : ""; if(on){ e.classList.add("hot"); } else e.classList.remove("hot"); }
