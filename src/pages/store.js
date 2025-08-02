import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../utils/firebase/firebaseDB'; // Adjust the path if needed

const Store = ({ email }) => {
  const [points, setPoints] = useState(0); // User's current points
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(true); // Loading state
  const [purchasedItems, setPurchasedItems] = useState([]); // Track purchased items

  const items = [
    { name: 'Panda', image: '/quirkle/red_panda.jpg' },
    { name: 'Frog', image: '/quirkle/frog.jpg' },
    { name: 'Whale', image: '/quirkle/whale.jpg' },
  ];

  // Fetch user's points from Firestore
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        console.log('Fetching points for user:', email);
        const pointsDocRef = doc(db, 'users', email, 'pointSystem', 'points');
        console.log('Fetching points from:', pointsDocRef.path);
        const pointsDoc = await getDoc(pointsDocRef);

        if (pointsDoc.exists()) {
          setPoints(pointsDoc.data().value || 0);
        } else {
          console.log('Points document does not exist. Setting points to 0.');
          setPoints(0);
        }
        // Fetch purchased items
        const itemsDocRef = doc(db, 'users', email, 'pointSystem', 'items');
        const itemsDoc = await getDoc(itemsDocRef);

        if (itemsDoc.exists()) {
          setPurchasedItems(itemsDoc.data().list || []);
        } else {
          console.log('Items document does not exist. Setting purchased items to an empty list.');
          setPurchasedItems([]);
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

  // Handle purchasing an item
  const handlePurchase = async (itemName,itemPath) => {
    if (points < 1) {
      alert('Not enough points to purchase this item.');
      return;
    }
    const itemsDocRef = doc(db, 'users', email, 'pointSystem', 'items');
    // Fetch the updated items list from Firestore
    const updatedItemsDoc = await getDoc(itemsDocRef);
    if (purchasedItems.includes(itemName)) {
      alert(`You already own the ${itemName}.`);
      return;
    }

    try {
      const pointsDocRef = doc(db, 'users', email, 'pointSystem', 'points');
      await updateDoc(pointsDocRef, { value: points - 1 }); // Deduct 1 point
      setPoints(points - 1); // Update local state
      // Add the purchased item to the 'items' list in Firestore

      const itemsDoc = await getDoc(itemsDocRef);
 
      if (itemsDoc.exists()) {
       const currentItems = itemsDoc.data().list || [];
       await updateDoc(itemsDocRef, { list: [...currentItems, itemPath] });
       console.log( `update items doc ${updatedItemsDoc.data().list}`)

      } else {
       await setDoc(itemsDocRef, { list: [itemPath] }); // Initialize the list with the purchased item
     }
     setPurchasedItems(updatedItemsDoc.data().list || []); // Update local state with the latest items
     console.log('Purchased items:', purchasedItems);

      alert(`You have successfully purchased the ${itemName}!`);
    } catch (err) {
      console.error('Error updating points:', err);
      setError('Failed to complete the purchase.');
    }
  };

  if (loading) {
    return <div>Loading store...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="store">
      <h2>Welcome to the Store</h2>
      <p>You have {points} points.</p>
      <div className="store-items">
        {items.map((item) => (
          <div key={item.name} className="store-item">
            <img src={item.image} alt={item.name} className="store-item-image" />
            <h3>{item.name}</h3>
            <button
              onClick={() => handlePurchase(item.name,item.image)}
              disabled={purchasedItems.includes(item.name)}
              className="store-item-button"
            >
              {purchasedItems.includes(item.name) ? 'Purchased' : 'Buy for 1 Point'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;