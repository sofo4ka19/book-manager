import { Serializer } from './Serializer';
import {Book} from '../models/Book';
import { v4 as uuidv4 } from 'uuid';

export default class BookSerializer extends Serializer<Book>{
    deserialize(data: any): Book {
        return {
            id: data.id, //perhaps needs changing
            title: data.volumeInfo.title,
            authors: data.volumeInfo.authors || null,
            genres: data.volumeInfo.categories || null,
            isbn: data.volumeInfo.industryIdentifiers
                ? data.volumeInfo.industryIdentifiers[0].identifier
                : null,
            imageUrl: data.volumeInfo.imageLinks
                ? data.volumeInfo.imageLinks.thumbnail
                : "/bookCover_default.png",
            rate: data.volumeInfo.averageRating || null,
            language: data.volumeInfo.language || null
        };
    }

    serialize(book: Book): any {
        return {
            volumeInfo: {
                title: book.title,
                authors: book.authors,
                categories: book.genres,
                industryIdentifiers: [{ identifier: book.isbn }],
                imageLinks: { thumbnail: book.imageUrl },
                averageRating: book.rate,
                language: book.language
            }
        };
    }
}