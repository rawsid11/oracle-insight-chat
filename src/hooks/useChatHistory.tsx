import { useState, useEffect } from 'react';
import { ChatHistory } from '@/types/chat';

export const useChatHistory = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Sample data - in a real app, this would come from a database
  const sampleHistory: ChatHistory[] = [
    {
      id: '1',
      title: 'MTD Collection Mumbai Analysis',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      preview: 'What is MTD collection in Mumbai?',
      messages: []
    },
    {
      id: '2', 
      title: 'Channel Performance Review',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      preview: 'Show budget achievement by channel',
      messages: []
    },
    {
      id: '3',
      title: 'Regional Persistency Analysis',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      preview: 'Which regions have highest persistency?',
      messages: []
    },
    {
      id: '4',
      title: 'Shortfall Analysis',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      preview: 'Best and worst channel in terms of shortfall',
      messages: []
    },
    {
      id: '5',
      title: 'LOB Refund Report',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      preview: 'What are the refund amounts by LOB?',
      messages: []
    }
  ];

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