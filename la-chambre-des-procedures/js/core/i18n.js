"use strict";
/* CORE — language
   Change LANG to "fr" once STRINGS.fr exists in a room content file.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

const LANG = "fr";
const T = k => (STRINGS[LANG] && STRINGS[LANG][k]) || STRINGS.en[k] || k;
