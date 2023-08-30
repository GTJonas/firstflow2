import React from "react";

const UserProfile = ({ user }) => {
    const name = user.first_name + " " + user.last_name;
    const welcomeMessage = "Välkommen tillbaka";

    return (
        <div className="profileContainer">
            {user.profilePicture && (
                <div className="ProfileImage">
                    <img src={user.profilePicture}  />
                </div>
            )}
            <span className="smallText">{welcomeMessage}</span>
            <span>
        <b>{name}</b>
      </span>
        </div>
    );
};

export default UserProfile;