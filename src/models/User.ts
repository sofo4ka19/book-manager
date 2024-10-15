import BookList from "./BookList";
import Book from "./Book";
import { RecomendationList } from "./RecommendationList";

export default class User{
    constructor(
        private username: string,
        private email: string, //perhaps it will be also deleted
        private password: string, //it will be deleted when we connect it to firebase
        //private bookLists: (BookList|null)[]=[],
        private wishlist: BookList,
        private readingList: BookList,
        private haveRead: BookList,
        private recommendationList: RecomendationList,
        private preference: {authors: string[]|null, genre: string[]|null, language:string[]},
        private bio: string|null,
        private avatar: string = "/avatar_default.png" //will be changed to FILE type later
    ){
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            throw new Error("Unavailable email value");
        }
        this.preference.language=["en"];
        /*while(bookLists.length<5){
            bookLists.push(null);
        }*/
    }
    public get info(): {username: string, photo: string, bio:string|null}{
        return {username: this.username, photo: this.avatar, bio: this.bio};
    }
    public get lists(): BookList[]{
        return [this.wishlist, this.readingList, this.haveRead, this.recommendationList];
    }
    public set recommends(rec:RecomendationList){
        this.recommendationList=rec;
    }
    public changeUsername(newUsername: string){
        //needs to check if somebody doesn't have such username
        this.username=newUsername;
    }
    /*checkTheList(list:BookList){
        let j=-1;
        for(let i=0; i<this.bookLists.length; i++){
            if(list==this.bookLists[i]) break;
            if(j==-1 && this.bookLists[i]==null) j=i;
        }
        if(j==-1){
            throw new Error("there is no such list");
        }
        this.bookLists[j]=list;
    }*/
    public addBookToList(list:BookList, book:Book, myAssesment=-1){
        list.addBook(book, myAssesment); //perhaps needs updating
    }
    public getRecommends(){
        this.recommendationList.updatePreferences();
        this.recommendationList.addBook();
    }
    public get preferences(): {authors: string[]|null, genre: string[]|null, language:string[]}{
        return { authors: this.preference.authors, genre: this.preference.genre, language: this.preference.language}
    }
    public removeBookFromList(list:BookList, book:Book){
        list.removeBook(book); // perhaps needs updating
    }
    public changeList(listFrom:BookList, listTo:BookList, book:Book){
        this.addBookToList(listTo, book);
        this.removeBookFromList(listFrom, book);
    }
}