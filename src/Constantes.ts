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