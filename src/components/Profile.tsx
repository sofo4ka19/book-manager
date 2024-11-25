import React, {useState} from "react";
import User from "../models/User";
import FirebaseApi from "../api/FirebaseApi";

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
        {toggle && (
            <div className="modal">
                    <span className="close" onClick={() => {setToggle(false)}}>&times;</span>
                        <form className="addCard" onSubmit={changeInfo}>
                            <h2>Change info</h2>
                            <div className="fields">
                                <label>Name</label>
                                <input onChange={(e) => setName(e.target.value)} type="text" />
                                <label>Bio</label>
                                <input onChange={(e) => setBio(e.target.value)} type="text" />
                                <label>Avatar</label>
                                <input onChange={(e) => setAvatarURL(e.target.value)} type="text" />
                            </div>
                            
                            <button type="submit" className="find">Change</button>
                        </form>                    
            </div>
        )}
        </>
    );
}

export default Profile;