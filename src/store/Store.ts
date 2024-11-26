import { create } from "zustand";
import {UserTemp} from "../models/User";
import {Book} from "../models/Book";
import {devtools} from "zustand/middleware";
import FirebaseApi from "../api/FirebaseApi.ts";

export type TypeOfList = "Recommendations" | "Wishlist" | "Reading" | "Finished" | null;

interface AppState {
  user: UserTemp | null;
  currentSelectedList: TypeOfList;
  recommendationsList: Book[];
  wishlist: Book[];
  finishedList: Book[];
  currentlyReadingList: Book[];

  setCurrentList: (list: TypeOfList) => void;
  setUser: (user: UserTemp|null) => void;
  addBookToList: (book: Book) => void;
  removeBookFromList: (bookId: string) => void;
  loadBookForUser: () => Promise<void>;
  getBooksOfCurrentList: () => Book[];
  // TODO: Check all username name references of user instance. Should be only name or username. Check firebase for username\name references
  updateUser: (username: string, bio: string, avatar: string) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
    user: null,
    recommendationsList: [],
    wishlist: [],
    finishedList: [],
    currentlyReadingList: [],
    currentSelectedList: null,

    setUser: (user: UserTemp|null) => set({ user }),
    // perhaps needs refactoring
    updateUser: (username: string, bio: string, avatar: string) => {

      const userFromStore = {...get().user};

      const user: UserTemp = {
          username: username,
          bio: bio,
          avatar: avatar,
          id: userFromStore.id!,
          email: userFromStore.email!,
          ...userFromStore

      }

      set(() => ({
          user: user
      }));
    },
    setCurrentList: (list: TypeOfList) => {
      set(() => ({
          currentSelectedList: list
      }))
    },

    getBooksOfCurrentList: () => {

      switch (get().currentSelectedList) {
          case "Recommendations":
              return get().recommendationsList;

          case "Wishlist":
              return get().wishlist;


          case "Finished":
              return get().finishedList;

          case "Reading":
              return get().currentlyReadingList;

          default:
              return []
      }

    },

    addBookToList: async (book) => {
      const user = get().user;
      const currentSelectedList = get().currentSelectedList;
      try{
      if (user && currentSelectedList) await FirebaseApi.addBookToUserList(user.id, currentSelectedList, book)
      // TODO: check if call is successful
    } catch(error){
        console.error("Firebase:", error);
    }

      switch (currentSelectedList) {
            case "Recommendations":
                set((state) => ({
                    recommendationsList: [...state.recommendationsList, book],
                }))
                break;

            case "Wishlist":
                set((state) => ({
                    wishlist: [...state.wishlist, book],
                }))
                break;

            case "Finished":
                set((state) => ({
                    finishedList: [...state.finishedList, book],
                }))
                break;

            case "Reading":
                set((state) => ({
                    currentlyReadingList: [...state.currentlyReadingList, book],
                }))
                break;
        }
    },

    removeBookFromList: async (bookId) => {
      const user = get().user;
      const currentSelectedList = get().currentSelectedList
      if (user && currentSelectedList) await FirebaseApi.removeBookFromUserList(user.id, currentSelectedList, bookId)
      // TODO: check if call is successful

      switch (get().currentSelectedList) {
          case "Wishlist":
              set((state) => ({
                  wishlist: state.wishlist.filter(book => book.id !== bookId),
              }))
              break;

          case "Finished":
              set((state) => ({
                  finishedList: state.finishedList.filter(book => book.id !== bookId),
              }))
              break;

          case "Reading":
              set((state) => ({
                  currentlyReadingList: state.currentlyReadingList.filter(book => book.id !== bookId),
              }))
              break;
      }
    }, 

    loadBookForUser: async () => {

    }
}),
{name: 'AppStore'}
));