import {Question, ReponseJoueur, Room} from "./class";

export class Utile
{
    public static getGuidJoueur(){
        return this.s4() +'-'+ this.GetTimeStampOnSecond() + '-' + this.s4();
    }

    public static getGuidRoom(){
        return this.s4() +'-' + this.GetTimeStampOnSecond();
    }
    private static s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    private static GetTimeStampOnSecond(){
        return Math.round(+new Date() / 1000);
    }
    public static calculResult(reponseJoueur: ReponseJoueur, ListGoodResponsesApi: Question[]) {

        // 7) recupere l'id de la question dans la liste des questions renvoyé par l'apî
        let questionPoserAuJoueur: Question = ListGoodResponsesApi.find((ApiReponse: Question) => ApiReponse.id == reponseJoueur.questionId);
        // console.log("question poser au joueur :");
        // console.log(questionPoserAuJoueur);

        // 8) on compare s'il a la bonne réponse
        if (questionPoserAuJoueur.bonneReponse.id == reponseJoueur.reponseUtilisateurId) {
            // console.log("bonne réponse +")
            // console.log(questionPoserAuJoueur.points)
            return questionPoserAuJoueur.points;
        } else {
            // console.log("mauvaise réponse ")
            return 0;
        }

    }
}