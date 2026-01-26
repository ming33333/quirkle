import React, { useState, useEffect } from 'react';
import UserSearch from '../services/userSearch'; // Import the UserSearch component
import ShowPoints from '../services/showPoints'; // Import the ShowPoints component
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase/firebaseDB';

const SUBSCRIPTION_FIELD = 'subscription status';
const USER_SETTING_DOC_ID = 'settings';

const ProfileOverlay = ({ isOpen, onClose, userInfo }) => {
  const navigate = useNavigate(); // Hook to navigate to different routes
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  useEffect(() => {
    if (!isOpen || !userInfo?.email) {
      setSubscriptionStatus(null);
      return;
    }
    const loadSubscription = async () => {
      try {
        const ref = doc(db, 'users', userInfo.email, 'userSetting', USER_SETTING_DOC_ID);
        const snapshot = await getDoc(ref);
        const data = snapshot.exists() ? snapshot.data() : {};
        setSubscriptionStatus(data[SUBSCRIPTION_FIELD] ?? 'free');
      } catch (err) {
        console.error('Error loading subscription:', err);
        setSubscriptionStatus('free');
      }
    };
    loadSubscription();
  }, [isOpen, userInfo?.email]);

  if (!isOpen) return null; // Don't render anything if the overlay is not open

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth); // Sign out the user
      // onClose()
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
    navigate('/login'); // Redirect to the main page
  };
  return (
    <div className="overlay">
      <div className="popup">
        <button className="close-button" onClick={onClose}>
          &times; {/* Close button */}
        </button>
        <h2>Profile Information</h2>
        <div className="profile-content">
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Subscription:</strong> {subscriptionStatus ?? '…'}</p>
          <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
        </div>
        <hr />
        <ShowPoints email={userInfo.email} />{' '}
        {/* Add the UserSearch component */}
        <UserSearch email={userInfo.email} />{' '}
        {/* Add the UserSearch component */}
      </div>
    </div>
  );
};

export default ProfileOverlay;
