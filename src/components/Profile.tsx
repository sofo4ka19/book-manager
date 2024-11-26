import {useState} from "react";
import FirebaseApi from "../api/FirebaseApi";
import Modal from "./Modal";
import { useAppStore } from "../store/Store";
import { useNavigate } from "react-router-dom";

function Profile(){
    const navigate = useNavigate()
    const user = useAppStore().user
    const store = useAppStore();

    if(!user){
        navigate("/login")
        return;
    }

    const[toggle, setToggle] = useState<boolean>(false);
    const [name, setName] = useState(user.username);
    const [bio, setBio] = useState(user.bio);
    const [avatarURL, setAvatarURL] = useState(user.avatar);

    const defaultAvatarURL = "/avatar_default.png";

    function changeInfo(){
        if(!user){
            navigate("/login")
            return;
        }
        FirebaseApi.updateUserInfo(user.id, name, bio, avatarURL|| "");
        store.updateUser(name,bio,avatarURL || defaultAvatarURL);
        setToggle(false);
    }
    return(
        <>
        <section className="profile">
            <button onClick={() => setToggle(true)}><img src="../../public/settings.svg" alt="logout" /></button>
            <button onClick={FirebaseApi.logout}><img src="../../public/logout.svg" alt="logout" /></button>
            <img src={user.avatar || defaultAvatarURL} alt={user.username} />
            <section className="aboutMe">
                <h1>{user.username}</h1>
                {user.bio && (
                <h2>{user.bio}</h2>)}
            </section>
        </section>
        <Modal isOpen={toggle} onClose={() => setToggle(false)} title = "Change info">
            <div className="fields">
                <form className="addCard" onSubmit={changeInfo}>
                    <label>Name</label>
                    <input onChange={(e) => setName(e.target.value)} type="text" />
                    <label>Bio</label>
                    <input onChange={(e) => setBio(e.target.value)} type="text" />
                    <label>Avatar</label>
                    <input onChange={(e) => setAvatarURL(e.target.value)} type="text" />
                </form>
            </div>
                            
            <button type="submit" className="find">Change</button>
        </Modal>
        </>
    );
}

export default Profile;