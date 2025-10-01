import React, { useState } from 'react';
import './MessagingUI.css';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
}

export const MessagingUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Mrs. Johnson',
      text: 'John has been doing great in math class!',
      timestamp: new Date(Date.now() - 3600000),
      isOwn: false
    },
    {
      id: '2',
      sender: 'You',
      text: 'That\'s wonderful to hear. Thank you for the update!',
      timestamp: new Date(Date.now() - 1800000),
      isOwn: true
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'You',
        text: newMessage,
        timestamp: new Date(),
        isOwn: true
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };
  
  return (
    <div className="messaging-ui">
      <div className="messages-container">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.isOwn ? 'own' : 'other'}`}>
            <div className="message-sender">{message.sender}</div>
            <div className="message-text">{message.text}</div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};
