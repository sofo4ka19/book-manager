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
  loadUserData: (id: string) => Promise<void>;
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
    updateUser: async (username: string, bio: string, avatar: string) => {

      const userFromStore = {...get().user};
    //   perhaps needs changings with avatar
    try{
      await FirebaseApi.updateUserInfo(userFromStore.id!, username, bio, (!avatar || avatar=="/avatar_default.png")?(""):avatar);
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
    }catch(error){
        throw error
      }
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
            switch (currentSelectedList) {
                //i think we don't need it
                // case "Recommendations":
                //     set((state) => ({
                //         recommendationsList: [...state.recommendationsList, book],
                //     }))
                //     break;
    
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
    } catch(error){
        console.error(error);
        throw new Error("problem with adding")
    }

      
    },

    removeBookFromList: async (bookId, rate?) => {
      const user = get().user;
      const currentSelectedList = get().currentSelectedList
      console.log(bookId, rate);
      try{
        if(currentSelectedList!=="Recommendations"){
            if (user && currentSelectedList) await FirebaseApi.removeBookFromUserList(user.id, currentSelectedList, bookId, rate)
        }
        switch (currentSelectedList) {
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
      }catch(error){
        console.error(error);
        throw new Error("problem with removing")
      }
    }, 
    logout() {
        FirebaseApi.logout();
        set(() => ({
            user: null,
            recommendationsList: [],
            wishlist: [],
            finishedList: [],
            currentlyReadingList: [],
            currentSelectedList: "Recommendations",
        }));
    },
    updateRecommendations: async () => {
        const recomendationList = new RecomendationList();
        await recomendationList.addBook();
        set(() => ({
            recommendationsList: recomendationList.list
        }));
    },
    loadUserData: async (userId: string) => {
        const defaultAvatarURL = "/avatar_default.png";
        try{
            const userData = await FirebaseApi.getUserData(userId);
            if (!userData) {
                throw new Error("User data don't found");
            } else {
                const wishlist = await FirebaseApi.loadBooksByIds(userData.wishlist || []);
                const currentlyReadingList = await FirebaseApi.loadBooksByIds(userData.readingList || []);
                const finishedList = await FirebaseApi.loadBooksWithRating(userData.haveRead || []);
                userData.id = userId; 
                if(!userData.avatar) userData.avatar = defaultAvatarURL;
                set({
                    user: { ...userData, id: userId },
                    wishlist: wishlist,
                    currentlyReadingList: currentlyReadingList,
                    finishedList: finishedList,
                });
                await get().updateRecommendations()
            }
        } catch(error){
            set({
                user: null,
                wishlist: [],
                currentlyReadingList: [],
                finishedList: [],
            });
            console.error("Error loading user data:", error);
            alert("Oops, something is wrong, try again")
            throw error;
        }
    }

}),
{name: 'AppStore'}
));