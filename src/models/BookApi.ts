import ApiClient from './ApiClient';

export default class BookApi extends ApiClient {
  constructor() {
    super('https://www.googleapis.com/books/v1');
    this.client.defaults.params = { key: import.meta.env.VITE_APP_GOOGLE_BOOKS_API_KEY };
  }

  // Метод для пошуку книг за заголовком
  public async searchBooksByTitle(title: string): Promise<any> {
    const endpoint = '/volumes';
    const config = {
      params: {
        q: `intitle:${title}`,
      },
    };
    return this.get<any>(endpoint, config);
  }

  // Метод для пошуку книг за автором
  public async searchBooksByAuthor(author: string): Promise<any> {
    const endpoint = '/volumes';
    const config = {
      params: {
        q: `inauthor:${author}`,
      },
    };
    return this.get<any>(endpoint, config);
  }

  // Метод для пошуку книг за жанром
  public async searchBooksByGenre(genre: string): Promise<any> {
    const endpoint = '/volumes';
    const config = {
      params: {
        q: `subject:${genre}`,
      },
    };
    return this.get<any>(endpoint, config);
  }

  // Метод для пошуку книг за кількома параметрами
  public async searchBooks(title?: string, author?: string, genre?: string): Promise<any> {
    const endpoint = '/volumes';
    const params = [];

    if (title) params.push(`intitle:${title}`);
    if (author) params.push(`inauthor:${author}`);
    if (genre) params.push(`subject:${genre}`);

    const config = {
      params: {
        q: params.join(' '), // Поєднуємо всі параметри в один запит
      },
    };

    return this.get<any>(endpoint, config);
  }
}