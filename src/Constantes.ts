import dotenv from 'dotenv'; 
//const dotenv = require ('dotenv'); 
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
    static NB_JOUEUR_MAX_MULTI : number = Number(process.env.NBJOUEURMAX);
    static TIMER_INTERVAL_QUESTION_MULTI : number = Number(process.env.TIMERINTERVALMULTI);
    static TIMER_OUT_GAME_START : number = Number(process.env.TIMEROUT);
}

