export class ReponseJoueur{
    questionId : number;
    reponseUtilisateurId : number;
}

export class Question{
    id : number;
    texte : string;
    points : number;
    bonneReponse : BonneReponse;
    reponses : Reponses[];
    difficultes : Difficultes;
}

export class BonneReponse{
    id : number;
    texte : string;
}

export class Reponses{
    id : number;
    texte : string;
}

export class Difficultes{
    id : number;
    nom : string;
}
export class Joueur{
    pseudo :string;
    guid : string
    points : number
    ListeReponse : Map<number,number>;
}
export class Room{
    guid : string;
    isFull : boolean;
    listJoueur : Joueur[]=[];    
    nbJoueur = this.listJoueur.length;


    ajoutJoueur(joueur : Joueur){
        // Si la liste des joueurs est égal au nombre max de joueur je ne fais rien



        // on ajout le joueur et on envoi une notif a toute la room

        if (joueur)


        this.listJoueur.push(joueur);

    }

    // method envoi notification all room

    // methode delete joueur

}