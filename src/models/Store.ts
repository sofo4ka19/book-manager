import { create } from "zustand";
import User from "./User";
import {Book} from "./Book";
import BookList from "./BookList";

interface AppState {
  user: User | null;
  setUser: (user: User|null) => void;
  getUserBookLists: () => { haveRead: BookList; currentlyReading: BookList; wishlist: BookList };
  addBookToList: (list: BookList, book: Book) => void;
  removeBookFromList: (list: BookList, book: Book) => void;
  //generateRecommendations: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,

  setUser: (user: User|null) => set({ user }),

  getUserBookLists: () => {
    const user = get().user;
    if (!user) return { haveRead: new BookList(), currentlyReading: new BookList(), wishlist: new BookList() };
    let lists: BookList[] = user.lists;
    return {
      haveRead: lists[2],
      currentlyReading: lists[1],
      wishlist: lists[0],
    };
  },

  addBookToList: (list, book) => {
    list.addBook(book);
    const user = get().user;
    if (user){
        if(list===user.lists[2]){
            user.getRecommends();
        }
        set({ user });
    } 
  },

  removeBookFromList: (list, book) => {
    list.removeBook(book);
    const user = get().user;
    if (user) set({ user });
  }, 

//   generateRecommendations: () => {
//     const user = get().user;
//     if (!user) return;

//     user.recommendationList.generateRecommendations();
//     set({ user });
//   },
}));