
import { Environnement } from "../Constantes";
import {Question, ReponseJoueur} from "../class";
import {Utile} from "../Utiles";

let express = require("express");
const router = express.Router();
const axios = require("axios");


/**
 * APPELER QUAND ON COMMENCE LE MODE SOLO
 */
router.post("/start", function (request : any, res :any) {

    console.log(Environnement.ADRESSEAPI +'questions/modesolo');
    axios.get(Environnement.ADRESSEAPI +'questions/modesolo')
    .then( (response :any) => {
        res.status(200).json(response.data);
    })
    .catch( (error:any) => {
        res.status(504).json({"message":"erreur lors du contact avec l'api"});
        console.log("erreur lors du contact avec l'api");
    });
});

router.post("/calculResult", function (req :any, res :any) {
    // 1) on reçoit un tableau d'objet qui est composé de : { questionId: x, reponseUtilisateurId: x }
    // 2) on récupérer tous les id questions dans un tableau 
    // 3) envoye de id question à l'api 
    // 4) l'api nous renvoi les questions avec les bonne réponses au format : 
    // 5) on initialise le nombre de point à 0 du joueur
    // 6) fait le tour des reponses du joueur 
    // 7) recupere l'id de la question dans la liste des questions renvoyé par l'apî
    // 8) on compare s'il a la bonne réponse
    // 9) si oui + le nombre de point de la question 
    // 10) si non + 0;

    // console.log(req.body);
    // 1) on reçoit un tableau d'objet qui est composé de : { questionId: x, reponseUtilisateurId: x }
    // 2) on récupérer tous les id questions dans un tableau et l'envoyé à l'api 
    let ListReponsesJoueur : ReponseJoueur[] = req.body;
    let arrayIdQuestion :number[] = [] 

    ListReponsesJoueur.forEach((reponseJoueur:ReponseJoueur)=> {
        arrayIdQuestion.push(reponseJoueur.questionId);    
    });

    // console.log(arrayIdQuestion);

    //3) envoye de id question à l'api 
    axios({
        url: Environnement.ADRESSEAPI + 'questions/QuestionResult',
        method: 'post',
        data: arrayIdQuestion
    })
    .then((response:any) => {
        //4) l'api nous renvoi les questions avec les bonne réponses au format : 
        /*
            {
                id: 4,
                texte: 'Quelle ville a construit le premier métro',
                points: 12,
                bonneReponse: { id: 15, texte: 'Londres' },
                reponses: [ [Object], [Object] ],
                difficultes: { id: 1, nom: 'Facile' }
            }
        */
        // console.log("retour data");
        // console.log(response.data);
        let ListGoodResponse : Question[] = response.data;
        // console.log("retour dans variable");

        // console.log(ListGoodResponse);
        // console.log(ListReponsesJoueur);
        // 5) on initialise le nombre de point à 0 du joueur
        let nombrePointJoueur = 0;
        // 6) fait le tour des reponses du joueur 
        ListReponsesJoueur.forEach((reponseJoueur:ReponseJoueur) =>{
            nombrePointJoueur += Utile.calculResult(reponseJoueur,ListGoodResponse);
        });
        var poitnMax = 0;
        ListGoodResponse.forEach(q=> poitnMax += q.points);

        res.status(200).json({'points' : nombrePointJoueur,'bonneReponseList':ListGoodResponse, 'reponsePlayer':ListReponsesJoueur , 'poitnMax' :poitnMax});
    })
    .catch( (error:any) => {
        res.status(504).json({"message":"erreur lors du contact avec l'api"});
        // console.log("erreur lors du contact avec l'api");
    })


});


// function calculResult(reponseJoueur :ReponseJoueur, ListGoodResponsesApi :Question[]){
//
//     // 7) recupere l'id de la question dans la liste des questions renvoyé par l'apî
//     let questionPoserAuJoueur : Question = ListGoodResponsesApi.find((ApiReponse :Question) => ApiReponse.id == reponseJoueur.questionId);
//     // console.log("question poser au joueur :");
//     // console.log(questionPoserAuJoueur);
//
//     // 8) on compare s'il a la bonne réponse
//     if (questionPoserAuJoueur.bonneReponse.id == reponseJoueur.reponseUtilisateurId)
//     {
//         // console.log("bonne réponse +")
//         // console.log(questionPoserAuJoueur.points)
//         return questionPoserAuJoueur.points;
//     }
//     else{
//         // console.log("mauvaise réponse ")
//         return 0;
//     }
// }


module.exports = router;
