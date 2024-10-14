export default class Book {
    constructor(
        private title: string,
        private authors: string[],
        private genres: string[],
        private isbn: number,
        private imageUrl: string,
        private rate: number,
        private myAssesment: number=-1,
    ){
        if(myAssesment>=0 && myAssesment<=5){
            this.myAssesment=myAssesment;
        }
    }
    public get info() : {title: string, authors: string[], genres: string[], isbn: number, imageUrl: string, rate: number}{
        return{
            title: this.title,
            authors: this.authors,
            genres: this.genres,
            isbn: this.isbn,
            imageUrl: this.imageUrl,
            rate: this.rate
        }
    }
    public get id():number{
        return this.isbn;
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
    public set info(bookInfo:{title: string, authors: string[], genres: string[], isbn: number, imageUrl: string, rate: number}){
        this.title=bookInfo.title;
        this.authors=bookInfo.authors;
        this.genres=bookInfo.genres;
        this.isbn=bookInfo.isbn;
        this.imageUrl=bookInfo.imageUrl;
        this.rate=bookInfo.rate;
    }
}