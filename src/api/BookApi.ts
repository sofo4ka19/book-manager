import ApiClient from './ApiClient';
import {Book} from '../models/Book';
import axios from 'axios';
import BookSerializer from '../serializers/BookSerializer';

export default class BookApi extends ApiClient {
    public static async searchBooks(title:string|null, authors:string[]|null, genres:string[]|null, languages?:string[]): Promise<Book[]> {
    const endpoint = '/volumes';
    const params: string[] = [];

    if (title && title.length>0) {
        params.push(`intitle:${title}`);
    }
    

    if (authors && authors.length > 0) {
        const authorQueries = authors.map(author => `inauthor:${author}`).join('|');
        params.push(`${authorQueries}`);
    }
    

    if (genres && genres.length > 0) {
        const genreQueries = genres.map(genre => `subject:${genre}`).join('|');
        params.push(`(${genreQueries})`);
    }
    const configBase = {
        params: {
            q: params.join('+'), 
        },
    };
    this.client = axios.create({baseURL:'https://www.googleapis.com/books/v1'});
    this.client.defaults.params = { key: import.meta.env.VITE_APP_GOOGLE_BOOKS_API_KEY };
    const results: Book[] = [];
    const serialised = new BookSerializer();
    if (languages && languages.length > 0) {
        for (const language of languages) {
            const config = {
                ...configBase,
                params: {
                    ...configBase.params,
                    langRestrict: encodeURIComponent(language),
                },
            };

            try {
                const response = await this.get<any>(endpoint, config);
                if (response?.items) {
                    results.push(
                        ...response.items.map((item: any) => serialised.deserialize(item))
                    );
                }
            } catch (error) {
                console.error(`Error fetching books for language ${language}:`, error);
                throw error
            }
        }}else {
            try {
                const response = await this.get<any>(endpoint, configBase);
                if (response?.items) {
                    results.push(
                        ...response.items.map((item: any) => serialised.deserialize(item))
                    );
                }
            } catch (error) {
                console.error("Error fetching books:", error);
                throw error
            }
        }
    
        return results;
   
  }
  public static async searchBookOR(authors:string[]|null, genres:string[]|null, languages?:string[]){ //should be checked the logic of requests to api and perhaps join smth
    if(!authors && !genres) return [];
    try{        
        const queries = [];
        if (genres && genres.length > 0) {
            const filteredGenres = genres.filter(genre => genre !== "Unknown genre");
            if (filteredGenres.length > 0) {
                
            if (authors && authors.length > 0) {
                for(let author of authors){
                    if(author!="Unknown author"){
                    queries.push(BookApi.searchBooks(null, [author],filteredGenres, languages));
                    }
                }}
            }
            queries.push(BookApi.searchBooks(null, null, filteredGenres, languages)); 
         }
        
        if (authors && authors.length > 0) {
            for(let author of authors){
                if(author!="Unknown author"){
                    queries.push(BookApi.searchBooks(null, [author], null, languages)); 
                }
            }
        }
        if (queries.length === 0) return [];
        const results = await Promise.all(queries);
        const uniqueBooks = new Map<string, Book>();

        const addBooksToMap = (books: Book[]) => {
            books.forEach(book => uniqueBooks.set(book.id, book)); 
        };

        addBooksToMap(results.flat());
        console.log(Array.from(uniqueBooks.values()))
        return Array.from(uniqueBooks.values());
    }catch (error) {
        console.error("Error fetching recommendations:", error);
        return [];
    }
  }
}