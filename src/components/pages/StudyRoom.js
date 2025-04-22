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

  // Add AdSense initialization
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
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

      {/* AdSense Ad Unit */}
      <div className="adsense-container">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-2470775733308737"
          data-ad-slot="1234567890" // Replace with your AdSense ad slot ID
          data-ad-format="auto"
        ></ins>
      </div>
    </div>
  );
};

export default StudyRoom;