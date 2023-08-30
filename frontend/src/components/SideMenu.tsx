import React, { useEffect, useState } from "react";
import DesktopMenu from "./Menu/DesktopMenu.tsx";
import MobileMenu from "./Menu/MobileMenu.tsx";
import List4Menu from "./Menu/menuItems/List4Menu.tsx";
import List3Menu from "./Menu/menuItems/List3Menu.tsx";
import List2Menu from "./Menu/menuItems/List2Menu.tsx";
import List1Menu from "./Menu/menuItems/List1Menu.tsx";
import {useNavigate} from "react-router-dom";

function SideMenu({ user }) {
  const navigate = useNavigate();
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

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



  // Render the menu items based on the user's roleId]
 let menuItems;
  switch (user.user.roleId) {
    case 1:
      menuItems = <List1Menu />;
      break;
    case 2:
      menuItems = <List2Menu />;
      break;
    case 3:
      menuItems = <List3Menu />;
      break;
    case 4:
      menuItems = <List4Menu />;
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
