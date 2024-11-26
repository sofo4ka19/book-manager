import BasicInput from "../../components/BasicInput.tsx";
import {useState} from "react";
import {useAppStore} from "../../store/Store.ts";
import {sendPasswordResetEmail, signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../firebase.ts";
import FirebaseApi from "../../api/FirebaseApi.ts";
import { useNavigate } from "react-router-dom";


const LoginCard: React.FC = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const setUser = useAppStore((state) => state.setUser);
    const store = useAppStore()


    const defaultAvatarURL = "/avatar_default.png";


    const handleAuth = async () => {
        try {
            let userCredential;
            let userId;

            // Вхід
            userCredential = await signInWithEmailAndPassword(auth, email, password);
            userId = userCredential.user.uid;
            // Завантаження даних користувача
            const userData = await FirebaseApi.getUserData(userId);
            console.log("User Data:", userData);
            if (!userData) {
                throw new Error("User data don't found");
            } else {
                store.wishlist = await FirebaseApi.loadBooksByIds(userData.wishlist || []);
                store.currentlyReadingList = await FirebaseApi.loadBooksByIds(userData.readingList || []);
                store.finishedList = await FirebaseApi.loadBooksByIds(userData.haveRead || []);

                if(!userData.avatar) userData.avatar = defaultAvatarURL;
                setUser(userData);
            }

            navigate('/home')



        } catch (error) {
            // TODO :catch properly
            console.error("Error:", error);
        }
    }


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
            <h1>Personal Book Manager Online</h1>
            <h2>Authorisation</h2>
            <BasicInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                required = {true}
            />
            <BasicInput
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                required= {true}
            />


            <button onClick={handleAuth}>Login</button>
            <button onClick={handlePasswordReset}>Forgot the password</button>
            <button onClick={() => navigate("/register")}>
                I don't have an account
            </button>

        </div>
    )
}


export default LoginCard;