import React from 'react';
import UserSearch from '../services/userSearch'; // Import the UserSearch component
import ShowPoints from '../services/showPoints'; // Import the ShowPoints component
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

const ProfileOverlay = ({ isOpen, onClose, userInfo }) => {
  const navigate = useNavigate(); // Hook to navigate to different routes
  if (!isOpen) return null; // Don't render anything if the overlay is not open
  
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth); // Sign out the user
      // onClose()
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
    navigate('/login'); // Redirect to the main page
  };
  return (
    <div className="overlay">
      <div className="popup">
        <button className="close-button" onClick={onClose}>
          &times; {/* Close button */}
        </button>
        <h2>Profile Information</h2>
        <div className="profile-content">
          <p><strong>Email:</strong> {userInfo.email}</p>
          <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
        </div>
        <hr />
        <ShowPoints email={userInfo.email} />{' '}
        {/* Add the UserSearch component */}
        <UserSearch email={userInfo.email} />{' '}
        {/* Add the UserSearch component */}
      </div>
    </div>
  );
};

export default ProfileOverlay;
