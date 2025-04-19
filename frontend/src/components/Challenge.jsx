import { useState, useEffect } from "react";
import "../App.css";

const ChallengeForm = () => {
  const [title, setTitle] = useState("");
  const [challenge, setChallenge] = useState("");
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  
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
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!title.trim() || !challenge.trim()) return;

    const newChallenge = { title, challenge };

    try {
      let response;
      if (editingChallenge) {
        // If editing, send a PUT request
        response = await fetch(`${API_URL}/${editingChallenge._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newChallenge),
        });
      } else {
        // If not editing, send a POST request
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newChallenge),
        });
      }

      if (!response.ok) throw new Error("Failed to submit challenge");

      setTitle("");
      setChallenge("");
      setEditingChallenge(null); // Reset the editing state
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

  const handleEdit = (challenge) => {
    setTitle(challenge.title);
    setChallenge(challenge.challenge);
    setEditingChallenge(challenge); // Set the challenge to be edited
  };

  useEffect(() => {
    fetchUsers();
    fetchChallenges();
  }, [selectedUser]);

  return (
    <div className="challenge-form">
      <h2>{editingChallenge ? "Edit Challenge" : "Submit an AI Challenge"}</h2>

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
        <button type="submit">{editingChallenge ? "Save Changes" : "Submit Challenge"}</button>
      </form>

      <div className="filter-section">
        <label>Filter by User:</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">All Users</option>
          {users.map((userId) => (
            <option key={userId._id} value={userId._id}>
              {userId.name}
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

      {loading && <p>Loading challenges...</p>}

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
