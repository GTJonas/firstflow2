const UserProfile = ({ user }) => {
  const name = user.user.first_name + " " + user.user.last_name;
  const welcomeMessage = "Välkommen tillbaka";

  return (
    <div className="profileContainer">
      {user.user.profilePicture && (
        <div className="ProfileImage">
          <img src={user.user.profilePicture} loading="lazy" alt="Profile" />
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
