import React, { createContext, useContext, useState } from 'react';

const CustomerChatContext = createContext(null);

export const CustomerChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  const toggleChat = () => setIsOpen(prev => !prev);

  return (
    <CustomerChatContext.Provider
      value={{
        isOpen,
        openChat,
        closeChat,
        toggleChat
      }}
    >
      {children}
    </CustomerChatContext.Provider>
  );
};

export const useCustomerChatContext = () => {
  const context = useContext(CustomerChatContext);

  if (!context) {
    throw new Error(
      'useCustomerChatContext must be used within CustomerChatProvider'
    );
  }

  return context;
};