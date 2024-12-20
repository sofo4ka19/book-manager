import BasicInput from "../../components/BasicInput.tsx";
import {useState} from "react";
import {sendPasswordResetEmail, signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../firebase.ts";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";


const LoginCard: React.FC = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorFields, setErrorFields] = useState({email: "", password: ""});
 
    const validateEmpty = () => {
        let valid = true;
        let errors: any = {};
        if(email==""){
            errors.email = "it is required field";
            valid = false;
        }
        if(password==""){
            errors.password = "it is required field";
            valid = false;
        }
        setErrorFields(errors);
        return valid;
    }
    const handleAuth = async () => {
        if(!validateEmpty()) return;
        try {
            // Вхід
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/home')

        } catch (error) {
            console.log(error)
            if(error instanceof FirebaseError){
                switch(error.code){
                    case "auth/user-not-found":
                        alert("No user found with this email.")
                        break;
                    case "auth/wrong-password":
                        alert("Incorrect password")
                        break;
                    default:
                        alert("An error occurred during authentication.");
                }
            }
            else{
                alert("An error occurred during authentication.");
            }
        }
    }


    const handlePasswordReset = async () => {
        if (!email) {
            alert("Please, enter the email");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Instructions for reseting the password was send to your email");
        } catch (error) {
            alert("Error during reseting the password: "+ error);
        }
    };


    return (

        <div className="enter">
            <h1>Personal Book Manager Online</h1>
            <div>
                <h2>Authorisation</h2>
                <label>Email</label>
                <BasicInput
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    required = {true}
                    style={{ border: errorFields.email ? '2px solid red' : '' }}
                />
                {errorFields.email && <small style={{ color: 'red', marginTop: '-15px'  }}>{errorFields.email}</small>}
                <label>Password</label>
                <BasicInput
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                    required= {true}
                    style={{ border: errorFields.password ? '2px solid red' : '' }}
                />
                {errorFields.password && <small style={{ color: 'red', marginTop: '-15px' }}>{errorFields.password}</small>}


                <button className="auth" onClick={handleAuth}>Login</button>
                <button className="additional" onClick={handlePasswordReset}>Forgot the password</button>
                <button className="additional" onClick={() => navigate("/register")}>
                    I don't have an account
                </button>
            </div>
        </div>
    )
}


export default LoginCard;