import { Environnement, Utile } from "./Constantes";
let express = require('express');
const app = express();
const server  = require("http").createServer(app);
import * as WebSocket from 'ws';
const wss = new WebSocket.Server({ server});

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
    res.json({"message" :"ping back-end ok"});
});
app.get("/infos",function(req :any,res: any){

    res.json({
        "ISPRODUCTION" : Environnement.ISPRODUCTION,
        "MODE" : Environnement.MODE,
        "PORT" : Environnement.PORT,
        "ADRESSEAPI" : Environnement.ADRESSEAPI,
        "ADRESSEFRONT" : Environnement.ADRESSEFRONT
    });
});









/**
 *  ROUTE APPELÉE EN PREMIER POUR LA GESTION DES MODES DE JEU
 */
app.post('/controller/receptionMode', function (req : any, res :any) {
    console.log('Got body:', req.body);
    console.log('mode:', req.body.mode);
    if (req.body.mode == 1)
        res.status(200).json({"chemin":"mode-solo"});
    else if (req.body.mode == 2)
        res.status(200).json({"chemin":"mode-multi"});
    else
        res.status(303).send("Erreur de mode");
});










//#region  WEBSOCKET

// appeler quand un client se connect
wss.on('connection',function connection(ws : any, req : any) {

    // attribue un guid au client:
    ws.guid = Utile.getGuidJoueur();

    // get adresse :
    console.log(ws._socket.address());
    console.log(req.socket.remoteAddress);


    // affiche dans les logs
    console.log(`Connecté au client ${ws.guid}`)

    // appeler que le client se déco
    ws.on("close", function(w : any){
        console.log("Déconnectiono du client " + ws.guid);
        console.log("close");
    })

    // éxécuté quand un client envoi un message
    ws.on('chat message', (msg : any) => {
        console.log('message: ' + msg);
        // on envoi le message à tous ceux abonnée à la room 'channel xxx'
        ws.emit('channel xxx', "Bien joué");
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
