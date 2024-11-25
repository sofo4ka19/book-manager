import React, {useState} from "react";
import User from "../models/User";
import FirebaseApi from "../api/FirebaseApi";
import Modal from "./Modal";

function Profile({user}:{user: User}){
    const[toggle, setToggle] = useState<boolean>(false);
    const [name, setName] = useState(user.info.username);
    const [bio, setBio] = useState(user.info.bio);
    const [avatarURL, setAvatarURL] = useState(user.info.photo);
    function changeInfo(){
        user.changeInfo(name,bio,avatarURL);
        FirebaseApi.updateUserInfo(user.uid, name, bio, avatarURL);
        setToggle(false);
    }
    return(
        <>
        <section className="profile">
            <button onClick={() => setToggle(true)}><img src="../../public/settings.svg" alt="logout" /></button>
            <button onClick={FirebaseApi.logout}><img src="../../public/logout.svg" alt="logout" /></button>
            <img src={user.info.photo} alt={user.info.username} />
            <section className="aboutMe">
                <h1>{user.info.username}</h1>
                {user.info.bio && (
                <h2>{user.info.bio}</h2>)}
            </section>
        </section>
        <Modal isOpen={toggle} onClose={() => setToggle(false)} title = "Change info">
            <div className="fields">
                <label>Name</label>
                <input onChange={(e) => setName(e.target.value)} type="text" />
                <label>Bio</label>
                <input onChange={(e) => setBio(e.target.value)} type="text" />
                <label>Avatar</label>
                <input onChange={(e) => setAvatarURL(e.target.value)} type="text" />
            </div>
                            
            <button type="submit" className="find">Change</button>
        </Modal>
        </>
    );
}

export default Profile;