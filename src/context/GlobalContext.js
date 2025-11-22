import React, { createContext } from 'react';

// Create the context
export const GlobalContext = createContext();

// Create a provider component
export const GlobalProvider = ({ children }) => {
  const config = {
    apiKey: 'your-api-key',
    apiUrl: 'https://api.example.com',
    environment: process.env.NODE_ENV || 'development',
    name: 'Quirkle'
  };

  return (
    <GlobalContext.Provider value={config}>
      {children}
    </GlobalContext.Provider>
  );
};