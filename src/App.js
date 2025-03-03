import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './App.css';

function App() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  return (
    <div className="App">
      <Header />
      <Sidebar setSelectedQuiz={setSelectedQuiz} />
      <MainContent selectedQuiz={selectedQuiz} />
      <Footer />
    </div>
  );
}

export default App;
