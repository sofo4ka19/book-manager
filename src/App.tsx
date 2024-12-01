import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase"; // ваш екземпляр firebase
import Home from "./components/Home"; // головна сторінка
import "./App.css";
import { useAppStore } from "./store/Store";
import LoginCard from "./components/auth/LoginCard.tsx";
import RegisterCard from "./components/auth/RegisterCard.tsx";
import FirebaseApi from "./api/FirebaseApi.ts";

const App = () => {
  const setUser = useAppStore((state : any) => state.setUser);
  const defaultAvatarURL = "/avatar_default.png";
  const store = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      //place of the code should be changed, because the same is in LoginCard
      console.log("User from fb api: " + currentUser);
      
      if(currentUser){
        const userId = currentUser.uid;
        try{
          const userData = await FirebaseApi.getUserData(userId);
          console.log("User Data:", userData  );
              if (!userData) {
                  throw new Error("User data don't found");
              } else {
                  store.wishlist = await FirebaseApi.loadBooksByIds(userData.wishlist || []);
                  store.currentlyReadingList = await FirebaseApi.loadBooksByIds(userData.readingList || []);
                  store.finishedList = await FirebaseApi.loadBooksWithRating(userData.haveRead || []);
                  userData.id = userId;
                  if(!userData.avatar) userData.avatar = defaultAvatarURL;
                  setUser(userData);
                  console.log("User Data:", store.user  );
              }
        } catch (error) {
          // TODO :catch properly
          console.error("Error:", error);
      }
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);
  if (isLoading) {
    return <div className="loading">Loading...</div>;
}

  return (
    <Router>
      <Routes>
        <Route path="/" element={store.user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/home" element={store.user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginCard/>} />
        <Route path="/register" element={<RegisterCard/>} />
      </Routes>
    </Router>
  );
};

export default App;