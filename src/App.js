import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './App.css';

function App() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(200); // Initial width of 200px


  return (
    <div className="App">
      <Header />
      <Sidebar setSelectedQuiz={setSelectedQuiz} setSidebarWidth={setSidebarWidth} />
      <MainContent selectedQuiz={selectedQuiz} sidebarWidth={sidebarWidth} />
      <Footer />
    </div>
  );
}

export default App;
