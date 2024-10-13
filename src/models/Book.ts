class Book {
    constructor(
        private title: string,
        private author: string,
        private isbn: number,
        private imageUrl: string,
        private rate: number,
        private myAssesment=-1,
    ){}
    public get info() : {title: string, author: string, isbn: number, imageUrl: string, rate: number}{
        return{
            title: this.title,
            author: this.author,
            isbn: this.isbn,
            imageUrl: this.imageUrl,
            rate: this.rate
        }
    }
    public set myRate(myAssesment:number){
        if(myAssesment>=0 && myAssesment<=5){
            this.myAssesment=myAssesment;
        }
        else{
            throw new Error("Your assesment must be from 0 to 5");
        }
    }
    public get myRate() : number{
        if(this.myAssesment==-1){
            this.myRate;
        }
        return this.myAssesment;
    }
}