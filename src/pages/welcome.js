import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';

const Welcome = ({ user }) => {
  const config = useContext(GlobalContext);
  const [flashcards, setFlashcards] = useState([
    {
      question: 'What is React?',
      answer: 'A JavaScript library for building user interfaces.',
      flipped: false,
    },
    {
      question: 'What is a component?',
      answer: 'A reusable piece of UI in React.',
      flipped: false,
    },
    {
      question: 'What is JSX?',
      answer: 'A syntax extension for JavaScript that looks like HTML.',
      flipped: false,
    },
  ]);

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src =
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2470775733308737';
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="welcome-header">
          <h1>Welcome {user ? 'Back' : ''} to {config.name}!</h1>
          <p>
            {user
              ? `Hello, ${user.email}! We're thrilled to have you back. Keep pushing forward—your learning journey is worth it!`
              : 'Sign in to get started with personalized flashcards and quizzes!'}
          </p>
        </div>
        <div className="welcome-content">
          <a
            href={user ? '#/home' : '#/login'}
            style={{
              textDecoration: 'none',
              color: 'white',
              backgroundColor: 'salmon',
              padding: '10px 20px',
              borderRadius: '5px',
              fontSize: '1.2em',
            }}
          >
            {user ? 'Go to Dashboard' : 'Login to Get Started'}
          </a>
          <p>
            {user
              ? 'Here’s why learning is important and how we can help:'
              : 'Discover how this site can help you achieve your learning goals:'}
          </p>
          <ul>
            <li>📚 Master concepts with interactive flashcards.</li>
            <li>⏳ Use spaced learning to retain knowledge effectively.</li>
            <li>🎯 Track your progress and stay motivated.</li>
            <li>💡 Learn at your own pace with personalized study tools.</li>
          </ul>
          <p>
            {user
              ? 'Remember, consistency is key. Let’s make today count!'
              : 'Sign up today and take the first step toward mastering your studies!'}
          </p>
          <p>
            Learning is a lifelong journey, and every step you take brings you closer to your goals. 
            It empowers you to grow, adapt, and succeed in an ever-changing world. By dedicating time 
            to study and expand your knowledge, you are investing in your future and unlocking your 
            full potential. Let us help you make the most of your learning experience!
          </p>
        </div>
      </div>
      <div className="flashcards-container">
        {flashcards.map((card, index) => (
          <div
            key={index}
            className={`flashcard ${card.flipped ? 'flipped' : ''}`}
            onClick={() =>
              setFlashcards((prev) =>
                prev.map((c, i) => (i === index ? { ...c, flipped: !c.flipped } : c))
              )
            }
          >
            <div className="flashcard-front">
              <p>{card.question}</p>
            </div>
            <div className="flashcard-back">
              <p>{card.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Welcome;
