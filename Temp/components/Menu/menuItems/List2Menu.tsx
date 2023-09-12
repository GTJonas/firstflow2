import React, { useState } from "react";
import MenuItem from "../MenuItem.tsx";
import getAuthHeaders from "../../../api/getAuthHeaders.tsx";
import axios from "axios";

const List2Menu = () => {
  const [companyUuid, setCompanyUuid] = useState(null);

  const handleRedirect = async () => {
    try {
      const response = await axios.get(
        "http://194.71.0.30:8000/api/company/own-profile",
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.status === 200) {
        setCompanyUuid(response.data.company_uuid); // Set the companyUuid state
      } else {
        console.error("Failed to fetch company UUID:", response.data.error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // Call handleRedirect when the component mounts
  React.useEffect(() => {
    handleRedirect();
  }, []);

  const list2 = [
    { label: "Dashboard", link: "/", icon: "icon-dashboard" },
    { label: "Elevernas inlägg", link: "/history", icon: "icon-history" },
    { label: "Inställningar", link: "/settings", icon: "icon-settings" },
  ];

  if (companyUuid !== null) {
    list2.push({
      label: "Företagsprofilen",
      link: `/company/${companyUuid}`,
      icon: "icon-settings",
    });
  } else {
    list2.push({
      label: "Skapa företagsprofilen",
      link: `/company/${companyUuid}`,
      icon: "icon-settings",
    });
  }

  return <MenuItem items={list2} />;
};

export default List2Menu;
