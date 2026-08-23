import React, { useState } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser, user }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook to navigate to different routes

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user); // Set the logged-in user
      navigate('/home'); // Redirect to the main page
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user); // Set the logged-in user
      navigate('/home'); // Redirect to the main page
    } catch (err) {
      setError(err.message);
    }
  };
  if (user) {
    navigate('/home'); // Redirect to the main page if user is already logged in
  } else {
    console.log(`User state in login: ${JSON.stringify(user)}`);
  }

  return (
    <div style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      {/* Center-align the content */}
      <h2>Login</h2>
      <p>Welcome to the Quiz App! Please log in to continue.</p>
      
      {/* Email/Password Login Form */}
      <form onSubmit={handleLogin} style={{ marginBottom: '2em' }}>
        <div style={{ marginBottom: '1em' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ marginBottom: '1em' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '1rem',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            marginBottom: '1em'
          }}
        >
          Sign In
        </button>
      </form>

      {/* Divider */}
      <div style={{ margin: '1.5em 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
        <span style={{ margin: '0 1em', color: '#666' }}>OR</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
      </div>

      {/* Google Sign In */}
      <div style={{ marginBottom: '1em' }}>
        {/* Container for the image and button */}
        <img
          src={`${process.env.PUBLIC_URL}/red_panda.jpg`}
          alt="Red Panda"
          style={{ width: '200px', height: 'auto', marginBottom: '0.5em' }}
        />
        <button
          onClick={handleGoogleSignIn}
          style={{
            display: 'block',
            margin: '0 auto',
            marginTop: '0.5em',
            padding: '12px 24px',
            fontSize: '1rem',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Sign in with Google
        </button>
      </div>
      
      {error && <p style={{ color: 'red', marginTop: '1em' }}>{error}</p>}
    </div>
  );
};

export default Login;
