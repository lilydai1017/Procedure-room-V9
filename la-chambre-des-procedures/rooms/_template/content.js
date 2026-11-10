"use strict";
/* ROOM TEMPLATE — CONTENT
   Copy the whole _template folder to rooms/room02, then rename every "room02"/"R02" below.
   Text shown to the player goes in STRINGS; teaching text and the reference section in MEDICAL_CONTENT_R02. */
Object.assign(STRINGS.en, {
  r02_b_intro: "What is this room?"
});
const MEDICAL_CONTENT_R02 = {
  intro: { ref: "Reference section name", teach: "One-sentence teaching point." }
};
