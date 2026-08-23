import React, { useState, useEffect } from 'react';
import {getDocument,setDocument } from '../utils/firebase/firebaseServices';

const ShowPoints = ({ email }) => {
  const [points, setPoints] = useState(null); // State to store the user's points
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const pointsDoc = await getDocument(`users/${email}/pointSystem/points`);

        if (pointsDoc) {
          setPoints(pointsDoc.value || 0); // Retrieve the points value
        } else {
          await setDocument(`users/${email}/pointSystem/points`, { value: 0 }); // Create the document and set its value to 0
          setPoints(0); // Default to 0 if the document doesn't exist
        }
      } catch (err) {
        console.error('Error fetching points:', err);
        setError('Failed to fetch points.');
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, [email]);

  if (loading) {
    return <div>Loading points...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="show-points">
      <h2>Your Points</h2>
      <p>{points} points</p>
    </div>
  );
};

export default ShowPoints;
