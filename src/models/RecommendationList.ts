import BookList from "./BookList"
import Book from "./Book";
import User from "./User";
const apiKey = import.meta.env.REACT_APP_GOOGLE_BOOKS_API_KEY;

export class RecomendationList extends BookList{
    constructor(
        //private recommendationSet: {author?:string, genre?:string, rating?:number}
        private user: User,
        private authors: string[]|null,
        private genres: string[]|null, //needs checking
        //private rating: number|null,
        private languages: string[]=["en"] //needs checking
    ){
        super();
        this.authors=user.preferences.authors;
        this.genres=user.preferences.genre;
        this.languages=user.preferences.language;
    }

    public updatePreferences(/*authors:string[]|null, genres: string[]|null, languages: string[]=["en"]*/){
        this.authors=this.user.preferences.authors;
        this.genres=this.user.preferences.genre;
        this.languages=this.user.preferences.language;
    }
    public filterByAnotherLists(books:Book[]):Book[]{
        const idsToRemove = new Set();
        //for(let i=0; i<3; i++){
            for(const list of this.user.lists){
                for(const book of list.bookArray){
                    idsToRemove.add(book.id);
                }
            }
        //}
        return books = books.filter(book => !idsToRemove.has(book.id));
    }
    async generateRecommends():Promise<Book[]>{
        const queryParams = [];
        if (this.authors && this.authors.length > 0) {
            const authorQueries = this.authors.map(author => `inauthor:${author}`).join('|');
            queryParams.push(`(${authorQueries})`);
        } //else if(this.authors){queryParams.push(`inauthor:${this.authors}`) }

        if (this.genres && this.genres.length > 0) {
            const genreQueries = this.genres.map(genre => `subject:${genre}`).join('|');
            queryParams.push(`(${genreQueries})`);
        }//else if(this.genres){queryParams.push(`subject:${this.genres}`) }
       //if (this.rating) queryParams.push(`rating:${this.rating}`);
       //if (this.publicationYear) queryParams.push(`publishedDate:${this.publicationYear}`);
       //if (this.language) queryParams.push(`langRestrict=${this.language}`);
       if (this.languages && this.languages.length > 0) {
        const languageQueries = this.languages.map(language => `langRestrict=${language}`).join('|');
        queryParams.push(languageQueries);
        }

       const query = queryParams.join('+');
       const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&&printType=books&key=${apiKey}`;

       const response = await fetch(url);
       if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
       const data = await response.json();
       return data.items.map((item: any) => new Book(
        item.volumeInfo.title,
        item.volumeInfo.authors /*? item.volumeInfo.authors.join(', ') :*/ || "Unknown Author", // З'єднуємо авторів у рядок
        item.volumeInfo.categories /*? item.volumeInfo.categories.join(', ') :*/ || "Unknown Genre", // З'єднуємо жанри у рядок
        item.volumeInfo.industryIdentifiers ? item.volumeInfo.industryIdentifiers[0].identifier : "Unknown ISBN",
        item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : "/bookCover_default.png",
        item.volumeInfo.averageRating || 0,
        item.volumeInfo.language || "Unknown Language"
       ));
    }
    async addBook(): Promise<void> {
        const recommendations = await this.generateRecommends();
        const filteredBooks = this.filterByAnotherLists(recommendations)
         for(let book of filteredBooks){
            super.addBook(book);
         }
     }
    
}