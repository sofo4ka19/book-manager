import { useState } from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword} from "firebase/auth";
import FirebaseApi from "../../api/FirebaseApi";
import { useAppStore } from "../../store/Store";
import BasicInput from "../BasicInput";
import { useNavigate } from "react-router-dom";

const RegisterCard: React.FC = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarURL, setAvatarURL] = useState("");

  const navigate = useNavigate();

  const defaultAvatarURL = "/avatar_default.png";
  const setUser = useAppStore((state:any) => state.setUser);

  const handleAuth = async () => {
    try {
      let userCredential;
      let userId;
      // Реєстрація
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      userId = userCredential.user.uid;

      // Збереження у Firestore
      await FirebaseApi.createUser({id: userId, username: name, email: email, bio: bio, avatar:avatarURL});
      setUser({name: name, email: email, bio, avatar: avatarURL || defaultAvatarURL, id: userId});
      alert("User registered successfully!");

      navigate('/home')
     
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Personal Book Manager Online</h1>
      <h2>Registration</h2>
      <BasicInput
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required={true}
      />
      <BasicInput
        type="text"
        placeholder="Bio (optional)"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <BasicInput
        type="text"
        placeholder="Avatar URL (optional)"
        value={avatarURL}
        onChange={(e) => setAvatarURL(e.target.value)}
      />
      <BasicInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required={true}
      />
      <BasicInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required={true}
      />
      <button onClick={handleAuth}>Register</button>
      <button onClick={() => navigate("/login")}>I don't have an account</button>
    </div>
  );
};

export default RegisterCard;
