import { Link } from 'react-router-dom';
import Login from "../views/Login.tsx";

const GuestLayout: React.FC = () => {


    // Retrieve user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    const user = storedUserData ? JSON.parse(storedUserData) : null;

    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Dashboard</Link>
                    </li>
                </ul>
            </nav>
            <div>
                <Login user={user} />
            </div>
        </div>
    );
};

export default GuestLayout;
