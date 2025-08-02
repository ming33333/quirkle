import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook to navigate to different routes

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user); // Set the logged-in user
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

  return (
    <div style={{ textAlign: 'center' }}> {/* Center-align the content */}
      <h2>Login</h2>
      <p>Welcome to the Quiz App! Please log in to continue.</p>
      <div style={{ marginBottom: '1em' }}> {/* Container for the image and button */}
        <img 
          src={`${process.env.PUBLIC_URL}/red_panda.jpg`} 
          alt="Red Panda" 
          style={{ width: '200px', height: 'auto', marginBottom: '0.5em' }} 
        />
        <button 
          onClick={handleGoogleSignIn} 
          style={{ display: 'block', margin: '0 auto', marginTop: '0.5em' }}
        >
          Sign in with Google
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;