import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Auth = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarURL, setAvatarURL] = useState("");

  const defaultAvatarURL = "/images/default-avatar.png";

  const handleAuth = async () => {
    try {
      if (isRegisterMode) {
        // Реєстрація
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        // Збереження у Firestore
        const userDoc = doc(db, "users", userId);
        await setDoc(userDoc, {
          name,
          bio,
          avatarURL: avatarURL || defaultAvatarURL,
          lists: {
            currentlyReading: [],
            read: [],
            wantToRead: [],
          },
        });
        alert("User registered successfully!");
      } else {
        // Вхід
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        // Завантаження даних користувача
        const userDoc = doc(db, "users", userId);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          console.log("User Data:", userData);
        } else {
          alert("User data not found!");
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
