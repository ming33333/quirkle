import React, { useState, useEffect, useRef } from 'react';
import './StudyRoom.css';

const StudyRoom = ({ currentUserEmail }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Current user's position
  const [otherUsers, setOtherUsers] = useState([]); // Positions of other users
  const ws = useRef(null); // WebSocket reference

  // Call the backend to ensure the WebSocket server is running
  useEffect(() => {
    const startWebSocketServer = async () => {
      try {
        const response = await fetch('http://localhost:8080/studyroom');
        console.log(await response.text());
      } catch (error) {
        console.error('Error starting WebSocket server:', error);
      }
    };

    startWebSocketServer();

    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onopen = () => {
      console.log('Connected to WebSocket server.');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'positions') {
        const updatedUsers = Object.entries(data.users)
          .filter(([email]) => email !== currentUserEmail) // Exclude the current user
          .map(([email, position]) => ({ email, position }));
        setOtherUsers(updatedUsers);
      }
    };

    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket server.');
    };

    return () => {
      ws.current.close();
    };
  }, [currentUserEmail]);

  // Handle key presses to move the character
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

      // Send the updated position to the WebSocket server
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            type: 'updatePosition',
            email: currentUserEmail,
            position: newPosition,
          })
        );
      }

      return newPosition;
    });
  };

  // Add event listener for key presses
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="room">
      {/* Current user's character */}
      <div
        className="character"
        style={{
          top: `${position.y}%`,
          left: `${position.x}%`,
        }}
      ></div>

      {/* Other users' characters */}
      {otherUsers.map((user, index) => (
        <div
          key={index}
          className="character other-user"
          style={{
            top: `${user.position.y}%`,
            left: `${user.position.x}%`,
          }}
        >
          {user.email}
        </div>
      ))}
    </div>
  );
};

export default StudyRoom;