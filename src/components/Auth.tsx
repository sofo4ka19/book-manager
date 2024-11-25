import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import FirebaseApi from "../api/FirebaseApi";
import User from "../models/User";
import { useAppStore } from "../models/Store";
import BookList from "../models/BookList";

const Auth = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarURL, setAvatarURL] = useState("");

  const defaultAvatarURL = "/avatar_default.png";
  const setUser = useAppStore((state) => state.setUser);

  const handleAuth = async () => {
    try {
      let userCredential;
      let userId;
      if (isRegisterMode) {
        // Реєстрація
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        userId = userCredential.user.uid;

        // Збереження у Firestore
        await FirebaseApi.createUser({id: userId, username: name, email: email, bio: bio, avatar:avatarURL});
        const newUser = new User(userId, name, bio, avatarURL || defaultAvatarURL);
        setUser(newUser);
        alert("User registered successfully!");
      } else {
        // Вхід
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        userId = userCredential.user.uid;

        // Завантаження даних користувача
        const userData = await FirebaseApi.getUserData(userId);
        console.log("User Data:", userData);
        if (!userData) {
          throw new Error("User data don't found");
        }else{
          const wishlistBooks = await FirebaseApi.loadBooksByIds(userData.wishlist || []);
          const currentlyReadingBooks = await FirebaseApi.loadBooksByIds(userData.readingList || []);
          const haveReadBooks = await FirebaseApi.loadBooksByIds(userData.haveRead || []); //change to have op with rating
          const wishlist = new BookList(wishlistBooks);
          const currentlyReading = new BookList(currentlyReadingBooks);
          const haveRead = new BookList(haveReadBooks);

          const loggedInUser = new User(userId, userData.username, userData.email, userData.bio, userData.avatar || defaultAvatarURL, wishlist, currentlyReading, haveRead);
          setUser(loggedInUser);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      alert("Будь ласка, введіть email!");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Інструкції для відновлення пароля відправлені на вашу пошту.");
    } catch (error) {
      console.error("Помилка при відновленні пароля:", error);
    }
  };

  return (
    <div>
      <h1>{isRegisterMode ? "Register" : "Login"}</h1>
      {isRegisterMode && (
        <>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <input
            type="text"
            placeholder="Avatar URL (optional)"
            value={avatarURL}
            onChange={(e) => setAvatarURL(e.target.value)}
          />
        </>
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button onClick={handleAuth}>{isRegisterMode ? "Register" : "Login"}</button>
      {!isRegisterMode && (
        <button onClick={handlePasswordReset}>Forgot the password</button>
      )}
      <button onClick={() => setIsRegisterMode(!isRegisterMode)}>
        I {isRegisterMode ? "" : "don't "}have an account
      </button>
    </div>
  );
};

export default Auth;
