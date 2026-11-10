"use strict";
/* ROOM 01 — sequence (the state machine data)
   Order of steps. To reorder, add or remove a step, edit this list only.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

/* ---------- Step table: the room's data-driven sequence ---------- */
const STEPS_ROOM01 = [
  {id:"S01",phase:"opening",run:scene01},{id:"S02",phase:"opening",run:scene02},{id:"S03",phase:"opening",run:scene03},
  {id:"S04",phase:"opening",run:scene04},{id:"S05",phase:"opening",run:scene05},{id:"S06",phase:"opening",run:scene06},{id:"S07",phase:"opening",run:scene07},
  {id:"P01",phase:"assessment",med:"indication",run:step01},{id:"P02",phase:"assessment",med:"monitor",run:step02},
  {id:"P03",phase:"assessment",med:"position",run:step03},{id:"P04",phase:"assessment",med:"nonsterile",run:step04},
  {id:"P05",phase:"equipment",med:"equipment",run:step05},
  {id:"P07",phase:"sterile",med:"barrier",run:step07},{id:"P08",phase:"sterile",med:"antisepsis",run:step08},
  {id:"P09",phase:"sterile",med:"barrier",run:step09},{id:"P06",phase:"sterile",med:"prime",run:step06},{id:"P10",phase:"sterile",med:"cover",run:step10},
  {id:"P11",phase:"access",med:"target",run:step11},{id:"P12",phase:"access",med:"lido",run:step12},
  {id:"P13",phase:"access",med:"needle",run:step13},{id:"P14",phase:"access",med:"confirm",run:step14},
  {id:"P15",phase:"seldinger",med:"wire",run:step15},{id:"P16",phase:"seldinger",med:"wire",run:step16},{id:"P17",phase:"seldinger",med:"rmneedle",run:step17},
  {id:"P18",phase:"seldinger",med:"nick",run:step18},{id:"P19",phase:"seldinger",med:"dilate",run:step19},{id:"P20",phase:"seldinger",med:"cath",run:step20},
  {id:"P21",phase:"seldinger",med:"cath",run:step21},{id:"P22",phase:"seldinger",med:"rmwire",run:step22},{id:"P23",phase:"seldinger",med:"flush",run:step23},
  {id:"P24",phase:"securing",med:"dress",run:step24},{id:"P25",phase:"securing",med:"dress",run:step25},
  {id:"P26",phase:"confirmation",med:"cxr",run:step26},{id:"P27",phase:"confirmation",run:step27}
];

ROOMS.room01 = { id:"room01", title:"Accès central", steps:STEPS_ROOM01 };
