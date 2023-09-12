import UserProfile from "./UserProfile";
import "../Style-modules/Menu-style-module.css";
import "../../assets/Icons/Icons.css";
import Logout from "../Logout.tsx";

const DesktopMenu = ({ user, menuItems }) => {

    return (
        <div className="Desktop">
            <UserProfile user={user} />
            <nav>
                <ul>{menuItems}</ul>
            </nav>
            <Logout />
        </div>
    );
};

export default DesktopMenu;