import React, { useState, useEffect, useRef } from 'react';
import ShowItems from '../services/showItems'; // Import the ShowItems component

const StudyRoom = ({ email }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Current user's position
  const [otherUsers, setOtherUsers] = useState([]); // Positions of other users
  const [isAdVisible, setIsAdVisible] = useState(true); // State to control ad visibility
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
          .filter(([email]) => email !== email) // Exclude the current user
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
  }, [email]);

  // Add AdSense initialization
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  const handleCloseAd = () => {
    setIsAdVisible(false); // Hide the ad when the close button is clicked
  };

  return (
    <div className="study-room">
      {/* AdSense Modal */}
      {isAdVisible && (
        <div className="adsense-modal">
          <div className="adsense-content">
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-2470775733308737" // Replace with your AdSense client ID
              data-ad-slot="8349185692" // Replace with your AdSense ad slot ID
              data-ad-format="auto"
            ></ins>
            <button onClick={handleCloseAd} className="close-ad-button">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Study Room Content */}
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

        {/* ShowItems Component */}
        <div className="show-items-container">
          <ShowItems email={email} />
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;
