const dotenv = require ('dotenv'); 
dotenv.config (); 

export class Constantes{


}

export class Environnement{
    static MODE : string =  process.env.NODE_ENV;
    static ADRESSEAPI : string =  process.env.ADRESSEAPI;
    static ADRESSEFRONT : string =  process.env.ADRESSEFRONT;
    static ISPRODUCTION : boolean = Boolean(JSON.parse((process.env.ISPRODUCTION)));
    static PORT : string = process.env.PORT;
    static VERSION : string = process.env.BACKVERSION;    
}

export class Utile
{
    public static getGuidJoueur(){
        return this.s4() + this.s4() + '-' + this.s4();
    }


    private static s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
}
