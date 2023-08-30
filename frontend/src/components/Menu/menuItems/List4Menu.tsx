// List4Menu.js (or List4Menu.tsx)
import React from "react";
import MenuItem from "../MenuItem.tsx";

const List4Menu = () => {
    const list4 = [
        { label: "Dashboard", link: "/", icon: "icon-dashboard" },
        { label: "Historik", link: "/own-posts", icon: "icon-history" },
        { label: "Inställningar", link: "/settings", icon: "icon-settings" },
    ];


    return <MenuItem items={list4} />;
};

export default List4Menu;
