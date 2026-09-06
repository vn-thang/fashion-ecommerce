import React, { useEffect, useRef } from 'react'; 
 
const ChatMessageList = ({ 
  messages = [], 
  currentUserId, 
  loading = false, 
  otherUser = {} 
}) => { 
  const bottomRef = useRef(null); 
 
  useEffect(() => { 
    bottomRef.current?.scrollIntoView({ 
      behavior: 'smooth' 
    }); 
  }, [messages]); 
 
  const getInitial = name => 
    name?.trim()?.charAt(0)?.toUpperCase() || 'U'; 
 
  const formatTime = date => 
    new Date(date).toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }); 
 
  const renderAvatar = () => { 
    if (otherUser.avatarUrl) { 
      return ( 
        <img 
          src={otherUser.avatarUrl} 
          alt={otherUser.fullName || 'User'} 
          className="h-8 w-8 rounded-full object-cover" 
        /> 
      ); 
    } 
 
    return ( 
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600"> 
        {getInitial(otherUser.fullName)} 
      </div> 
    ); 
  }; 
 
  if (loading && !messages.length) { 
    return ( 
      <div className="flex flex-1 items-center justify-center bg-slate-50"> 
        <div className="flex items-center gap-1.5"> 
          <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" /> 
          <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:100ms]" /> 
          <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:200ms]" /> 
        </div> 
      </div> 
    ); 
  } 
 
  return ( 
    <div className="flex-1 overflow-y-auto bg-slate-50 px-5 py-5"> 
      {!messages.length ? ( 
        <div className="flex h-full flex-col items-center justify-center text-center"> 
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600"> 
            <svg 
              className="h-7 w-7" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={1.8} 
            > 
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M8 10h8M8 14h5m8-2a9 9 0 11-18 0 9 9 0 0118 0z" 
              /> 
            </svg> 
          </div> 
 
          <p className="text-xs font-semibold text-gray-700"> 
            Chưa có tin nhắn 
          </p> 
 
          <p className="mt-1 text-xs text-gray-400"> 
            Hãy bắt đầu cuộc trò chuyện. 
          </p> 
        </div> 
      ) : ( 
        <div className="space-y-3"> 
          {messages.map(message => { 
           const isMine = String(message.senderId) === String(currentUserId); 
            const isImage = 
              message.type === 'IMAGE' && 
              message.attachmentUrl; 
 
            const isFile = 
              message.type === 'FILE' && 
              message.attachmentUrl; 
 
            return ( 
              <div 
                key={message.id} 
                className={`flex items-end gap-2 ${ 
                  isMine 
                    ? 'justify-end' 
                    : 'justify-start' 
                }`} 
              > 
                {!isMine && ( 
                  <div className="shrink-0"> 
                    {renderAvatar()} 
                  </div> 
                )} 
 
                <div className="max-w-[70%]"> 
                  {!isMine && ( 
                    <p className="mb-1 ml-1 text-[10px] font-semibold text-gray-400"> 
                      {otherUser.fullName || 'Người dùng'} 
                    </p> 
                  )} 
 
                  {isImage ? ( 
                    <div className="max-w-[320px]"> 
                      <a 
                        href={message.attachmentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block" 
                      > 
                        <img 
                          src={message.attachmentUrl} 
                          alt={ 
                            message.attachmentName || 
                            'Ảnh' 
                          } 
                          className="max-h-80 max-w-full rounded-2xl object-cover" 
                        /> 
                      </a> 
 
                      <div
                        className={`mt-1 flex items-center justify-end gap-1 px-1 text-[10px] ${
                          isMine ? 'text-gray-700' : 'text-gray-500'
                        }`}
                      >
                        <span className="font-medium">
                          {formatTime(message.createdAt)}
                        </span>

                        {isMine && (
                        <MessageStatus 
                        status={message.status} 
                        isMine={isMine}
                        isAttachment
                      />
                        )}
                      </div>
                    </div> 
                  ) : ( 
                    <div 
                      className={`rounded-2xl px-4 py-2.5 shadow-sm ${ 
                        isMine 
                          ? 'rounded-br-md bg-indigo-600 text-white' 
                          : 'rounded-bl-md border border-gray-100 bg-white text-gray-800' 
                      }`} 
                    > 
                      {isFile && ( 
                        <a 
                          href={message.attachmentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`flex items-center gap-3 rounded-lg p-2 ${ 
                            isMine 
                              ? 'bg-indigo-500' 
                              : 'bg-gray-50' 
                          }`} 
                        > 
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600"> 
                            <svg 
                              className="h-5 w-5" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor" 
                              strokeWidth={1.8} 
                            > 
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" 
                              /> 
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="M14 2v6h6" 
                              /> 
                            </svg> 
                          </div> 
 
                          <span className="max-w-[220px] truncate text-xs"> 
                            {message.attachmentName || 
                              'Tập tin'} 
                          </span> 
                        </a> 
                      )} 
 
                      {message.type === 'TEXT' && 
                        message.content && ( 
                          <p className="whitespace-pre-wrap break-words text-xs leading-5"> 
                            {message.content} 
                          </p> 
                        )} 
 
                    <div 
                        className={`mt-1 flex items-center justify-end text-[10px] ${ 
                          isMine 
                            ? 'text-indigo-100' 
                            : 'text-gray-400' 
                        }`} 
                      > 
                        <span> 
                          {formatTime(message.createdAt)} 
                        </span> 
                      
                        {isMine && ( 
                          <MessageStatus status={message.status} /> 
                        )} 
                      </div> 
                    </div> 
                  )} 
                </div> 
              </div> 
            ); 
          })} 
 
          <div ref={bottomRef} /> 
        </div> 
      )} 
    </div> 
  ); 
}; 
 
const MessageStatus = ({ status, isAttachment = false }) => {
  if (!status) return null;

  const textColor = isAttachment
    ? 'text-gray-700'
    : 'text-white/90';

  if (status === 'SENT') {
    return (
      <span className={`ml-1 ${textColor}`}>
        Đã gửi
      </span>
    );
  }

  if (status === 'DELIVERED') {
    return (
      <span className={`ml-1 ${textColor}`}>
        Đã nhận
      </span>
    );
  }

  if (status === 'READ') {
    return (
      <span
        className={`ml-1 ${
          isAttachment ? 'text-indigo-600' : 'text-white/90'
        }`}
      >
        Đã xem
      </span>
    );
  }

  if (status === 'FAILED') {
    return (
      <span className="ml-1 text-red-500">
        Gửi thất bại
      </span>
    );
  }

  return null;
};
 
export default ChatMessageList; 