"use strict";
/* ROOM TEMPLATE — sequence. Rename to ROOMS.room02 after copying. */
const STEPS_ROOM02 = [
  { id:"R02-P01", phase:"intro", med:"intro", run:r02_step01 }
];
ROOMS.room02 = { id:"room02", title:"Room title", steps:STEPS_ROOM02 };
