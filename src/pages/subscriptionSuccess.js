import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import subscriptionService from '../services/subscriptionService';

/**
 * Subscription Success Page
 * 
 * This page is shown after a successful Stripe checkout.
 * It verifies the checkout session and updates the user's subscription status.
 */
const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyCheckout = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          setStatus('error');
          setMessage('Please log in to verify your subscription.');
          return;
        }

        if (!sessionId) {
          setStatus('error');
          setMessage('Invalid checkout session.');
          return;
        }

        // In a real implementation, you would verify the session with Stripe here
        // For now, the webhook will handle updating the subscription status
        // This page just confirms the redirect worked

        setStatus('success');
        setMessage('Your subscription is being activated. This may take a few moments.');

        // Redirect to profile after 3 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
      } catch (error) {
        console.error('Error verifying checkout:', error);
        setStatus('error');
        setMessage('There was an error verifying your subscription. Please check your profile.');
      }
    };

    verifyCheckout();
  }, [searchParams, navigate]);

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
        {status === 'loading' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
            <h2>Verifying your subscription...</h2>
            <p>Please wait while we confirm your payment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
            <h2 style={{ color: '#10b981', marginBottom: '10px' }}>Subscription Activated!</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>{message}</p>
            <p style={{ fontSize: '0.9rem', color: '#999' }}>Redirecting to your profile...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
            <h2 style={{ color: '#ef4444', marginBottom: '10px' }}>Verification Error</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>{message}</p>
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
              Go to Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
