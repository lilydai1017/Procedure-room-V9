"use strict";
/* ROOM TEMPLATE — an example step.
   Prefix every function with the room (r02_) so names never clash with Room 01.
   Building blocks you can reuse from the engine:
     camTo(view)            move the camera (views in js/environment/camera.js)
     bubble(key, anchor)    one story bubble; waits for the click
     holo(html, opts)       holographic panel; waits for ◈
     openWS / tool / range / holdBtn / svgDrag   close-up workspace and controls (js/core/workspace.js)
     makeUS(pane)           live ultrasound (js/ultrasound/ultrasound.js)
     say(text, "good"|"warn")  feedback line */
async function r02_step01(){
  await camTo("patient");
  await bubble("r02_b_intro", "a-chest");
  await holo(`<p>${MEDICAL_CONTENT_R02.intro.teach}</p>`, {pos:[50,40]});
}
