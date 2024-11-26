import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase"; // ваш екземпляр firebase
import Home from "./components/Home"; // головна сторінка
import "./App.css";
import { useAppStore } from "./models/Store";
import LoginCard from "./components/auth/LoginCard.tsx";
import RegisterCard from "./components/auth/RegisterCard.tsx";

const App = () => {
  const setUser = useAppStore((state : any) => state.setUser);

  const store = useAppStore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);


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