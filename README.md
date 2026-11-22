# Le potager de Kami · Grid-game

Un jeu pour apprendre CSS Grid en écrivant du vrai code, pensé pour les personnes qui veulent **commencer une formation dans le web** : aucune connaissance n’est nécessaire.

Kami le caméléon cultive un potager. Chaque légume doit pousser sur sa parcelle de terre : pour tout ranger en rangées et en colonnes, Kami utilise CSS Grid, la grille du CSS. Chaque atelier terminé fait pousser une nouvelle plante autour de lui.

## Jouer

- **En ligne** : active GitHub Pages (Settings › Pages › *Deploy from a branch*, choisis la branche du jeu et le dossier `/ (root)`). Le jeu sera disponible à l’adresse `https://diurndesign.github.io/Grid-game/`.
- **En local** : ouvre le dossier avec l’extension Live Server de VS Code (ou n’importe quel petit serveur web). Ouvrir `index.html` en double-cliquant peut bloquer l’aperçu dans certains navigateurs.

La progression est enregistrée dans le navigateur de chaque joueur (localStorage).

## Comment ça marche

- **Découvrir** : une page qui explique ce qu’est CSS Grid, à quoi ça sert et pourquoi on l’utilise, avec une démo à manipuler, des exemples de la vraie vie, les métiers du web qui s’en servent, le vocabulaire et les pièges du débutant.
- **Les missions** : le plateau bouge **en direct** pendant que l’élève tape son CSS : chaque élément doit rejoindre sa cible. Le bouton **Vérifier** (ou Ctrl + Entrée) contrôle chaque objectif.

| Onglet | Ce qu’on y voit |
|---|---|
| Le plateau | Les éléments de l’élève et leurs cibles, avec le compteur d’éléments bien placés |
| Objectifs | Chaque critère réussi ou raté, avec une explication quand c’est faux |
| Remarques | Le vérificateur CSS : accolade, deux-points ou point-virgule oubliés, propriété inconnue, valeur invalide (couleur en français, unité manquante…), sélecteur qui ne trouve rien… en français, avec la ligne surlignée dans l’éditeur |

Étoiles : 3 sans indice, 2 avec un indice, 1 avec la solution.

## Les 16 missions

| Atelier | Récompense | Notions |
|---|---|---|
| 1. Tracer la grille | La carotte | display: grid, grid-template-columns, mélanger px et fr, repeat() |
| 2. Les rangées | La tomate | grid-template-rows, gap, row-gap, column-gap, quiz |
| 3. Placer les légumes | La salade | grid-column, grid-row, span |
| 4. Les zones | La fleur | grid-template-areas, grid-area, redessiner les zones, la case vide |
| 5. Aligner dans les cases | La citrouille | justify-items, align-items, place-items, justify-self, align-self, quiz |
| 6. Le grand potager | Le radis | repeat(auto-fill, minmax()), mission finale |

En plus : un **Carnet** (antisèche des notions débloquées) et un **Bac à sable** pour tester librement. Dans le Carnet, l’option « Débloquer toutes les missions » permet au formateur d’ouvrir toutes les missions.

## Fichiers

```
index.html   la structure de la page
style.css    le design commun aux 4 jeux
theme.css    les couleurs de ce jeu (variables CSS dans :root)
engine.js    le moteur commun : éditeur, aperçu, vérificateur, objectifs, carte, carnet
mascot.js    Kami, le caméléon, en SVG
game.js      les données du jeu : page Découvrir, ateliers et missions (tableau levels)
```

Pour ajouter ou modifier une mission, édite le tableau `levels` dans `game.js`. Chaque mission contient : le texte de Kami, la leçon (quoi, pourquoi, code, morceaux, piège), les étapes, le HTML du plateau (`boardHTML`), le code de départ, les objectifs (`goals`, avec une fonction `test`), les indices et la solution (qui sert aussi à calculer les cibles du plateau).

## La série

| Jeu | Langage | Mascotte |
|---|---|---|
| [Mission Tago](https://diurndesign.github.io/Html_game/) | HTML | Tago, le bernard-l’ermite |
| [Mission Kami](https://diurndesign.github.io/Css_game/) | CSS | Kami, le caméléon |
| [Kami et les lucioles](https://diurndesign.github.io/Flexbox-game/) | CSS Flexbox | Kami |
| [Le potager de Kami](https://diurndesign.github.io/Grid-game/) | CSS Grid | Kami |
| [Mission Bip](https://diurndesign.github.io/javascript_game/) | JavaScript | Bip, le robot |

---

Créé par Diurn Studio.
