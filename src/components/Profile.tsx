import React from "react";
import User from "../models/User";
import FirebaseApi from "../api/FirebaseApi";

function Profile({user}:{user: User}){
    return(
        <section className="profile">
            <button onClick={FirebaseApi.logout}><img src="../../public/logout.svg" alt="logout" /></button>
            <img src={user.info.photo} alt={user.info.username} />
            <section className="aboutMe">
                <h1>{user.info.username}</h1>
                {user.info.bio && (
                <h2>{user.info.bio}</h2>)}
            </section>
        </section>
    );
}

export default Profile;