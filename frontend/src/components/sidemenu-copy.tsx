import React, { useEffect, useState } from "react";
import DesktopMenu from "./Menu/DesktopMenu.tsx";
import MobileMenu from "./Menu/MobileMenu.tsx";
import List1Menu from "./Menu/menuItems/List1Menu.tsx";
import List3Menu from "./Menu/menuItems/List3Menu.tsx";
import List4Menu from "./Menu/menuItems/List4Menu.tsx";
import List2Menu from "./Menu/menuItems/List2Menu.tsx";
import getUserData from "../functions/getUserData.tsx";
import { useNavigate } from "react-router-dom";


const SideMenu = () => {
    const [user, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [isMobileViewport, setIsMobileViewport] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUserData();
                setUserData(userData);
                setIsLoading(false);
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
                navigate('/login');
            }
        };

        fetchData();
    }, []);

    // Handle window resize event
    useEffect(() => {
        const handleResize = () => {
            setIsMobileViewport(window.innerWidth <= 640);
        };

        // Initial check
        handleResize();

        // Add event listener for window resize
        window.addEventListener("resize", handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);



    // lowdetail load
    if (isLoading) {
        console.log("Just loading");
        return (
            <div className="Menu">
                <div className="Desktop">
                    <div className="profileContainer">
                        <div className="ProfileImage">
                            <img src="" alt=""/>
                        </div>
                        <span className="smallText">Välkommen tillbaka</span>
                        <span>
              <b>Loading...</b>
            </span>
                    </div>
                    <nav>
                        <ul>
                        </ul>
                    </nav>
                    <div className="LogoutDiv">
                        <a href="" className="Logout">
                            <i className="icon-logout"></i>Logga ut
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <p>{error}</p>;
    }
    console.log("Loading complete?");
    const MobileViewport = window.innerWidth <= 640;

    // Render the menu items based on the user's roleId
    let menuItems;
    switch (user.roleId) {
        case 1:
            menuItems = <List1Menu/>;
            break;
        case 2:
            menuItems = <List2Menu/>;
            break;
        case 3:
            menuItems = <List3Menu/>;
            break;
        case 4:
            menuItems = <List4Menu/>;
            break;
        default:
            menuItems = <p>Error</p>;
            break;
    }

    return (
        <>
            {isMobileViewport ? <MobileMenu /> : <DesktopMenu user={user} menuItems={menuItems} />}
        </>
    );
}

export default SideMenu;
