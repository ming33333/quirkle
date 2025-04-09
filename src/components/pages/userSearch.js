import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase/firebaseDB';

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState(''); // Input value for the search
  const [users, setUsers] = useState([]); // List of all users (document names)
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered list based on search term

  // Fetch all user document names from the 'users' collection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollection);
        const userNames = querySnapshot.docs.map((doc) => doc.id); // Get document names (user names)
        console.log('User Names:', userNames);
        setUsers(userNames);
        setFilteredUsers(userNames); // Initially, show all users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on the search term
  useEffect(() => {
    const results = users.filter((user) =>
      user.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  return (
    <div className="user-search">
      <h2>User Search</h2>
      <input
        type="text"
        placeholder="Search for a user..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
        className="search-input"
      />
      <ul className="user-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <li key={index} className="user-item">
              {user}
            </li>
          ))
        ) : (
          <li className="no-results">No users found</li>
        )}
      </ul>
    </div>
  );
};

export default UserSearch;