export class Utile
{
    public static getGuidJoueur(){
        return this.s4() +'-'+ this.GetTimeStampOnSecond() + '-' + this.s4();
    }


    private static s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    private static GetTimeStampOnSecond(){
        return Math.round(+new Date() / 1000);
    }
    
}