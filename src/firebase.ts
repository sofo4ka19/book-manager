import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

    apiKey: "AIzaSyAJQjXAqfJmJgdgOkrNLM4_yEcszzTJ5b0",
  
    authDomain: "book-manager-1e3ac.firebaseapp.com",
  
    projectId: "book-manager-1e3ac",
  
    storageBucket: "book-manager-1e3ac.firebasestorage.app",
  
    messagingSenderId: "1053211307817",
  
    appId: "1:1053211307817:web:db54a735a86b5322db1138",
  
    measurementId: "G-L72XFP2RCL"
  
};
  // Ініціалізуємо Firebase
const app = initializeApp(firebaseConfig);

// Ініціалізація сервісів
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };