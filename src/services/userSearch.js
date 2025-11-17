import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../utils/firebase/firebaseDB';

const UserSearch = ({ email }) => {
  const [searchTerm, setSearchTerm] = useState(''); // Input value for the search
  const [users, setUsers] = useState([]); // List of all users (document names)
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered list based on search term
  const [friendRequestsSent, setFriendRequestsSent] = useState([]); // Track sent friend requests
  console.log('Current User Email:', email);
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

  // Handle sending a friend request
  const handleSendFriendRequest = async (recipientEmail) => {
    console.log('Current User Emai outsidel:', email);
    console.log('Sending friend request to:', recipientEmail);
    try {
      // Reference the 'friendRequests' subcollection under the recipient's document
      console.log('Recipient Email:', recipientEmail);
      const recipientDocRef = doc(db, 'users', recipientEmail);
      const friendRequestRef = collection(recipientDocRef, 'friendCollection');
      await setDoc(
        doc(friendRequestRef, 'requests'),
        {
          [email]: {
            response: false,
            responded: false,
            timestamp: new Date(),
          },
        },
        { merge: true }
      );

      // Update the UI to show that the request was sent
      setFriendRequestsSent((prev) => [...prev, recipientEmail]);
      console.log(`Friend request sent to ${recipientEmail}`);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

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
              {user !== email && ( // Don't show the button for the current user
                <button
                  onClick={() => handleSendFriendRequest(user)}
                  disabled={friendRequestsSent.includes(user)} // Disable button if already sent
                  style={{
                    marginLeft: '1em',
                    padding: '0.5em',
                    backgroundColor: friendRequestsSent.includes(user)
                      ? '#ccc'
                      : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: friendRequestsSent.includes(user)
                      ? 'not-allowed'
                      : 'pointer',
                  }}
                >
                  {friendRequestsSent.includes(user)
                    ? 'Request Sent'
                    : 'Add Friend'}
                </button>
              )}
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
