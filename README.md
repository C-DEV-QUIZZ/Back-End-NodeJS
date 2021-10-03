# Back-End-NodeJS
## 26/05/2021 Integration du back-end en nodeJS:  
---
> ℹ
Suite à l'indisponibilité  de Flavien nous avons convenu afin de débloquer la situation du projet sur la partie back (impossible de déployer le site et le client lourd sans le Back-end qui communique avec l'api et gérera les webSocket pour le multi)  de nous orienter vers une techno que nous connaissons Nessim et moi même.  

---
> ℹ
Le projet Back-End en PHP n'as pas été supprimé étant donné que nous ne savons pas quand Flavien sera de retour pour gérer la partie Back.
---


## Procédure d'installation et de lancement :  
Après avoir télécharger ce repos, et en supposant que vous avez [node.js](https://nodejs.org/en/download/)  d'installé, mettez vous à la racine du projet (dans le dossier Back-End-NodeJS) et faite la commande : 
```sh
npm i
```
Cela a pour but de récupérer les dépendances liées au projet.
Une fois les dépendances téléchargées, il faut build le projet pour cela faite :
```sh
npm run build
```

Une fois le build terminé, faite la commande pour démarrer votre serveur 
```sh
nodemon server
```
**nodemon**  garantit d'avoir toujours la dernière version de votre serveur dès que vous sauvegardez, sans devoir relancer manuellement le serveur !

si un message du type la commande 'nodemon' n'existe pas ... vous pouvez faire :
```sh
npm install -g nodemon
```
cela installera nodemon sur votre machine





## Mise en production de la partie developpement le 30/05/2021
* fixe dénomination version *(car pm2 utilise cette dénomination donc il renvoi la version donnée par pm 2 soit 1.0.0)* ✔
* Partie solo ✔
* Test de mise en place du websocket concluant avec 'ws' ✔



##### A FAIRE:
 - Inclure le serveur web socket ✔

## Le 20/08/21 
Deploiement OK

# fix deploiement
lancement manuel puis deploiement ok 

