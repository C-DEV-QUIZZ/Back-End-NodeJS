import { debug } from "console";
import { Environnement } from "./Constantes";
import { Utile } from "./Utiles";

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

export class QuestionModelView{
    id : number;
    texte : string;
    points : number;
    reponses : Reponses[];
    difficultes : Difficultes;
    constructor(question : Question) {
        this.id = question.id;
        this.texte = question.texte;
        this.points = question.points;
        this.reponses = question.reponses;
        this.difficultes = question.difficultes;
    }
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

    constructor( pseudo : string ="Marcel") {
        this.guid = Utile.getGuidJoueur();
        this.pseudo = pseudo;
    }
}


export class Room{
    static listRoom :Array<Room> = [];
    guid : string;
    listJoueur : Joueur[]=[];        
    IsPartyStarted : boolean =false;
    constructor(){
        this.guid = Utile.getGuidRoom();
        // boucle tant que le guid généré pour la nouvelle room
        // existe dans la liste de room
        while(Room.listRoom.some(r => r.guid == this.guid)){
            this.guid = Utile.getGuidRoom();
        }        
    }

    public get nbJoueur(){
        return this.listJoueur.length;
    }

    public get isFull(){
        return this.listJoueur.length == Environnement.NB_JOUEUR_MAX_MULTI  ? true : false;
    }

    addJoueurOnRoom(joueur : Joueur){
        // Si la liste des joueurs est pleine
        if (this.isFull){
            return;
        }

        if (this.listJoueur.length ==0){
            console.log("Premier joueur dans la salle");
        }

        // on ajout le joueur
        this.listJoueur.push(joueur);

        if (this.isFull){
            console.log("Dernier joueur dans la salle");

        }

        console.log(`le joueur ${joueur.guid} est associé à la room ${this.guid}`);


    }

    deleteJoueurOnRoom(joueur : Joueur){
        if (this.listJoueur.length == 0)
        {
            return;
        }

        this.listJoueur.forEach( (item, index) => {
            if(item.guid === joueur.guid){
                this.listJoueur.splice(index,1);
                console.log("Le joueur à été supprimé de la room" + this.guid);
                return;
            }
        });

    }

    // method envoi notification all room

    // methode delete joueur

    /**Retourne une des rooms vide de la liste 
    * sinon créer une nouvelle room et l'ajoute dans la liste
    * @param listeRoom la lsite principal des rooms
    * @returns room avec des users ou une nouvelle room
    */
    public static GetEmptyRoom() : Room{

        let cpt : number = -1;

        for (let i = 0; i< Room.listRoom.length ;i++){

            if (Room.listRoom[i].isFull == false && Room.listRoom[i].IsPartyStarted == false){
                cpt = i;
                return Room.listRoom[i];
            }
        }

        return cpt == -1 ? this.NewRoomCreator() : Room.listRoom[cpt];
    }

    /**Creait une nouvelle room et l'ajoute dans la liste des rooms
     */
    private static NewRoomCreator() : Room{
        let newRoom : Room = new Room();
        Room.listRoom.push(newRoom);
        return newRoom;
    }
}

export class Message{
    tag : String;
    message :String;
    objet : any;
    constructor(tag: string, msg :string,obj : any = null) {
        this.tag = tag;
        this.message = msg;
        if (obj == null){
            return;
        }
        this.objet = obj;
    }
}