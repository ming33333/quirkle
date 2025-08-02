import React from 'react';
import ReactDOM from 'react-dom/client'; // Use ReactDOM from 'react-dom/client' for React 18
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Dynamically add the AdSense script
const addAdSenseScript = () => {
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2470775733308737';
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
};

// Call the function to add the AdSense script
// addAdSenseScript();

// Create the root and render the app
const root = ReactDOM.createRoot(document.getElementById('root')); // Use createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();