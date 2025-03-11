import React from "react";
import "./App.css";

function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>Worst AI Prompts</h1>
        <p className="subheading">
          Explore, submit, and vote on the most bizarre AI prompts ever created!
        </p>
      </header>

      <section className="about">
        <h2>About This Project</h2>
        <p>
          The "Worst AI Prompts" project is a fun platform where users can submit the most ridiculous AI prompts,
          vote on their favorites, and see AI-generated responses to them.
        </p>
      </section>
 
      <section className="features">
        <h3>Project Features:</h3>
        <ul>
          <li>Submit your worst AI prompt</li>
          <li>Vote on submitted prompts</li>
          <li>Random bad prompt generator</li>
          <li>See hilarious AI-generated responses</li>
        </ul>
      </section>

      <section className="leaderboard">
        <h3>Leaderboard</h3>
        <p>Discover the worst AI prompts voted by the community.</p>
      </section>

      <footer className="footer">
        <p>Have fun and explore the limits of AI creativity!</p>
      </footer>
    </div>
  );
}

export default App;
