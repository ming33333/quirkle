import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase/firebaseDB'; // Adjust the path to your Firestore setup

const ShowItems = ({ email }) => {
  const [purchasedItems, setPurchasedItems] = useState([]); // State to store purchased items
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    const fetchPurchasedItems = async () => {
      try {
        console.log('Fetching purchased items for user:', email);
        const itemsDocRef = doc(db, 'users', email, 'pointSystem', 'items');
        const itemsDoc = await getDoc(itemsDocRef);

        if (itemsDoc.exists()) {
          setPurchasedItems(itemsDoc.data().list || []); // Set purchased items from Firestore
        } else {
          console.log('Items document does not exist. No items purchased yet.');
          setPurchasedItems([]); // Default to an empty list if no document exists
        }
      } catch (err) {
        console.error('Error fetching purchased items:', err);
        setError('Failed to fetch purchased items.');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedItems();
  }, [email]);
  console.log('purchasedItems:', purchasedItems);
  if (loading) {
    return <div>Loading purchased items...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (purchasedItems.length === 0) {
    return <div>You have not purchased any items yet.</div>;
  }

  return (
    <div className="show-items">
      <h2>Your Purchased Items</h2>
      <div className="items-list">
        {purchasedItems.map((item, index) => (
          <div key={index} className="item">
            <img
              src={item}
              alt={`Purchased item ${index + 1}`}
              className="store-item-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowItems;
