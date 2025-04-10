import React from 'react';
import UserSearch from '../pages/userSearch'; // Import the UserSearch component

const ProfileOverlay = ({ isOpen, onClose, userInfo }) => {
  if (!isOpen) return null; // Don't render anything if the overlay is not open

  return (
    <div className="overlay">
      <div className="popup">
        <button className="close-button" onClick={onClose}>
          &times; {/* Close button */}
        </button>
        <h2>Profile Information</h2>
        <div className="profile-content">
          <p><strong>Email:</strong> {userInfo.email}</p>
        </div>
        <hr />
        <h3>Search for Users</h3>
        <UserSearch /> {/* Add the UserSearch component */}
      </div>
    </div>
  );
};

export default ProfileOverlay;