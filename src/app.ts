import { Environnement } from "./Constantes";
const axios = require("axios");
let express = require('express');
const app = express();
const server  = require("http").createServer(app);
import * as WebSocket from 'ws';
import { Utile } from "./Utiles";
import {Joueur, Message, Room} from "./class";
import { IncomingMessage } from "http";
const wss = new WebSocket.Server({ server});


//#region PARAMETRAGE


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'))
app.use((req : any, res : any, next : any) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// exemple routing:
const modeSoloController = require ("./controllers/modeSoloController");
app.use("/controller/modeSolo",modeSoloController);



app.get("/ping",function(req :any,res: any){
    axios.get(Environnement.ADRESSEAPI +'/infos/ping')
    .then( (response :any) => {
        res.status(200).json({"message":"ping ok"});
    })
    .catch( (error:any) => {
        res.status(504).json({"message":"Back OK mais erreur avec l'api"});
    });
});
app.get("/infos",function(req :any,res: any){

    res.json({
        "ISPRODUCTION" : Environnement.ISPRODUCTION,
        "MODE" : Environnement.MODE,
        "PORT" : Environnement.PORT,
        "ADRESSEAPI" : Environnement.ADRESSEAPI,
        "ADRESSEFRONT" : Environnement.ADRESSEFRONT,
        "VERSION" : Environnement.VERSION
    });
});
//#endregion

/**ROUTE APPELÉE EN PREMIER POUR LA GESTION DES MODES DE JEU
 */
app.post('/controller/receptionMode', function (req : any, res :any) {
    if (req.body.mode == 1)
        res.status(200).json({"chemin":"mode-solo"});
    else if (req.body.mode == 2)
        res.status(200).json({"chemin":"salle-attente"});
    else
        res.status(303).send("Erreur de mode");
});










//#region  WEBSOCKET

// appeler quand un client se connect
wss.on('connection',function connection(client : any , req : IncomingMessage) {
    //ws = client
    let pseudoUser = req.url.split("/")[1];
    // TODO : ⚠ sécurisé l'entrée utilisateur !
    let msg;
    let joueur : Joueur = new Joueur(pseudoUser);
    client.joueur = joueur;
    // affiche dans la console du serveur

    // get adresse du client:
    console.log(req.socket.remoteAddress);
    let room : Room = Room.GetEmptyRoom();

    console.log("Nombre de salle existante: " + Room.listRoom.length);
    room.addJoueurOnRoom(client.joueur);
    client.room =room;
    console.log("Nombre de joueur dans la salle " + room.nbJoueur);
    //
    wss.clients.forEach(function each(ClientsOnMemory:any) {
        if (ClientsOnMemory.room.guid == client.room.guid){
            msg = new Message("connectionPlayer", `Le client ${client.joueur.guid} viens de se connecter à la salle : ${client.room.guid}`,client.joueur);
            ClientsOnMemory.send( JSON.stringify(msg));
        }
    });

    // si la salle est pleine
    if (client.room.isFull){
        const msg : Message = new Message("action", `La salle ${client.room.guid} est pleine`);
        wss.clients.forEach(function each(ClientsOnMemory:any) {
            if (ClientsOnMemory.room.guid == client.room.guid){
                ClientsOnMemory.send( JSON.stringify(msg));
            }
        });
    }

    // appeler quand le client se déco
    client.on("close", function(w : any){
        room.deleteJoueurOnRoom(client.joueur);
        console.log(room.nbJoueur)
        console.log(`Déconnection du client: ${client.joueur.guid}`);
        console.log("close");
    })


    // éxécuté quand un client envoi un message
    client.on('chat message', (msg : any) => {
        console.log('message: ' + msg);
        // on envoi le message à tous ceux abonnée à la room 'channel xxx'
        client.emit('channel xxx', "Bien joué");
    });
})

// le serveur web socket écoute 
wss.on("listening",function listening(ws : any) {
    console.log("méthode listening");
}) 

//#endregion



server.listen(Environnement.PORT, function () {
    console.log('Votre app est disponible sur localhost:3000 !')
})
module.exports = app;
