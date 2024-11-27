import { doc, setDoc, collection, addDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserTemp } from '../models/User';
import { Book } from '../models/Book';
import { useAppStore } from '../store/Store';

export default class FirebaseApi{
    static async createUser(user: UserTemp) {
        const userRef = doc(db, "users", user.id);
        // Set user data in Firestore
        await setDoc(userRef, {
          username: user.username,
          email: user.email,
          bio: user.bio || "",
          avatar: user.avatar,
        });
    
        // Create empty lists for the user
        const lists = ["wishlist", "reading", "finished"];
        const listsRef = collection(userRef, "lists");
    
        for (const listName of lists) {
          const listRef = doc(listsRef, listName);
          await setDoc(listRef, { books: [] });
        }
      }

      static async getUserData(userId:string) : Promise<UserTemp|null>{
        const userDoc = doc(db, "users", userId);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
        const userData: UserTemp = userSnap.data() as UserTemp;
         // Отримуємо референс до підколекції "lists"
        const listsRef = collection(userDoc, "lists");

        // Зчитуємо списки книг
        const lists = ["wishlist", "reading", "finished"];
        const userLists: { [key: string]: string[] } = {};

        for (const listName of lists) {
            const listDoc = doc(listsRef, listName);
            const listSnap = await getDoc(listDoc);
            userLists[listName] = listSnap.exists() ? listSnap.data().books || [] : [];
        }

        // Якщо список не існує, створіть його як порожній
        return {
            ...userData,
            wishlist: userLists["wishlist"],
            readingList: userLists["reading"],
            haveRead: userLists["finished"],
        };
        } else {
            return null;
        }
      }
    
      // Add book to user's list or create new book in Firestore
      static async addBookToUserList(userId: string, listName: string, book: Book) {
        // Check if book already exists in the books collection
        const bookId = await FirebaseApi.checkIfBookExists(book);
    
        // If book doesn't exist, create it
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
            users: arrayUnion(userId), // Додаємо ID користувача до списку
        });
        }
        book.id = newBookId;
        // Add the book to the user's list
        const userListRef = doc(db, "users", userId, "lists", listName.toLowerCase());
        await updateDoc(userListRef, {
          books: arrayUnion(newBookId), // Adds the book id to the user's list
        });
      }
    
      // Remove book from user's list and from books collection if necessary
      static async removeBookFromUserList(userId: string, listName: string, bookId: string) {
        const userListRef = doc(db, "users", userId, "lists", listName.toLowerCase());
        // Remove book from the user's list
        await updateDoc(userListRef, {
          books: arrayRemove(bookId), // Removes the book id from the user's list
        });
    
        // Optionally, remove the book from the books collection if no user references it
        const bookRef = doc(db, "books", bookId);
        const bookSnap = await getDoc(bookRef);
        if (bookSnap.exists()) {
          const bookData = bookSnap.data();
          const bookUsers = bookData.users || [];
          const updatedUsers = bookUsers.filter((user: string) => user !== userId);
    
          if (updatedUsers.length === 0) {
            // Delete the book from the books collection if no users reference it
            await deleteDoc(bookRef);
          } else {
            // Update book's user references
            await updateDoc(bookRef, { users: updatedUsers });
          }
        }
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
        
    
      // Check if a book already exists in the Firestore books collection
      static async checkIfBookExists(book: Book): Promise<string | null> {
        //check this logic
        //let bookId: string | null = null;
        const booksRef = collection(db, "books"); 
        let conditions = [];
        // Додаємо умову для ISBN, якщо він є
        if (book.isbn) {
          conditions.push(where("isbn", "==", book.isbn));
        }

        // Додаємо умову для назви
        if (book.title) {
          conditions.push(where("title", "==", book.title));
        }

        // Додаємо умову для авторів
        if (book.authors && book.authors.length > 0) {
          conditions.push(where("authors", "array-contains-any", book.authors));
        }

        // Створюємо запит тільки якщо є умови
        if (conditions.length > 0) {
          const queryConstraints = query(booksRef, ...conditions);
          const querySnapshot = await getDocs(queryConstraints);

          if (!querySnapshot.empty) {
            console.log("Book found!");
            return querySnapshot.docs[0].id; // Повертаємо ID першого знайденого документа
          }
        }

        console.log("Book not found.");
        return null; 
      }

      static async loadBooksByIds(bookIds: string[]):Promise<Book[]>{ //add polymorphysm to search with ratings
        if(!bookIds) return [];
        const bookPromises = bookIds.map(async (bookId:string) => {
          const bookRef = doc(db, "books", bookId);
          const bookSnap = await getDoc(bookRef);
  
          if (bookSnap.exists()) {
              return { id: bookId, ...bookSnap.data() }; // Додаємо id до даних книги
          }
          return null; // Якщо книга не знайдена
        });
        const books = (await Promise.all(bookPromises)).filter((book): book is Book => book !== null);
        return books;
      }

      static async updateUserInfo(userId:string, name:string, bio: string|null, avatarUrl: string){
        const userRef = doc(db, "users", userId);
    
            // Формуємо дані для оновлення
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

            // Якщо є що оновлювати, виконуємо оновлення
            if (Object.keys(updates).length > 0) {
                await updateDoc(userRef, updates);
            }
      }
      static async logout(){ 
        try {
            await auth.signOut(); // викликаємо метод для логауту в Firebase
        } catch (error) {
            console.error("Logout error:", error); // обробка помилки
        }
      }
}


