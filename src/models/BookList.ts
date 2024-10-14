import Book from './Book';

export default class BookList{
    //static names: string[] = ["wishlist", "recommendation", "reading", "haveRead"];
    constructor(
       // protected listName: string,
        protected books: Book[]=[]
    ){}
    /*set name(name:string){
        if(!BookList.names.includes(name)){
            throw new Error('There is not such type of list');
        }
        this.listName=name;
    }*/
    get list() : Book[]{
        return this.books;
    }
    addBook(book : Book, myAssesment:number=-1) : void{
        /*if(this.listName=="haveRead"){
            book.myRate=myAssesment;
        }*/
        this.books.push(book);
    }
    removeBook(book : Book) : void{
        let isHere = false;
        let i=0;
        for(i; i<this.books.length; i++){
            if(this.books[i]==book){
                isHere=true;
                break;
            }
        }
        if(isHere){
            this.books.splice(i,1);
        }
    }
    public get bookArray() : Book[]{
        return this.books;
    }
}