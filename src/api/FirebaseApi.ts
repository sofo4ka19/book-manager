import { doc, setDoc, collection, addDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserTemp } from '../models/User';
import { Book } from '../models/Book';

export default class FirebaseApi{
    static async createUser(user: UserTemp) {
      try{
        const userRef = doc(db, "users", user.id);
        
        await setDoc(userRef, {
          username: user.username,
          email: user.email,
          bio: user.bio || "",
          avatar: user.avatar,
        });
    
        const lists = ["wishlist", "reading", "finished"];
        const listsRef = collection(userRef, "lists");
    
        for (const listName of lists) {
          const listRef = doc(listsRef, listName);
          await setDoc(listRef, { books: [] });
        }
      }catch(error){
        throw error
      }
      }

      static async getUserData(userId:string) : Promise<UserTemp|null>{ //perhaps should be updated and optimized
        try{
          const userDoc = doc(db, "users", userId);
          const userSnap = await getDoc(userDoc);

          if (userSnap.exists()) {
          const userData: UserTemp = userSnap.data() as UserTemp;
          const listsRef = collection(userDoc, "lists");

            const wishlistSnap = await getDoc(doc(listsRef, "wishlist"));
            const wishlist = wishlistSnap.exists()? wishlistSnap.data().books : [];
            const readingSnap = await getDoc(doc(listsRef, "reading"));
            const reading = readingSnap.exists()? readingSnap.data().books : [];
            const finishedSnap = await getDoc(doc(listsRef, "finished"));
            const finished = finishedSnap.exists()? finishedSnap.data().books : [];

            return {
                ...userData,
                wishlist: wishlist,
                readingList: reading,
                haveRead: finished,
            };
          } else {
              return null;
          }
        }catch(error){
          throw error
        }
      }
    

      static async addBookToUserList(userId: string, listName: string, book: Book) {
        try{
        const bookId = await FirebaseApi.checkIfBookExists(book);
    
        let newBookId;
        if (!bookId) {
          const bookRef = await addDoc(collection(db, "books"), {
            title: book.title,
            authors: book.authors,
            imageUrl: book.imageUrl,
            genres: book.genres,
            isbn: book.isbn || "",
            rate: book.rate || "",
            language: book.language || "",
            users: [userId],
          });
          newBookId = bookRef.id;
        } else {
          newBookId = bookId;
          const bookRef = doc(db, "books", newBookId);
          await updateDoc(bookRef, {
            users: arrayUnion(userId), 
        });
        }
        book.id = newBookId;
        
        const userListRef = doc(db, "users", userId, "lists", listName.toLowerCase());
        if(listName.toLowerCase()=="finished" && book.myRate){
          await updateDoc(userListRef, {
            books: arrayUnion({id: newBookId, myRate: book.myRate}),
          });
        }
        else{
          await updateDoc(userListRef, {
            books: arrayUnion(newBookId), 
          });
        }
      }catch(error){
        throw error
      }
      }
    
      
      static async removeBookFromUserList(userId: string, listName: string, bookId: string, rate?:number) {
        try{
        const userListRef = doc(db, "users", userId, "lists", listName.toLowerCase());
        
        if(listName=="Finished" && rate){
          await updateDoc(userListRef, {
            books: arrayRemove({id: bookId, myRate: rate}), 
          });
        }
        else{
          await updateDoc(userListRef, {
            books: arrayRemove(bookId), 
          });
        }
    
        // Optionally, remove the book from the books collection if no user references it
        
          const bookRef = doc(db, "books", bookId);
          const bookSnap = await getDoc(bookRef);
          if (bookSnap.exists()) {
            const bookData = bookSnap.data();
            const bookUsers = bookData.users || [];
            const updatedUsers = bookUsers.filter((user: string) => user !== userId);
      
            if (updatedUsers.length === 0) {
              await deleteDoc(bookRef);
            } else {
              await updateDoc(bookRef, { users: updatedUsers });
            }
        }
      }catch(error){ throw error}
      }
      //do we need it?
      // Load books for a user from a specific list
      static async loadUserBooks(userId: string, listName: string) : Promise<Book[]> {
        const listRef = doc(db, "users", userId, "lists", listName);
        const listSnap = await getDoc(listRef);

        if (!listSnap.exists()) {
          return [];
        }
        return await FirebaseApi.loadBooksByIds(listSnap.data().books)
      }
        
    
      static async checkIfBookExists(book: Book): Promise<string | null> {
        try{
          const booksRef = collection(db, "books"); 
          let conditions = [];
          if (book.isbn) {
            conditions.push(where("isbn", "==", book.isbn));
          }

          if (book.title) {
            conditions.push(where("title", "==", book.title));
          }

          if (book.authors && book.authors.length > 0) {
            conditions.push(where("authors", "array-contains-any", book.authors));
          }

          if (conditions.length > 0) {
            const queryConstraints = query(booksRef, ...conditions);
            const querySnapshot = await getDocs(queryConstraints);

            if (!querySnapshot.empty) {
              return querySnapshot.docs[0].id; 
            }
          }
          return null; 
        }catch(error){throw error}
      }

      static async loadBooksByIds(bookIds: string[]):Promise<Book[]>{ //add polymorphysm to search with ratings
        if(!bookIds) return [];
        try{
        const bookPromises = bookIds.map(async (bookId:string) => {
          const bookRef = doc(db, "books", bookId);
          const bookSnap = await getDoc(bookRef);
  
          if (bookSnap.exists()) {
              return { id: bookId, ...bookSnap.data() }; 
          }
          return null; // Якщо книга не знайдена
        });
        const books = (await Promise.all(bookPromises)).filter((book): book is Book => book !== null);
        return books;
        }catch(error){throw error}
      }
      static async loadBooksWithRating(books:{ id: string, myRate: number }[]):Promise<Book[]>{ //add polymorphysm to search with ratings
        if(!books || books.length === 0) return [];
        try{
          const bookPromises = books.map(async (book) => {
            const bookRef = doc(db, "books", book.id);
            const bookSnap = await getDoc(bookRef);
    
            if (bookSnap.exists()) {
                return { id: book.id, ...bookSnap.data(), myRate: book.myRate }; 
            }
            return null; 
          });
          const result = (await Promise.all(bookPromises)).filter((book): book is Book & { myRate: number } => book !== null);
          return result;
        }catch(error){throw error}
      }

      static async updateUserInfo(userId:string, name:string, bio: string|null, avatarUrl: string){
        const userRef = doc(db, "users", userId);
    
            const updates: { username?: string; bio?: string|null; avatar?: string } = {};
            
            if (name && name.length > 0) {
                updates.username = name;
            }
            if (bio && bio.length > 0) {
                updates.bio = bio;
            }
            if (avatarUrl && avatarUrl.length > 0) {
                updates.avatar = avatarUrl;
            }

            if (Object.keys(updates).length > 0) {
              try{
                await updateDoc(userRef, updates);
              }catch(error){throw error}
            }
      }
      static async logout(){ 
        try {
            await auth.signOut(); 
        } catch (error) {
            console.error("Logout error:", error); 
            throw error
        }
      }
}


