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