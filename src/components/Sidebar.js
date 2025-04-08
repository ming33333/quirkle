import React, { useState, useEffect } from 'react';

const Sidebar = ({ setSelectedQuiz, setSidebarWidth }) => {
  const [width, setWidth] = useState(200); // Initial width of 200px
  const [isResizing, setIsResizing] = useState(false);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await require('../constants/data.json'); //TODO switch to use firebase
        setQuizzes(response.quizzes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        const newWidth = e.clientX;
        setWidth(newWidth);
        setSidebarWidth(newWidth); // Update the sidebar width in the parent component
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setSidebarWidth]);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  return (
    <div
      className="sidebar"
      style={{ width: `${width}px` }}
    >
      <div className="resizer" onMouseDown={handleMouseDown}></div>
      <nav>
        <h2>All of your quizzes</h2>
        <ul>
          {quizzes.map((quiz, index) => (
            <li key={index}>
              <a href={`quiz-${index}`} onClick={() => setSelectedQuiz(quiz)}>
                {quiz.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;