import React, { useState } from 'react';
import Chatbot from './Chatbot';

interface ChatbotProviderProps {
  children: React.ReactNode;
}

const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <>
      {children}
      <Chatbot isOpen={isChatbotOpen} onToggle={toggleChatbot} />
    </>
  );
};

export default ChatbotProvider;