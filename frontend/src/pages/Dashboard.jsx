import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import PromptSubmission from '../components/PromptSubmission';
import RandomPrompt from '../components/RandomPrompt';
import '../App.css';

const Dashboard = () => {
  const [prompts, setPrompts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const navigate = useNavigate(); // React Router navigation function

  const addPrompt = (newPrompt) => {
    setPrompts([...prompts, { 
      id: Date.now(), 
      text: newPrompt,
      aiResponse: ''
    }]);
  };

  const deletePrompt = (id) => {
    setPrompts(prompts.filter(prompt => prompt.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    setPrompts(prompts.map(prompt => 
      prompt.id === id ? { ...prompt, text: editText } : prompt
    ));
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="dashboard">
      <header>
        <h1>📌 AI Prompt Dashboard</h1>
        <p>Submit and explore the most bizarre AI prompts!</p>
      </header>

      <main>
        <button className="challenge-button" onClick={() => navigate('/Challenge')}>
          🚀 Go to Challenges
        </button>
        
        <PromptSubmission onSubmit={addPrompt} />
        <RandomPrompt />
        
        

        <section className="prompts-list">
          <h2>📝 Recent Submissions</h2>
          {prompts.length === 0 ? (
            <p>No prompts submitted yet!</p>
          ) : (
            prompts.map(prompt => (
              <div key={prompt.id} className="prompt-item">
                <div className="prompt-content">
                  {editingId === prompt.id ? (
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="edit-textarea"
                    />
                  ) : (
                    <>
                      <p className="prompt-text">{prompt.text}</p>
                      {prompt.aiResponse && (
                        <p className="ai-response">🤖 AI Response: {prompt.aiResponse}</p>
                      )}
                    </>
                  )}
                </div>
                <div className="prompt-actions">
                  {editingId === prompt.id ? (
                    <button 
                      onClick={() => saveEdit(prompt.id)}
                      className="save-button"
                    >
                      ✅ Save
                    </button>
                  ) : (
                    <button 
                      onClick={() => startEditing(prompt.id, prompt.text)}
                      className="edit-button"
                    >
                      ✏️ Edit
                    </button>
                  )}
                  <button 
                    onClick={() => deletePrompt(prompt.id)}
                    className="delete-button"
                  >
                    ❌ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      <footer>
        <p className='hi'>© 2025 Worst AI Prompts</p>
      </footer>
    </div>
  );
}

export default Dashboard;
