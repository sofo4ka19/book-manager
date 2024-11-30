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
        console.log(name, bio, avatarURL);
        if(!user){
            navigate("/login")
            return;
        }
        FirebaseApi.updateUserInfo(user.id, name, bio, (!avatarURL || avatarURL==defaultAvatarURL)?(""):avatarURL);
        store.updateUser(name,bio,avatarURL || defaultAvatarURL);
        setToggle(false);
    }
    return(
        <>
        <section className="profile">
            <img className="avatar" src={user.avatar || defaultAvatarURL} alt={user.username} />
            <section className="aboutMe">
                <h1>{user.username}</h1>
                {user.bio && (
                <h2>{user.bio}</h2>)}
            </section>
            <div className="settings">
                <button className="iconButton" onClick={() => setToggle(true)}><img src="../../public/settings.svg" alt="logout" /></button>
                <button className="iconButton" onClick={store.logout}><img src="../../public/logout.svg" alt="logout" /></button>
            </div>
        </section>
        <Modal isOpen={toggle} onClose={() => setToggle(false)} title = "Change info">
            <div className="fields">
                <form className="addCard" onSubmit={changeInfo}>
                    <label>Name</label>
                    <input onChange={(e) => setName(e.target.value)} type="text" placeholder={name} value={name} />
                    <label>Bio</label>
                    <input onChange={(e) => setBio(e.target.value)} type="text" placeholder={bio} value={bio} />
                    <label>Avatar</label>
                    <input onChange={(e) => setAvatarURL(e.target.value)} type="text" placeholder={avatarURL || "default"} />
                    <button type="submit" className="find">Change</button>
                </form>
            </div>
                            
        </Modal>
        </>
    );
}

export default Profile;