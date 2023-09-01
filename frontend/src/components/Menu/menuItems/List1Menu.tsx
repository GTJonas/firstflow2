// List1Menu.js (or List1Menu.tsx)
import React from "react";
import MenuItem from "../MenuItem.tsx";

const List1Menu = () => {
  const list1 = [
    { label: "Dashboard", link: "/", icon: "icon-dashboard" },
    { label: "Mina classer", link: "/item1", icon: "icon-class" },
    { label: "Inställningar", link: "/settings", icon: "icon-settings" },
  ];

  return <MenuItem items={list1} />;
};

export default List1Menu;
