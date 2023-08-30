import fetchUsersSortedByRoles from "../../api/fetchUsersSortedByRoles.tsx";
import React, {useEffect, useState} from "react";

const SimilarComponent = () => {
    const [usersByRoles, setUsersByRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsersByRoles();
    }, []);

    const fetchUsersByRoles = async () => {
        try {
            const data = await fetchUsersSortedByRoles();
            setUsersByRoles(data.roleId);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setIsLoading(false);
        }
    };

    const usersWithRole4 = usersByRoles["4"] || [];

    const usersWithCombinedNames = usersWithRole4.map((user) => ({
        ...user,
        name: `${user.firstName} ${user.lastName}`
    }));
    // Check if there are 4 or fewer users
    const shouldAddClass = usersWithCombinedNames.length <= 4;


    return (
        <div className={`Profiles ${shouldAddClass ? "FewUsers" : ""}`}>
        {isLoading ? (
            <p>Loading...</p>
        ) : (
            usersWithCombinedNames.map((user) => (
                <div key={user.uuid} className="Profile">
                    <img src={user.profilePicture} alt={user.name}/>
                    <div>{user.name}</div>
                    {/* Render other user profile information here */}
                </div>
            ))
        )}
    </div>
    );
}


    export default SimilarComponent;