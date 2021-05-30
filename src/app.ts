

// TODO :
    // Gérer les cors ✔
    // Gérer les controllers pour plusieurs fichiers ✔
    // connection à l'api ✔
    // Config des environnements ✔
    // déploiement

import { Environnement } from "./Constantes";

let express = require('express');
const app = express();
const http  = require("http").createServer(app);
const cors = require("cors");
const io = require('socket.io')(http,{
    cors: {
        origin: "*",
        credentials: true
    },
    // // path si on veux affecter un chemin dédié au websocket
    // path: "/test",
});
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
io.on('connection', (socket : any) =>{
    // affiche dans les logs
    console.log(`Connecté au client ${socket.id}`)

    io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });

    // Executé quand un client se déconnecte
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });

    // éxécuté quand un client envoi un message
    socket.on('chat message', (msg : any) => {
        console.log('message: ' + msg);
        // on envoi le message à tous ceux abonnée à la room 'channel xxx'
        io.emit('channel xxx', "Bien joué");
    });

})

//#endregion



http.listen(Environnement.PORT, function () {
    console.log('Votre app est disponible sur localhost:3000 !')
})
module.exports = app;
