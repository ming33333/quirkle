import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Subscription Cancel Page
 * 
 * This page is shown when a user cancels the Stripe checkout process.
 */
const SubscriptionCancel = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>😔</div>
        <h2 style={{ marginBottom: '10px' }}>Checkout Cancelled</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          You cancelled the checkout process. No charges were made.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/profile')}
            style={{
              padding: '12px 24px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            Back to Profile
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px',
              background: '#e5e7eb',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCancel;
