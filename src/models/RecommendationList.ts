import BookList from "./BookList"
import {Book} from "./Book";
import BookApi from "../api/BookApi";
import { useAppStore } from "../store/Store";


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
    async generateRecommends({ authors, genres, languages }: { authors: string[], genres: string[], languages: string[] }):Promise<Book[]>{
        try{
            //needs to be changed
            return await BookApi.searchBookOR(authors, genres, languages);
        }
       catch (error){
        console.error("Error fetching recommendations:", error);
        return [];
       }
    }
    public async addBook(): Promise<void> {
        const store = useAppStore.getState();
        const haveRead = store.finishedList;
        if(haveRead.length==0) return;
        const currentlyReading = store.currentlyReadingList;
        const wishlist = store.wishlist;
        const recommendations = await this.generateRecommends(this.updatePreferences(haveRead));
        this.books = recommendations;
        this.filterByAnotherLists(currentlyReading, wishlist, haveRead);
     }
    
}