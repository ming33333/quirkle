import React from 'react';
import { getAuth, signOut } from 'firebase/auth';

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
      <h1>Quiz App</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/add-questions" style={{ marginLeft: '1em' }}>Add Quiz</a>
      </nav>
      {user && (
        <div style={{ marginTop: '1em' }}>
          <p>Logged in as: {user.email}</p>
          <button onClick={handleLogout} style={{ marginLeft: '1em' }}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;