import React from 'react';

const Header = ({ user }) => {
  return (
    <header className="header">
      <h1>Quiz App</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/add-questions" style={{ marginLeft: '1em' }}>Add Quiz</a>
      </nav>
      {user && <p style={{ marginTop: '1em' }}>Logged in as: {user.email}</p>}
    </header>
  );
};

export default Header;