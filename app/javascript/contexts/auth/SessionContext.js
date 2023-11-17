import React, { createContext, useState, useContext } from 'react';

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [sessionExpired, setSessionExpired] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const triggerSessionExpiry = () => {
    setSessionExpired(true);
    setShowAlert(true);
    setAlertMessage('Your session has expired. Please log in again.');
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  return (
    <SessionContext.Provider value={{ sessionExpired, triggerSessionExpiry, showAlert, closeAlert, alertMessage }}>
      {children}
    </SessionContext.Provider>
  );
};
