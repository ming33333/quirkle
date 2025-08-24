import React, { useEffect, useState } from 'react';

const Welcome = () => {
  const [flashcards, setFlashcards] = useState([
    { question: 'What is React?', answer: 'A JavaScript library for building user interfaces.', flipped: false },
    { question: 'What is a component?', answer: 'A reusable piece of UI in React.', flipped: false },
    { question: 'What is JSX?', answer: 'A syntax extension for JavaScript that looks like HTML.', flipped: false },
  ]);
  useEffect(() => {
    // Dynamically load the AdSense script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2470775733308737';
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);
    
    // Initialize AdSense
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);
  const handleFlip = (index) => {
    setFlashcards((prevFlashcards) =>
      prevFlashcards.map((card, i) =>
        i === index ? { ...card, flipped: !card.flipped } : card
      )
    );
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
    {/* Main Content */}
    <div style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '2em' }}>
    <h1 style={{ fontSize: '2.5em', fontWeight: 'bold', marginBottom: '0.5em' }}>
    Welcome to Quirkle!
    </h1>
    <p style={{ fontSize: '1.2em', lineHeight: '1.8', marginBottom: '1em' }}>
    Quirkle is a free platform designed to help students master their studies using flashcards and quizzes. 
    Thousands of students have found success by creating personalized flashcards to improve their memory and 
    understanding of complex topics. Whether you're preparing for exams or learning new skills, Quirkle is here 
    to support your journey.
    </p>
    <p style={{ fontSize: '1.2em', lineHeight: '1.8', marginBottom: '1em' }}>
    This site is completely free and proudly built by a solo developer. By using Quirkle, you're not only 
    improving your studies but also supporting independent development. Thank you for being part of this 
    community!
    </p>
    <a href="#/login" style={{ textDecoration: 'none', color: 'white', backgroundColor: 'salmon', padding: '10px 20px', borderRadius: '5px', fontSize: '1.2em' }}>
    Login to Get Started
    </a>
    </div>
    
      {/* Flashcard Animation */}
      <div className="flashcard-container">
        {flashcards.map((card, index) => (
          <div
            key={index}
            className={`flashcard ${card.flipped ? 'flipped' : ''}`}
            onClick={() => handleFlip(index)}
            style={{ animationDelay: `${Math.random() * 0.5}s` }} // Random animation delay between 0 and 0.5 seconds
          >
            <div className="flashcard-front">{card.question}</div>
            <div className="flashcard-back">{card.answer}</div>
          </div>
        ))}
      </div>
      {/* AdSense Ad Block */}
    <div style={{ position: 'fixed', bottom: '0', width: '100%', textAlign: 'center', backgroundColor: '#f9f9f9', boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100px', margin: '0 auto' }} // Fixed height set to 50px
        data-ad-client="ca-pub-2470775733308737"
        data-ad-slot="8349185692"
        data-full-width-responsive="true"
      ></ins>
    </div>
    </div>
  );
};

export default Welcome;