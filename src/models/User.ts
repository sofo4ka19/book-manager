import BookList from "./BookList";
import {Book} from "./Book";
import { RecomendationList } from "./RecommendationList";
import { useAppStore } from "../store/Store";

export interface UserTemp{
    id: string;
    username: string;
    email: string;
    bio: string;
    avatar: string|null;
    wishlist?: string[];
    readingList?: string[];
    haveRead?: string[];
}
export default class User{
    constructor(
        private id:string,
        private username: string,
        private email: string, //perhaps it will be also deleted
        private bio: string|null,
        private avatar: string = "/avatar_default.png",
        private wishlist: BookList = new BookList(),
        private readingList: BookList = new BookList(),
        private haveRead: BookList = new BookList(),
        private recommendationList: RecomendationList = new RecomendationList(),
    ){
        // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!emailPattern.test(email)) {
        //     throw new Error("Unavailable email value");
        // }
    }
    public get info(): {username: string, photo: string, bio:string|null}{
        return {username: this.username, photo: this.avatar, bio: this.bio};
    }
    public get lists(): BookList[]{
        return [this.wishlist, this.readingList, this.haveRead, this.recommendationList];
    }
    public get uid():string{
        return this.id;
    }
    // public changeUsername(newUsername: string){
    //     //needs to check if somebody doesn't have such username
    //     this.username=newUsername;
    // }
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
    public removeBookFromList(list:BookList, book:Book){
        list.removeBook(book); // perhaps needs updating
    }
    public changeList(listFrom:BookList, listTo:BookList, book:Book){
        this.addBookToList(listTo, book);
        this.removeBookFromList(listFrom, book);
    }
    public changeInfo(name:string, bio: string|null, avatar:string){
        if(name && name.length>0) this.username=name;
        if(bio && bio.length>0)this.bio=bio;
        if(avatar && avatar.length>0)this.avatar = avatar;
        //useAppStore.getState().setUser(this);
    }
}