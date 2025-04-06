import React, { useState, useEffect } from 'react';
import './StudyRoom.css'; // Ensure this file exists and contains the necessary styles

const StudyRoom = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Initial position of the character

  const handleKeyDown = (event) => {
    setPosition((prevPosition) => {
      const newPosition = { ...prevPosition };
      const step = 10; // Distance the character moves with each key press

      switch (event.key) {
        case 'ArrowUp':
          newPosition.y = Math.max(prevPosition.y - step, 0); // Prevent moving out of bounds
          break;
        case 'ArrowDown':
          newPosition.y = Math.min(prevPosition.y + step, 90); // Prevent moving out of bounds
          break;
        case 'ArrowLeft':
          newPosition.x = Math.max(prevPosition.x - step, 0); // Prevent moving out of bounds
          break;
        case 'ArrowRight':
          newPosition.x = Math.min(prevPosition.x + step, 90); // Prevent moving out of bounds
          break;
        default:
          break;
      }

      return newPosition;
    });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="room">
      <div
        className="character"
        style={{
          top: `${position.y}%`,
          left: `${position.x}%`,
        }}
      ></div>
    </div>
  );
};

export default StudyRoom;