import { useLocation } from "react-router-dom";

import ContentWrapper from "../components/contentWrapper.tsx";
import RightSidebar from "../components/RightSidebar.tsx";
import "../components/Style-modules/Dashboard-style-module.css";
import "../components/Style-modules/RightSidebar-module.css";

function Dashboard({ user }) {
  const location = useLocation();

  let content;
  let right;

  switch (location.pathname) {
    default:
      content = (
        <>
          <ContentWrapper user={user} />
          <RightSidebar user={user} />
        </>
      );

      break;
    case "/test":
      console.log("user information: " + JSON.stringify(user));
      content = (
        <>
          <ContentWrapper />
          <RightSidebar user={user} />
        </>
      );
      break;
  }

  return (
    <>
      {content}
      {right}
    </>
  );
}

export default Dashboard;
