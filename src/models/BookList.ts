import Book from './Book';
import BookApi from './BookApi';


export default class BookList{
    constructor(
        protected books: Book[]=[]
    ){}
    /*set name(name:string){
        if(!BookList.names.includes(name)){
            throw new Error('There is not such type of list');
        }
        this.listName=name;
    }*/
    public get list() : Book[]{
        return this.books;
    }
    public async findBook(title:string|null, author:string):Promise<Book[]>{
        const authors = (author!="")?(author.split(', ')):null;
        title = (title=="")?(null):title;
        try{
            return await BookApi.searchBooks(title, authors, null);
        }
       catch (error){
        console.error("Error fetching recommendations:", error);
        return [];
       }
    }
    public isHere(id:string):number{
        for(let i=0; i<this.books.length; i++){
            if(this.books[i].id==id) return i;
        }
        return -1;
    }
    public addBook(book : Book) : void{
       if(this.isHere(book.id)==-1){
            this.books.push(book);
       }
       throw new Error ("This book is already here");
    }
    public removeBook(book : Book) : void{
        if(this.isHere(book.id)!=-1){
            this.books.splice(this.isHere(book.id),1);
        }
    }
    public get bookArray() : Book[]{
        return this.books;
    }
}