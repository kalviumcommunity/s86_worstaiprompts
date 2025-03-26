import { Link } from "react-router-dom";
import "../Homepage.css"; // Optional styling

const Homepage = () => {
    return (
        <div className="homepage-container">
            <h1 >🔥 Welcome to Worst AI Prompts! 🔥</h1>
            <p className="hlo">Where the most bizarre, confusing, and hilarious AI prompts come to life! 🤖💬</p>

            <div className="features">
                <h2>🚀 Features:</h2>
                <ul>
                    <li>Submit your **worst** AI prompts</li>
                    <li>Vote on the most ridiculous ones</li>
                    <li>See AI-generated responses to bad prompts</li>
                    <li>Try our **random bad prompt generator**</li>
                </ul>
            </div>

            <div className="auth-buttons">
                <Link to="/signup">
                    <button className="signup-btn">Sign Up</button>
                </Link>
                <Link to="/login">
                    <button className="login-btn">Login</button>
                </Link>
            </div>
        </div>
    );
};

export default Homepage;
