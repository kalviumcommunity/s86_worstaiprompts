import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function EntityFilter() {
    const [users, setUsers] = useState([]);
    const [entities, setEntities] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [loading, setLoading] = useState(false);

    // Set base URL once on mount
    useEffect(() => {
        axios.defaults.baseURL = 'http://localhost:3000'; // Adjust if needed
    }, []);

    // Fetch all users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/users');
            const data = response.data;

            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                console.error('Invalid response for users:', data);
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUserChange = async (e) => {
        const userId = e.target.value;
        setSelectedUser(userId);
        setEntities([]);

        if (!userId) return;

        try {
            setLoading(true);
            const response = await axios.get(`/api/user/${userId}`);
            const data = response.data;

            if (Array.isArray(data)) {
                setEntities(data);
            } else {
                console.error('Invalid response for entities:', data);
                setEntities([]);
            }
        } catch (error) {
            console.error('Error fetching entities:', error);
            setEntities([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                Filter Entities by User
            </h2>

            <div className="mb-6">
                <label htmlFor="userSelect" className="block text-sm font-medium text-gray-700 mb-2">
                    Choose a user:
                </label>
                <select
                    id="userSelect"
                    value={selectedUser}
                    onChange={handleUserChange}
                    className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select a user</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>

            {loading && (
                <div className="text-center py-6">
                    <div className="animate-spin h-10 w-10 border-t-4 border-b-4 border-blue-500 rounded-full mx-auto"></div>
                </div>
            )}

            {!loading && selectedUser && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                        Entities
                        <span className="ml-2 text-sm text-gray-500">
                            ({entities.length} found)
                        </span>
                    </h3>

                    {entities.length > 0 ? (
                        <ul className="space-y-3">
                            {entities.map((entity) => (
                                <li
                                    key={entity.id}
                                    className="p-4 bg-white border-l-4 border-blue-500 rounded shadow-sm"
                                >
                                    <h4 className="text-lg font-medium text-gray-800">
                                        {entity.title}
                                    </h4>
                                    <p className="text-gray-600">{entity.description}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-4">No entities found for this user.</p>
                    )}
                </div>
            )}

            {!loading && !selectedUser && users.length > 0 && (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    Please select a user to view their entities.
                </div>
            )}

            {!loading && users.length === 0 && (
                <div className="text-center py-8 text-red-500 bg-red-50 rounded-lg border border-red-200">
                    No users found. Please check your backend or database.
                </div>
            )}
        </div>
    );
}
