import React from 'react';
import AdminChat from '../../components/admin/AdminChat';

const ChatPage = () => {
  const user = JSON.parse(
    localStorage.getItem('user') || 'null'
  );
  return (
    <div className="h-full p-6">
      <AdminChat currentUserId={user?.id} />
    </div>
  );
};

export default ChatPage;