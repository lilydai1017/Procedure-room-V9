"use strict";
/* ROOM 01 — CONTENT (edit text here)
   All on-screen prompts (STRINGS: en = English, fr = français canadien; LANG in js/core/i18n.js picks one) and the medical teaching text + reference section for each step (MEDICAL_CONTENT).
   Primary reference: Merck Manual Professional, "How To Do Internal Jugular Vein Cannulation (Ultrasound-Guided)", Sept 2026.
   Loaded as a classic <script>: everything declared here is shared with the other files (see index.html for load order). */

const STRINGS = { en: {
  b_whats:"What’s going on?", b_who:"Who is this?", b_what:"What happened to him?", b_unstable:"How unstable is he?",
  b_wrong:"What’s wrong with him?", b_done:"What has been done?", b_need:"What does he need now?",
  b_ready:"Are we ready to proceed?", b_monitor:"Let’s monitor him.", b_position:"How should we position him?",
  b_head:"Turn his head, gently.", b_vein:"Where is the vein?", b_orient:"Check your orientation.", b_struct:"What are these structures?",
  b_suit:"Is the vein suitable?", b_needs:"What do we need?", b_prime:"Prepare the catheter.", b_protect:"Protect the sterile field.",
  b_skin:"Prepare the skin.", b_drape:"Establish a sterile field.", b_us:"What about the ultrasound?", b_target:"Locate your target.",
  b_before:"Before the needle?", b_access:"Ready to access the vein?", b_invein:"Are we in the vein?", b_next:"What’s next?",
  b_wire:"Where is the wire?", b_rmneedle:"Remove the needle.", b_entry:"Prepare the entry site.", b_room:"Make room for the catheter.",
  b_cath:"Time for the catheter.", b_cathus:"Is it in the vein?", b_forget:"Don’t forget the wire.", b_lumens:"Check the lumens.",
  b_keep:"Keep it in place.", b_cover:"Protect the insertion site.", b_finished:"Are we finished?", b_now:"What happens now?", b_complete:"Procedure complete?",
  b_depth:"How deep is it?", b_tip:"Find the tip.", b_hold:"Hold it still.",
  sound_on:"Sound on", sound_off:"Sound off"
}};
STRINGS.fr = {
  b_whats:"Que se passe-t-il?", b_who:"Qui est-ce?", b_what:"Que lui est-il arrivé?", b_unstable:"À quel point est-il instable?",
  b_wrong:"Qu’est-ce qu’il a?", b_done:"Qu’a-t-on fait jusqu’ici?", b_need:"De quoi a-t-il besoin maintenant?",
  b_ready:"Sommes-nous prêts à procéder?", b_monitor:"Installons le monitorage.", b_position:"Comment le positionner?",
  b_head:"Tournez sa tête, doucement.", b_vein:"Où est la veine?", b_orient:"Vérifiez votre orientation.", b_struct:"Quelles sont ces structures?",
  b_suit:"La veine est-elle adéquate?", b_needs:"De quoi avons-nous besoin?", b_prime:"Préparez le cathéter.", b_protect:"Protégez le champ stérile.",
  b_skin:"Préparez la peau.", b_drape:"Installez un champ stérile.", b_us:"Et l’échographe?", b_target:"Repérez votre cible.",
  b_before:"Avant l’aiguille?", b_access:"Prêt à ponctionner la veine?", b_invein:"Sommes-nous dans la veine?", b_next:"Et ensuite?",
  b_wire:"Où est le guide?", b_rmneedle:"Retirez l’aiguille.", b_entry:"Préparez le point d’entrée.", b_room:"Faites de la place pour le cathéter.",
  b_cath:"Place au cathéter.", b_cathus:"Est-il dans la veine?", b_forget:"N’oubliez pas le guide.", b_lumens:"Vérifiez les lumières.",
  b_keep:"Fixez-le en place.", b_cover:"Protégez le site d’insertion.", b_finished:"Avons-nous terminé?", b_now:"Et maintenant?", b_complete:"Procédure terminée?",
  b_depth:"À quelle profondeur?", b_tip:"Trouvez la pointe.", b_hold:"Ne bougez plus.",
  sound_on:"Son activé", sound_off:"Son désactivé"
};

/* ---------- 2. MEDICAL_CONTENT ----------
   Primary reference: Merck Manual Professional Edition, “How To Do Internal Jugular Vein
   Cannulation (Ultrasound-Guided)”, F. Alvarado, full review Sept 2026.
   Section names below match the headings of that page. */
