"use strict";
/* MAIN — boot
   Runs the selected room step by step.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

async function runRoom(steps){
  for(let i=0;i<steps.length;i++){ G.step=i; progress(i/steps.length);
    try{ await steps[i].run(); } catch(err){ console.error("Step "+steps[i].id+" failed:", err); say("Un problème est survenu à l’étape "+steps[i].id+". Consultez la console du navigateur.","warn",8000); return; } }
}

/* Start the room named in the address (?room=room02), default room01. */
window.addEventListener("load", ()=>{
  const id = new URLSearchParams(location.search).get("room") || "room01";
  const room = ROOMS[id];
  if(!room){ say("La chambre « "+id+" » n’est pas installée.","warn",10000); return; }
  runRoom(room.steps);
});
