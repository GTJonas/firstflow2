import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react'; // Import useState
import SideMenu from '../components/SideMenu.tsx';
import ContentWrapper from '../components/contentWrapper.tsx';
import RightSidebar from "../components/RightSidebar.tsx";
import '../components/Style-modules/Dashboard-style-module.css';
import getUserData from "../functions/getUserData.tsx";

function Dashboard() {
    const location = useLocation();
    const [User, setUser] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedUserData = await getUserData();
                setUser(fetchedUserData);
                console.log("User Data:", fetchedUserData);
            } catch (error) {
                console.error("Error:", error.message);
            }
        };
        fetchData();
    }, []);
    console.log({User})

    // Basic Dashboard routing controls (also might be unnecessary)
    let menu;
    let content;
    let right;

    switch (location.pathname) {
        case "/company":
            right = <></>;
            break;
        default:
            menu = null;
            content = null;
            right = null;
            break;
    }

    return (
        <div className="main">
            {menu}
            {content}
            {right}
        </div>
    );
};

export default Dashboard;
