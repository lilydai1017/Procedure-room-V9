"use strict";
/* ENVIRONMENT — room scene
   The dark procedure room: walls, floor, lights, haze, cart, IV pole, monitor, bed, ultrasound machine, camera anchors.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

const ROOM_SVG = `
<defs>
  <linearGradient id="gWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060c16"/><stop offset=".7" stop-color="#0c1828"/><stop offset="1" stop-color="#0a1422"/></linearGradient>
  <linearGradient id="gFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1626"/><stop offset="1" stop-color="#020408"/></linearGradient>
  <linearGradient id="gMetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fb6c8"/><stop offset=".18" stop-color="#4e6276"/><stop offset=".55" stop-color="#25364a"/><stop offset="1" stop-color="#0d1620"/></linearGradient>
  <linearGradient id="gMetalV" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1a2838"/><stop offset=".45" stop-color="#5a7186"/><stop offset=".55" stop-color="#3a4e62"/><stop offset="1" stop-color="#121c28"/></linearGradient>
  <linearGradient id="gSkin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9c2ad"/><stop offset=".6" stop-color="#b59a86"/><stop offset="1" stop-color="#7d665a"/></linearGradient>
  <linearGradient id="gGown" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7e93a6"/><stop offset="1" stop-color="#3a4a5c"/></linearGradient>
  <linearGradient id="gSheet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9d4dc"/><stop offset="1" stop-color="#6a7a88"/></linearGradient>
  <linearGradient id="gCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bff6ff" stop-opacity=".55"/><stop offset="1" stop-color="#62e6f2" stop-opacity="0"/></linearGradient>
  <radialGradient id="gPool" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#9ff3ff" stop-opacity=".35"/><stop offset="1" stop-color="#62e6f2" stop-opacity="0"/></radialGradient>
  <radialGradient id="gRed" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff4a5a" stop-opacity=".5"/><stop offset="1" stop-color="#ff4a5a" stop-opacity="0"/></radialGradient>
  <linearGradient id="gScreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03141c"/><stop offset="1" stop-color="#010609"/></linearGradient>
  <filter id="fGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="fBlur"><feGaussianBlur stdDeviation="18"/></filter>
  <filter id="fSoft"><feGaussianBlur stdDeviation="1.2"/></filter>
</defs>
<g id="cam">
  <!-- back wall -->
  <g id="room" opacity="0" style="transition:opacity 3s">
    <rect x="-400" y="-200" width="2400" height="820" fill="url(#gWall)"/>
    <g stroke="#1a2a3e" stroke-width="2" opacity=".8">
      <path d="M-400 120H2000M-400 300H2000"/>
      <path d="M100 -200V620M420 -200V620M740 -200V620M1060 -200V620M1380 -200V620M1700 -200V620"/>
    </g>
    <g fill="#0e1b2b" stroke="#21364c">
      <rect x="140" y="140" width="250" height="140" rx="4"/><rect x="460" y="140" width="250" height="140" rx="4"/>
      <rect x="780" y="140" width="250" height="140" rx="4"/><rect x="1100" y="140" width="250" height="140" rx="4"/>
    </g>
    <g stroke="#62e6f2" stroke-opacity=".18"><path d="M150 282H380M470 282H700M790 282H1020M1110 282H1340"/></g>
    <!-- doorway at the back -->
    <g id="door"><rect x="1395" y="210" width="110" height="390" fill="#03080f" stroke="#1b3044" stroke-width="3"/>
      <rect id="doorGlow" x="1401" y="216" width="98" height="378" fill="none" stroke="#62e6f2" stroke-width="2" opacity=".06" filter="url(#fGlow)"/>
      <circle id="doorLock" cx="1490" cy="410" r="4" fill="#ff4a5a"/></g>
    <!-- floor -->
    <rect x="-400" y="620" width="2400" height="500" fill="url(#gFloor)"/>
    <g stroke="#14243a" stroke-width="1.2">
      <path d="M-400 680H2000M-400 760H2000M-400 870H2000"/>
      <path d="M800 620L-600 1100M800 620L200 1100M800 620L800 1100M800 620L1400 1100M800 620L2200 1100"/>
    </g>
  </g>
  <g id="floorLights" opacity="0" style="transition:opacity 1.2s">
    <path d="M-200 640H1800" stroke="#62e6f2" stroke-width="2" opacity=".5" filter="url(#fGlow)"/>
    <path d="M-200 900H1800" stroke="#1fb3a6" stroke-width="3" opacity=".35" filter="url(#fGlow)"/>
    <ellipse cx="820" cy="700" rx="460" ry="40" fill="url(#gPool)"/>
  </g>
  <!-- haze -->
  <g id="haze" opacity=".0" style="transition:opacity 3s">
    <ellipse cx="500" cy="420" rx="420" ry="90" fill="#1d3a52" opacity=".28" filter="url(#fBlur)"><animate attributeName="cx" values="480;560;480" dur="18s" repeatCount="indefinite"/></ellipse>
    <ellipse cx="1150" cy="360" rx="380" ry="80" fill="#163246" opacity=".22" filter="url(#fBlur)"><animate attributeName="cx" values="1180;1080;1180" dur="22s" repeatCount="indefinite"/></ellipse>
  </g>

  <!-- equipment cart -->
  <g id="cart" opacity="0" style="transition:opacity 1.5s">
    <rect x="1300" y="560" width="230" height="230" rx="6" fill="url(#gMetal)" stroke="#5c748a"/>
    <rect x="1290" y="548" width="250" height="16" rx="3" fill="#8aa2b6"/>
    <g id="cartDoorL"><rect x="1310" y="580" width="102" height="190" fill="#1a2a3c" stroke="#3a5268"/><circle cx="1400" cy="676" r="4" fill="#62e6f2"/></g>
    <g id="cartDoorR"><rect x="1418" y="580" width="102" height="190" fill="#1a2a3c" stroke="#3a5268"/><circle cx="1430" cy="676" r="4" fill="#62e6f2"/></g>
    <rect id="cartGlow" x="1300" y="560" width="230" height="230" rx="6" fill="none" stroke="#62e6f2" opacity="0" filter="url(#fGlow)"/>
    <circle cx="1320" cy="800" r="9" fill="#222"/><circle cx="1510" cy="800" r="9" fill="#222"/>
  </g>

  <!-- IV pole & pumps -->
  <g id="iv" opacity="0" style="transition:opacity 1.5s">
    <path d="M1205 160V640" stroke="url(#gMetalV)" stroke-width="7"/>
    <path d="M1170 640H1240" stroke="#5a7186" stroke-width="6"/>
    <path d="M1180 170H1230" stroke="#8aa2b6" stroke-width="4"/>
    <path d="M1185 172v40h26v-40" fill="#cfe8ee" fill-opacity=".25" stroke="#9fb6c8"/>
    <g id="pump1"><rect x="1170" y="300" width="70" height="56" rx="5" fill="#d7dde2"/><rect x="1178" y="308" width="40" height="20" fill="#03141c"/><text x="1198" y="322" font-size="10" fill="#5ef2a8" text-anchor="middle" font-family="Saira">NE</text><circle id="pumpLed" cx="1230" cy="314" r="4" fill="#ffb547"/></g>
    <g><rect x="1170" y="370" width="70" height="56" rx="5" fill="#d7dde2"/><rect x="1178" y="378" width="40" height="20" fill="#03141c"/><text x="1198" y="392" font-size="10" fill="#62e6f2" text-anchor="middle" font-family="Saira">NaCl</text></g>
    <path d="M1180 356C1120 420 1000 470 800 528" stroke="#cfe8ee" stroke-opacity=".5" fill="none" stroke-width="2"/>
    <path d="M1185 426C1110 480 1000 500 780 536" stroke="#cfe8ee" stroke-opacity=".4" fill="none" stroke-width="2"/>
  </g>

  <!-- patient monitor on articulated arm -->
  <g id="mon" opacity="0" style="transition:opacity 1.2s">
    <path d="M300 -40V160L330 200" stroke="url(#gMetalV)" stroke-width="10" fill="none"/>
    <rect x="160" y="200" width="300" height="200" rx="10" fill="#1a2533" stroke="#4a6076" stroke-width="2"/>
    <rect x="172" y="212" width="276" height="176" rx="4" fill="url(#gScreen)"/>
    <g id="monScreen" opacity="0" style="transition:opacity .6s">
      <polyline id="ecgW" fill="none" stroke="#5ef2a8" stroke-width="1.6" filter="url(#fGlow)"/>
      <polyline id="plethW" fill="none" stroke="#62e6f2" stroke-width="1.4"/>
      <g font-family="Saira" fill="#5ef2a8">
        <text x="440" y="240" text-anchor="end" font-size="11" opacity=".7">FC</text>
        <text id="mHR" x="440" y="270" text-anchor="end" font-size="30">128</text>
        <text x="440" y="300" text-anchor="end" font-size="11" fill="#ff4a5a" opacity=".8">PNI</text>
        <text id="mBP" x="440" y="322" text-anchor="end" font-size="20" fill="#ff4a5a">82/46</text>
        <text id="mMAP" x="440" y="340" text-anchor="end" font-size="13" fill="#ff4a5a">(58)</text>
        <text id="mSp" x="440" y="372" text-anchor="end" font-size="18" fill="#62e6f2">93 %</text>
        <text x="182" y="380" font-size="11" fill="#ffb547" id="mRR">FR 30</text>
        <text x="240" y="380" font-size="11" fill="#ffb547" id="mT">T 39,4</text>
      </g>
    </g>
    <circle id="monAlarm" cx="450" cy="206" r="5" fill="#ff4a5a" opacity="0"/>
  </g>

  <!-- the bed and patient (tiltable) -->
  <g id="bed" opacity="0" style="transition:opacity 2s">
   <g id="bedTilt" style="transform-origin:840px 560px;transition:transform 1.2s ease">
    <rect x="460" y="548" width="740" height="26" rx="6" fill="url(#gMetal)" stroke="#8aa2b6" stroke-width="1"/>
    <rect x="470" y="574" width="720" height="8" fill="#0b141e"/>
    <g id="patient"></g>
    <g id="bedCtrl" transform="translate(1110 556)"><rect width="46" height="16" rx="3" fill="#0a1a26" stroke="#62e6f2" stroke-opacity=".5"/><path d="M10 8h26M14 4l-4 4 4 4M32 4l4 4-4 4" stroke="#62e6f2" stroke-width="1.4" fill="none"/></g>
   </g>
    <path d="M800 582V680M880 582V680" stroke="url(#gMetalV)" stroke-width="22"/>
    <ellipse cx="840" cy="684" rx="110" ry="10" fill="#0d1620"/>
  </g>

  <!-- ultrasound machine -->
  <g id="usm" opacity="0" style="transition:opacity 1.5s">
    <rect x="300" y="560" width="22" height="210" fill="url(#gMetalV)"/>
    <rect x="252" y="766" width="120" height="14" rx="5" fill="#2a3a4c"/>
    <rect x="236" y="530" width="150" height="34" rx="5" fill="#cfd8df"/><rect x="246" y="538" width="90" height="18" rx="3" fill="#34495c"/>
    <rect x="232" y="420" width="160" height="110" rx="6" fill="#d7dde2"/><rect x="242" y="430" width="140" height="90" rx="3" fill="#020a10"/>
    <g id="usmScreen" opacity="0"><ellipse cx="300" cy="470" rx="18" ry="12" fill="#000" stroke="#7a8a90"/><circle cx="318" cy="486" r="8" fill="#000" stroke="#8a9aa0"/><rect x="242" y="430" width="140" height="90" fill="#9ab" opacity=".08"/></g>
    <g id="probeW"><path d="M352 540c0-8 6-12 12-12h6c6 0 10 4 10 12v4h-28z" fill="#e7ecef"/><path d="M366 528C366 500 340 470 330 470" stroke="#444" stroke-width="3" fill="none"/><circle cx="356" cy="538" r="2" fill="#62e6f2"/></g>
    <rect x="396" y="540" width="16" height="22" rx="3" fill="#1fb3a6" opacity=".8"/>
  </g>

  <!-- lighting -->
  <g id="ovh" opacity="0" style="transition:opacity .25s">
    <rect x="740" y="-20" width="200" height="22" rx="8" fill="#cfe8ee"/>
    <polygon points="740,0 940,0 1240,560 440,560" fill="url(#gCone)" style="mix-blend-mode:screen"/>
    <ellipse cx="840" cy="548" rx="390" ry="34" fill="url(#gPool)"/>
  </g>
  <g id="neckSpot" opacity="0" style="transition:opacity 1.2s">
    <polygon points="590,-20 640,-20 700,520 520,520" fill="url(#gCone)" opacity=".9" style="mix-blend-mode:screen"/>
    <ellipse cx="610" cy="510" rx="70" ry="22" fill="url(#gPool)"/>
  </g>
  <ellipse id="redWash" cx="310" cy="300" rx="260" ry="200" fill="url(#gRed)" opacity="0" style="transition:opacity .6s"/>
  <g id="anchors" opacity="0">
    <circle id="a-face" cx="575" cy="470" r="1"/><circle id="a-mon" cx="310" cy="200" r="1"/><circle id="a-iv" cx="1205" cy="290" r="1"/>
    <circle id="a-cart" cx="1415" cy="545" r="1"/><circle id="a-usm" cx="310" cy="420" r="1"/><circle id="a-neck" cx="610" cy="488" r="1"/>
    <circle id="a-bedc" cx="1133" cy="550" r="1"/><circle id="a-door" cx="1450" cy="205" r="1"/><circle id="a-chest" cx="740" cy="482" r="1"/>
  </g>
</g>
`;
document.getElementById("world").innerHTML = ROOM_SVG;
