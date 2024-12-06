import {Book} from './Book';
import BookApi from '../api/BookApi';


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
    //    throw new Error ("This book is already here");
    }
    public removeBook(book : Book) : void{
        if(this.isHere(book.id)!=-1){
            this.books.splice(this.isHere(book.id),1);
        }
    }
    public set bookArray(list:Book[]){
        this.books = list;
    }
    public filterByAnotherLists(list1:Book[], list2:Book[], list3:Book[]){
        const excludeIsbn = new Set<string>();
        const excludeTitle = new Set<string>();
        for (const book of [...list1, ...list2, ...list3]) {
            if (book.isbn) excludeIsbn.add(book.isbn);
            if (book.title) excludeTitle.add(book.title.toLowerCase().trim());
        }
        this.books = this.books.filter(book => {
            // Перевірка ISBN
            if (book.isbn && excludeIsbn.has(book.isbn)) {
              return false;
            }
        
            // Перевірка назви (на всякий випадок)
            if (book.title && excludeTitle.has(book.title.toLowerCase().trim())) {
              return false;
            }
        
            return true; // Якщо немає збігів, залишаємо книгу
          });
    }
}