"use strict";
/* PATIENT — Robert Martin on the table
   Patient illustration (side view, head left), chest breathing driven by respiratory rate, ECG electrodes, dressed CVC.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

const PATIENT_SVG = `
      <ellipse cx="560" cy="540" rx="74" ry="13" fill="#b9c6d0"/>
      <!-- legs under sheet -->
      <path d="M850 512C930 506 1040 508 1120 504C1140 486 1162 488 1166 506C1172 520 1170 540 1164 548H850Z" fill="url(#gSheet)"/>
      <path d="M900 520C960 530 1010 524 1060 532M940 540C1000 536 1060 540 1110 534" stroke="#8796a4" fill="none"/>
      <!-- torso + gown (breathing) -->
      <g id="chest">
        <path d="M612 506C650 490 720 486 790 492C830 496 856 500 870 508L872 548H612Z" fill="url(#gGown)"/>
        <path d="M630 500C680 494 740 494 800 500" stroke="#a8bbcc" stroke-opacity=".35" fill="none"/>
        <g id="leadsW" opacity="0"><circle cx="660" cy="496" r="6" fill="#eef"/><circle cx="740" cy="490" r="6" fill="#eef"/><circle cx="830" cy="500" r="6" fill="#eef"/>
          <path d="M660 496C640 470 560 470 420 380M740 490C700 450 560 440 430 370M830 500C780 440 600 430 440 360" stroke="#c9d4dc" stroke-opacity=".5" fill="none"/></g>
      </g>
      <!-- arm with peripheral line -->
      <path d="M640 530C700 536 760 540 820 538C836 537 846 542 842 548H640Z" fill="url(#gSkin)" opacity=".95"/>
      <rect x="770" y="532" width="22" height="9" rx="2" fill="#e8f0f4" opacity=".85"/>
      <!-- neck -->
      <path d="M596 496C606 492 616 494 622 506L626 548H598Z" fill="url(#gSkin)"/>
      <g id="cvcWorld" opacity="0"><rect x="600" y="500" width="18" height="14" rx="3" fill="#e9f6fb" fill-opacity=".7" stroke="#9fd"/><path d="M609 506C600 480 620 470 650 470" stroke="#f2f2f2" stroke-width="3" fill="none"/><circle cx="650" cy="470" r="4" fill="#8a5a3c"/><circle cx="657" cy="466" r="4" fill="#3d6fd1"/><circle cx="664" cy="470" r="4" fill="#eee"/></g>
      <!-- head -->
      <g id="headW" style="transform-origin:566px 512px;transition:transform 1s">
        <path d="M524 516C520 488 540 470 566 470C576 470 584 472 588 476L594 470C598 472 600 478 596 484C604 488 610 496 606 506C612 512 610 522 600 526C588 540 548 544 530 532Z" fill="url(#gSkin)"/>
        <path d="M524 516C520 494 532 476 552 472C538 484 530 504 536 530Z" fill="#8c8f94"/>
        <path d="M566 492c6-2 12-2 16 1" stroke="#5a4a42" stroke-width="1.5" fill="none"/>
        <path d="M592 500c4 2 8 2 11 0" stroke="#6a4a44" stroke-width="1.6" fill="none"/>
        <ellipse cx="556" cy="508" rx="7" ry="9" fill="#a88f7c"/>
        <ellipse cx="572" cy="478" rx="6" ry="2" fill="#fff" opacity=".35"/>
        <ellipse cx="600" cy="494" rx="3" ry="1.5" fill="#fff" opacity=".3"/>
      </g>
    `;
document.getElementById("patient").innerHTML = PATIENT_SVG;

/* breathing: chest rises at the current respiratory rate */
(function breathe(){ let t0=performance.now(); function f(t){ const per=60/G.vitals.rr; const k=(Math.sin(((t-t0)/1000)/per*2*Math.PI)+1)/2; const c=$("#chest"); c.setAttribute("transform",`translate(0 ${548*(1-(1+k*.05))}) scale(1 ${1+k*.05})`); requestAnimationFrame(f);} requestAnimationFrame(f); })();
