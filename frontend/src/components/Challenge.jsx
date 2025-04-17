import { useState, useEffect } from "react";
import "../App.css";

const ChallengeForm = () => {
  const [title, setTitle] = useState("");
  const [challenge, setChallenge] = useState("");
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editChallenge, setEditChallenge] = useState("");

  const API_URL = "http://localhost:3000/api/challenges";

  const fetchChallenges = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to load challenges");
      const data = await response.json();
      setChallenges(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!title.trim() || !challenge.trim()) return;

    const newChallenge = { title, challenge };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newChallenge),
      });

      if (!response.ok) throw new Error("Failed to submit challenge");

      setTitle("");
      setChallenge("");
      fetchChallenges();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete challenge");

      fetchChallenges();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (c) => {
    setEditId(c._id);
    setEditTitle(c.title);
    setEditChallenge(c.challenge);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editTitle, challenge: editChallenge }),
      });

      if (!response.ok) throw new Error("Failed to update challenge");

      setEditId(null);
      setEditTitle("");
      setEditChallenge("");
      fetchChallenges();
    } catch (err) {
      setError("Error updating challenge: " + err.message);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return (
    <div className="challenge-form">
      <h2>Submit an AI Challenge</h2>

      {error && <p className="error">⚠️ {error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Challenge Title"
          required
        />
        <textarea
          value={challenge}
          onChange={(e) => setChallenge(e.target.value)}
          placeholder="Describe the challenge..."
          required
        />
        <button type="submit">Submit Challenge</button>
      </form>

      <h3>Submitted Challenges</h3>
      {loading ? <p>Loading challenges...</p> : null}

      <ul>
        {challenges.map((c) => (
          <div key={c._id}>
            {editId === c._id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  value={editChallenge}
                  onChange={(e) => setEditChallenge(e.target.value)}
                />
                <button onClick={handleUpdate}>💾 Save</button>
                <button onClick={() => setEditId(null)}>❌ Cancel</button>
              </>
            ) : (
              <>
                <h3>{c.title}</h3>
                <p>{c.challenge}</p>
                <p>👤 {c.createdBy?.name || "Unknown"}</p>
                <button onClick={() => handleEditClick(c)}>✏️ Edit</button>
                <button onClick={() => handleDelete(c._id)}>❌ Delete</button>
              </>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default ChallengeForm;
