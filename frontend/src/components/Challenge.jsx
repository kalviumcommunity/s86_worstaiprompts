import { useState, useEffect } from "react";
import "../App.css";

const ChallengeForm = () => {
  const [title, setTitle] = useState("");
  const [challenge, setChallenge] = useState("");
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const [editingChallenge, setEditingChallenge] = useState(null); // Track the challenge being edited

  const API_URL = "http://localhost:3000/api/challenges";
  const USERS_API_URL = "http://localhost:3000/users/userlist";

  const fetchUsers = async () => {
    try {
      const res = await fetch(USERS_API_URL);
      if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.statusText}`);
      }
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err.message);
      setError("Error fetching users. Please try again later.");
    }
  };

  const fetchChallenges = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = selectedUser
        ? `http://localhost:3000/api/challenges/post/user/${selectedUser}`
        : API_URL;
      const response = await fetch(url);
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
    const token = localStorage.getItem('token');
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token || !editingChallenge) return;

    if (!title.trim() || !challenge.trim()) return;

    const updatedChallenge = { title, challenge };

    try {
      const response = await fetch(`${API_URL}/${editingChallenge._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedChallenge),
      });

      if (!response.ok) throw new Error("Failed to update challenge");

      setTitle("");
      setChallenge("");
      setEditingChallenge(null); // Reset editing state after update
      fetchChallenges();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete challenge");

      fetchChallenges();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (challenge) => {
    setEditingChallenge(challenge);
    setTitle(challenge.title);
    setChallenge(challenge.challenge);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchChallenges();
  }, [selectedUser]);

  return (
    <div className="challenge-form">
      <h2>{editingChallenge ? "Edit Challenge" : "Submit an AI Challenge"}</h2>

      {error && <p className="error">⚠️ {error}</p>}

      <form onSubmit={editingChallenge ? handleUpdate : handleSubmit}>
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
        <button type="submit">
          {editingChallenge ? "Save Changes" : "Submit Challenge"}
        </button>
      </form>

      <div className="filter-section">
        <label>Filter by User:</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">All Users</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>

        {selectedUser && (
          <button
            className="reset-btn"
            onClick={() => setSelectedUser("")}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              backgroundColor: "#eee",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            🔄 Reset Filter
          </button>
        )}
      </div>

      <h3>Submitted Challenges</h3>

      {loading ? <p>Loading challenges...</p> : null}

      <ul>
        {challenges.map((c) => (
          <div key={c._id}>
            <h3>{c.title}</h3>
            <p>{c.challenge}</p>
            <p>Created by: {c.createdBy?.name || "Unknown"}</p>

            <button className="delete-btn" onClick={() => handleDelete(c._id)}>
              ❌ Delete
            </button>

            <button className="edit-btn" onClick={() => handleEdit(c)}>
              ✏️ Edit
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default ChallengeForm;
