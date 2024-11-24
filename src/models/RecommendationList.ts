import BookList from "./BookList"
import {Book} from "./Book";
import BookApi from "../api/BookApi";
import { useAppStore } from "./Store";

export class RecomendationList extends BookList{
    constructor(){
        super();
    }

    public updatePreferences(list: Book[]):{authors: string[], genres: string[], languages:string[]}{
        let authors = new Set<string>();
        let genres = new Set<string>();
        let languages = new Set<string>();
        for(let book of list){
            if(book.myRate && book.myRate>=3){
                if(book.authors && book.authors.length > 0 && !book.authors.includes("Unknown Author")){
                    for(let author of book.authors) authors.add(author);
                }
                if(book.genres && book.genres.length > 0 && !book.genres.includes("Unknown Genre")){
                    for(let genre of book.genres) genres.add(genre);
                }
                if(book.language && book.language!="Unknown Language"){
                    languages.add(book.language);
                }
            }
        }
        return{
            authors: Array.from(authors),
            genres: Array.from(genres),
            languages: Array.from(languages)
        }
    }
    public filterByAnotherLists(books:Book[], list1:Book[], list2:Book[], list3:Book[]):Book[]{
        const excludeIsbn = new Set<string>();
        const excludeTitle = new Set<string>();
        for (const book of [...list1, ...list2, ...list3]) {
            if (book.isbn) excludeIsbn.add(book.isbn);
            if (book.title) excludeTitle.add(book.title.toLowerCase().trim());
        }
        return books.filter(book => {
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
    async generateRecommends({ authors, genres, languages }: { authors: string[], genres: string[], languages: string[] }):Promise<Book[]>{
        try{
            //get info about have read
            return await BookApi.searchBooks(null, authors, genres, languages);
        }
       catch (error){
        console.error("Error fetching recommendations:", error);
        return [];
       }
    }
    public async addBook(): Promise<void> {
        //need actions if we have no books in lists
        const { haveRead, currentlyReading, wishlist } = useAppStore.getState().getUserBookLists();
        const recommendations = await this.generateRecommends(this.updatePreferences(haveRead.list));
        const filteredBooks = this.filterByAnotherLists(recommendations, currentlyReading.list, wishlist.list, haveRead.list);
         for(let book of filteredBooks){
            super.addBook(book);
         }
     }
    
}