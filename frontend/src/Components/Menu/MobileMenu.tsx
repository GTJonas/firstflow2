// MobileMenu.js (or MobileMenu.tsx)
import React from "react";
import "../Style-modules/Menu-style-module.css"
import "../../assets/Icons/Icons.css"
import MobUserProfile from "./MobUserProfile.tsx";

const MobileMenu = () => {
    return (
        <div className="Mobile">
            <MobUserProfile />
        </div>
    );
};

export default MobileMenu;
