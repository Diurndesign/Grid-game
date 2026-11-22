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

Chaque leçon explique **ce que c’est**, **à quoi ça sert**, le **piège à éviter** et la **bonne pratique** professionnelle. Les missions responsive ont une bascule **Ordinateur / Téléphone**.

Étoiles : 3 sans indice, 2 avec un indice, 1 avec la solution.

## Pour aller jusqu’au bout

- **Lexique** (menu en haut) : 39 mots du vocabulaire professionnel, définis simplement, avec une recherche ; 12 bonnes pratiques ; et la checklist **« Prêt pour la suite ? »** (14 points), qui renvoie vers la mission à revoir pour chaque point.
- **Ateliers** : chaque atelier annonce ce qu’on va apprendre et se termine par un bilan « Ce que tu sais faire maintenant ».
- **Découvrir** : la page commence par ce qu’il faut savoir avant de commencer, et renvoie au jeu précédent si besoin.

## Les 21 missions

| Atelier | Récompense | Notions |
|---|---|---|
| 1. Tracer la grille | La carotte | display: grid, grid-template-columns, mélanger px et fr, repeat() |
| 2. Les rangées | La tomate | grid-template-rows, gap, row-gap, column-gap, grille implicite, grid-auto-rows, quiz |
| 3. Placer les légumes | La salade | lignes de grille, grid-column, grid-row, span, lignes négatives : 1 / -1 |
| 4. Les zones | La fleur | grid-template-areas, grid-area, redessiner les zones, la cellule vide |
| 5. Aligner | La citrouille | justify-items, align-items, place-items, justify-self, align-self, justify-content, align-content, quiz |
| 6. Le grand potager | Le radis | minmax(), repeat(auto-fill, minmax()), @media : redessiner la grille, mission finale |

En plus : un **Carnet** (antisèche des notions débloquées) et un **Bac à sable** pour tester librement. Dans le Carnet, l’option « Débloquer toutes les missions » permet au formateur d’ouvrir toutes les missions.

## Fichiers

```
index.html   la structure de la page
jeu.css      le design commun aux 4 jeux
theme.css    les couleurs de ce jeu (variables CSS dans :root)
engine.js    le moteur commun : éditeur, aperçu, vérificateur, objectifs, carte, carnet, lexique
cloud.js     la sauvegarde en ligne (Firebase), reprise de Mission Bip
mascot.js    Kami, le caméléon, en SVG
game.js      les données du jeu : page Découvrir, lexique, ateliers et missions (tableau levels)
```

Pour ajouter ou modifier une mission, édite le tableau `levels` dans `game.js`. Chaque mission contient : le texte de Kami, la leçon (quoi, pourquoi, code, morceaux, piège), les étapes, le HTML du plateau (`boardHTML`), le code de départ, les objectifs (`goals`, avec une fonction `test`), les indices et la solution (qui sert aussi à calculer les cibles du plateau).

## La sauvegarde en ligne

Comme dans Mission Bip : sans compte, la progression reste dans le navigateur. Avec un compte (**e-mail + mot de passe**, bouton « Se connecter » en haut), elle est enregistrée en ligne dans Firebase (projet « bip-jeux », le même que Mission Bip) et l’élève la retrouve sur n’importe quel ordinateur. **Le même compte sert pour tous les jeux** : La maison de Bip, Mission Kami, Kami et les lucioles, Le potager de Kami, Mission Bip et Bip Agence. Chaque élève ne peut lire et modifier que sa propre progression.

Ce qui est enregistré pour le formateur, mission par mission : essais, essais ratés, erreurs du vérificateur, indices, solution vue, réponses fausses aux quiz, étoiles et temps passé (même format que Mission Bip).

Rappel aux élèves : noter son e-mail et son mot de passe, et se déconnecter en partant d’un ordinateur de l’école.

### À faire une fois dans Firebase (formateur)

Les règles Firestore du projet « bip-jeux » n’autorisent pour l’instant que `mission-bip` et `bip-agence`. Dans **console.firebase.google.com › bip-jeux › Firestore Database › Règles**, remplace la liste des jeux par :

```
&& jeu in ['mission-bip', 'bip-agence', 'maison-bip', 'mission-kami', 'kami-lucioles', 'kami-potager'];
```

puis clique sur **Publier**. Sans cette étape, le jeu marche quand même, mais la sauvegarde en ligne affiche « La base refuse l’accès ».

| Jeu | Nom du document dans Firestore |
|---|---|
| La maison de Bip (HTML) | `eleves/{uid}/jeux/maison-bip` |
| Mission Kami (CSS) | `eleves/{uid}/jeux/mission-kami` |
| Kami et les lucioles (Flexbox) | `eleves/{uid}/jeux/kami-lucioles` |
| Le potager de Kami (Grid) | `eleves/{uid}/jeux/kami-potager` |

L’**Espace formateur** (bouton en bas de page) est celui de Mission Bip : `https://diurndesign.github.io/javascript_game/admin.html`.

## La série

| Jeu | Langage | Mascotte |
|---|---|---|
| [La maison de Bip](https://diurndesign.github.io/Html_game/) | HTML | la maison de Bip, à construire |
| [Mission Kami](https://diurndesign.github.io/Css_game/) | CSS | Kami, le caméléon |
| [Kami et les lucioles](https://diurndesign.github.io/Flexbox-game/) | CSS Flexbox | Kami |
| [Le potager de Kami](https://diurndesign.github.io/Grid-game/) | CSS Grid | Kami |
| [Mission Bip](https://diurndesign.github.io/javascript_game/) | JavaScript | Bip, le robot |

---

Créé par Diurn Studio.
