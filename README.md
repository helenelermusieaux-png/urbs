# Clairière

Appli mobile de suivi façon jeu : objectifs hebdo, sport 3x/semaine, repas par photo,
mesures du corps et loisirs font grandir une forêt en 3D (Three.js) peuplée d'animaux.

- `app.artifact.html` : source de l'appli (format Claude Artifact).
- `index.html` : version hébergeable, générée par `python3 build.py` (site statique, aucun build côté serveur).

Hors de Claude, l'analyse de photo, l'écriture des épisodes et la sauvegarde cloud sont
désactivées. Les données restent dans le navigateur (localStorage).
