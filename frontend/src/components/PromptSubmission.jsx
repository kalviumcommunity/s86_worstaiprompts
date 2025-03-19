// components/PromptSubmission.jsx
import React, { useState } from 'react';

function PromptSubmission({ onSubmit }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt('');
    }
  };

  return (
    <section className="prompt-submission">
      <h2>Submit Your Worst Prompt</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your terrible AI prompt here..."
          rows="4"
        />
        <button type="submit" className='submit'>Submit Prompt</button>
      </form>
    </section>
  );
}

export default PromptSubmission;