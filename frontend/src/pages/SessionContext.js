import React, { createContext, useContext, useState } from 'react';

// Créez un contexte pour gérer la session
const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  const signIn = (userData) => {
    setSession(userData);
  };

  const signOut = () => {
    setSession(null);
  };

  return (
    <SessionContext.Provider value={{ session, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
};

// Hook pour utiliser facilement le contexte
export const useSession = () => {
  return useContext(SessionContext);
};
