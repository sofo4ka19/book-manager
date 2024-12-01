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
        params.push(`(${authorQueries})`);
    }
    

    if (genres && genres.length > 0) {
        const authorQueries = genres.map(genre => `subject:${genre}`).join('|');
        params.push(`(${authorQueries})`);
    }
    const configBase = {
        params: {
            q: params.join('+'), // Поєднуємо всі параметри в один запит
        },
    };
    this.client = axios.create({baseURL:'https://www.googleapis.com/books/v1'});
    this.client.defaults.params = { key: import.meta.env.VITE_APP_GOOGLE_BOOKS_API_KEY };
    const results: Book[] = [];
    const serialised = new BookSerializer();
    if (languages && languages.length > 0) {
        // Окремий запит для кожної мови
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
                console.log(response)
                if (response?.items) {
                    results.push(
                        ...response.items.map((item: any) => serialised.deserialize(item))
                    );
                }
            } catch (error) {
                console.error(`Error fetching books for language ${language}:`, error);
            }
        }}else {
            // Запит без мовного обмеження
            try {
                const response = await this.get<any>(endpoint, configBase);
                if (response?.items) {
                    results.push(
                        ...response.items.map((item: any) => serialised.deserialize(item))
                    );
                }
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        }
    
        return results;
   
  }
  public static async searchBookOR(authors:string[]|null, genres:string[]|null, languages?:string[]){
    if(!authors && !genres) return [];
    try{
        const exactMatch = await BookApi.searchBooks(null, authors, genres, languages);
        const queries = [];
        if (authors && authors.length > 0 && !authors.includes("Unknown author")) {
            queries.push(BookApi.searchBooks(null, authors, null, languages)); // Запит для авторів
        }
        if (genres && genres.length > 0 && !genres.includes("Unknown genre")) {
            queries.push(BookApi.searchBooks(null, null, genres, languages)); // Запит для жанрів
        }
        const results = await Promise.all(queries);
        const uniqueBooks = new Map<string, Book>();

        const addBooksToMap = (books: Book[]) => {
            books.forEach(book => uniqueBooks.set(book.id, book)); // Використовуємо `id` як ключ
        };

        // Додаємо книги з точного збігу та додаткових запитів
        addBooksToMap(exactMatch);
        addBooksToMap(results.flat());
        console.log(Array.from(uniqueBooks.values()))
        // Повертаємо унікальні книги
        return Array.from(uniqueBooks.values());
    }catch (error) {
        console.error("Error fetching recommendations:", error);
        return [];
    }
  }
}