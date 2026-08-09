import React, { useState, useEffect } from 'react';
import UserSearch from '../services/userSearch'; // Import the UserSearch component
import ShowPoints from '../services/showPoints'; // Import the ShowPoints component
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase/firebaseDB';
import subscriptionService from '../services/subscriptionService';
import { SUBSCRIPTION_PLANS, getPaidPlans } from '../config/subscriptionPlans';

const SUBSCRIPTION_FIELD = 'subscription status';
const USER_SETTING_DOC_ID = 'settings';

const ProfileOverlay = ({ isOpen, onClose, userInfo }) => {
  const navigate = useNavigate(); // Hook to navigate to different routes
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPlans, setShowPlans] = useState(false);

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
      console.log('User logged out successfully');
      // Close the profile overlay before navigating
      onClose();
    } catch (error) {
      console.error('Error logging out:', error);
      // Close overlay even if logout fails
      onClose();
    }
    navigate('/login'); // Redirect to the main page
  };

  const handleUpgrade = async (planId) => {
    if (!userInfo?.email) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await subscriptionService.checkout(userInfo.email, planId);
      // User will be redirected to Stripe checkout
    } catch (err) {
      console.error('Error starting checkout:', err);
      setError(err.message || 'Failed to start checkout. Please try again.');
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!userInfo?.email) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await subscriptionService.manageSubscription(userInfo.email);
      // User will be redirected to Stripe Customer Portal
    } catch (err) {
      console.error('Error managing subscription:', err);
      setError(err.message || 'Failed to open subscription management. Please try again.');
      setIsLoading(false);
    }
  };

  const currentPlan = subscriptionStatus ? SUBSCRIPTION_PLANS[subscriptionStatus] : null;
  const paidPlans = getPaidPlans();
  const hasActiveSubscription = subscriptionStatus && subscriptionStatus !== 'free';

  return (
    <div className="overlay">
      <div className="popup" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        <button className="close-button" onClick={onClose}>
          &times; {/* Close button */}
        </button>
        <h2>Profile Information</h2>
        <div className="profile-content">
          <p><strong>Email:</strong> {userInfo.email}</p>
          
          {/* Subscription Section */}
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <p style={{ margin: '5px 0' }}>
                  <strong>Current Plan:</strong> {currentPlan?.name || '…'}
                </p>
                {currentPlan && (
                  <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                    {currentPlan.features.map((feature, idx) => (
                      <div key={idx} style={{ margin: '2px 0' }}>• {feature}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div style={{ 
                padding: '10px', 
                background: '#fee', 
                color: '#c33', 
                borderRadius: '5px', 
                marginBottom: '10px',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}

            {hasActiveSubscription ? (
              <button
                onClick={handleManageSubscription}
                disabled={isLoading}
                style={{
                  padding: '10px 20px',
                  background: '#4a5568',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  width: '100%',
                  marginTop: '10px'
                }}
              >
                {isLoading ? 'Loading...' : 'Manage Subscription'}
              </button>
            ) : (
              <div>
                <button
                  onClick={() => setShowPlans(!showPlans)}
                  style={{
                    padding: '10px 20px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    width: '100%',
                    marginTop: '10px'
                  }}
                >
                  {showPlans ? 'Hide Plans' : 'View Upgrade Options'}
                </button>

                {showPlans && (
                  <div style={{ marginTop: '20px' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Available Plans</h3>
                    {paidPlans.map((plan) => (
                      <div
                        key={plan.id}
                        style={{
                          border: '2px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '15px',
                          marginBottom: '15px',
                          background: '#f7fafc'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <div>
                            <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{plan.name}</h4>
                            <p style={{ margin: '0', fontSize: '1.2rem', fontWeight: 'bold', color: '#667eea' }}>
                              ${plan.price}/month
                            </p>
                          </div>
                        </div>
                        <ul style={{ margin: '10px 0', paddingLeft: '20px', fontSize: '0.9rem' }}>
                          {plan.features.map((feature, idx) => (
                            <li key={idx} style={{ margin: '5px 0' }}>{feature}</li>
                          ))}
                        </ul>
                        <button
                          onClick={() => handleUpgrade(plan.id)}
                          disabled={isLoading}
                          style={{
                            padding: '10px 20px',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            width: '100%',
                            marginTop: '10px'
                          }}
                        >
                          {isLoading ? 'Processing...' : `Upgrade to ${plan.name}`}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <button onClick={handleLogout} className="logout-button" style={{ marginTop: '20px' }}>
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
