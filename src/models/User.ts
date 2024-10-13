import BookList from "./BookList";
import Book from "./Book";

class User{
    constructor(
        private username: string,
        private email: string, //perhaps it will be also deleted
        private password: string, //it will be deleted when we connect it to firebase
        private bookLists: (BookList|null)[]=[],
        private preference: string[],
        private bio: string,
        private avatar: string = "/avatar_default.png" //will be changed to FILE type later
    ){
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            throw new Error("Unavailable email value");
        }
        while(bookLists.length<5){
            bookLists.push(null);
        }
    }
    
    changeUsername(newUsername: string){
        //needs to check if somebody doesn't have such username
        this.username=newUsername;
    }
    checkTheList(list:BookList){
        let j=-1;
        for(let i=0; i<this.bookLists.length; i++){
            if(list==this.bookLists[i]) break;
            if(j==-1 && this.bookLists[i]==null) j=i;
        }
        if(j==-1){
            throw new Error("there is no such list");
        }
        this.bookLists[j]=list;
    }
    addBookToList(list:BookList, book:Book, myAssesment=-1){
        this.checkTheList(list);
        list.addBook(book, myAssesment);
    }
    removeBookFromList(list:BookList, book:Book){
        this.checkTheList(list);
        list.removeBook(book);
    }
}