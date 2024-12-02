import { useState } from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword} from "firebase/auth";
import FirebaseApi from "../../api/FirebaseApi";
import { useAppStore } from "../../store/Store";
import BasicInput from "../BasicInput";
import { useNavigate } from "react-router-dom";

const RegisterCard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarURL, setAvatarURL] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    name: "",
    bio: "",
    avatarURL: ""
  });

  const navigate = useNavigate();

  const defaultAvatarURL = "/avatar_default.png";
  const setUser = useAppStore((state:any) => state.setUser);
  const store = useAppStore();

  const handleAuth = async () => {
    if (!validateFields()) return;
    setLoading(true);
    try {
      let userCredential;
      let userId;
      // Реєстрація
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      userId = userCredential.user.uid;

      // Збереження у Firestore
      setUser({name: name, email: email, bio, avatar: avatarURL || defaultAvatarURL, id: userId});
      await FirebaseApi.createUser({id: userId, username: name, email: email, bio: bio, avatar:avatarURL});
      setLoading(false);
      navigate('/home')
     
    } catch (error) {
      setLoading(false);
      store.logout();
      if (error instanceof Error) {
        switch (error.message) {
          case "Firebase: Error (auth/email-already-in-use).":
            alert("There is an account with this email");
            break;
          case "Firebase: Error (auth/invalid-email).":
            alert("Your email is inappropriate");
            break;
          case "Firebase: Error (auth/weak-password).":
            alert("Your password is too easy");
            break;
          default:
            alert("An unexpected error occurred: " + error.message);
        }
      } else {
        alert("An unknown error occurred.");
      }
    }
  };
  const validateFields = () => {
    let valid = true;
    let newErrors: any = {};

    // Email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }

    // Name validation (max 20 characters)
    if (!name) {
      newErrors.name = "Name is required.";
      valid = false;
    } else if (name.length > 20) {
      newErrors.name = "Name must be less than 20 characters.";
      valid = false;
    }

    // Bio validation (max 60 characters)
    if (bio.length > 60) {
      newErrors.bio = "Bio must be less than 60 characters.";
      valid = false;
    }

    // Avatar URL validation (check if it is a valid URL)
    if (avatarURL && !/^https?:\/\//.test(avatarURL)) {
      newErrors.avatarURL = "Please enter a valid URL for the avatar.";
      valid = false;
    }

    // Password validation (min 8 characters, must contain letters and numbers)
    if (!password || password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      valid = false;
    } else if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      newErrors.password = "Password must contain both letters and numbers.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }
  if (loading) {
    return <div className="loading">Loading...</div>;  // Show loading screen
  }

  return (
    <div className="enter">
      <h1>Personal Book Manager Online</h1>
      <div>
        <h2>Registration</h2>
        {errors.name && <small style={{ color: 'red' }}>{errors.name}</small>}
        <BasicInput
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required={true}
          style={{ border: errors.name ? '2px solid red' : '' }}
        />
        {errors.bio && <small style={{ color: 'red' }}>{errors.bio}</small>}
        <BasicInput
          type="text"
          placeholder="Bio (optional)"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          style={{ border: errors.bio ? '2px solid red' : '' }}
        />
        {errors.avatarURL && <small style={{ color: 'red' }}>{errors.avatarURL}</small>}
        <BasicInput
          type="text"
          placeholder="Avatar URL (optional)"
          value={avatarURL}
          onChange={(e) => setAvatarURL(e.target.value)}
          style={{ border: errors.avatarURL ? '2px solid red' : '' }}
        />
        {errors.email && <small style={{ color: 'red' }}>{errors.email}</small>}
        <BasicInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required={true}
          style={{ border: errors.email ? '2px solid red' : '' }}
        />
        {errors.password && <small style={{ color: 'red' }}>{errors.password}</small>}
        <BasicInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={true}
          style={{ border: errors.password ? '2px solid red' : '' }}
        />
        <button className="auth" onClick={handleAuth}>Register</button>
        <button className="additional" onClick={() => navigate("/login")}>I have an account</button>
        </div>
    </div>
  );
};

export default RegisterCard;
