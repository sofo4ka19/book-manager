export interface Book{
    id: string;
    title: string;
    authors: string[];
    genres: string[];
    isbn: string|null;
    imageUrl: string;
    rate: number|null;
    language: string|null;
    myRate?: number;
}