// List3Menu.js (or List3Menu.tsx)
import React from "react";
import MenuItem from "../MenuItem.tsx";

const List3Menu = () => {
    const list3 = [
        { label: "Dashboard", link: "/", icon: "icon-dashboard" },
        { label: "Mina Klasser", link: "/class", icon: "icon-class" },
        { label: "Inställningar", link: "/settings", icon: "icon-settings" },
        { label: "Praktikplatser", link: "/company-lists", icon:""},
    ];

    return <MenuItem items={list3} />;
};

export default List3Menu;
