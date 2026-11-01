# Clairière

Appli mobile façon jeu : une forêt 3D qui grandit (6×6, 8×8, 10×10) avec ton niveau, objectifs de la semaine à valider, séances à la salle, repas, mesures avec avatar et loisirs.
mesures du corps et loisirs font grandir une forêt en 3D (Three.js) peuplée d'animaux.

- `app.artifact.html` : source de l'appli (format Claude Artifact).
- `index.html` : version hébergeable, générée par `python3 build.py` (site statique, aucun build côté serveur).

Hors de Claude, l'analyse de photo, l'écriture des épisodes et la sauvegarde cloud sont
désactivées. Les données restent dans le navigateur (localStorage).
