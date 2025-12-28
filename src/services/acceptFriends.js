import React, { useState, useEffect } from 'react';
import {getDocument,setDocument } from '../utils/firebase/firebaseServices';

const AcceptFriends = ({ currentUserEmail }) => {
  const [friends, setFriends] = useState([]); // Store current friends
  const [friendRequests, setFriendRequests] = useState([]); // Store friend requests
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors
  console.log(`currentuser ${currentUserEmail}`);

  // Fetch current friends and friend requests from Firestore
  useEffect(() => {
    const fetchFriendsAndRequests = async () => {
      try {
        const friendsDoc = await getDocument(`users/${currentUserEmail}/friendCollection/friends`);

        if (friendsDoc) {
          const friendsData = friendsDoc;
          const friendKeys = Object.keys(friendsData); // Get all keys (friend emails)
          setFriends(friendKeys);
        } else {
          console.log('No friends found.');
          setFriends([]);
        }

        const requestDoc = await getDocument(`users/${currentUserEmail}/friendCollection/requests`);

        if (requestDoc) {
          const requests = Object.keys(requestDoc || {}); // Get the 'requests' array
          setFriendRequests(requests);
        } else {
          console.log('No friend requests found.');
          setFriendRequests([]);
        }
      } catch (err) {
        console.error('Error fetching friends or friend requests:', err);
        setError('Failed to load friends or friend requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchFriendsAndRequests();
  }, [currentUserEmail]);
  // Handle accepting a friend request
  const handleAccept = async (friendEmail) => {
    console.log('friend email', friendEmail);
    try {
      // Updated the accepted friend from the requests list of user
      const updatedRequests = {
        [friendEmail]: {
          response: true,
          responded: true,
          timestamp: new Date(),
        },
      };
      // Updated the accepted friend from the requests list of sender
      const senderUpdatedRequests = {
        [currentUserEmail]: {
          response: true,
          responded: true,
          timestamp: new Date(),
        },
      };
      setFriendRequests(updatedRequests);
      await setDocument(
        `users/${currentUserEmail}/friendCollection/requests`,
        updatedRequests, 
        { merge: true });

      // Add the friend to the user's friend list

      await setDocument(
        `users/${currentUserEmail}/friendCollection/friends`,
        { [friendEmail]: 'email' },
        { merge: true }
      );
      // Update the Firestore document sender request
      await setDocument(
        `users/${friendEmail}/friendCollection/requests`, 
        senderUpdatedRequests, 
        { merge: true });

      // Add the friend to the user's friend list
      await setDocument(
        `users/${friendEmail}/friendCollection/friends`,
        { [currentUserEmail]: 'email' },
        { merge: true }
      );

    } catch (err) {
      console.error('Error accepting friend request:', err);
      setError('Failed to accept friend request.');
    }
  };

  if (loading) {
    return <div>Loading friend requests...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="accept-friends">
      <h2>Current Friends</h2>
      {friends.length > 0 ? (
        <ul>
          {friends.map((friendEmail, index) => (
            <li key={index} style={{ marginBottom: '1em' }}>
              {friendEmail}
            </li>
          ))}
        </ul>
      ) : (
        <p>No friends found.</p>
      )}
      <h2>Friend Requests</h2>
      {friendRequests.length > 0 ? (
        <ul>
          {friendRequests.map((friendEmail, index) => (
            <li key={index} style={{ marginBottom: '1em' }}>
              {friendEmail}
              <button
                onClick={() => handleAccept(friendEmail)}
                style={{
                  marginLeft: '1em',
                  padding: '0.5em',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Accept
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No friend requests found.</p>
      )}
    </div>
  );
};

export default AcceptFriends;
