import BookList from "./BookList";
import {Book} from "./Book";
import { RecomendationList } from "./RecommendationList";

export default class User{
    constructor(
        private username: string,
        private email: string, //perhaps it will be also deleted
        //private password: string, //it will be deleted when we connect it to firebase
        private bio: string|null,
        private avatar: string = "/avatar_default.png",
        private wishlist: BookList = new BookList(),
        private readingList: BookList = new BookList(),
        private haveRead: BookList = new BookList(),
        private recommendationList: RecomendationList = new RecomendationList(),
        //private preference: {authors: string[]|null, genre: string[]|null, language:string[]} //will be changed to FILE type later
    ){
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            throw new Error("Unavailable email value");
        }
        // this.wishlist = new BookList;
        // this.readingList = new BookList;
        // this.haveRead = new BookList;
        // this.recommendationList = new RecomendationList;
        //this.preference = {authors:null, genre:null, language:["en"]};
    }
    public get info(): {username: string, photo: string, bio:string|null}{
        return {username: this.username, photo: this.avatar, bio: this.bio};
    }
    public get lists(): BookList[]{
        return [this.wishlist, this.readingList, this.haveRead, this.recommendationList];
    }
    public changeUsername(newUsername: string){
        //needs to check if somebody doesn't have such username
        this.username=newUsername;
    }
    public addBookToList(list:BookList, book:Book, myAssesment?:number){
        if(list==this.haveRead){
            if(myAssesment){
                book.myRate=myAssesment;
            } else{
                throw new Error("enter your mark to the book");
            }
        }
        list.addBook(book);
    }
    public getRecommends(){
        this.recommendationList = new RecomendationList();
        this.recommendationList.addBook();
    }
    // public get preferences(): {authors: string[]|null, genre: string[]|null, language:string[]}{
    //     return { authors: this.preference.authors, genre: this.preference.genre, language: this.preference.language}
    // }
    public removeBookFromList(list:BookList, book:Book){
        list.removeBook(book); // perhaps needs updating
    }
    public changeList(listFrom:BookList, listTo:BookList, book:Book){
        this.addBookToList(listTo, book);
        this.removeBookFromList(listFrom, book);
    }
}