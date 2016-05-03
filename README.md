# Oboro
![alt text](https://github.com/simkarlier/oboro/blob/master/doc/img/logo.png "Oboro")

## Technologies utilisées
Le projet se base sur la distibution de fichiers HTML, nous utilisons un simple serveur PHP pour s'occuper de celle-ci.
Gulp et du coup nodeJS sont uitlisés pour la gestion du déploiement.

## Installation
Téléchargement du repository et des modules node
```
git clone git@github.com:simkarlier/oboro.git
npm install
```

## Déploiement
Le projet est composé de deux répertoires : src et dist. Le répertoire src est celui utilisé pour le développement et dist est une version minifiée de celui-ci utilisée pour la version production. Le script présent dans Gulpfile.js regroupe les fichiers js et css dans des fichiers uniques permettant ainsi une gestion plus facile des parties.

Après chaque changement :

Pour le développpement (compilation dans ./src)
```
gulp build --env=dev
```


Pour la production (compilation dans ./dist), copie des autres fichiers présent dans ./src
```
gulp build --env=prod
```


### Développement

## Architecture
![alt text](https://github.com/simkarlier/oboro/blob/master/doc/img/manuel_image.png "Loader")

- Un loader (dans app.js) nous permet de charger les parties dynamiquement (pendant qu'une video charge par example), ce qui permet une transition fluide entre les différentes 		scènes. (Quelques examples ci-dessous )
-- `new Part("intro")` charge par example les éléments (JS, HTML,CSS)
-- `window.appendNext("intro")` charge dans la DOM les éléments mais ne les affiche pas
-- `parts[1].show()` affiche la partie 1

- Une fonction globale `window.next()` nous permet de passer à la prochaine partie

## Difficulté des jeux.

### Issunriver

Nous avons fixé le score à atteindre à 33 pour terminer le jeu. Afin de rallonger ou raccourcir les phases de jeu, il faut varier la condition`if(this.score < 33)` le nombre d'ennemie (troncs d'arbre), générés est defini à la ligne 189 `nemy = new Enemy(Math.floor(Math.random()*6));`

#### Sokoban

Les levels sont paramtrès en ASCII, dans le fichier javascript du jeu.
Exemple:
<br/>
`levelDataLine = new Array();`<br/>
`levelDataLine[0] = "@@@@@@@@@@@@@@@@@";`<br/>
`levelDataLine[1] = "@@@@@@   @@@@@@@@";`<br/>
`levelDataLine[2] = "@@@@@@ @>o @@@@@@";`<br/>
`levelDataLine[3] = "@@@@@@x  @ @@@@@@";`<br/>
`levelDataLine[4] = "@@@@@@ ox  @@@@@@";`<br/>
`levelDataLine[5] = "@@@@@@@  @@@@@@@@";`<br/>
`levelDataLine[6] = "@@@@@@@  @@@@@@@@";`<br/>
`levelDataLine[7] = "@@@@@@@@@@@@@@@@@";`<br/>

### StomachJump

Les lignes 180 à 185 permettent de gerer les pièces generées.
Les lignes 349 et plus permettent de gérer la vitesse.
Les lignes 512 et plus regle la fin impossible et le passage à la prochaine partie.

## Localstorage

L'aventure web est à vivre en "one-shot", pas de comptes utilisateurs à créer. Pour les visiteurs qui reviendraient sur le site et/ou qui souhaiteraient refaire un jeu en particulier, nous avons utilisé les possibilités offertes par le localstorage.Au lancement de chaque partie, une clé est enregistrée dans le localsotrage du navigateur. Ainsi, dans le cas où le visiteurs arrête l'aventure en plein milieu il pourra reprendre là où il était resté. Une fois la fin du site web atteinte, des boutons permettent de passer les différentes parties de l'aventure.


## Newsletter

Validation mail PHP pour verifier la véricatié du mail, fonction php mail() pour l'envoi.
Les adresse mail recupérées sont stoquées dans le fichier mails.json dans le dossier de la partie japan.
**Important**
Pour empêcher l'accés non autorisé au fichier contenant les mails, il faut modifier l'accés au fichier: 
```
chmod 600 mails.json
```





