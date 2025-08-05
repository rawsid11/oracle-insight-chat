import { useState, useEffect } from 'react';
import { ChatHistory } from '@/types/chat';

export const useChatHistory = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Sample data - in a real app, this would come from a database
  const sampleHistory: ChatHistory[] = [];

  useEffect(() => {
    setChatHistory(sampleHistory);
  }, []);

  const searchHistory = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  };

  const filteredHistory = chatHistory.filter(chat => 
    searchQuery === '' || 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addChatToHistory = (chat: ChatHistory) => {
    setChatHistory(prev => [chat, ...prev]);
  };

  const deleteChatFromHistory = (chatId: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
  };

  return {
    chatHistory: filteredHistory,
    searchQuery,
    isSearching,
    searchHistory,
    addChatToHistory,
    deleteChatFromHistory
  };
};