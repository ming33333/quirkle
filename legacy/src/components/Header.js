import React, { useState, useContext } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import ProfileOverlay from './profileOverlay';
import { GlobalContext } from '../context/GlobalContext';

const Header = ({ user }) => {
  const config = useContext(GlobalContext)
  const [isOverlayOpen, setIsOverlayOpen] = useState(false); // State to control the overlay visibility
  const navigate = useNavigate(); // Hook to navigate to different routes

  return (
    <header className="header">
      <div className="header-content">
        <nav>
          
          <h1
            onClick={() => navigate('/')} // Navigate to '/' when clicked
            className="header-title"
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faStar} style={{ width: '1.5rem', height: '1.5rem', color: '#FFFFFF' }} />
            {config.name}
          </h1>
        </nav>
        <nav>
          <a href="/#/home" className="home-icon">
            <FontAwesomeIcon icon={faHome} size="lg" />
          </a>
        </nav>
        {user && (
          <div className="header-user">
            <p
              className="logged-in-as"
              onClick={() => setIsOverlayOpen(true)} // Open the overlay when clicked
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              Logged in as: {user.email}
            </p>

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
    </header>
  );
};

export default Header;
