// components/RandomPrompt.jsx
import React, { useState } from 'react';
import '../index.css';

function RandomPrompt() {
  const badPrompts = [
    "Write a poem about cheese in the style of a confused toaster",
    "Explain quantum physics to a potato",
    "Describe love as if you’re a malfunctioning robot",
    "Make a recipe for invisible soup",
    "Sing happy birthday in binary",
    "Write a breakup letter from a spoon to a fork",
    " Describe a dance battle between a penguin and a pineapple.",
    "Give me pickup lines that only work on garden gnomes.",
    "Create a national anthem for a country founded by ducks."
    ];

  const [currentPrompt, setCurrentPrompt] = useState('');

  const generatePrompt = () => {
    const randomIndex = Math.floor(Math.random() * badPrompts.length);
    setCurrentPrompt(badPrompts[randomIndex]);
  };

  return (
    <section className="random-prompt">
      <h2>Random Bad Prompt Generator</h2>
      <button onClick={generatePrompt} className='generate'>Generate Prompt</button>
      {currentPrompt && (
        <div className="generated-prompt">
          <p>{currentPrompt}</p>
        </div>
      )}
    </section>
  );
}

export default RandomPrompt;