const REF = "Merck Manual Professional, IJ cannulation (US-guided), Sept 2026";
const MEDICAL_CONTENT = {
  indication:{ref:"Indications", teach:"La perfusion de vasopresseurs et un accès périphérique inadéquat sont des indications d’accès veineux central."},
  contraind:{ref:"Contraindications", teach:"Absolues : veine thrombosée ou inaccessible à l’échographie, infection locale, opérateur non formé. La coagulopathie est relative."},
  monitor:{ref:"Step-by-step: preliminary preparation", teach:"Branchez le moniteur cardiaque : un guide ou un cathéter dans le cœur peut provoquer une ectopie."},
  position:{ref:"Positioning", teach:"Le Trendelenburg à 15–20° distend la veine jugulaire interne et aide à prévenir l’embolie gazeuse. Tournez légèrement la tête; une rotation excessive peut placer la carotide directement derrière la veine."},
  nonsterile:{ref:"Preliminary preparation (nonsterile)", teach:"Vue en petit axe. Veines : plus grosses, à paroi mince, ovoïdes, compressibles. Artères : rondes, à paroi épaisse, pulsatiles. Une thrombose disqualifie la veine."},
  equipment:{ref:"Equipment", teach:"Sonde linéaire haute fréquence, gaine stérile, antiseptique, barrière complète, lidocaïne 1 %, aiguille d’introduction sur seringue à embout lisse, guide en J, lame no 11, dilatateur, CVC, solution saline, fil de suture, disque de chlorhexidine, pansement transparent."},
  prime:{ref:"Prepare the equipment", teach:"Prérincez chaque lumière avec 3–5 mL de solution saline stérile et bouchez-la. Utilisez une seringue de 10 mL (ou plus large) pour éviter de rompre le cathéter. Introducteur sur une seringue de 5 mL contenant 1–2 mL de solution saline, biseau aligné avec les graduations."},
  barrier:{ref:"Prepare the sterile field", teach:"Barrière stérile maximale : bonnet, masque, blouse stérile, gants stériles, champ stérile corps entier."},
  antisepsis:{ref:"Prepare the sterile field", teach:"Badigeonnez le cou, la clavicule et le thorax antérieur jusque sous le mamelon homolatéral, pour garder possible une approche sous-clavière. Laissez sécher ≥ 1 min."},
  cover:{ref:"Place a sterile cover over the ultrasound probe", teach:"L’assistant tient la sonde enduite de gel, extrémité vers le haut, hors du champ. Déroulez la gaine le long du câble sans le toucher; éliminez les bulles d’air; fixez-la avec les élastiques."},
  target:{ref:"Anaesthetise the cannulation site", teach:"Centrez la veine; le milieu de la sonde marque le centre de la lumière. Mesurez la profondeur jusqu’au centre de la veine. Piquez à cette même distance de la sonde, en visant 45° vers son milieu."},
  lido:{ref:"Anaesthetise the cannulation site", teach:"Faites une papule, puis infiltrez le long du trajet à 45°, en gardant la pointe de l’aiguille visible et à distance des vaisseaux."},
  needle:{ref:"Insert the introducer needle", teach:"Inclinez la sonde pour suivre la pointe : elle apparaît et disparaît quand le plan la balaie. La paroi se déprime, puis l’aiguille entre dans la lumière avec un reflux de sang foncé."},
  confirm:{ref:"Assess the blood return", teach:"Gardez l’aiguille immobile. Le flux veineux n’est pas pulsatile. La couleur n’est pas fiable en état de choc ou d’hypoxie; en cas de doute, utilisez la manométrie ou un capteur de pression avant de dilater."},
  arterial:{ref:"Assess the blood return / Additional considerations", teach:"Ponction artérielle avec l’aiguille : arrêtez, retirez l’aiguille, comprimez 10 min. Si le dilatateur ou le cathéter est dans l’artère : laissez-le en place et appelez la chirurgie vasculaire."},
  wire:{ref:"Insert the guidewire", teach:"Biseau et courbure en J en direction médiale. Ne forcez jamais le guide. VJI droite : avancez de 10–15 cm, ou reculez jusqu’à disparition de l’ectopie. Ne lâchez jamais le guide."},
  rmneedle:{ref:"Remove the introducer needle", teach:"Tenez le guide au-delà de l’aiguille, retirez l’aiguille de la peau, puis tenez le guide à la peau et faites glisser l’aiguille hors du guide."},
  nick:{ref:"Widen the insertion tract", teach:"Une petite incision (≈4 mm) au point d’entrée du guide, sans toucher le guide."},
  dilate:{ref:"Widen the insertion tract", teach:"Avancez le dilatateur sur le guide avec un mouvement de vrille, juste à travers la paroi veineuse, puis retirez-le en gardant le guide."},
  cath:{ref:"Place the catheter", teach:"Le guide doit sortir de l’embase avant que le cathéter n’entre dans la peau. Avancez par étapes; reculez en cas d’ectopie."},
  rmwire:{ref:"Place the catheter", teach:"Tenez le cathéter à la peau et retirez le guide en entier. Vérifiez qu’il est complet."},
  flush:{ref:"Place the catheter", teach:"Pour chaque port : aspirez l’air, confirmez le retour de sang veineux, puis rincez avec de la solution saline (seringue de 10 mL ou plus large) sans force excessive."},
  dress:{ref:"Dress the site", teach:"Lidocaïne aux sites de suture si le patient est éveillé ou légèrement sédationné; disque de chlorhexidine; suturez l’ailette et un second site avec une boucle; pansement occlusif transparent."},
  cxr:{ref:"Aftercare / Warnings", teach:"Avant l’utilisation : radiographie pulmonaire. Extrémité dans la VCS près de la jonction cavo-atriale, jamais dans l’oreillette droite; exclure un pneumothorax."}
};
