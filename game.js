/* =====================================================================
   LE POTAGER DE KAMI · les données du jeu CSS Grid
   Le plateau : un potager. L’élève écrit du CSS Grid pour que chaque
   légume pousse sur la parcelle de terre qui lui est réservée.
   Les cibles sont calculées en appliquant la solution (`solution`) au même HTML.
   ===================================================================== */
MASCOT.style = "plants";

const svgURL = s => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;
const VEG = {
  carotte: `<path d="M24 26 L40 26 L32 60 Z" fill="#FF8A3D" stroke="#1B2440" stroke-width="3" stroke-linejoin="round"/><path d="M27 34 h6 M29 44 h5" stroke="#1B2440" stroke-width="2"/><path d="M32 26 q-10 -14 -4 -20 q6 8 4 20 q2 -14 12 -16 q0 10 -12 16" fill="#3DCB8B" stroke="#1B2440" stroke-width="2.5"/>`,
  tomate: `<circle cx="32" cy="38" r="18" fill="#F03E3E" stroke="#1B2440" stroke-width="3"/><path d="M22 22 l10 6 l10 -6 l-4 8 h-12 Z" fill="#3DCB8B" stroke="#1B2440" stroke-width="2.5" stroke-linejoin="round"/><circle cx="25" cy="34" r="3" fill="#fff" opacity=".6"/>`,
  salade: `<circle cx="32" cy="36" r="20" fill="#94D82D" stroke="#1B2440" stroke-width="3"/><path d="M32 18 v36 M18 28 q14 10 28 0 M16 40 q16 10 32 0" fill="none" stroke="#2B8A3E" stroke-width="2.5"/>`,
  radis: `<path d="M32 22 q-10 -14 -2 -18 q4 6 2 18 q2 -12 10 -14 q0 8 -10 14" fill="#3DCB8B" stroke="#1B2440" stroke-width="2.5"/><circle cx="32" cy="38" r="14" fill="#E64980" stroke="#1B2440" stroke-width="3"/><path d="M32 52 v8" stroke="#1B2440" stroke-width="3" stroke-linecap="round"/>`,
  citrouille: `<ellipse cx="32" cy="40" rx="24" ry="17" fill="#FD7E14" stroke="#1B2440" stroke-width="3"/><path d="M24 25 q-6 15 0 30 M40 25 q6 15 0 30" fill="none" stroke="#1B2440" stroke-width="2.5"/><path d="M32 23 v-9 q4 -2 6 2" fill="none" stroke="#2BA86F" stroke-width="4" stroke-linecap="round"/>`,
  fraise: `<path d="M32 58 C 14 46, 14 26, 32 26 C 50 26, 50 46, 32 58 Z" fill="#FA5252" stroke="#1B2440" stroke-width="3"/><path d="M22 24 l10 6 l10 -6 l-4 -6 l-6 4 l-6 -4 Z" fill="#3DCB8B" stroke="#1B2440" stroke-width="2.5" stroke-linejoin="round"/><circle cx="27" cy="38" r="1.8" fill="#FFE066"/><circle cx="36" cy="36" r="1.8" fill="#FFE066"/><circle cx="31" cy="46" r="1.8" fill="#FFE066"/><circle cx="38" cy="45" r="1.8" fill="#FFE066"/>`,
  tournesol: `<g fill="#FFD43B" stroke="#1B2440" stroke-width="2"><circle cx="32" cy="14" r="7"/><circle cx="32" cy="50" r="7"/><circle cx="14" cy="32" r="7"/><circle cx="50" cy="32" r="7"/><circle cx="19" cy="19" r="7"/><circle cx="45" cy="45" r="7"/><circle cx="45" cy="19" r="7"/><circle cx="19" cy="45" r="7"/></g><circle cx="32" cy="32" r="12" fill="#8B5E34" stroke="#1B2440" stroke-width="3"/>`,
  courgette: `<path d="M12 44 C 20 24, 44 18, 54 22 C 56 30, 40 46, 16 50 Z" fill="#2F9E44" stroke="#1B2440" stroke-width="3" stroke-linejoin="round"/><path d="M20 42 C 30 34, 40 30, 48 27" fill="none" stroke="#8CE99A" stroke-width="2.5" stroke-dasharray="4 4"/>`
};
const vegURL = (k, ghost) => svgURL(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"${ghost ? ' opacity=".32"' : ""}>${VEG[k]}</svg>`);
const vegRules = ghost => Object.keys(VEG).map(k => `.${k}{background-image:${vegURL(k, ghost)}}`).join("");

/* Outils propres au potager (en plus de ceux du moteur : cs, decl, boardOK…) */
const tracks = (c, prop) => { const v = cs(c, ".potager", prop); return /px/.test(v) ? v.split(/\s+/).filter(Boolean).map(px) : []; };
const near = (a, b, t) => Math.abs(a - b) < (t || 1.5);
const isGrid = c => cs(c, ".potager", "display") === "grid" || (qa(c, ".potager > *").some(e => /grid/.test(cs(c, e, "display"))) ? "Le `display: grid` se met sur le parent, `.potager`, pas sur les légumes." : false);
const areasOf = c => cs(c, ".potager", "grid-template-areas").replace(/"/g, " ").replace(/\.+/g, ".").replace(/\s+/g, " ").trim();
const lines = (c, sel, axis) => [cs(c, sel, `grid-${axis}-start`), cs(c, sel, `grid-${axis}-end`)];
const inArea = (c, sel, name) => {
  if (cs(c, sel, "grid-row-start") === name) return true;
  const d = decl(c, sel, "grid-area") || "";
  if (/["']/.test(d)) return "Pas de guillemets dans `grid-area` : écris le nom tout seul.";
  return false;
};
const commas = (c, prop) => /,/.test((decl(c, ".potager", prop) || "").replace(/\([^)]*\)/g, "")) ? "Pas de virgules entre les valeurs : sépare-les par des espaces, comme `1fr 1fr 1fr`." : false;
const SIZED = `.potager>*{width:72px;height:72px}`;

/* Media queries de l’élève : les règles écrites dans @media (max-width: 600px) */
const mqRules = c => (c.rules || []).filter(r => r.media && /max-width\s*:\s*600px/i.test(r.media));
const mqDecl = (c, sel, prop) => { let v = null; mqRules(c).forEach(r => { if (r.sel && r.sel.split(",").map(s => s.trim()).includes(sel)) r.decls.forEach(d => { if (d.prop === prop) v = d.value; }); }); return v; };
const areaWords = v => (String(v || "").match(/"[^"]*"|'[^']*'/g) || []).map(s => s.slice(1, -1).trim().replace(/\s+/g, " "));

const GAME = {
  id: "kami-potager",
  name: "Le potager de Kami",
  title: ["Kami", "Grid"],
  kicker: "CSS Grid · pour bien démarrer dans le web",
  lead: "Kami le caméléon a décidé de cultiver un potager. Chaque légume doit pousser sur **sa** parcelle de terre. Pour tout ranger en rangées et en colonnes, Kami utilise **CSS Grid**, la grille du CSS. Chaque atelier terminé fait pousser une nouvelle plante autour de lui.",
  mode: "board",
  lang: "css",
  rewardWord: "plantes",
  rewardLabel: "Plante",
  rewardMsg: "Une nouvelle plante pousse dans le jardin de Kami :",
  chapterNote: "Chaque atelier terminé fait pousser une plante dans le potager de Kami.",
  finaleTitle: "Le potager de Kami est magnifique !",
  confetti: ["#FF8A3D", "#F03E3E", "#94D82D", "#FFD43B", "#8B5E34"],
  links: { html: "https://diurndesign.github.io/Html_game/", css: null, js: "https://diurndesign.github.io/javascript_game/" },
  next: {
    name: "Mission Bip (JavaScript)",
    url: "https://diurndesign.github.io/javascript_game/",
    title: "La suite : rendre la page vivante avec le JavaScript",
    text: "HTML pour la structure, CSS pour le style, Flexbox et Grid pour la mise en page : tu as les murs et la déco. Il manque l’électricité ! **Bip le robot** t’apprend le **JavaScript** : réagir à un clic, ajouter des éléments dans une grille, changer une classe pour changer la mise en page."
  },
  board: {
    items: ".potager > *",
    html: `<div class="potager">\n  <div class="carotte"></div>\n</div>`
  },
  boardSkin: {
    title: "Le potager de Kami",
    word: "légumes sur leur parcelle",
    legend: "Chaque légume doit pousser sur **la parcelle qui montre son dessin**. Le potager bouge pendant que tu tapes.",
    height: 340,
    base: `.potager{box-sizing:border-box;width:100%;height:100%;padding:14px}.potager>*{box-sizing:border-box;min-height:44px;min-width:44px;border-radius:12px;background-position:center;background-repeat:no-repeat;background-size:auto min(70%, 76px)}`,
    game: vegRules(false) + `.potager>*{background-color:#FFF8E7;border:3px solid #1B2440;box-shadow:3px 3px 0 #1B2440}.potager>*{background-color:rgba(255,248,231,.6)}.potager>.on-target{background-color:#D3F9D8;border-color:#2B8A3E}`,
    target: `body{background:repeating-linear-gradient(45deg,#8CC152 0 14px,#83B84A 14px 28px)}` + vegRules(true) + `.potager>*{background-color:#8B5E3C;border:3px dashed #5C3A21}.potager>.reached{opacity:.4}body.sandbox .potager>*{display:none}`
  },

  /* ------------------------------------------------------------------
     PAGE « DÉCOUVRIR » : c’est quoi, à quoi ça sert, pourquoi
     ------------------------------------------------------------------ */
  discover: {
    nav: "Découvrir", button: "C’est quoi Grid ?", subject: "CSS Grid",
    cardTitle: "C’est quoi CSS Grid ? À quoi ça sert ? Pourquoi on l’utilise ?",
    cardText: "5 minutes pour comprendre avant de jouer, avec une démo à tester.",
    kicker: "Étape 0 · Découvrir",
    title: "C’est quoi, **CSS Grid** ?",
    lead: "Avant de planter ton premier légume, prends cinq minutes pour comprendre ce qu’est CSS Grid, à quoi il sert, et pourquoi presque tous les sites modernes l’utilisent pour ranger leur contenu. On repart des bases, pas à pas.",
    say: "Une grille, c’est comme mon potager : des rangées, des colonnes, et chaque légume dans sa parcelle. Je t’explique tout !",
    cards: [
      { title: "C’est quoi ?", text: ["**CSS Grid** (*grid* veut dire « grille » en anglais) est une partie du **CSS**, le langage qui décide de l’apparence d’une page web : couleurs, tailles, et place de chaque chose.", "Grid sert à **ranger** les blocs d’une page dans un quadrillage invisible, fait de **colonnes** (verticales) et de **rangées** (horizontales). Exactement comme une feuille à carreaux, un tableau… ou un potager."] },
      { title: "À quoi ça sert ?", text: "Grid sert à faire la **mise en page** : décider où va chaque bloc sur l’écran. Par exemple :", list: ["ranger des photos ou des produits en colonnes bien alignées ;", "construire la structure d’un site : en-tête, menu, contenu, pied de page ;", "faire qu’une page s’adapte toute seule à un téléphone ou à un grand écran ;", "donner plus de place à un élément important : une photo à la une, une bannière."] },
      { title: "Pourquoi on l’utilise ?", text: ["Avant Grid, faire des colonnes demandait des astuces compliquées et fragiles. Avec Grid, on **dessine le plan** de la page en quelques lignes, et le navigateur range tout seul.", "Il fonctionne dans tous les navigateurs actuels (Chrome, Firefox, Safari, Edge). Il est gratuit et fait partie du CSS : rien à installer."] }
    ],
    before: {
      title: "Ce qu’il faut savoir avant de commencer",
      text: "Grid est la dernière marche de la mise en page avant le JavaScript. Pour en profiter, tu dois déjà être à l’aise avec ces notions (elles sont toutes dans les jeux précédents) :",
      items: [
        "**HTML** : une **balise**, un **élément**, l’**imbrication** : un élément **parent** contient des éléments **enfants**. Et l’attribut `class` pour nommer un élément.",
        "**Les balises de structure** : `header`, `nav`, `main`, `aside`, `footer`. On les place avec Grid dans la mission finale.",
        "**CSS** : écrire une **règle** complète (`sélecteur { propriété: valeur; }`), viser une classe avec `.nom` ou une balise par son nom, les unités `px` et `%`.",
        "**La cascade** : quand deux règles se contredisent, la dernière écrite gagne (à force égale). Ça compte pour les media queries.",
        "**Flexbox** : un **conteneur flex** range ses **éléments flex** sur un axe, avec `justify-content`, `align-items` et `gap`. Grid reprend beaucoup de ces mots, mais en deux dimensions.",
        "Avoir déjà vu une **media query** (`@media (max-width: 600px) { … }`) aide pour la mission responsive, mais on la réexplique."
      ],
      link: { label: "Revoir le jeu Flexbox", url: "https://diurndesign.github.io/Flexbox-game/" }
    },
    trioFocus: "css",
    trioHere: "Grid fait partie du CSS",
    trioNote: "Grid n’est pas un nouveau langage : ce sont des **propriétés CSS**, écrites dans le même fichier `style.css`, avec la même écriture `propriété: valeur;`. Le HTML fournit les blocs (les légumes), Grid décide **où** ils vont (les parcelles). Si tu n’as jamais écrit de CSS, commence par le jeu CSS de Kami.",
    demo: {
      title: "Les mêmes blocs, avec et sans Grid",
      text: "Clique sur les boutons : à gauche, le CSS ; à droite, le résultat. Pour les deux premiers, le HTML ne change pas du tout : seul le CSS change.",
      lang: "css",
      html: `<div class="potager">\n  <div>Carotte</div>\n  <div>Tomate</div>\n  <div>Salade</div>\n  <div>Radis</div>\n  <div>Fraise</div>\n  <div>Citrouille</div>\n</div>`,
      base: `.potager>div,.page>*{background:#FFF8E7;border:3px solid #1B2440;border-radius:10px;padding:12px;font-weight:700;text-align:center}.potager>div:nth-child(1){background:#FFD8A8}.potager>div:nth-child(2){background:#FFC9C9}.potager>div:nth-child(3){background:#D8F5A2}.potager>div:nth-child(4){background:#FCC2D7}.potager>div:nth-child(5){background:#FFE3E3}.potager>div:nth-child(6){background:#FFE8CC}.page header{background:#FFE066}.page aside{background:#D8F5A2}.page main{background:#D0EBFF;min-height:110px}.page footer{background:#E9ECEF}`,
      variants: [
        { label: "Sans Grid", css: `/* Aucune règle de mise en page */\n.potager {\n  display: block;\n}`, caption: "Sans Grid, chaque bloc prend toute la largeur et ils s’empilent les uns sous les autres. Sur un grand écran, c’est long, et il reste plein de place vide." },
        { label: "Une grille de 3 colonnes", css: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n}`, caption: "Trois lignes de CSS : les blocs se rangent en **3 colonnes égales**, avec une **gouttière** (un écart) entre eux. C’est le principe d’une galerie de photos ou d’une grille de produits." },
        { label: "Une page complète", html: `<div class="page">\n  <header>En-tête</header>\n  <aside>Menu</aside>\n  <main>Contenu</main>\n  <footer>Pied de page</footer>\n</div>`, css: `.page {\n  display: grid;\n  grid-template-columns: 120px 1fr;\n  gap: 10px;\n  grid-template-areas:\n    "entete entete"\n    "menu   contenu"\n    "pied   pied";\n}\nheader { grid-area: entete; }\naside  { grid-area: menu; }\nmain   { grid-area: contenu; }\nfooter { grid-area: pied; }`, caption: "Avec des **zones nommées**, Grid construit la structure d’une page entière : un en-tête, un menu sur le côté, le contenu, un pied de page. Regarde le CSS : le dessin entre guillemets **ressemble** à la page !" }
      ]
    },
    anatomy: {
      title: "Comment s’écrit une grille",
      text: "Deux étages : on dessine la grille sur le **conteneur de grille** (le parent, la boîte qui contient tout), puis on peut placer chaque **élément de grille** (chaque enfant direct).",
      lang: "css",
      code: `.potager {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 10px;\n}\n\n.citrouille {\n  grid-column: 1 / 3;\n}`,
      pieces: [
        [".potager", "le **conteneur de grille** : le parent, la boîte qui contient les éléments à ranger"],
        ["display: grid", "transforme le conteneur en grille. Ses enfants directs deviennent des **éléments de grille** et se rangent dans les **cellules**, un par cellule"],
        ["grid-template-columns", "le plan des colonnes : une valeur par colonne (une colonne ou une rangée s’appelle une **piste**)"],
        ["1fr", "*fr* veut dire **fraction** : une part de la place disponible. Trois `1fr` = trois tiers égaux"],
        ["gap: 10px", "la **gouttière** : l’écart entre les pistes, les allées du potager"],
        ["grid-column: 1 / 3", "sur un **élément** : il s’étend de la **ligne de grille** 1 à la ligne 3, donc sur 2 colonnes"]
      ]
    },
    compare: {
      title: "Flexbox ou Grid ?",
      text: "Le CSS a deux outils de mise en page. Ils ne sont pas rivaux : ils se complètent, et on les utilise souvent ensemble sur la même page. En résumé : Flexbox aligne sur **une** dimension, Grid organise en **deux** dimensions (rangées et colonnes).",
      cols: [
        { title: "Flexbox : une seule direction", focus: false,
          svg: "<svg viewBox='0 0 260 120' xmlns='http://www.w3.org/2000/svg' role='img' aria-label='Flexbox : des blocs de tailles différentes alignés sur une seule ligne'><rect x='4' y='20' width='252' height='66' rx='10' fill='#FFF8E7' stroke='#1B2440' stroke-width='3'/><rect x='16' y='33' width='52' height='40' rx='6' fill='#FFD43B' stroke='#1B2440' stroke-width='2.5'/><rect x='76' y='33' width='86' height='40' rx='6' fill='#FF922B' stroke='#1B2440' stroke-width='2.5'/><rect x='170' y='33' width='40' height='40' rx='6' fill='#4CC9F0' stroke='#1B2440' stroke-width='2.5'/><path d='M16 104 H236' stroke='#1B2440' stroke-width='3'/><path d='M234 97 L246 104 L234 111 Z' fill='#1B2440'/></svg>",
          items: ["**Une seule direction** : une ligne *ou* une colonne (l’axe principal).", "Les éléments se suivent, comme des perles sur un fil.", "Idéal pour : une barre de menu, une rangée de boutons, une icône à côté d’un texte.", "On part du **contenu** : chaque élément prend la place dont il a besoin."] },
        { title: "Grid : deux directions à la fois", focus: true,
          svg: "<svg viewBox='0 0 260 120' xmlns='http://www.w3.org/2000/svg' role='img' aria-label='Grid : des blocs rangés en colonnes et en rangées, une citrouille sur deux colonnes'><rect x='22' y='4' width='234' height='96' rx='10' fill='#FFF8E7' stroke='#1B2440' stroke-width='3'/><rect x='32' y='14' width='136' height='34' rx='6' fill='#FD7E14' stroke='#1B2440' stroke-width='2.5'/><rect x='176' y='14' width='68' height='34' rx='6' fill='#94D82D' stroke='#1B2440' stroke-width='2.5'/><rect x='32' y='56' width='64' height='34' rx='6' fill='#F03E3E' stroke='#1B2440' stroke-width='2.5'/><rect x='104' y='56' width='64' height='34' rx='6' fill='#FFD43B' stroke='#1B2440' stroke-width='2.5'/><rect x='176' y='56' width='68' height='34' rx='6' fill='#E64980' stroke='#1B2440' stroke-width='2.5'/><path d='M32 112 H236' stroke='#1B2440' stroke-width='3'/><path d='M234 105 L246 112 L234 119 Z' fill='#1B2440'/><path d='M10 14 V90' stroke='#1B2440' stroke-width='3'/><path d='M3 88 L10 100 L17 88 Z' fill='#1B2440'/></svg>",
          items: ["**Deux directions à la fois** : des colonnes **et** des rangées.", "Chaque élément a sa cellule, comme un légume dans sa parcelle.", "Idéal pour : une galerie, une grille de produits, la structure d’une page entière.", "On part du **plan** : on dessine la grille, puis on range les éléments dedans. Et à l’intérieur d’une cellule, on peut utiliser Flexbox."] }
      ]
    },
    usesTitle: "Où on voit des grilles dans la vraie vie",
    uses: [
      { title: "Les boutiques en ligne", text: "Les pages de produits (vêtements, livres, meubles…) rangent les articles en grille : 2 colonnes sur téléphone, 4 ou 5 sur ordinateur." },
      { title: "Les galeries de photos", text: "Un profil Instagram sur ordinateur, un portfolio de designer, un site de recettes : des images bien alignées, en colonnes et en rangées." },
      { title: "La structure des sites", text: "En-tête en haut, menu sur le côté, contenu au centre, pied de page en bas : la mise en page de très nombreux sites est une grille." },
      { title: "Les agendas et tableaux de bord", text: "Un calendrier (7 colonnes pour les jours), une appli météo, un tableau de bord avec des graphiques : des blocs rangés en lignes et en colonnes." }
    ],
    jobs: {
      title: "Et dans les métiers du web ?",
      text: "CSS Grid n’est pas un exercice d’école : les professionnels du web s’en servent tous les jours. Voici comment, concrètement.",
      items: [
        { title: "Intégrateur·rice web", text: "Son travail : transformer une **maquette** (le dessin du site fait par un designer) en vraie page HTML et CSS. Chaque jour, il ou elle trace des grilles pour placer l’en-tête, les colonnes et les cartes exactement comme sur la maquette, sur tous les écrans." },
        { title: "Développeur·se front-end", text: "Il ou elle code la partie visible des sites et des applications. Grid lui sert à fabriquer des blocs réutilisables : une grille de produits qui s’adapte toute seule à l’écran, un tableau de bord, une page d’accueil." },
        { title: "Webdesigner / UI designer", text: "Il ou elle dessine les écrans dans un logiciel comme Figma, en s’appuyant sur une grille de colonnes (souvent 12). Comprendre CSS Grid permet de proposer des mises en page réalistes et de bien se comprendre avec les développeurs." },
        { title: "Créateur·rice de sites WordPress", text: "Dans WordPress, Shopify ou Webflow, les thèmes et les blocs de mise en page utilisent Grid. Savoir le lire permet d’ajuster une page (3 colonnes au lieu de 4, un écart plus grand) sans tout casser." }
      ]
    },
    words: [
      ["**Conteneur de grille**", "le parent sur lequel on écrit `display: grid`. Dans le jeu : `.potager`."],
      ["**Élément de grille**", "chaque enfant direct du conteneur. Dans le jeu : chaque légume."],
      ["**Piste**", "une colonne ou une rangée de la grille (*track* en anglais)."],
      ["**Cellule**", "une case de la grille : le croisement d’une colonne et d’une rangée."],
      ["**Ligne de grille**", "les traits qui séparent les pistes, numérotés à partir de 1. 3 colonnes = 4 lignes verticales."],
      ["**Zone**", "un rectangle d’une ou plusieurs cellules, à qui on donne un nom avec `grid-template-areas`."]
    ],
    traps: [
      "Écrire `display: grid` sur les enfants au lieu du parent : c’est le **conteneur de grille** qui devient une grille.",
      "Séparer les pistes par des virgules : `1fr, 1fr` ne marche pas. On écrit `1fr 1fr`, avec des espaces.",
      "Confondre pistes et lignes de grille : avec 3 colonnes, les lignes vont de 1 à 4. `grid-column: 1 / 3` prend 2 colonnes, pas 3.",
      "Dessiner une zone en forme de L dans `grid-template-areas` : chaque zone doit être un rectangle, sinon tout le dessin est ignoré."
    ],
    tools: [
      "Un éditeur de code gratuit : **VS Code**. Écris ton CSS dans un fichier `style.css` relié à ta page HTML avec `<link rel=\"stylesheet\" href=\"style.css\">`.",
      "Dans Chrome ou Firefox : clic droit, **Inspecter**, puis clique sur le petit badge `grid` à côté du conteneur. La grille s’affiche par-dessus la page, avec les numéros des lignes de grille et les noms des zones.",
      "Le site **MDN** (developer.mozilla.org, en français) explique chaque propriété avec des exemples."
    ],
    ctaTitle: "Prêt à jardiner ?",
    ctaText: "21 missions t’attendent dans le potager, réparties en 6 ateliers. Chaque atelier terminé fait pousser une nouvelle plante autour de Kami."
  },

  /* ------------------------------------------------------------------
     BAC À SABLE
     ------------------------------------------------------------------ */
  sandbox: {
    id: "bac-a-sable", sandbox: true, title: "Bac à sable", mode: "board",
    say: "Le potager est à toi : plante où tu veux, rien ne peut faner ici !",
    ideas: [
      "Change le nombre de colonnes avec `grid-template-columns: repeat(4, 1fr)`.",
      "Fais s’étaler la citrouille sur deux colonnes : `.citrouille { grid-column: span 2; }`, puis sur toute la largeur : `grid-column: 1 / -1;`.",
      "Essaie `gap: 20px`, puis `gap: 4px 30px`.",
      "Donne une hauteur aux rangées créées automatiquement : `grid-auto-rows: 60px;`.",
      "Dessine un plan avec `grid-template-areas` et envoie chaque légume dans sa zone avec `grid-area`.",
      "Essaie `place-items: center` : les légumes rétrécissent, car ils n’ont pas de taille à eux.",
      "Essaie `grid-template-columns: repeat(3, 100px)` puis `justify-content: center`."
    ],
    boardHTML: `<div class="potager">\n  <div class="carotte"></div>\n  <div class="tomate"></div>\n  <div class="salade"></div>\n  <div class="radis"></div>\n  <div class="citrouille"></div>\n  <div class="fraise"></div>\n</div>`,
    starter: `.potager {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 10px;\n}\n`,
    hints: []
  },

  /* ------------------------------------------------------------------
     ATELIERS
     ------------------------------------------------------------------ */
  chapters: [
    { n: 1, title: "Tracer la grille", piece: "La carotte", notions: ["display: grid", "grid-template-columns", "fr", "repeat()"],
      skills: ["Je sais transformer un **conteneur** en grille avec `display: grid`.", "Je sais dessiner les colonnes (les **pistes**) avec `grid-template-columns`.", "Je sais partager la place avec l’unité `fr` et la mélanger avec des `px`.", "Je sais raccourcir un plan répétitif avec `repeat()`."] },
    { n: 2, title: "Les rangées", piece: "La tomate", notions: ["grid-template-rows", "gap", "grid-auto-rows", "grille implicite"],
      skills: ["Je sais dessiner les rangées avec `grid-template-rows`.", "Je sais créer des **gouttières** avec `gap`, `row-gap` et `column-gap`.", "Je sais faire la différence entre la **grille explicite** et la **grille implicite**.", "Je sais régler la hauteur des rangées créées automatiquement avec `grid-auto-rows`."] },
    { n: 3, title: "Placer les légumes", piece: "La salade", notions: ["grid-column", "grid-row", "span", "1 / -1"],
      skills: ["Je sais compter les **lignes de grille** : une de plus que de pistes.", "Je sais placer un élément avec `grid-column` et `grid-row`.", "Je sais étendre un élément sur plusieurs cellules avec `span`.", "Je sais faire traverser toute la grille à un élément avec `1 / -1`."] },
    { n: 4, title: "Les zones", piece: "La fleur", notions: ["grid-template-areas", "grid-area", ". (cellule vide)"],
      skills: ["Je sais dessiner une mise en page avec `grid-template-areas`.", "Je sais envoyer un élément dans sa **zone** avec `grid-area`.", "Je sais laisser une cellule vide avec un point `.`.", "Je sais réorganiser une page en changeant seulement le dessin des zones."] },
    { n: 5, title: "Aligner", piece: "La citrouille", notions: ["place-items", "justify-self", "align-self", "justify-content", "align-content"],
      skills: ["Je sais aligner tous les éléments dans leurs cellules avec `justify-items`, `align-items` et `place-items`.", "Je sais aligner un seul élément avec `justify-self` et `align-self`.", "Je sais déplacer toutes les pistes dans le conteneur avec `justify-content` et `align-content`.", "Je sais que `justify` est horizontal et `align` vertical."] },
    { n: 6, title: "Le grand potager", piece: "Le radis", notions: ["minmax()", "auto-fill", "@media", "mise en page"],
      skills: ["Je sais donner une taille minimale et maximale à une piste avec `minmax()`.", "Je sais faire une grille qui s’adapte toute seule avec `repeat(auto-fill, minmax(…))`.", "Je sais redessiner une grille sur téléphone avec une **media query**.", "Je sais construire la mise en page complète d’une page web avec des zones nommées."] }
  ],

  /* ------------------------------------------------------------------
     LEXIQUE, BONNES PRATIQUES, PRÊT POUR LA SUITE ?
     ------------------------------------------------------------------ */
  glossary: [
    ["**CSS Grid**", "l’outil du CSS qui range les éléments d’une page dans une grille de colonnes et de rangées (deux dimensions).", ".potager {\n  display: grid;\n}"],
    ["**Conteneur de grille**", "l’élément parent sur lequel on écrit `display: grid`. C’est lui qui porte le plan de la grille.", ".potager { display: grid; }"],
    ["**Élément de grille**", "chaque enfant **direct** du conteneur de grille. Les petits-enfants ne sont pas rangés dans la grille.", ".potager > .carotte"],
    ["**display: grid**", "la déclaration qui transforme un élément en conteneur de grille."],
    ["**Piste**", "une colonne ou une rangée de la grille (*track* en anglais). On dessine les pistes avec `grid-template-columns` et `grid-template-rows`."],
    ["**Colonne**", "une piste verticale. Les colonnes se suivent de gauche à droite.", "grid-template-columns: 1fr 1fr;"],
    ["**Rangée**", "une piste horizontale (*row* en anglais). Les rangées se suivent de haut en bas.", "grid-template-rows: 90px 1fr;"],
    ["**Cellule**", "une case de la grille : le croisement d’une colonne et d’une rangée. Un élément de grille occupe une cellule par défaut."],
    ["**Ligne de grille**", "un des traits qui séparent les pistes, numérotés à partir de 1. Il y a toujours une ligne de plus que de pistes.", "grid-column: 1 / 3;"],
    ["**Ligne négative**", "un numéro de ligne compté depuis la fin : `-1` est la dernière ligne de la grille explicite.", "grid-column: 1 / -1;"],
    ["**Zone**", "un rectangle d’une ou plusieurs cellules qui porte un nom, dessiné avec `grid-template-areas`."],
    ["**Gouttière**", "l’espace entre deux pistes, réglé avec `gap`. Il n’y a jamais de gouttière sur les bords de la grille.", "gap: 12px 40px;"],
    ["**Fraction (fr)**", "l’unité de Grid : une part de la place qui reste, une fois les tailles fixes et les gouttières retirées.", "grid-template-columns: 1fr 2fr;"],
    ["**grid-template-columns**", "la propriété qui dessine les colonnes : une valeur par colonne, séparées par des espaces.", "grid-template-columns: 120px 1fr 2fr;"],
    ["**grid-template-rows**", "la propriété qui dessine les rangées, de haut en bas.", "grid-template-rows: 70px 1fr 60px;"],
    ["**repeat()**", "un raccourci pour répéter une taille de piste : le nombre, une virgule, la taille.", "grid-template-columns: repeat(4, 1fr);"],
    ["**minmax()**", "donne à une piste une taille minimale et une taille maximale.", "grid-template-columns: repeat(3, minmax(100px, 160px));"],
    ["**auto-fill**", "à la place du nombre dans `repeat()` : « mets autant de pistes que possible ». `auto-fit` fait presque pareil, mais replie les pistes vides.", "repeat(auto-fill, minmax(100px, 1fr))"],
    ["**Grille explicite**", "les pistes que tu as dessinées toi-même avec `grid-template-columns`, `grid-template-rows` ou `grid-template-areas`."],
    ["**Grille implicite**", "les pistes que la grille crée toute seule quand il y a plus d’éléments que de cellules dessinées."],
    ["**grid-auto-rows**", "la hauteur des rangées de la grille implicite (`grid-auto-columns` fait pareil pour les colonnes).", "grid-auto-rows: 80px;"],
    ["**Placement automatique**", "le rangement par défaut : les éléments de grille remplissent les cellules libres une par une, dans l’ordre du HTML, de gauche à droite puis rangée par rangée."],
    ["**grid-column / grid-row**", "sur un élément de grille : les lignes de début et de fin, séparées par `/`.", ".citrouille {\n  grid-column: 1 / 3;\n  grid-row: 2;\n}"],
    ["**span**", "« s’étendre sur » : le nombre de cellules à prendre, sans dire où commencer.", "grid-column: span 2;"],
    ["**grid-template-areas**", "le dessin de la grille avec des mots : un texte entre guillemets par rangée, un mot par cellule.", "grid-template-areas:\n  \"entete entete\"\n  \"menu   contenu\";"],
    ["**grid-area**", "sur un élément de grille : le nom de la zone où il va, sans guillemets.", "header { grid-area: entete; }"],
    ["**Cellule vide (.)**", "dans `grid-template-areas`, un point dessine une cellule qui n’appartient à aucune zone.", "\"menu . contenu\""],
    ["**justify-items / align-items**", "sur le conteneur : aligne **tous** les éléments dans leurs cellules, à l’horizontale (`justify`) ou à la verticale (`align`).", "justify-items: center;\nalign-items: end;"],
    ["**place-items**", "le raccourci de `align-items` puis `justify-items`. `place-items: center` centre tout.", "place-items: center;"],
    ["**justify-self / align-self**", "sur **un** élément de grille : son alignement à lui dans sa cellule, qui remplace celui du conteneur.", ".radis { align-self: end; }"],
    ["**justify-content / align-content**", "sur le conteneur : déplace **toutes les pistes** dans le conteneur, quand elles ne le remplissent pas.", "justify-content: space-evenly;"],
    ["**stretch**", "la valeur d’alignement par défaut : un élément sans taille s’étire pour remplir sa cellule."],
    ["**start / center / end**", "les valeurs d’alignement de Grid : au début (gauche ou haut), au centre, à la fin (droite ou bas)."],
    ["**Raccourci**", "une propriété qui en remplace plusieurs : `gap` (pour `row-gap` et `column-gap`), `place-items`, `grid-area`…"],
    ["**Responsive**", "une page qui s’adapte à la taille de l’écran : téléphone, tablette, ordinateur."],
    ["**Media query**", "un bloc de CSS qui ne s’applique que si une condition sur l’écran est vraie.", "@media (max-width: 600px) {\n  .potager { grid-template-columns: 1fr; }\n}"],
    ["**Point de rupture**", "la largeur à laquelle la mise en page change (*breakpoint*), par exemple `600px`."],
    ["**Mobile d’abord**", "écrire d’abord le CSS du téléphone, puis ajouter des media queries `min-width` pour les écrans plus grands."],
    ["**Inspecteur**", "l’outil du navigateur (clic droit, Inspecter) qui montre la grille, ses numéros de lignes et ses zones par-dessus la page."]
  ],
  practices: [
    "Utilise **Grid** pour la mise en page en deux dimensions (rangées **et** colonnes) et **Flexbox** pour aligner sur une seule ligne, souvent à l’intérieur des cellules.",
    "Écris `display: grid` et tout le plan (pistes, gouttières, zones) sur le **conteneur** ; ne place les éléments un par un que pour les exceptions.",
    "Préfère `fr` aux pourcentages : `fr` partage la place qui reste **après** les gouttières, alors que des `%` plus un `gap` finissent par déborder.",
    "Espace les éléments avec `gap` sur le conteneur, jamais avec des `margin` sur chaque élément.",
    "Écris `repeat()` dès que plusieurs pistes ont la même taille, et `grid-column: 1 / -1` pour un élément qui traverse toute la grille.",
    "Nomme tes zones selon leur **rôle** (`entete`, `menu`, `contenu`, `pied`) et aligne le dessin de `grid-template-areas` comme un tableau.",
    "Évite les hauteurs fixes pour les rangées qui contiennent du texte : laisse `auto`, `1fr` ou `minmax(80px, auto)`, pour que rien ne déborde.",
    "Garde le HTML dans l’ordre logique de lecture : Grid change la place à l’écran, pas l’ordre lu par les lecteurs d’écran et la touche Tab.",
    "Pense **mobile d’abord** : une colonne sur téléphone, plus de colonnes quand l’écran s’élargit, avec une media query ou `repeat(auto-fill, minmax(…))`.",
    "Place tes media queries à la fin du fichier et n’y réécris que ce qui change.",
    "Indente ton CSS de 2 espaces, une déclaration par ligne, et sépare les grandes parties par un commentaire (`/* Mise en page */`).",
    "Vérifie ta grille dans l’**inspecteur** du navigateur (badge `grid`) au lieu de deviner les numéros de lignes."
  ],
  checklist: [
    { text: "Je sais transformer un conteneur en grille et dessiner ses colonnes avec `grid-template-columns`.", mission: "colonnes" },
    { text: "Je sais partager la place avec `fr` et mélanger des pistes fixes (`px`) et souples (`fr`).", mission: "px-fr" },
    { text: "Je sais écrire un plan répétitif avec `repeat()`.", mission: "repeat" },
    { text: "Je sais dessiner les rangées et créer des gouttières avec `gap`.", mission: "allees" },
    { text: "Je sais expliquer la grille implicite et régler ses rangées avec `grid-auto-rows`.", mission: "implicite" },
    { text: "Je sais compter les lignes de grille et placer un élément avec `grid-column` et `grid-row`.", mission: "grid-column" },
    { text: "Je sais étendre un élément avec `span`, et sur toute la largeur avec `1 / -1`.", mission: "toute-la-largeur" },
    { text: "Je sais dessiner une mise en page avec `grid-template-areas` et y placer les éléments avec `grid-area`.", mission: "zones" },
    { text: "Je sais aligner les éléments dans leurs cellules (`place-items`, `align-self`, `justify-self`).", mission: "self" },
    { text: "Je sais faire la différence entre `justify-content` (les pistes) et `justify-items` (les éléments).", mission: "justify-content" },
    { text: "Je sais faire une grille qui s’adapte toute seule avec `repeat(auto-fill, minmax(…))`.", mission: "auto-fill" },
    { text: "Je sais changer la grille sur téléphone avec une media query placée après la règle normale.", mission: "responsive" },
    { text: "Je sais construire la mise en page d’une page complète avec `header`, `aside`, `main` et `footer`.", mission: "finale" },
    { text: "Je sais qu’on peut changer toute une mise en page en changeant seulement une règle CSS (ou une classe) : c’est ce que fera le JavaScript.", mission: "plan" }
  ],

  levels: [
  /* ------------------------------ ATELIER 1 ------------------------------ */
  {
    id: "colonnes", ch: 1, title: "Trois parcelles", notion: "display: grid, grid-template-columns",
    say: "Bienvenue dans mon potager ! Mes trois légumes poussent les uns sous les autres, tout serrés. Trace-moi trois colonnes égales pour que chacun ait sa parcelle.",
    lesson: {
      what: ["Une **grille**, c’est un quadrillage de **colonnes** (verticales) et de **rangées** (horizontales), comme une feuille à carreaux. Une colonne ou une rangée s’appelle une **piste**. Chaque case, au croisement d’une colonne et d’une rangée, s’appelle une **cellule**.", "On transforme une boîte en grille avec `display: grid`, écrit sur le **conteneur de grille** : le parent, ici `.potager`, la boîte qui contient les légumes. Ses enfants directs deviennent des **éléments de grille**. Ensuite, `grid-template-columns` dit combien il y a de colonnes et quelle largeur elles ont. Les éléments de grille (les légumes) se rangent alors tout seuls, un par cellule."],
      why: "Sans grille, les blocs s’empilent les uns sous les autres, sur toute la largeur. Avec une grille, on les range en colonnes en deux lignes de CSS : c’est la base des galeries de photos, des grilles de produits et des pages en plusieurs colonnes.",
      code: `.potager {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n}`,
      pieces: [[".potager", "le **conteneur de grille** (le parent) : c’est lui qui devient une grille"], ["display: grid", "« range mes enfants directs dans une grille »"], ["grid-template-columns", "le plan des colonnes : une valeur par piste, séparées par des espaces"], ["1fr", "*fr* veut dire **fraction** : une part de la place disponible. `1fr 1fr 1fr` = trois parts égales, donc trois tiers"]],
      example: { code: `.boite {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n}\n.boite div {\n  background: #FFD43B;\n  border: 2px solid #1B2440;\n  padding: 8px;\n}`, html: `<div class="boite"><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div></div>` },
      trap: "Séparer les valeurs par des virgules : `1fr, 1fr, 1fr` n’est pas valide et la déclaration est ignorée. Les valeurs se séparent par des **espaces**.",
      good: "Mets `display: grid` et le plan des pistes dans **une seule règle**, sur le conteneur, avec une déclaration par ligne indentée de 2 espaces : on lit la structure de la grille d’un coup d’œil."
    },
    boardHTML: `<div class="potager">\n  <div class="carotte"></div>\n  <div class="tomate"></div>\n  <div class="salade"></div>\n</div>`,
    steps: ["Dans la règle `.potager`, ajoute `display: grid;`. Les légumes s’étirent, mais restent dans une seule colonne : une grille n’a qu’une colonne tant qu’on ne dessine rien.", "Ajoute `grid-template-columns` avec trois colonnes égales de `1fr`.", "Regarde les légumes se ranger, puis clique sur **Vérifier**."],
    starter: `.potager {\n  \n}\n`,
    goals: [
      { label: "Le potager est une grille (`display: grid`)", test: isGrid },
      { label: "Il a trois colonnes de même largeur", test: c => { const w = tracks(c, "grid-template-columns"); return (w.length === 3 && w.every(x => near(x, w[0]))) || commas(c, "grid-template-columns") || (w.length ? `Il y a ${w.length} colonne(s) pour l’instant${w.length === 3 ? ", mais elles n’ont pas la même largeur" : ""}.` : false); } },
      { label: "Les légumes sont sur leurs parcelles", test: boardOK }
    ],
    hints: ["Tout se passe dans la règle `.potager`, entre les accolades `{ }`.", "Première déclaration : `display: grid;`", "Deuxième déclaration : `grid-template-columns: 1fr 1fr 1fr;`"],
    solution: `.potager {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n}`,
    debrief: "Deux déclarations, et ta boîte est devenue une **grille** de trois colonnes. Les légumes se sont rangés tout seuls, un par cellule, de gauche à droite. Retiens : `display: grid` se met toujours sur le **conteneur**, et `fr` partage la place en parts égales. Une galerie de photos en trois colonnes se fait exactement comme ça."
  },
  {
    id: "px-fr", ch: 1, title: "Petits radis, grandes courgettes", notion: "mélanger px et fr",
    say: "Dans ma première colonne, je plante des radis : ils ne prennent presque pas de place. Les courgettes, elles, s’étalent partout ! Il me faut des colonnes de largeurs différentes.",
    lesson: {
      what: ["On peut mélanger les **unités**. Les `px` (pixels, les minuscules points de l’écran) donnent une largeur **fixe**, qui ne change jamais. Les `fr` se partagent **ce qui reste**.", "Avec `120px 1fr 2fr`, le navigateur réserve d’abord 120 pixels pour la première piste. Puis il coupe le reste en 3 parts : 1 part pour la deuxième colonne, 2 parts pour la troisième."],
      why: "Dans un vrai site, certaines zones ont une taille fixe (un menu de 200px sur le côté) et d’autres doivent s’adapter à la taille de l’écran (le contenu). Mélanger `px` et `fr`, c’est exactement ça.",
      code: `.potager {\n  display: grid;\n  grid-template-columns: 120px 1fr 2fr;\n}`,
      pieces: [["120px", "une piste fixe de 120 pixels, quelle que soit la taille de l’écran"], ["1fr", "une part de la place qui reste"], ["2fr", "deux parts : deux fois plus large que `1fr`"]],
      trap: "Croire que `2fr` veut dire « 2 pixels ». Les `fr` sont des **parts** : on additionne les parts (1 + 2 = 3), puis chaque colonne prend les siennes.",
      good: "Préfère `fr` aux pourcentages pour partager la place : `fr` compte **après** les gouttières, alors que `33%` + un écart finit par déborder. Garde les `px` pour ce qui doit vraiment rester fixe."
    },
    boardHTML: `<div class="potager">\n  <div class="radis"></div>\n  <div class="fraise"></div>\n  <div class="courgette"></div>\n</div>`,
    steps: ["La grille de trois colonnes est déjà tracée.", "La colonne des radis doit faire exactement `120px`.", "La colonne des courgettes doit être **deux fois** plus large que celle des fraises : utilise des `fr`."],
    starter: `.potager {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n}\n`,
    goals: [
      { label: "La colonne des radis fait `120px`", test: c => { const w = tracks(c, "grid-template-columns"); return (w.length === 3 && near(w[0], 120)) || commas(c, "grid-template-columns") || (w.length === 3 ? `Elle fait ${Math.round(w[0])}px pour l’instant : écris 120px pour la première valeur.` : (w.length ? "Il faut garder trois colonnes." : false)); } },
      { label: "La colonne des courgettes est deux fois plus large que celle des fraises (en `fr`)", test: c => { const w = tracks(c, "grid-template-columns"); const d = decl(c, ".potager", "grid-template-columns") || ""; if (!(w.length === 3 && near(w[2], 2 * w[1], 3))) return false; return /fr/.test(d) || "C’est la bonne taille, mais utilise des fr pour partager la place qui reste."; } },
      { label: "Les légumes sont sur leurs parcelles", test: boardOK }
    ],
    hints: ["Toujours une valeur par piste, séparées par des espaces.", "La première en pixels : `120px`. Les deux autres en `fr` : une part, puis deux parts.", "`grid-template-columns: 120px 1fr 2fr;`"],
    solution: `.potager {\n  display: grid;\n  grid-template-columns: 120px 1fr 2fr;\n}`,
    debrief: "Tu as mélangé une piste **fixe** (`px`) et des pistes **souples** (`fr`). Si tu agrandis la fenêtre du navigateur, la colonne de 120px ne bouge pas, les deux autres grandissent. C’est le principe d’un site avec un menu fixe sur le côté et un contenu qui s’adapte à l’écran."
  },
  {
    id: "repeat", ch: 1, title: "Huit légumes en rang", notion: "repeat()",
    say: "J’ai planté huit légumes ! Je voudrais quatre colonnes égales. Écrire `1fr` quatre fois, c’est long… Il paraît qu’il existe un raccourci.",
    lesson: {
      what: ["`repeat()` est une **fonction** CSS qui sert de raccourci : `repeat(4, 1fr)` veut dire « répète `1fr` 4 fois ». C’est exactement pareil que `1fr 1fr 1fr 1fr`, en plus court.", "Quand une rangée est pleine, les légumes suivants passent tout seuls à la rangée suivante, dans l’ordre du HTML : c’est le **placement automatique**."],
      why: "Les grilles de produits ou de photos ont souvent 4, 6, voire 12 colonnes. Avec `repeat()`, on écrit moins, on se trompe moins, et pour passer de 4 à 6 colonnes, on change un seul chiffre.",
      code: `.potager {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n}`,
      pieces: [["repeat(", "« répète… »"], ["4", "combien de pistes"], [", 1fr)", "la taille de chaque piste, après une virgule"], ["placement automatique", "quand les 4 colonnes sont pleines, les légumes suivants passent tout seuls à la rangée suivante"]],
      example: { code: `.galerie {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n}\n.galerie div {\n  height: 36px;\n  border: 2px solid #1B2440;\n  background: #FFD8A8;\n}`, html: `<div class="galerie"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>` },
      trap: "Oublier la virgule **dans** `repeat(4, 1fr)`. Ici, et seulement ici, la virgule est obligatoire : elle sépare le nombre de répétitions et la taille.",
      good: "Dès que plusieurs pistes ont la même taille, écris `repeat()` : le code est plus court, plus lisible, et il n’y a qu’un seul chiffre à changer."
    },
    boardHTML: `<div class="potager">\n  <div class="carotte"></div>\n  <div class="tomate"></div>\n  <div class="salade"></div>\n  <div class="radis"></div>\n  <div class="citrouille"></div>\n  <div class="fraise"></div>\n  <div class="tournesol"></div>\n  <div class="courgette"></div>\n</div>`,
    steps: ["Il y a pour l’instant deux colonnes : remplace-les par **quatre** colonnes égales.", "Utilise `repeat()` au lieu d’écrire `1fr` quatre fois."],
    starter: `.potager {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n}\n`,
    goals: [
      { label: "Le potager a quatre colonnes égales", test: c => { const w = tracks(c, "grid-template-columns"); return (w.length === 4 && w.every(x => near(x, w[0]))) || (w.length ? `Il y a ${w.length} colonne(s) pour l’instant.` : false); } },
      { label: "Tu utilises le raccourci `repeat()`", test: c => /repeat\s*\(/.test(decl(c, ".potager", "grid-template-columns") || "") || (tracks(c, "grid-template-columns").length === 4 ? "Ça marche, mais essaie le raccourci : repeat(4, 1fr)." : false) },
      { label: "Les légumes sont sur leurs parcelles", test: boardOK }
    ],
    hints: ["On change seulement la valeur de `grid-template-columns`.", "Le modèle : `repeat(combien, taille)`.", "`grid-template-columns: repeat(4, 1fr);`"],
    solution: `.potager {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n}`,
    debrief: "Huit légumes, quatre colonnes : la grille a créé **deux rangées** toute seule. Tu n’as rien écrit pour les rangées, et pourtant elles sont là : ce sont des rangées **implicites**, que tu apprendras à régler dans l’atelier 2. On retrouve `repeat()` dans presque toutes les grilles de produits des boutiques en ligne."
  },

  /* ------------------------------ ATELIER 2 ------------------------------ */
  {
    id: "rangees", ch: 2, title: "La rangée des petits", notion: "grid-template-rows",
    say: "En haut, je plante les petits : radis, fraises et carottes. En bas, les gros : citrouille, courgette, salade. La rangée du haut n’a pas besoin d’être aussi haute !",
    lesson: {
      what: "`grid-template-columns` dessine les colonnes ; `grid-template-rows` dessine les **rangées** (les pistes horizontales du quadrillage). Même écriture : une valeur par rangée, de haut en bas.",
      why: "Sans `grid-template-rows`, les rangées se partagent la hauteur à parts égales. En les dessinant, tu décides : un bandeau fin en haut, une grande zone en dessous… C’est comme ça qu’on fait l’en-tête d’un site.",
      code: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: 90px 1fr;\n}`,
      pieces: [["grid-template-rows", "le plan des rangées, de haut en bas (*row* = rangée)"], ["90px", "la première rangée : 90 pixels de haut, fixe"], ["1fr", "la deuxième rangée prend toute la hauteur qui reste"]],
      trap: "Confondre les deux mots anglais : *columns* = colonnes (côte à côte, de gauche à droite), *rows* = rangées (les unes sous les autres, de haut en bas).",
      good: "Réserve les hauteurs fixes en `px` aux bandeaux de taille connue (un en-tête, une barre d’outils). Pour une rangée qui contient du texte, laisse `1fr` ou `auto` : si le texte s’allonge, la rangée grandit au lieu de déborder."
    },
    boardHTML: `<div class="potager">\n  <div class="radis"></div>\n  <div class="fraise"></div>\n  <div class="carotte"></div>\n  <div class="citrouille"></div>\n  <div class="courgette"></div>\n  <div class="salade"></div>\n</div>`,
    steps: ["Les trois colonnes sont déjà là.", "Ajoute `grid-template-rows` : une première rangée de `90px`, puis une deuxième qui prend toute la hauteur qui reste (`1fr`)."],
    starter: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  \n}\n`,
    goals: [
      { label: "Deux rangées sont dessinées avec `grid-template-rows`", test: c => { const d = decl(c, ".potager", "grid-template-rows"); const r = tracks(c, "grid-template-rows"); return (!!d && r.length === 2) || (d ? `Ton plan a ${r.length} rangée(s) : il en faut deux.` : false); } },
      { label: "La rangée du haut fait `90px`, celle du bas prend le reste", test: c => { const r = tracks(c, "grid-template-rows"); const d = decl(c, ".potager", "grid-template-rows") || ""; if (r.length !== 2) return false; if (!near(r[0], 90)) return `La rangée du haut fait ${Math.round(r[0])}px : il faut 90px.`; return /fr|auto/.test(d) || "Pour la rangée du bas, utilise 1fr : elle prendra la place qui reste, quelle que soit la hauteur du potager."; } },
      { label: "Les légumes sont sur leurs parcelles", test: boardOK }
    ],
    hints: ["Ajoute une déclaration dans `.potager` : `grid-template-rows: … ;`", "Deux valeurs, de haut en bas : la première en `px`, la deuxième en `fr`.", "`grid-template-rows: 90px 1fr;`"],
    solution: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: 90px 1fr;\n}`,
    debrief: "Colonnes **et** rangées : tu contrôles maintenant les deux dimensions. C’est ce qui rend Grid unique : on dessine un vrai quadrillage. Sur un site, un en-tête fin en haut et un grand contenu en dessous, c’est exactement `grid-template-rows: 90px 1fr`."
  },
  {
    id: "allees", ch: 2, title: "Les allées du potager", notion: "gap, row-gap, column-gap",
    say: "Mes légumes sont collés les uns aux autres : impossible de passer entre eux ! Il me faut des allées. Et entre les colonnes, une allée plus large pour ma brouette.",
    lesson: {
      what: ["L’espace entre deux pistes s’appelle une **gouttière** (comme la bande blanche entre deux colonnes d’un journal). On la règle avec `gap` (« écart » en anglais), sur le conteneur.", "Les gouttières sont **entre** les pistes, jamais sur les bords. Avec une valeur, l’écart est le même partout. Avec deux valeurs, la première est l’écart entre les rangées, la deuxième entre les colonnes : `gap` est un **raccourci** pour `row-gap` et `column-gap`."],
      why: "Sans gouttière, les éléments se touchent et la page est difficile à lire. Avant `gap`, il fallait mettre des marges sur chaque élément, puis enlever celle du dernier… Avec `gap`, une seule déclaration sur le conteneur suffit.",
      code: `/* le même écart partout */\n.potager { gap: 20px; }\n\n/* deux valeurs : rangées, puis colonnes */\n.potager { gap: 12px 40px; }\n\n/* ou chaque écart séparément */\n.potager {\n  row-gap: 12px;\n  column-gap: 40px;\n}`,
      pieces: [["gap: 20px", "la même gouttière entre toutes les pistes"], ["gap: 12px 40px", "deux valeurs : les rangées d’abord, les colonnes ensuite"], ["row-gap", "seulement la gouttière entre les rangées"], ["column-gap", "seulement la gouttière entre les colonnes"]],
      trap: "Mettre des `margin` sur les légumes pour les écarter : ça ajoute aussi de l’espace sur les bords, et les tailles ne tombent plus juste. Pour espacer les cellules d’une grille, c’est `gap`, sur le conteneur.",
      good: "Espace toujours les éléments d’une grille (et d’un conteneur flex) avec `gap` : une seule valeur à changer, et aucune marge en trop sur les bords."
    },
    boardHTML: `<div class="potager">\n  <div class="carotte"></div>\n  <div class="tomate"></div>\n  <div class="salade"></div>\n  <div class="radis"></div>\n  <div class="fraise"></div>\n  <div class="citrouille"></div>\n</div>`,
    steps: ["Entre les **rangées**, une allée de `12px`.", "Entre les **colonnes**, une allée de `40px` pour la brouette.", "Tu peux écrire `row-gap` et `column-gap`, ou un seul `gap` avec deux valeurs."],
    starter: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: 1fr 1fr;\n  \n}\n`,
    goals: [
      { label: "Gouttières de `12px` entre les rangées", test: c => cs(c, ".potager", "row-gap") === "12px" || (cs(c, ".potager", "column-gap") === "12px" ? "Tu as mis 12px entre les colonnes : avec gap, la première valeur est pour les rangées." : (qa(c, ".potager > *").some(e => px(cs(c, e, "margin-top")) > 0) ? "Pas de margin sur les légumes : utilise gap sur .potager." : false)) },
      { label: "Gouttières de `40px` entre les colonnes", test: c => cs(c, ".potager", "column-gap") === "40px" },
      { label: "Les légumes sont sur leurs parcelles", test: boardOK }
    ],
    hints: ["Les gouttières s’écrivent sur `.potager`, pas sur les légumes.", "`row-gap: 12px;` puis `column-gap: 40px;`", "Ou en une seule déclaration : `gap: 12px 40px;` (rangées d’abord, colonnes ensuite)."],
    solution: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: 1fr 1fr;\n  gap: 12px 40px;\n}`,
    debrief: "`gap` crée des gouttières **entre** les pistes, jamais autour. Remarque : les colonnes ont un peu rétréci pour laisser la place aux allées, et elles sont restées égales, grâce à `fr`. Sur une page de produits, c’est `gap` qui sépare les cartes les unes des autres."
  },
  {
    id: "implicite", ch: 2, title: "Des semis en plus", notion: "grille implicite, grid-auto-rows",
    say: "J’ai semé plus de graines que prévu ! Mon plan n’a qu’une rangée, alors le potager a ajouté des rangées tout seul… mais elles sont toutes déformées. Je veux que chaque rangée fasse 80 pixels.",
    lesson: {
      what: ["Les pistes que tu dessines avec `grid-template-columns` et `grid-template-rows` forment la **grille explicite** (*explicite* = dite clairement).", "Quand il y a plus d’éléments que de cellules dessinées, la grille ne les jette pas : elle crée toute seule de nouvelles rangées. Ces pistes ajoutées forment la **grille implicite** (*implicite* = sous-entendue). Leur taille se règle avec `grid-auto-rows` (et `grid-auto-columns` pour les colonnes)."],
      why: "Sur un vrai site, on ne sait presque jamais combien il y aura d’éléments : des produits qui viennent d’une base de données, des photos ajoutées par les visiteurs, des cartes créées par le **JavaScript**… On dessine les colonnes, et on laisse la grille créer les rangées qu’il faut, à la bonne hauteur.",
      code: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: 80px;   /* grille explicite : 1 rangée */\n  grid-auto-rows: 80px;       /* grille implicite */\n}`,
      pieces: [["grid-template-rows: 80px", "la grille **explicite** : une seule rangée dessinée, donc 3 cellules"], ["9 légumes", "il manque 6 cellules : la grille ajoute 2 rangées **implicites**"], ["grid-auto-rows: 80px", "la hauteur de chaque rangée créée automatiquement"], ["sans grid-auto-rows", "les rangées implicites ont la taille `auto` : elles s’étirent pour remplir la place qui reste, ou s’écrasent sur leur contenu"]],
      example: { code: `.liste {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-auto-rows: 30px;\n  gap: 4px;\n}\n.liste div {\n  background: #D8F5A2;\n  border: 2px solid #1B2440;\n}`, html: `<div class="liste"><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>` },
      trap: "Ajouter une valeur dans `grid-template-rows` à chaque nouvel élément (`80px 80px 80px…`). Le jour où il y en a un de plus, sa rangée n’a plus la bonne taille. `grid-auto-rows` règle **toutes** les rangées à venir d’un coup.",
      good: "Quand le nombre d’éléments peut changer, dessine seulement les colonnes et règle les rangées avec `grid-auto-rows`. Pour du texte, préfère `grid-auto-rows: minmax(80px, auto)` : au moins 80px, et plus si le contenu en a besoin."
    },
    boardHTML: `<div class="potager">\n  <div class="carotte"></div>\n  <div class="tomate"></div>\n  <div class="salade"></div>\n  <div class="radis"></div>\n  <div class="fraise"></div>\n  <div class="tournesol"></div>\n  <div class="courgette"></div>\n  <div class="citrouille"></div>\n  <div class="salade"></div>\n</div>`,
    steps: ["Le plan dessine 3 colonnes et **une seule** rangée de `80px` : c’est la grille explicite, 3 cellules pour 9 légumes.", "Regarde les 2 rangées du bas : la grille les a ajoutées toute seule (grille implicite), et elles s’étirent jusqu’en bas.", "Ajoute `grid-auto-rows` pour que les rangées implicites fassent aussi `80px`. Ne touche pas à `grid-template-rows`."],
    starter: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: 80px;\n  gap: 10px;\n  \n}\n`,
    goals: [
      { label: "Les rangées implicites font `80px` (`grid-auto-rows`)", test: c => cs(c, ".potager", "grid-auto-rows") === "80px" || (tracks(c, "grid-template-rows").length === 3 && tracks(c, "grid-template-rows").every(x => near(x, 80)) ? "Ça marche pour 9 légumes, mais si Kami en sème 3 de plus ? Laisse grid-template-rows: 80px; et ajoute grid-auto-rows: 80px;." : (/grid-auto-rows/.test(c.clean) ? "Vérifie la valeur : grid-auto-rows: 80px;" : false)) },
      { label: "Les 3 rangées du potager font `80px`", test: c => { const r = tracks(c, "grid-template-rows"); return (r.length === 3 && r.every(x => near(x, 80))) || (r.length === 3 ? `Les rangées font ${r.map(Math.round).join("px, ")}px.` : false); } },
      { label: "Les légumes sont sur leurs parcelles", test: boardOK }
    ],
    hints: ["La propriété à ajouter dans `.potager` commence par `grid-auto-`.", "*auto* = les pistes créées automatiquement, *rows* = les rangées : `grid-auto-rows`.", "`grid-auto-rows: 80px;`"],
    solution: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: 80px;\n  gap: 10px;\n  grid-auto-rows: 80px;\n}`,
    debrief: "Tu connais maintenant les deux parties d’une grille : la grille **explicite** (ce que tu dessines) et la grille **implicite** (ce que la grille ajoute toute seule). Avec `grid-auto-rows`, Kami peut semer 9, 12 ou 30 légumes : chaque nouvelle rangée fera 80px. C’est comme ça que fonctionne une liste de produits qui se remplit au fil des pages."
  },
  {
    id: "quiz1", ch: 2, quiz: true, title: "Contrôle des parcelles", notion: "quiz",
    say: "Avant de planter plus loin, je vérifie que tu connais bien le plan de mon potager. Tout juste, et ma tomate pousse !",
    questions: [
      { q: "Sur quel élément écrit-on `display: grid` ?", opts: ["Sur chaque légume", "Sur le conteneur de grille, le parent qui contient les légumes", "Nulle part : on écrit une balise `<grid>` dans le HTML"], a: 1, why: "C’est le **conteneur de grille** (le parent) qui devient une grille. Ses enfants directs deviennent des éléments de grille et se rangent dans les cellules." },
      { q: "Que fait `grid-template-columns: 1fr 2fr;` ?", opts: ["Deux colonnes : la deuxième est deux fois plus large que la première", "Deux colonnes de 1 et 2 pixels", "Une colonne et deux rangées"], a: 0, why: "Deux valeurs = deux pistes. `fr` = une fraction de la place : 1 part + 2 parts, donc la deuxième fait le double." },
      { q: "Ce potager a 7 légumes. Que se passe-t-il ?", code: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}`, opts: ["Les légumes 4 à 7 disparaissent : il n’y a que 3 cellules", "Les 7 légumes se serrent sur une seule rangée", "La grille crée toute seule les rangées qu’il faut : c’est la grille implicite"], a: 2, why: "Les 3 colonnes forment la grille explicite. Pour les légumes en plus, la grille ajoute des rangées : la **grille implicite**, dont on règle la hauteur avec `grid-auto-rows`." },
      { q: "Que fait cette déclaration ?", code: `.potager { gap: 10px 30px; }`, opts: ["10px entre les rangées, 30px entre les colonnes", "10px autour du potager, 30px entre les cellules", "10px entre les colonnes, 30px entre les rangées"], a: 0, why: "Avec deux valeurs, `gap` donne d’abord la gouttière entre les rangées, puis entre les colonnes. Et jamais de gouttière sur les bords." }
    ],
    debrief: "Colonnes, rangées, `fr`, `repeat()`, `gap` et grille implicite : tu sais tracer le plan complet d’une grille. Il reste à apprendre à placer chaque légume exactement où tu veux."
  },

  /* ------------------------------ ATELIER 3 ------------------------------ */
  {
    id: "grid-column", ch: 3, title: "Trop gros pour une cellule", notion: "lignes de grille, grid-column",
    say: "Ma citrouille et ma courgette sont trop grosses pour une seule parcelle ! Elles ont besoin de deux cellules chacune, côte à côte.",
    lesson: {
      what: ["Une grille est tracée par des **lignes de grille** numérotées, comme les traits d’une feuille à carreaux. Avec 3 colonnes, il y a **4 lignes verticales** : la ligne 1 tout à gauche, la ligne 4 tout à droite. Il y a toujours une ligne de plus que de pistes.", "`grid-column: 1 / 3` veut dire : « commence à la ligne 1, arrête-toi à la ligne 3 ». L’élément de grille occupe donc les colonnes 1 et 2."],
      why: "Par défaut, chaque élément prend une cellule. Mais dans une vraie page, certains éléments doivent être plus larges : une photo à la une, une bannière, une grande carte. On leur donne leurs lignes de début et de fin.",
      code: `.citrouille {\n  grid-column: 1 / 3;\n}`,
      pieces: [[".citrouille", "cette fois, on écrit sur **l’élément de grille**, le légume à placer"], ["grid-column", "les lignes verticales de début et de fin (c’est un raccourci de `grid-column-start` et `grid-column-end`)"], ["1", "la ligne de début"], ["/ 3", "la ligne de fin (la barre `/` sépare les deux)"]],
      example: { code: `.grille {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 4px;\n}\n.grille div {\n  background: #FFF3BF;\n  border: 2px solid #1B2440;\n}\n.grille .grand {\n  grid-column: 1 / 3;\n  background: #FFC078;\n}`, html: `<div class="grille"><div class="grand">1 / 3</div><div>B</div><div>C</div><div>D</div><div>E</div></div>` },
      trap: "Compter les colonnes au lieu des lignes. Pour occuper les colonnes 2 et 3, on écrit `2 / 4`, pas `2 / 3` : on s’arrête à la ligne qui est **après** la dernière colonne.",
      good: "Ne devine pas les numéros : ouvre l’**inspecteur** du navigateur (clic droit, Inspecter, badge `grid`). Il dessine la grille par-dessus la page avec le numéro de chaque ligne."
    },
    boardHTML: `<div class="potager">\n  <div class="citrouille"></div>\n  <div class="carotte"></div>\n  <div class="tomate"></div>\n  <div class="courgette"></div>\n</div>`,
    steps: ["La citrouille occupe les colonnes 1 et 2 : de la ligne 1 à la ligne 3.", "La courgette occupe les colonnes 2 et 3 : de la ligne 2 à la ligne 4.", "Les autres légumes se rangent tout seuls dans les cellules libres."],
    starter: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n}\n\n.citrouille {\n  \n}\n\n.courgette {\n  \n}\n`,
    goals: [
      { label: "La citrouille va de la ligne 1 à la ligne 3", test: c => { const [s, e] = lines(c, ".citrouille", "column"); return (s === "1" && e === "3") || (/span/.test(s + e) ? "Ça marche, mais ici écris les numéros de lignes : 1 / 3." : (s === "1" && e === "2" ? "1 / 2 ne prend qu’une colonne : la fin est la ligne 3." : false)); } },
      { label: "La courgette va de la ligne 2 à la ligne 4", test: c => { const [s, e] = lines(c, ".courgette", "column"); return (s === "2" && e === "4") || (s === "2" && e === "3" ? "2 / 3 ne prend qu’une colonne : va jusqu’à la ligne 4." : (/span/.test(s + e) ? "Ici, écris les numéros de lignes : 2 / 4." : false)); } },
      { label: "Les légumes sont sur leurs parcelles", test: boardOK }
    ],
    hints: ["Les numéros comptent les **lignes de grille** (les traits), pas les cellules. 3 colonnes = lignes 1, 2, 3 et 4.", "Pour la citrouille : `grid-column: 1 / 3;`", "Pour la courgette : `grid-column: 2 / 4;`"],
    solution: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n}\n\n.citrouille {\n  grid-column: 1 / 3;\n}\n\n.courgette {\n  grid-column: 2 / 4;\n}`,
    debrief: "Tu as étalé des éléments sur **plusieurs colonnes** en donnant leurs lignes de début et de fin. Et les autres légumes se sont glissés tout seuls dans les cellules libres : c’est le **placement automatique**. Retiens : on place avec des **lignes**, pas avec des cellules."
  },
  {
    id: "grid-row", ch: 3, title: "Le tournesol vise le ciel", notion: "grid-row",
    say: "Mon tournesol grandit, grandit… Il lui faut toute la hauteur du potager, dans la colonne de droite, là où le soleil tape le plus fort.",
    lesson: {
      what: "`grid-row` fonctionne exactement comme `grid-column`, mais à la verticale : il donne la ligne de grille **horizontale** de début et celle de fin. Avec 2 rangées, les lignes horizontales vont de 1 (tout en haut) à 3 (tout en bas). En combinant les deux, on place un élément de grille sur n’importe quelles cellules.",
      why: "Avec `grid-row` et `grid-column`, on place un élément où on veut, même s’il est écrit en premier dans le HTML. Une barre sur le côté qui prend toute la hauteur de la page se fait comme ça.",
      code: `.tournesol {\n  grid-column: 3;\n  grid-row: 1 / 3;\n}`,
      pieces: [["grid-column: 3", "un seul numéro : l’élément commence à la ligne 3 et prend une piste, donc la 3ᵉ colonne"], ["grid-row: 1 / 3", "de la ligne horizontale 1 (en haut) à la ligne 3 (en bas) : les deux rangées"]],
      trap: "Écrire `grid-row: 1 / 2` en pensant « les rangées 1 et 2 ». `1 / 2` ne prend qu’**une** rangée : de la ligne 1 à la ligne 2.",
      good: "Garde ton HTML dans l’ordre logique de lecture. Grid peut afficher un élément ailleurs, mais les lecteurs d’écran et la touche Tab suivent toujours l’ordre du HTML : déplace pour la mise en page, pas pour changer le sens du contenu."
    },
    boardHTML: `<div class="potager">\n  <div class="tournesol"></div>\n  <div class="carotte"></div>\n  <div class="tomate"></div>\n  <div class="salade"></div>\n  <div class="radis"></div>\n</div>`,
    steps: ["Le tournesol va dans la **troisième colonne** : utilise `grid-column`.", "Il prend **les deux rangées** : utilise `grid-row`, de la ligne 1 à la ligne 3.", "Regarde : les autres légumes se décalent pour lui laisser la place."],
    starter: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: 1fr 1fr;\n  gap: 10px;\n}\n\n.tournesol {\n  \n}\n`,
    goals: [
      { label: "Le tournesol est dans la 3ᵉ colonne", test: c => { const [s, e] = lines(c, ".tournesol", "column"); return (s === "3" && (e === "auto" || e === "4")) || (s === "auto" && e === "auto" ? false : "La 3ᵉ colonne commence à la ligne 3 : grid-column: 3;"); } },
      { label: "Il va de la ligne horizontale 1 à la ligne 3", test: c => { const [s, e] = lines(c, ".tournesol", "row"); return (s === "1" && e === "3") || (s === "1" && e === "2" ? "1 / 2 ne prend qu’une rangée : la fin est la ligne 3." : (/span/.test(s + e) ? "Ici, écris les numéros de lignes : 1 / 3." : false)); } },
      { label: "Les légumes sont sur leurs parcelles", test: boardOK }
    ],
    hints: ["Deux déclarations dans la règle `.tournesol` : une pour la colonne, une pour les rangées.", "Pour la colonne : `grid-column: 3;`", "Pour la hauteur : `grid-row: 1 / 3;`"],
    solution: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: 1fr 1fr;\n  gap: 10px;\n}\n\n.tournesol {\n  grid-column: 3;\n  grid-row: 1 / 3;\n}`,
    debrief: "Le tournesol est écrit en **premier** dans le HTML, et pourtant il est tout à droite : avec Grid, la place à l’écran ne dépend plus seulement de l’ordre du code. Les autres légumes remplissent les cellules libres, dans l’ordre. Sur un site, une barre latérale qui prend toute la hauteur se place exactement comme ça."
  },
  {
    id: "span", ch: 3, title: "Pousser sans compter", notion: "span",
    say: "Compter les lignes, c’est fatigant. Je voudrais juste dire : « ma courgette prend deux cellules en largeur, ma citrouille deux cellules en hauteur », sans chercher les numéros.",
    lesson: {
      what: "`span` veut dire « s’étendre sur ». `grid-column: span 2` signifie : « prends 2 colonnes, à partir de là où le placement automatique te met ». On ne donne plus de numéro de ligne : la grille trouve la place toute seule.",
      why: "Avec `span`, on décrit la **taille** d’un élément sans dire **où** il commence. C’est parfait pour une galerie où certaines photos sont plus grandes : elles prennent 2 cellules, et les autres se rangent autour.",
      code: `.courgette {\n  grid-column: span 2;\n}\n.citrouille {\n  grid-row: span 2;\n}`,
      pieces: [["span 2", "« sur 2 pistes »"], ["grid-column: span 2", "2 colonnes de large"], ["grid-row: span 2", "2 rangées de haut"]],
      trap: "Écrire `grid-column: 2` en pensant « 2 cellules ». Sans `span`, le chiffre est un **numéro de ligne** : l’élément va dans la colonne 2, et ne prend qu’une cellule.",
      good: "Choisis selon ce qui compte : `span` quand seule la **taille** importe (une photo plus grande dans une galerie), les numéros de lignes quand la **position** exacte importe (un menu toujours à gauche)."
    },
    boardHTML: `<div class="potager">\n  <div class="courgette"></div>\n  <div class="carotte"></div>\n  <div class="citrouille"></div>\n  <div class="tomate"></div>\n  <div class="salade"></div>\n  <div class="radis"></div>\n</div>`,
    steps: ["La courgette prend **deux colonnes** de large.", "La citrouille prend **deux rangées** de haut.", "Utilise `span`, sans numéros de lignes."],
    starter: `.potager {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 10px;\n}\n\n.courgette {\n  \n}\n\n.citrouille {\n  \n}\n`,
    goals: [
      { label: "La courgette s’étend sur 2 colonnes avec `span`", test: c => { const [s, e] = lines(c, ".courgette", "column"); return /span 2/.test(s + " " + e) || (s !== "auto" ? "Ça marche peut-être, mais utilise span 2 : pas besoin de numéros." : (lines(c, ".courgette", "row").join(" ").includes("span") ? "Tu as étiré la courgette en hauteur : c’est grid-column pour la largeur." : false)); } },
      { label: "La citrouille s’étend sur 2 rangées avec `span`", test: c => { const [s, e] = lines(c, ".citrouille", "row"); return /span 2/.test(s + " " + e) || (s !== "auto" ? "Utilise span 2 plutôt qu’un numéro de ligne." : (lines(c, ".citrouille", "column").join(" ").includes("span") ? "Tu as élargi la citrouille : c’est grid-row pour la hauteur." : false)); } },
      { label: "Les légumes sont sur leurs parcelles", test: boardOK }
    ],
    hints: ["`span` s’écrit à la place des numéros, dans `grid-column` ou `grid-row`.", "Pour la courgette (largeur) : `grid-column: span 2;`", "Pour la citrouille (hauteur) : `grid-row: span 2;`"],
    solution: `.potager {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 10px;\n}\n\n.courgette {\n  grid-column: span 2;\n}\n\n.citrouille {\n  grid-row: span 2;\n}`,
    debrief: "`span` dit **combien** de cellules prendre, le placement automatique choisit **où**. Les autres légumes se sont faufilés dans les trous. C’est la technique des galeries « en mosaïque », comme sur les pages d’accueil des magazines en ligne, où certaines images sont plus grandes que d’autres."
  },
  {
    id: "toute-la-largeur", ch: 3, title: "D’un bout à l’autre", notion: "lignes négatives : 1 / -1",
    say: "J’ai agrandi mon potager : il a maintenant quatre colonnes ! Mais ma rangée de courgettes s’arrête avant le bout. Je veux qu’elle aille d’un bord à l’autre, et la citrouille aussi, même si j’ajoute encore des colonnes.",
    lesson: {
      what: ["Les lignes de grille ont deux numéros : on les compte depuis le début (1, 2, 3…) **ou depuis la fin** avec des nombres négatifs. `-1` est toujours la **dernière** ligne, `-2` l’avant-dernière.", "`grid-column: 1 / -1` veut donc dire : « de la première ligne à la dernière », c’est-à-dire toute la largeur de la grille, quel que soit le nombre de colonnes."],
      why: "Une bannière, un titre ou un pied de page doivent souvent traverser toute la grille. Avec `1 / 4`, il faut tout recompter le jour où la grille passe à 4 ou 6 colonnes. Avec `1 / -1`, le code reste juste tout seul.",
      code: `.courgette {\n  grid-column: 1 / -1;\n}`,
      pieces: [["1", "la première ligne de grille, tout à gauche"], ["-1", "la dernière ligne, tout à droite, comptée depuis la fin"], ["1 / -1", "toute la largeur, même si le nombre de colonnes change"], ["-2", "l’avant-dernière ligne : `1 / -2` s’arrête avant la dernière colonne"]],
      example: { code: `.grille {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 4px;\n}\n.grille div {\n  background: #FFF3BF;\n  border: 2px solid #1B2440;\n}\n.grille .titre {\n  grid-column: 1 / -1;\n  background: #FFC078;\n}`, html: `<div class="grille"><div class="titre">1 / -1</div><div>A</div><div>B</div><div>C</div><div>D</div></div>` },
      trap: "`-1` ne compte que la grille **explicite**, celle que tu as dessinée. `grid-row: 1 / -1` ne prend pas toute la hauteur si les rangées n’ont pas été dessinées avec `grid-template-rows` : elles sont implicites.",
      good: "Pour tout élément qui doit traverser toute la grille (bannière, titre, pied de page), écris `grid-column: 1 / -1` plutôt qu’un numéro : ton code survit aux changements de colonnes."
    },
    boardHTML: `<div class="potager">\n  <div class="courgette"></div>\n  <div class="carotte"></div>\n  <div class="tomate"></div>\n  <div class="salade"></div>\n  <div class="radis"></div>\n  <div class="citrouille"></div>\n</div>`,
    steps: ["La grille a maintenant **4 colonnes**, donc 5 lignes verticales.", "La règle `.courgette` a été écrite quand il n’y avait que 3 colonnes : `1 / 4` ne va plus jusqu’au bout. Remplace-la par `1 / -1`.", "Fais pareil pour la citrouille : elle traverse toute la grille."],
    starter: `.potager {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 10px;\n}\n\n/* Écrit quand le potager avait 3 colonnes… */\n.courgette {\n  grid-column: 1 / 4;\n}\n\n.citrouille {\n  \n}\n`,
    goals: [
      { label: "La courgette va de la première à la dernière ligne (`1 / -1`)", test: c => { const [s, e] = lines(c, ".courgette", "column"); return (s === "1" && e === "-1") || (s === "1" && e === "5" || /span 4/.test(s + e) ? "Ça tombe juste aujourd’hui, mais si Kami ajoute une colonne il faudra tout recompter : écris 1 / -1." : (e === "4" ? "1 / 4 s’arrête avant la dernière colonne : la dernière ligne, c’est -1." : false)); } },
      { label: "La citrouille traverse aussi toute la grille", test: c => { const [s, e] = lines(c, ".citrouille", "column"); return (s === "1" && e === "-1") || (s === "1" && e === "5" || /span 4/.test(s + e) ? "Utilise -1 pour la dernière ligne : 1 / -1." : false); } },
      { label: "Les légumes sont sur leurs parcelles", test: boardOK }
    ],
    hints: ["Les nombres négatifs comptent les lignes de grille depuis la fin.", "La dernière ligne, c’est `-1`. La première, c’est `1`.", "`.courgette { grid-column: 1 / -1; }` et `.citrouille { grid-column: 1 / -1; }`"],
    solution: `.potager {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 10px;\n}\n\n/* Écrit quand le potager avait 3 colonnes… */\n.courgette {\n  grid-column: 1 / -1;\n}\n\n.citrouille {\n  grid-column: 1 / -1;\n}`,
    debrief: "`1 / -1` : de la première à la dernière ligne, quel que soit le nombre de colonnes. Essaie de remplacer `repeat(4, 1fr)` par `repeat(5, 1fr)` : la courgette et la citrouille suivent toutes seules. C’est la façon pro d’écrire un titre ou une bannière qui traverse toute une grille de cartes."
  },

  /* ------------------------------ ATELIER 4 ------------------------------ */
  {
    id: "zones", ch: 4, title: "Le plan avec des mots", notion: "grid-template-areas, grid-area",
    say: "J’ai dessiné le plan de mon potager avec des mots ! Chaque coin a un nom : les fleurs, les feuilles, les racines et les fruits. Envoie chaque légume dans son coin.",
    lesson: {
      what: ["`grid-template-areas` permet de **dessiner** la grille avec des mots. Chaque texte entre guillemets est une rangée, chaque mot est une cellule. Quand un nom est répété sur des cellules voisines, il forme une **zone** : un rectangle de plusieurs cellules qui porte ce nom.", "Ensuite, sur chaque élément de grille, `grid-area` dit dans quelle zone il va."],
      why: "C’est la façon la plus lisible de faire une mise en page : en lisant le CSS, on **voit** la page. Et pour changer la mise en page, on change le dessin, sans toucher au HTML.",
      code: `.potager {\n  grid-template-areas:\n    "fleurs feuilles feuilles"\n    "fleurs racines  fruits";\n}\n.tournesol {\n  grid-area: fleurs;\n}`,
      pieces: [['"fleurs feuilles feuilles"', "la première rangée : 3 cellules. `feuilles` est écrit 2 fois : la zone prend 2 cellules"], ['"fleurs racines fruits"', "la deuxième rangée. `fleurs` est encore là : la zone des fleurs prend 2 rangées"], ["grid-area: fleurs", "sur l’élément de grille : « va dans la zone qui s’appelle fleurs »"], ["les noms", "c’est toi qui les inventes : sans accents, sans espaces, sans guillemets dans `grid-area`"]],
      trap: "Mettre des guillemets dans `grid-area` : `grid-area: \"fleurs\";` ne marche pas. Les guillemets, c’est seulement dans le dessin, `grid-template-areas`.",
      good: "Nomme tes zones selon leur **rôle** (`entete`, `menu`, `contenu`, `pied`), pas selon leur place ou leur couleur (`haut`, `gauche`, `bleu`) : si la mise en page change, le nom reste vrai."
    },
    boardHTML: `<div class="potager">\n  <div class="carotte"></div>\n  <div class="tomate"></div>\n  <div class="salade"></div>\n  <div class="tournesol"></div>\n</div>`,
    steps: ["Le plan est déjà dessiné dans `.potager`, et le tournesol est déjà dans la zone `fleurs`.", "La salade va dans la zone `feuilles`, la carotte dans `racines`, la tomate dans `fruits`.", "Écris une règle par légume, avec `grid-area`."],
    starter: `.potager {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-template-rows: 1fr 1fr;\n  gap: 10px;\n  grid-template-areas:\n    "fleurs feuilles feuilles"\n    "fleurs racines  fruits";\n}\n\n.tournesol {\n  grid-area: fleurs;\n}\n\n`,
    goals: [
      { label: "La salade est dans la zone `feuilles`", test: c => inArea(c, ".salade", "feuilles") },
      { label: "La carotte est dans `racines`, la tomate dans `fruits`", test: c => { const a = inArea(c, ".carotte", "racines"), b = inArea(c, ".tomate", "fruits"); return (a === true && b === true) || (typeof a === "string" ? a : typeof b === "string" ? b : (a === true || b === true ? "Encore un légume à envoyer dans sa zone." : false)); } },
      { label: "Les légumes sont sur leurs parcelles", test: boardOK }
    ],
    hints: ["Une nouvelle règle par légume : `.salade { … }`, `.carotte { … }`, `.tomate { … }`.", "Dans chaque règle : `grid-area:` suivi du nom de la zone, sans guillemets.", "`.salade { grid-area: feuilles; }`, `.carotte { grid-area: racines; }`, `.tomate { grid-area: fruits; }`"],
    solution: `.potager {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-template-rows: 1fr 1fr;\n  gap: 10px;\n  grid-template-areas:\n    "fleurs feuilles feuilles"\n    "fleurs racines  fruits";\n}\n\n.tournesol {\n  grid-area: fleurs;\n}\n\n.salade {\n  grid-area: feuilles;\n}\n\n.carotte {\n  grid-area: racines;\n}\n\n.tomate {\n  grid-area: fruits;\n}`,
    debrief: "Tu as placé les légumes **par le nom de leur zone**, sans aucun numéro de ligne. Et le dessin dans `grid-template-areas` ressemble vraiment au potager : c’est tout l’intérêt. Les mises en page de sites (en-tête, menu, contenu, pied de page) s’écrivent très souvent comme ça."
  },
  {
    id: "plan", ch: 4, title: "La mare au milieu", notion: "redessiner les zones, la cellule vide",
    say: "Cette année, je change tout : je creuse une petite mare au milieu du potager, et les légumes tournent autour. Redessine le plan, sans toucher aux légumes !",
    lesson: {
      what: ["Pour réorganiser la grille, on ne touche ni au HTML ni aux règles des légumes : on **redessine** `grid-template-areas`.", "Un point `.` dessine une **cellule vide** : elle n’appartient à aucune zone, rien n’y pousse."],
      why: "C’est la grande force des zones : un seul dessin à modifier pour réorganiser toute la page. Par exemple, sur téléphone on empile les zones les unes sous les autres, et sur ordinateur on les met côte à côte.",
      code: `.potager {\n  grid-template-areas:\n    "soleil  soleil fraises"\n    "courges .      fraises"\n    "courges radis  radis";\n}`,
      pieces: [['"soleil soleil fraises"', "rangée 1 : le soleil sur 2 cellules, les fraises sur 1"], [".", "une cellule vide : la mare"], ["même nombre de mots", "chaque rangée doit avoir autant de cellules que de colonnes (ici 3)"], ["des rectangles", "chaque zone doit former un rectangle"]],
      trap: "Dessiner une zone en forme de L, ou en deux morceaux séparés. C’est interdit : le navigateur ignore alors **toute** la déclaration. Chaque zone doit être un rectangle.",
      good: "Aligne les mots du dessin avec des espaces pour qu’il forme un vrai tableau : une erreur (zone en L, mot manquant) saute alors aux yeux."
    },
    boardHTML: `<div class="potager">\n  <div class="tournesol"></div>\n  <div class="fraise"></div>\n  <div class="citrouille"></div>\n  <div class="radis"></div>\n</div>`,
    steps: ["Rangée 1 : le `soleil` sur deux cellules, puis les `fraises`.", "Rangée 2 : les `courges`, la mare (`.`), puis encore les `fraises`.", "Rangée 3 : les `courges`, puis les `radis` sur deux cellules."],
    starter: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: repeat(3, 1fr);\n  gap: 8px;\n  grid-template-areas:\n    "soleil fraises courges"\n    "soleil fraises courges"\n    "radis  radis   radis";\n}\n\n/* Les légumes connaissent déjà leur zone : ne change rien ici. */\n.tournesol  { grid-area: soleil; }\n.fraise     { grid-area: fraises; }\n.citrouille { grid-area: courges; }\n.radis      { grid-area: radis; }\n`,
    goals: [
      { label: "Le dessin est valide : 3 rangées de 3 cellules, des zones rectangulaires", test: c => { const a = areasOf(c); return (a !== "none" && a.split(" ").length === 9) || (a === "none" ? "Le dessin est ignoré : vérifie les guillemets, que chaque rangée a 3 mots et que chaque zone est un rectangle." : "Il faut 3 rangées de 3 mots."); } },
      { label: "La cellule du milieu est vide (`.`)", test: c => { const a = areasOf(c).split(" "); return (a.length === 9 && a[4] === ".") || (a.length === 9 ? "Au milieu de la 2ᵉ rangée, écris un point : c’est la mare." : false); } },
      { label: "Les légumes sont sur leurs parcelles", test: boardOK }
    ],
    hints: ["Tu ne modifies que les trois textes entre guillemets dans `grid-template-areas`.", "Rangée 2 : `\"courges . fraises\"`. Le point est un mot à lui tout seul.", "Le dessin complet : `\"soleil soleil fraises\"` puis `\"courges . fraises\"` puis `\"courges radis radis\"`."],
    solution: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: repeat(3, 1fr);\n  gap: 8px;\n  grid-template-areas:\n    "soleil  soleil fraises"\n    "courges .      fraises"\n    "courges radis  radis";\n}\n\n/* Les légumes connaissent déjà leur zone : ne change rien ici. */\n.tournesol  { grid-area: soleil; }\n.fraise     { grid-area: fraises; }\n.citrouille { grid-area: courges; }\n.radis      { grid-area: radis; }`,
    debrief: "Tu as réorganisé tout le potager sans toucher à un seul légume : seulement le dessin. Le point `.` laisse une cellule vide. Retiens : **une seule déclaration** à changer pour une nouvelle mise en page. C’est ce qu’on fera pour le téléphone dans l’atelier 6, et ce que le JavaScript pourra faire d’un clic, en changeant une classe."
  },

  /* ------------------------------ ATELIER 5 ------------------------------ */
  {
    id: "place-items", ch: 5, title: "Les jeunes pousses", notion: "justify-items, align-items, place-items",
    say: "Mes jeunes pousses sont plus petites que leur parcelle, et elles sont toutes coincées dans le coin en haut à gauche ! Je les veux centrées, et posées en bas de leur parcelle.",
    lesson: {
      what: ["Ici, les légumes ont une taille fixe de 72 pixels : ils sont plus **petits** que leur cellule. On peut donc choisir où ils se placent **dans** leur cellule.", "`justify-items` les aligne à l’horizontale (gauche, centre, droite). `align-items` les aligne à la verticale (haut, centre, bas). On les écrit sur le **conteneur de grille**, et ça s’applique à tous les éléments d’un coup.", "En Grid, c’est simple à retenir : `justify` = **horizontal**, `align` = **vertical**. (En Flexbox, ça dépendait de l’axe principal.)"],
      why: "Centrer une icône dans une carte, poser des boutons en bas d’une zone, mettre un logo au milieu d’un bandeau : c’est le quotidien de la mise en page. Ces propriétés le font pour toutes les cellules à la fois.",
      code: `.potager {\n  justify-items: center;   /* horizontal */\n  align-items: end;        /* vertical */\n}`,
      pieces: [["justify-items", "l’alignement **horizontal** dans chaque cellule"], ["align-items", "l’alignement **vertical** dans chaque cellule"], ["start / center / end", "au début (gauche ou haut), au centre, à la fin (droite ou bas)"], ["stretch", "la valeur par défaut : l’élément s’étire pour remplir sa cellule, s’il n’a pas de taille fixe"], ["place-items: end center", "le raccourci des deux : d’abord la verticale (`align`), puis l’horizontale (`justify`)"]],
      trap: "Écrire `align-items: bottom` : ça n’existe pas. En Grid, on dit `start` (début) et `end` (fin). Et dans `place-items`, l’ordre est vertical **puis** horizontal.",
      good: "Pour centrer quelque chose dans une cellule, écris `place-items: center` sur le conteneur : c’est la solution la plus courte et la plus lisible. Oublie les marges calculées à la main."
    },
    boardHTML: `<div class="potager">\n  <div class="carotte"></div>\n  <div class="tomate"></div>\n  <div class="salade"></div>\n  <div class="radis"></div>\n  <div class="fraise"></div>\n  <div class="courgette"></div>\n</div>`,
    boardBase: SIZED,
    steps: ["Centre les légumes à l’horizontale dans leur cellule.", "Pose-les en bas de leur cellule, à la verticale.", "Bonus : essaie de faire les deux en une seule déclaration avec `place-items`."],
    starter: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: 1fr 1fr;\n  gap: 10px;\n  \n}\n`,
    goals: [
      { label: "Centrés à l’horizontale (`justify-items: center`)", test: c => /center/.test(cs(c, ".potager", "justify-items")) || (/center/.test(cs(c, ".potager", "align-items")) ? "Tu as centré à la verticale : l’horizontal, c’est justify-items." : false) },
      { label: "Posés en bas de leur cellule (`align-items: end`)", test: c => /end/.test(cs(c, ".potager", "align-items")) || (/end/.test(cs(c, ".potager", "justify-items")) ? "Tu as poussé à droite : le vertical, c’est align-items." : false) },
      { label: "Les légumes sont sur leurs parcelles", test: boardOK }
    ],
    hints: ["Les deux propriétés vont dans `.potager`, sur le conteneur.", "`justify-items: center;` et `align-items: end;`", "Ou en une déclaration : `place-items: end center;` (vertical d’abord)."],
    solution: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: 1fr 1fr;\n  gap: 10px;\n  justify-items: center;\n  align-items: end;\n}`,
    debrief: "`justify-items` = horizontal, `align-items` = vertical, et `place-items` fait les deux. Attention : ces propriétés ne se voient que si l’élément est plus petit que sa cellule. Et le fameux `place-items: center` est sans doute la façon la plus simple de **centrer** quelque chose en CSS."
  },
  {
    id: "self", ch: 5, title: "Chacun sa place", notion: "justify-self, align-self",
    say: "Tous mes légumes sont bien centrés. Mais le tournesol veut monter vers le soleil, le radis veut descendre près de ses racines, et la citrouille roule toujours vers la droite !",
    lesson: {
      what: "`justify-self` et `align-self` font la même chose que `justify-items` et `align-items`, mais pour **un seul** élément de grille. On les écrit sur l’**élément** : pour lui seul, ils remplacent l’alignement choisi par le conteneur.",
      why: "Souvent, tout est aligné pareil sauf une exception : un badge « Nouveau » dans un coin, un bouton collé à droite. Pas besoin de tout changer : on règle juste l’exception.",
      code: `.tournesol {\n  align-self: start;\n}\n.citrouille {\n  justify-self: end;\n}`,
      pieces: [["…-items", "sur le **conteneur** : pour tous les éléments"], ["…-self", "sur **un élément** : pour lui seul (*self* = « soi-même »)"], ["align-self: start", "en haut de sa cellule"], ["justify-self: end", "à droite de sa cellule"]],
      trap: "Écrire `align-self` sur `.potager`. Les propriétés en `-self` vont sur l’élément de grille ; sur le conteneur, elles n’ont aucun effet sur les légumes.",
      good: "Écris la règle générale sur le conteneur et **seulement les exceptions** sur les éléments : moins de code, et chaque exception se repère tout de suite en lisant le CSS."
    },
    boardHTML: `<div class="potager">\n  <div class="tournesol"></div>\n  <div class="carotte"></div>\n  <div class="radis"></div>\n  <div class="salade"></div>\n  <div class="citrouille"></div>\n  <div class="tomate"></div>\n</div>`,
    boardBase: SIZED,
    steps: ["Les légumes sont déjà centrés avec `place-items: center`.", "Le tournesol monte en **haut** de sa cellule.", "Le radis descend en **bas** de sa cellule.", "La citrouille roule à **droite** de sa cellule."],
    starter: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: 1fr 1fr;\n  gap: 10px;\n  place-items: center;\n}\n\n.tournesol {\n  \n}\n`,
    goals: [
      { label: "Le tournesol est en haut de sa cellule (`align-self`)", test: c => /start/.test(cs(c, ".tournesol", "align-self")) || (/start|end/.test(cs(c, ".tournesol", "justify-self")) ? "justify-self est horizontal : pour monter, c’est align-self." : false) },
      { label: "Le radis est en bas de sa cellule", test: c => /end/.test(cs(c, ".radis", "align-self")) },
      { label: "La citrouille est à droite de sa cellule (`justify-self`)", test: c => /end/.test(cs(c, ".citrouille", "justify-self")) || (/end/.test(cs(c, ".citrouille", "align-self")) ? "align-self est vertical : pour aller à droite, c’est justify-self." : false) },
      { label: "Les légumes sont sur leurs parcelles", test: boardOK }
    ],
    hints: ["Une règle par légume : `.tournesol`, `.radis`, `.citrouille`.", "Monter ou descendre, c’est vertical : `align-self`. Aller à droite, c’est horizontal : `justify-self`.", "`.tournesol { align-self: start; }`, `.radis { align-self: end; }`, `.citrouille { justify-self: end; }`"],
    solution: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: 1fr 1fr;\n  gap: 10px;\n  place-items: center;\n}\n\n.tournesol {\n  align-self: start;\n}\n\n.radis {\n  align-self: end;\n}\n\n.citrouille {\n  justify-self: end;\n}`,
    debrief: "Le conteneur donne la règle générale (`place-items: center`), chaque élément peut faire une exception (`align-self`, `justify-self`). Ce duo « règle + exception » revient tout le temps en CSS. Sur une carte de produit, c’est comme ça qu’on colle le badge « Promo » dans un coin."
  },
  {
    id: "justify-content", ch: 5, title: "Les bacs au milieu du jardin", notion: "justify-content, align-content",
    say: "Mes bacs à semis ont une taille fixe, et ils sont tous entassés dans le coin en haut à gauche du jardin. Je veux les répartir sur toute la largeur, et les mettre à mi-hauteur.",
    lesson: {
      what: ["Quand les pistes ont une taille fixe (ici `100px` et `90px`), elles peuvent être **plus petites** que le conteneur : il reste de l’espace libre autour de la grille.", "`justify-content` déplace alors **toutes les colonnes** à l’horizontale dans le conteneur, et `align-content` **toutes les rangées** à la verticale. Ce sont les mêmes valeurs qu’en Flexbox : `start`, `center`, `end`, `space-between`, `space-around`, `space-evenly`."],
      why: "Une grille de cartes de largeur fixe centrée au milieu d’une grande page, un calendrier centré dans son cadre : on déplace la grille entière, sans toucher à la taille des pistes.",
      code: `.potager {\n  grid-template-columns: repeat(3, 100px);\n  grid-template-rows: repeat(2, 90px);\n  justify-content: space-evenly;  /* les colonnes */\n  align-content: center;          /* les rangées */\n}`,
      pieces: [["justify-content", "répartit les **colonnes** dans la largeur du conteneur"], ["align-content", "répartit les **rangées** dans la hauteur du conteneur"], ["space-evenly", "le même espace partout : entre les pistes et sur les bords"], ["place-content", "le raccourci des deux : `place-content: center space-evenly` (vertical d’abord)"], ["avec des fr", "aucun effet : les pistes en `fr` remplissent déjà tout le conteneur, il ne reste pas d’espace libre"]],
      example: { code: `.cadre {\n  display: grid;\n  grid-template-columns: repeat(3, 40px);\n  grid-auto-rows: 30px;\n  gap: 4px;\n  justify-content: center;\n  background: #E9ECEF;\n}\n.cadre div {\n  background: #D0EBFF;\n  border: 2px solid #1B2440;\n}`, html: `<div class="cadre"><div></div><div></div><div></div><div></div><div></div><div></div></div>` },
      trap: "Confondre `justify-content` et `justify-items`. `…-items` déplace chaque élément **dans sa cellule** ; `…-content` déplace **les pistes entières** dans le conteneur. Si les pistes sont en `fr`, `…-content` ne fait rien.",
      good: "Retiens la famille d’alignement : `…-content` pour les **pistes** dans le conteneur, `…-items` pour **tous les éléments** dans leurs cellules, `…-self` pour **un seul** élément."
    },
    boardHTML: `<div class="potager">\n  <div class="carotte"></div>\n  <div class="tomate"></div>\n  <div class="salade"></div>\n  <div class="radis"></div>\n  <div class="fraise"></div>\n  <div class="citrouille"></div>\n</div>`,
    steps: ["Les pistes sont fixes : 3 colonnes de `100px`, 2 rangées de `90px`. Elles ne remplissent pas le jardin.", "Répartis les **colonnes** avec le même espace partout : `justify-content: space-evenly`.", "Centre les **rangées** en hauteur : `align-content: center`."],
    starter: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 100px);\n  grid-template-rows: repeat(2, 90px);\n  gap: 10px;\n  \n}\n`,
    goals: [
      { label: "Les colonnes sont réparties (`justify-content: space-evenly`)", test: c => { const v = cs(c, ".potager", "justify-content"); return v === "space-evenly" || (/center|space|end|start/.test(cs(c, ".potager", "justify-items")) ? "justify-items déplace les légumes dans leurs cellules. Ici, ce sont les colonnes entières qu’il faut répartir : justify-content." : (v && v !== "normal" ? `Tu as écrit ${v} : il faut le même espace partout, bords compris (space-evenly).` : false)); } },
      { label: "Les rangées sont centrées en hauteur (`align-content: center`)", test: c => { const v = cs(c, ".potager", "align-content"); return v === "center" || (/center/.test(cs(c, ".potager", "align-items")) ? "align-items centre les légumes dans leurs cellules. Pour déplacer les rangées entières, c’est align-content." : false); } },
      { label: "Les légumes sont sur leurs parcelles", test: boardOK }
    ],
    hints: ["On déplace les **pistes**, pas les légumes : les propriétés finissent par `-content`.", "Horizontal = `justify`, vertical = `align`.", "`justify-content: space-evenly;` et `align-content: center;`"],
    solution: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 100px);\n  grid-template-rows: repeat(2, 90px);\n  gap: 10px;\n  justify-content: space-evenly;\n  align-content: center;\n}`,
    debrief: "Les bacs n’ont pas changé de taille : c’est toute la grille qui s’est déplacée dans le jardin. Tu connais maintenant les trois niveaux d’alignement de Grid : `-content` (les pistes), `-items` (tous les éléments), `-self` (un seul). Sur un site, `justify-content: center` centre une grille de cartes de largeur fixe sur un grand écran."
  },
  {
    id: "quiz2", ch: 5, quiz: true, title: "Contrôle du jardinier", notion: "quiz",
    say: "Dernière vérification avant la récolte : lignes, zones et alignements. Tout juste, et ma citrouille devient énorme !",
    questions: [
      { q: "Une grille a 4 colonnes. Quelle déclaration fait traverser **toute** la largeur à un élément, même si on ajoute des colonnes plus tard ?", opts: ["`grid-column: 1 / 4;`", "`grid-column: 1 / -1;`", "`grid-column: 4;`"], a: 1, why: "4 colonnes = 5 lignes de grille : `1 / 4` s’arrête avant la dernière colonne. `-1` est toujours la dernière ligne, quel que soit le nombre de colonnes." },
      { q: "Que fait ce code ?", code: `.photo {\n  grid-column: span 3;\n}`, opts: ["La photo va dans la colonne 3", "La photo prend 3 rangées de haut", "La photo prend 3 colonnes de large"], a: 2, why: "`span 3` = « sur 3 pistes ». Avec `grid-column`, c’est en largeur. Sans `span`, le 3 serait un numéro de ligne." },
      { q: "Ce dessin est-il valide ?", code: `grid-template-areas:\n  "menu menu"\n  "menu texte"\n  "pied pied";`, opts: ["Oui, il est parfait", "Non : la zone `menu` forme un L, pas un rectangle", "Non : il faut des virgules entre les rangées"], a: 1, why: "La zone `menu` prend 2 cellules en haut et 1 en dessous : ça fait un L. Chaque zone doit être un rectangle, sinon toute la déclaration est ignorée." },
      { q: "Pour placer **un seul** légume en haut de sa cellule, sans toucher aux autres, j’utilise…", opts: ["`align-self: start` sur ce légume", "`align-items: start` sur le potager", "`justify-self: start` sur ce légume"], a: 0, why: "Pour un seul élément : `-self`, sur l’élément de grille. Et haut/bas, c’est la verticale : `align`." },
      { q: "Les colonnes de ma grille font `100px` et ne remplissent pas le conteneur. Pour centrer **toutes les colonnes** dans le conteneur, j’écris…", opts: ["`justify-items: center;`", "`justify-self: center;`", "`justify-content: center;`"], a: 2, why: "`-content` déplace les pistes entières dans le conteneur. `-items` et `-self` déplacent les éléments **dans leurs cellules**." }
    ],
    debrief: "Lignes de grille, `span`, zones, trois niveaux d’alignement : tu sais placer n’importe quel légume n’importe où. Il reste le grand final : un potager qui s’adapte à tous les écrans."
  },

  /* ------------------------------ ATELIER 6 ------------------------------ */
  {
    id: "minmax", ch: 6, title: "Ni trop petit, ni trop grand", notion: "minmax()",
    say: "Mes bacs à semis ne doivent jamais dépasser 160 pixels, sinon je n’atteins plus le milieu en tendant la patte. Mais sur mon petit balcon, ils peuvent rétrécir… jusqu’à 100 pixels, pas moins !",
    devices: true,
    lesson: {
      what: ["`minmax(min, max)` donne à une piste une taille **souple, avec des limites** : jamais moins que `min`, jamais plus que `max`. Entre les deux, la piste s’adapte à la place disponible.", "`repeat(3, minmax(100px, 160px))` : trois colonnes qui font 160px quand il y a la place, et qui rétrécissent sur un petit écran, sans descendre sous 100px. On l’utilise aussi pour un menu sur le côté : `minmax(150px, 250px) 1fr`."],
      why: "Une taille fixe en `px` est trop grande sur un téléphone ; une taille en `fr` peut devenir minuscule ou énorme. `minmax()` garde une piste lisible sur tous les écrans : c’est une brique essentielle du **responsive**, une page qui s’adapte à la taille de l’écran.",
      code: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(100px, 160px));\n  justify-content: center;\n}`,
      pieces: [["minmax(", "une taille entre deux limites"], ["100px", "le minimum : la piste ne descend jamais plus bas"], ["160px)", "le maximum : la piste ne grandit jamais plus"], ["justify-content: center", "les colonnes ne remplissent plus le potager : on les centre (vu à l’atelier 5)"]],
      trap: "Inverser les deux valeurs : `minmax(160px, 100px)`. Le minimum s’écrit **toujours en premier**. Si le minimum est plus grand que le maximum, le navigateur ignore le maximum.",
      good: "Donne des **limites** à tes pistes plutôt que des tailles fixes : une colonne en `minmax()` reste lisible sur téléphone comme sur grand écran. Clique sur **Téléphone** pour le vérifier, comme un pro teste sa page sur plusieurs écrans."
    },
    boardHTML: `<div class="potager">\n  <div class="carotte"></div>\n  <div class="tomate"></div>\n  <div class="salade"></div>\n  <div class="radis"></div>\n  <div class="fraise"></div>\n  <div class="courgette"></div>\n</div>`,
    steps: ["Pour l’instant, les trois colonnes en `1fr` s’étalent sur toute la largeur.", "Remplace `1fr` par `minmax(100px, 160px)` : chaque colonne fera au maximum 160px. `justify-content: center` est déjà là pour centrer les colonnes.", "Clique sur **Téléphone** au-dessus du potager : les colonnes rétrécissent, mais restent au-dessus de 100px."],
    starter: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n  justify-content: center;\n}\n`,
    goals: [
      { label: "Chaque colonne a des limites : `minmax(100px, 160px)`", test: c => { const d = decl(c, ".potager", "grid-template-columns") || ""; const w = tracks(c, "grid-template-columns"); return /minmax\(\s*100px\s*,\s*160px\s*\)/.test(d) || (/minmax\(\s*160px\s*,\s*100px\s*\)/.test(d) ? "Le minimum d’abord, puis le maximum : minmax(100px, 160px)." : (/minmax/.test(d) ? "Les limites sont 100px (minimum) et 160px (maximum)." : (w.length === 3 && w.every(x => near(x, 160)) ? "La taille est bonne, mais elle est fixe : avec minmax(100px, 160px), elle pourra rétrécir sur un petit écran." : false))); } },
      { label: "Trois colonnes égales, entre `100px` et `160px`", test: c => { const w = tracks(c, "grid-template-columns"); return (w.length === 3 && w.every(x => near(x, w[0]) && x >= 99.5 && x <= 160.5)) || (w.length === 3 ? `Les colonnes font ${Math.round(w[0])}px pour l’instant.` : (w.length ? "Il faut garder trois colonnes." : false)); } },
      { label: "Les légumes sont sur leurs parcelles", test: boardOK }
    ],
    hints: ["On change seulement la taille dans `repeat(3, …)`.", "Le modèle : `minmax(minimum, maximum)`, avec une virgule.", "`grid-template-columns: repeat(3, minmax(100px, 160px));`"],
    solution: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(100px, 160px));\n  gap: 10px;\n  justify-content: center;\n}`,
    debrief: "Avec `minmax()`, une piste n’a plus **une** taille, mais une **fourchette**. Sur ordinateur, les bacs font 160px ; sur téléphone, ils rétrécissent sans devenir trop petits. Prochaine étape : laisser la grille choisir **le nombre** de colonnes toute seule."
  },
  {
    id: "auto-fill", ch: 6, title: "Le potager s’agrandit", notion: "repeat(auto-fill, minmax())",
    say: "Mon potager doit marcher sur un petit balcon comme dans un grand champ ! Je ne veux plus choisir le nombre de colonnes : qu’il mette autant de parcelles que possible, de 100 pixels minimum.",
    devices: true,
    lesson: {
      what: ["`repeat(auto-fill, …)` veut dire : « mets **autant de pistes que possible** », à la place d’un nombre fixe.", "Avec `minmax(100px, 1fr)`, chaque colonne fait au moins 100px et au plus une part de la place. Le navigateur calcule tout seul combien de colonnes de 100px tiennent dans la largeur, puis les élargit un peu pour remplir la rangée."],
      why: "C’est la formule magique du **responsive** : 2 colonnes sur téléphone, 5 sur ordinateur, sans écrire aucune règle en plus. Les grilles de produits des boutiques en ligne utilisent cette ligne.",
      code: `.potager {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));\n  gap: 10px;\n}`,
      pieces: [["auto-fill", "à la place du nombre : « autant de colonnes que possible »"], ["minmax(100px, 1fr)", "chaque colonne fait entre 100px (minimum) et une part de la place (maximum)"], ["auto-fit", "presque pareil. La différence ne se voit que s’il y a moins d’éléments que de place : les colonnes vides sont alors repliées, et les éléments s’étirent"]],
      example: { code: `.galerie {\n  display: grid;\n  grid-template-columns:\n    repeat(auto-fill, minmax(60px, 1fr));\n  gap: 6px;\n}\n.galerie div {\n  height: 30px;\n  background: #D8F5A2;\n  border: 2px solid #1B2440;\n}`, html: `<div class="galerie"><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>` },
      trap: "Écrire `repeat(auto-fill, 1fr)` : sans taille minimale, le navigateur ne peut pas savoir combien de colonnes mettre, et la déclaration est ignorée. Il faut un `minmax()` (ou une taille fixe en `px`).",
      good: "Pour une galerie ou une liste de cartes, `repeat(auto-fill, minmax(…, 1fr))` évite souvent d’écrire des media queries. C’est la déclaration de Grid la plus utilisée par les pros : garde-la sous la main."
    },
    boardHTML: `<div class="potager">\n  <div class="carotte"></div>\n  <div class="tomate"></div>\n  <div class="salade"></div>\n  <div class="radis"></div>\n  <div class="citrouille"></div>\n  <div class="fraise"></div>\n  <div class="tournesol"></div>\n  <div class="courgette"></div>\n  <div class="carotte"></div>\n  <div class="tomate"></div>\n</div>`,
    steps: ["Remplace `repeat(2, 1fr)` par `repeat(auto-fill, …)`.", "Chaque colonne fait au minimum `100px` et au maximum `1fr` : utilise `minmax()`.", "Clique sur **Téléphone** au-dessus du potager : le nombre de colonnes change tout seul."],
    starter: `.potager {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 10px;\n}\n`,
    goals: [
      { label: "Autant de colonnes que possible : `repeat(auto-fill, …)`", test: c => /repeat\(\s*auto-(fill|fit)\s*,/.test(decl(c, ".potager", "grid-template-columns") || "") || (/auto-(fill|fit)/.test(c.clean) ? "Vérifie l’écriture : repeat(auto-fill, minmax(100px, 1fr))." : false) },
      { label: "Des colonnes de `100px` minimum : `minmax(100px, 1fr)`", test: c => { const d = decl(c, ".potager", "grid-template-columns") || ""; const w = tracks(c, "grid-template-columns"); return (/minmax\(\s*100px\s*,\s*1fr\s*\)/.test(d) && w.length > 2 && w.every(x => x >= 99.5)) || (/minmax/.test(d) ? "Le minimum est 100px, le maximum 1fr : minmax(100px, 1fr)." : false); } },
      { label: "Les légumes sont sur leurs parcelles", test: boardOK }
    ],
    hints: ["On ne change que la valeur de `grid-template-columns`.", "À la place du `2`, écris `auto-fill`. À la place du `1fr`, écris `minmax(100px, 1fr)`.", "`grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));`"],
    solution: `.potager {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));\n  gap: 10px;\n}`,
    debrief: "Une seule déclaration, et le potager s’adapte à **toutes** les tailles d’écran. Pas besoin de dire « 2 colonnes sur téléphone, 5 sur ordinateur » : la grille le calcule. Va sur une boutique en ligne et rétrécis la fenêtre : les produits se réorganisent exactement comme ça."
  },
  {
    id: "responsive", ch: 6, title: "Le potager de poche", notion: "@media : redessiner la grille",
    say: "Mes voisins regardent la fiche de mon potager sur leur téléphone, et tout est écrasé en trois colonnes ! Sur un petit écran, je veux les blocs les uns sous les autres.",
    devices: true,
    lesson: {
      what: ["Une **media query** est un bloc de CSS qui ne s’applique que si une condition est vraie. `@media (max-width: 600px) { … }` veut dire : « seulement si la fenêtre fait **600px de large ou moins** ». Cette largeur où la mise en page change s’appelle un **point de rupture**.", "À l’intérieur, on écrit des règles normales. Pour une grille avec des zones, il suffit de **redessiner le plan** : une seule colonne, et les zones les unes sous les autres. Les éléments gardent leur `grid-area` : ils suivent le nouveau dessin tout seuls."],
      why: "Plus de la moitié des visites se font sur téléphone. Trois colonnes sur un écran de 390px, c’est illisible. On garde le même HTML et on change seulement le plan de la grille : c’est le **responsive**.",
      code: `/* Sur téléphone (600px de large ou moins) */\n@media (max-width: 600px) {\n  .potager {\n    grid-template-columns: 1fr;\n    grid-template-areas:\n      "titre"\n      "photo"\n      "infos"\n      "conseils";\n  }\n}`,
      pieces: [["@media", "le début de la media query : « seulement si… »"], ["(max-width: 600px)", "la condition : une largeur de 600px **ou moins**. 600px est le point de rupture"], ["{ … }", "les accolades de la media query contiennent des règles complètes, avec leurs propres accolades"], ["grid-template-columns: 1fr", "une seule colonne sur téléphone"], ["grid-template-areas", "le nouveau dessin : une zone par rangée, de haut en bas"]],
      trap: "Écrire la media query **avant** la règle `.potager` normale. À force égale, c’est la règle écrite **en dernier** qui gagne (la **cascade**) : la règle normale écraserait celle du téléphone. Et attention aux accolades : il en faut deux pour fermer (la règle, puis la media query).",
      good: ["Place tes media queries **à la fin** du fichier et n’y réécris que ce qui change (ici, le plan de la grille, pas `display` ni `gap`).", "Encore mieux, pense **mobile d’abord** : écris d’abord la version téléphone (une colonne), puis `@media (min-width: 601px) { … }` pour les grands écrans."]
    },
    boardHTML: `<div class="potager">\n  <div class="tournesol"></div>\n  <div class="citrouille"></div>\n  <div class="radis"></div>\n  <div class="salade"></div>\n</div>`,
    steps: ["Sur ordinateur, la fiche est déjà bien rangée : ne change pas la règle `.potager` du haut.", "Clique sur **Téléphone** au-dessus du potager : les parcelles s’empilent, mais pas tes légumes. (Ici, la media query regarde la largeur du potager, qui est une petite fenêtre.)", "À la fin du CSS, écris `@media (max-width: 600px) { … }` avec, à l’intérieur, une règle `.potager` : une seule colonne (`1fr`) et le dessin `\"titre\" \"photo\" \"infos\" \"conseils\"`."],
    starter: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n  grid-template-areas:\n    "titre titre titre"\n    "photo photo infos"\n    "photo photo conseils";\n}\n\n.tournesol  { grid-area: titre; }\n.citrouille { grid-area: photo; }\n.radis      { grid-area: infos; }\n.salade     { grid-area: conseils; }\n\n/* Sur téléphone (600px de large ou moins) */\n\n`,
    goals: [
      { label: "Une media query pour les écrans de `600px` ou moins, après la règle `.potager`", test: c => { const R = c.rules || []; if (mqRules(c).length) { const iBase = R.findIndex(r => !r.media && r.sel && r.sel.trim() === ".potager"); const iMq = R.findIndex(r => r.media && /max-width\s*:\s*600px/i.test(r.media)); return iMq > iBase || "Ta media query est écrite avant la règle .potager : la règle normale, écrite après, gagne. Place la media query à la fin."; } return R.some(r => r.media) ? "Ta media query doit viser les petits écrans : @media (max-width: 600px)." : (/@media/.test(c.clean) ? "Ta media query est vide ou mal écrite : @media (max-width: 600px) { .potager { … } }" : false); } },
      { label: "Sur téléphone : une seule colonne (`1fr`)", test: c => { const v = mqDecl(c, ".potager", "grid-template-columns"); return (v != null && /^(1fr|100%|auto|repeat\(\s*1\s*,\s*1fr\s*\))$/.test(v.trim().toLowerCase())) || (v != null ? "Une seule colonne : grid-template-columns: 1fr;" : (mqRules(c).length ? "Dans la media query, redessine les colonnes de .potager : grid-template-columns: 1fr;" : false)); } },
      { label: "Sur téléphone : les zones `titre`, `photo`, `infos`, `conseils` les unes sous les autres", test: c => { const w = areaWords(mqDecl(c, ".potager", "grid-template-areas")); return w.join("|") === "titre|photo|infos|conseils" || (w.length ? "Le dessin attendu : \"titre\" \"photo\" \"infos\" \"conseils\", un nom par rangée, chacun entre guillemets." : false); } },
      { label: "Sur ordinateur, rien ne change : les légumes sont sur leurs parcelles", test: boardOK }
    ],
    hints: ["Tout se passe **à la fin** du CSS, dans un bloc `@media (max-width: 600px) { }`.", "Dans ce bloc, une règle complète : `.potager { grid-template-columns: 1fr; grid-template-areas: … }`.", "Le dessin : `grid-template-areas: \"titre\" \"photo\" \"infos\" \"conseils\";` (un nom par rangée). N’oublie pas les deux accolades fermantes."],
    solution: `.potager {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n  grid-template-areas:\n    "titre titre titre"\n    "photo photo infos"\n    "photo photo conseils";\n}\n\n.tournesol  { grid-area: titre; }\n.citrouille { grid-area: photo; }\n.radis      { grid-area: infos; }\n.salade     { grid-area: conseils; }\n\n/* Sur téléphone (600px de large ou moins) */\n@media (max-width: 600px) {\n  .potager {\n    grid-template-columns: 1fr;\n    grid-template-areas:\n      "titre"\n      "photo"\n      "infos"\n      "conseils";\n  }\n}`,
    debrief: "Même HTML, même légumes, deux plans : un pour l’ordinateur, un pour le téléphone. La media query ne réécrit que ce qui change, et la cascade fait le reste. C’est exactement comme ça que les sites passent de plusieurs colonnes sur ordinateur à une seule colonne sur téléphone."
  },
  {
    id: "finale", ch: 6, boss: true, title: "La fête du potager", notion: "mission finale : une page complète",
    say: "Ce soir, c’est la fête du potager ! J’ai préparé une affiche, construite comme une vraie page web : un en-tête, une colonne sur le côté, le contenu et un pied de page. Construis toute la grille, de zéro !",
    lesson: {
      what: ["Cette mission réunit l’essentiel : un conteneur de grille, des pistes en `px` et en `fr`, des gouttières et des zones nommées.", "C’est la mise en page la plus classique du web : l’en-tête (`header`) en haut, une colonne sur le côté (`aside`), le contenu principal (`main`) au centre, le pied de page (`footer`) en bas. Regarde le HTML au-dessus de l’éditeur : chaque légume est une de ces balises **sémantiques**."],
      why: "Des millions de sites ont cette structure. Avec Grid, elle tient en une vingtaine de lignes, et on peut la réorganiser entièrement (pour le téléphone, par exemple) en changeant seulement le dessin des zones.",
      code: `.potager {\n  display: grid;\n  grid-template-columns: …;\n  grid-template-rows: …;\n  gap: …;\n  grid-template-areas:\n    "… …"\n    "… …"\n    "… …";\n}\nheader { grid-area: entete; }`,
      pieces: [["header, aside, main, footer", "les balises de la page : on peut les viser directement par leur nom"], ["160px 1fr", "le côté fixe, puis le contenu qui prend le reste"], ["70px 1fr 60px", "l’en-tête, le milieu, le pied de page"], ["grid-area", "une règle par balise, pour l’envoyer dans sa zone"]],
      trap: "Tout écrire d’un coup puis chercher l’erreur. Avance étape par étape : le potager bouge à chaque déclaration, et les **Objectifs** te disent ce qui manque.",
      good: ["Grid pour la grande structure de la page, Flexbox **à l’intérieur** des zones (les liens du menu dans l’en-tête, les boutons d’une carte) : les deux outils se combinent.", "Utilise les balises sémantiques (`header`, `aside`, `main`, `footer`) : elles donnent du sens à la page pour les lecteurs d’écran et les moteurs de recherche, et se visent facilement en CSS."]
    },
    showHTML: true,
    boardHeight: 360,
    boardHTML: `<div class="potager">\n  <header class="tournesol"></header>\n  <aside class="salade"></aside>\n  <main class="citrouille"></main>\n  <footer class="courgette"></footer>\n</div>`,
    steps: [
      "Fais de `.potager` une grille de 2 colonnes : `160px` pour le côté, le reste (`1fr`) pour le contenu.",
      "Dessine 3 rangées : `70px` pour l’en-tête, le reste pour le milieu, `60px` pour le pied.",
      "Ajoute une gouttière de `10px` partout.",
      "Dessine les zones `entete`, `cote`, `contenu` et `pied`. L’en-tête et le pied prennent toute la largeur.",
      "Envoie chaque balise dans sa zone avec `grid-area`."
    ],
    starter: `/* L’affiche de la fête : header, aside, main, footer */\n.potager {\n  \n}\n`,
    goals: [
      { label: "Une grille de 2 colonnes : `160px`, puis le reste", test: c => { if (isGrid(c) !== true) return isGrid(c); const w = tracks(c, "grid-template-columns"); return (w.length === 2 && near(w[0], 160) && w[1] > 160) || (w.length ? `Il y a ${w.length} colonne(s) : il en faut 2, la première de 160px.` : false); } },
      { label: "3 rangées : `70px`, le reste, puis `60px`", test: c => { const r = tracks(c, "grid-template-rows"); return (r.length === 3 && near(r[0], 70) && near(r[2], 60)) || (r.length ? `Il y a ${r.length} rangée(s) : il en faut 3 (70px, 1fr, 60px).` : false); } },
      { label: "Une gouttière de `10px` partout", test: c => cs(c, ".potager", "row-gap") === "10px" && cs(c, ".potager", "column-gap") === "10px" },
      { label: "Les zones `entete`, `cote`, `contenu` et `pied` sont dessinées", test: c => { const a = areasOf(c); return a === "entete entete cote contenu pied pied" || (a === "none" ? false : "Le dessin attendu : \"entete entete\" \"cote contenu\" \"pied pied\"."); } },
      { label: "Chaque balise est dans sa zone (`grid-area`)", test: c => { const ok = [["header", "entete"], ["aside", "cote"], ["main", "contenu"], ["footer", "pied"]].filter(([s, n]) => cs(c, s, "grid-row-start") === n).length; return ok === 4 || (ok ? `${ok} balise(s) sur 4 sont dans leur zone.` : false); } },
      { label: "Les légumes sont sur leurs parcelles", test: boardOK }
    ],
    hints: ["Commence par `.potager` : `display`, `grid-template-columns`, `grid-template-rows`, puis `gap`.", "Le dessin : `grid-template-areas: \"entete entete\" \"cote contenu\" \"pied pied\";`", "Une règle par balise : `header { grid-area: entete; }`, `aside { grid-area: cote; }`, `main { grid-area: contenu; }`, `footer { grid-area: pied; }`."],
    solution: `/* L’affiche de la fête : header, aside, main, footer */\n.potager {\n  display: grid;\n  grid-template-columns: 160px 1fr;\n  grid-template-rows: 70px 1fr 60px;\n  gap: 10px;\n  grid-template-areas:\n    "entete entete"\n    "cote   contenu"\n    "pied   pied";\n}\n\nheader { grid-area: entete; }\naside  { grid-area: cote; }\nmain   { grid-area: contenu; }\nfooter { grid-area: pied; }`,
    debrief: "Bravo, jardinier ! Tu viens d’écrire la mise en page d’un vrai site web. Le HTML dit **ce qu’il y a**, Grid dit **où ça va**. Tu sais tracer une grille explicite, régler la grille implicite, placer des éléments par lignes ou par zones, les aligner à trois niveaux, et adapter le tout à tous les écrans. Prochaine étape : le **JavaScript**, pour que la page réagisse aux clics. Le potager de Kami n’a jamais été aussi beau !"
  }
  ]
};
