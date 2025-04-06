import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const Header = ({ user }) => {
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth); // Sign out the user
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title" style={{ fontSize: '200%' }}>Quirkle</h1>
        {user && (
          <div className="header-user">
            <p>Logged in as: {user.email}</p>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        )}
      </div>
      <nav>
        <a href="/" className="home-icon">
          <FontAwesomeIcon icon={faHome} size="lg" /> 
        </a>
      </nav>
    </header>
  );
};

export default Header;