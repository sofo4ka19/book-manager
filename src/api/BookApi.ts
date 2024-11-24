import ApiClient from './ApiClient';
import Book from '../models/Book';
import axios from 'axios';
import BookSerializer from '../serializers/BookSerializer';

export default class BookApi extends ApiClient {
    public static async searchBooks(title:string|null, authors:string[]|null, genres:string[]|null, languages:string[]=["en"]): Promise<Book[]> {
    const endpoint = '/volumes';
    const params: string[] = [];

    if (title) {
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

    if (languages && languages.length > 0) {
        const languageQueries = languages.map(language => `langRestrict=${language}`).join('|');
        params.push(languageQueries);
    }

    const config = {
        params: {
            q: params.join('+'), // Поєднуємо всі параметри в один запит
        },
    };
    this.client = axios.create({baseURL:'https://www.googleapis.com/books/v1'});
    this.client.defaults.params = { key: import.meta.env.VITE_APP_GOOGLE_BOOKS_API_KEY };
    const response = await this.get<any>(endpoint, config);
    const serialised = new BookSerializer();
    return response.data.items.map((item: any) => serialised.deserialize(item));
  }
}