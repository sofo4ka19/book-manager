import { create } from "zustand";
import {UserTemp} from "../models/User";
import {Book} from "../models/Book";
import {devtools} from "zustand/middleware";
import FirebaseApi from "../api/FirebaseApi.ts";
import { RecomendationList } from "../models/RecommendationList.ts";

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
  addBookToList: (book: Book, myRate?:number) => void;
  removeBookFromList: (bookId: string, rate?:number) => void;
  loadBookForUser: () => Promise<void>;
  updateRecommendations: () => Promise<void>;
  getBooksOfCurrentList: () => Book[];
  updateUser: (username: string, bio: string, avatar: string) => void;
  logout:() => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
    user: null,
    recommendationsList: [],
    wishlist: [],
    finishedList: [],
    currentlyReadingList: [],
    currentSelectedList: "Recommendations",

    setUser: (user: UserTemp|null) => set({ user }),
    // perhaps needs refactoring
    updateUser: (username: string, bio: string, avatar: string) => {

      const userFromStore = {...get().user};

      const user: UserTemp = {
          ...userFromStore,
          username: (username && username!="")?(username):userFromStore.username!,
          bio: (bio && bio!="")?(bio):userFromStore.bio!,
          avatar: (avatar && avatar!="")?(avatar):userFromStore.avatar!,
          id: userFromStore.id!,
          email: userFromStore.email!,

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
                await get().updateRecommendations()
                break;

            case "Reading":
                set((state) => ({
                    currentlyReadingList: [...state.currentlyReadingList, book],
                }))
                break;
        }
    },

    removeBookFromList: async (bookId, rate?) => {
      const user = get().user;
      const currentSelectedList = get().currentSelectedList
      console.log(bookId, rate);
      if(get().currentSelectedList!=="Recommendations"){
        if (user && currentSelectedList) await FirebaseApi.removeBookFromUserList(user.id, currentSelectedList, bookId, rate)
      }
      
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
              await get().updateRecommendations()
              break;

          case "Reading":
              set((state) => ({
                  currentlyReadingList: state.currentlyReadingList.filter(book => book.id !== bookId),
              }))
              break;
            case "Recommendations":
              set((state) => ({
                recommendationsList: state.recommendationsList.filter(book => book.id !== bookId),
              }))
              break;
      }
    }, 
    logout() {
        FirebaseApi.logout();
        set(() => ({
            user: null
        }));
    },
    updateRecommendations: async () => {
        const recomendationList = new RecomendationList();
        await recomendationList.addBook();
        set(() => ({
            recommendationsList: recomendationList.list
        }));
    },
    loadBookForUser: async () => {

    }

}),
{name: 'AppStore'}
));