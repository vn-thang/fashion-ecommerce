import React, { useState } from 'react';

import { useAuth } from '../../../auth/store/authContext';

import CustomerChat from './CustomerChat';
import CustomerChatButton from './CustomerChatButton';

import { useCustomerChat } from '../../hooks/useCustomerChat';

const CustomerChatWidget = () => {
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const currentUserId = user?.id;

  if (!currentUserId || user?.role === 'Admin') {
    return null;
  }

  const chat = useCustomerChat({
    currentUserId,
    isOpen
  });

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-[9998] flex h-[600px] w-[390px] max-h-[calc(100vh-120px)] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-900/15 sm:right-6">

          <CustomerChat
            currentUserId={currentUserId}
            conversation={chat.conversation}
            messages={chat.messages}
            loading={chat.loading}
            sending={chat.sending}
            sendMessage={chat.sendMessage}
            sendAttachment={chat.sendAttachment}
            isConnected={chat.isConnected}
            adminPresence={chat.adminPresence}
            isAdminTyping={chat.isAdminTyping}
          />

        </div>
      )}

      <div className="fixed bottom-5 right-4 z-[9999] sm:right-6">

        <CustomerChatButton
          onClick={() => setIsOpen(prev => !prev)}
          unreadCount={chat.unreadCount}
          store={chat.conversation?.store}
          adminPresence={chat.adminPresence}
        />

      </div>
    </>
  );
};

export default CustomerChatWidget;