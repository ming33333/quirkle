import React, { useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import  ProfileOverlay  from './utils/profileOverlay'; // Import the ProfileOverlay component


const Header = ({ user }) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false); // State to control the overlay visibility
  const navigate = useNavigate(); // Hook to navigate to different routes
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth); // Sign out the user
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
    navigate('/login'); // Redirect to the main page
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Quirkle</h1>
        {user && (
          <div className="header-user">
            <p
              className="logged-in-as"
              onClick={() => setIsOverlayOpen(true)} // Open the overlay when clicked
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              Logged in as: {user.email}
            </p>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        )}
      </div>
      {/* Profile Overlay */}
      <ProfileOverlay
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)} // Close the overlay when the close button is clicked
        userInfo={{
          email: user?.email || 'No Email',
        }}
      />
      <nav>
        <a href="/#/home" className="home-icon">
          <FontAwesomeIcon icon={faHome} size="lg" /> 
        </a>
      </nav>
    </header>
  );
};

export default Header;