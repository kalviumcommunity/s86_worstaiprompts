import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Navbar.css"; // Import the CSS file for styling

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:3000/users/userlist", {
                    credentials: "include",
                });

                const data = await res.json();
                if (!res.ok) throw new Error("Unable to fetch users");

                const emailFromCookie = document.cookie
                    .split("; ")
                    .find(row => row.startsWith("email="))
                    ?.split("=")[1];

                const currentUser = data.find(u => u.email === decodeURIComponent(emailFromCookie));
                setUser(currentUser);
            } catch (err) {
                console.error("User fetch failed:", err);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        await fetch("http://localhost:3000/users/logout", {
            method: "POST",
            credentials: "include",
        });
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo">wAIp</Link>
            <div className="nav-items">
                <Link to="/dashboard" className="link">Dashboard</Link>
                <Link to="/challenge" className="link">Challenges</Link>
                {user && <span className="username">👤 {user.name}</span>}
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
