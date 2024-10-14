export default class Book {
    constructor(
        private title: string,
        private author: string,
        private genre: string,
        private isbn: number,
        private imageUrl: string,
        private rate: number,
        private myAssesment: number=-1,
    ){
        if(myAssesment>=0 && myAssesment<=5){
            this.myAssesment=myAssesment;
        }
    }
    public get info() : {title: string, author: string, genre: string, isbn: number, imageUrl: string, rate: number}{
        return{
            title: this.title,
            author: this.author,
            genre: this.genre,
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
    public set info(bookInfo:{title: string, author: string, genre: string, isbn: number, imageUrl: string, rate: number}){
        this.title=bookInfo.title;
        this.author=bookInfo.author;
        this.genre=bookInfo.genre;
        this.isbn=bookInfo.isbn;
        this.imageUrl=bookInfo.imageUrl;
        this.rate=bookInfo.rate;
    }
}