import { Environnement } from "./Constantes";
const axios = require("axios");
let express = require('express');
const app = express();
const server  = require("http").createServer(app);
import * as WebSocket from 'ws';
import { Utile } from "./Utiles";
import {Joueur, Message, Question, QuestionModelView, Room} from "./class";
import { IncomingMessage } from "http";
const wss = new WebSocket.Server({ server});
var xss = require('xss');


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
wss.on('connection',async function connection(client: any, req: IncomingMessage) {
    let pseudoUser = xss(req.url.split("/")[1]);
    let msg;

    // Création du player grace au pseudo:
    let joueur: Joueur = new Joueur(pseudoUser);

    // on affecte dans wsClient le joueur
    client.joueur = joueur;


    // on affiche l'adresse du client:
    console.log(req.socket.remoteAddress);

    // récupère une room 
    let room: Room = Room.GetEmptyRoom();

    // log du nombre de salle existante.
    console.log("Nombre de salle existante: " + Room.listRoom.length);

    // on ajoute le joueur à la room (push le joueur dans la liste de la room)
    room.addJoueurOnRoom(client.joueur);


    // Dans le wsClient on lui affecte la room
    client.room = room;

    console.log("Nombre de joueur dans la salle " + room.nbJoueur);

    /* 
    ==>  A ce stade le ws client à un objet joueur associé et une room ==
    */

    // on envoi au client son numéro unique et le numéro unique de la room.
    let dataInfos = {
        roomGuid: client.room.guid,
        clientGuid: client.joueur.guid
    }
    msg = new Message("action", `L'identifiant unique du client ${client.joueur.guid}`, dataInfos);
    client.send(JSON.stringify(msg))

    // on fait le tour de tous les ws-clients présents sur le serveur websocket (en mémoire)
    wss.clients.forEach(function each(ClientsOnMemory: any) {
        // si le ws-clients en mémoire a la même room que le client actuelle ( qui viens de se connecter à la room) 
        if (ClientsOnMemory.room.guid == client.room.guid) {
            // on envoi un message a tous pour les prévenirs qu'un new joueur viens de co 
            // et on envoi en plus la liste de tous les joueurs de la room (avec ce joueur) a tous le monde 
            // pour qu'il actualise leur liste.
            msg = new Message("connectionPlayer", `Le client ${client.joueur.guid} viens de se connecter à la salle : ${client.room.guid}`, room.listJoueur);
            ClientsOnMemory.send(JSON.stringify(msg));
        }
    });
    let Timout: NodeJS.Timeout;
    let TimerInterval:  NodeJS.Timeout;
    // si la salle est pleine
    if (client.room.isFull) {

        // on envoi un socket à tous ceux de la salle pour les prévenirs.
        wss.clients.forEach(function each(ClientsOnMemory: any) {
            if (ClientsOnMemory.room.guid == client.room.guid) {
                msg = new Message("PlayersReadyToPlay", `Récupération des questions ...`);
                ClientsOnMemory.send(JSON.stringify(msg));
            }
        });

        // on récupère x Questions pour les joueurs de la salle
        let listQuestions;
        listQuestions = await axios.get(Environnement.ADRESSEAPI + 'questions/modeMulti')
            .then(async (response: any) => {
                return await response.data;
            })
            .catch((error: any) => {
                console.log("erreur lors du contact avec l'api");
            });


        // on convertie les questions en question model view
        console.table(listQuestions);
        console.log("=================================");
        let ListQuestionModel =  listQuestions.map((x : Question)=> new QuestionModelView(x));
        console.table(ListQuestionModel);


        wss.clients.forEach(function each(ClientsOnMemory: any) {
            if (ClientsOnMemory.room.guid == client.room.guid) {
                let msg = new Message("GameReadyToPlay", "La partie va commencer dans", 15);
                ClientsOnMemory.send(JSON.stringify(msg));
            }
        });

        // Après 20 s on commencer le timer
        Timout=  setTimeout(()=>{
            client.room.IsPartyStarted= true;
            let compteur = 0;
            // on change de page et on envoi une question
            // on envoi une question à tous ceux de la salle.
            wss.clients.forEach(function each(ClientsOnMemory: any) {
                if (ClientsOnMemory.room.guid == client.room.guid) {
                    msg = new Message("changePage", "mode-multi");
                    let msg2 = new Message("ReceivedQuestion", `10`, ListQuestionModel[compteur]);
                    ClientsOnMemory.send(JSON.stringify(msg));
                    ClientsOnMemory.send(JSON.stringify(msg2));
                }
            });
            compteur++;

            // on démarre une timer interval et envoi une notification toutes les x secondes
            TimerInterval= setInterval(() => {
                console.log(compteur);
                if(ListQuestionModel.length == compteur)
                {
                    clearInterval(TimerInterval);
                    console.log("TIMER FINI !!!");
                    return;
                }
                // on envoi une question à tous ceux de la salle.
                wss.clients.forEach(function each(ClientsOnMemory: any) {
                    if (ClientsOnMemory.room.guid == client.room.guid) {
                        msg = new Message("ReceivedQuestion", `10`,ListQuestionModel[compteur]);
                        ClientsOnMemory.send(JSON.stringify(msg));
                    }
                });
                compteur++;
            }, 10000);
        },15_000); // temps avant changement de page et commencement interval

        // SendNotification( client,"GameReadyToPlay","La partie va commencer dans ", 20);
        // envoi vers la page  Page d'attente
        // notifie récupère question + envoi dans le sas

    }

    // appeler quand le client se déco
    client.on("close", function (w: any) {
        clearInterval(Timout);
        clearInterval(TimerInterval);
        // on le delete de la room qui lui était attribué.
        room.deleteJoueurOnRoom(client.joueur);

        // Puis on notifie tous ceux qui était dans la même room que lui
        wss.clients.forEach(function each(ClientsOnMemory: any) {
            if (ClientsOnMemory.room.guid == client.room.guid) {
                msg = new Message("connectionPlayer", `Le client ${client.joueur.guid} viens de quitter à la salle : ${client.room.guid}`, room.listJoueur);
                ClientsOnMemory.send(JSON.stringify(msg));
            }
        });
        console.log(room.nbJoueur)
        console.log(`Déconnection du client: ${client.joueur.guid}`);
    })


    // éxécuté quand un client envoi un message
    client.on('chat message', (msg: any) => {
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
