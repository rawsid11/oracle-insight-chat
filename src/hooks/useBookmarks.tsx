import { useState, useEffect } from 'react';
import { Bookmark } from '@/types/chat';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Sample bookmarks data
  const sampleBookmarks: Bookmark[] = [
    {
      id: '1',
      messageId: '1',
      title: 'MTD Collection Analysis',
      content: 'Based on your query, I found 15 sales records across 3 regions in Q2...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      tags: ['collection', 'mumbai', 'mtd']
    },
    {
      id: '2',
      messageId: '2', 
      title: 'Channel Performance SQL',
      content: 'SELECT channel, SUM(actual), SUM(budget) FROM budget_achievement...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      tags: ['channel', 'sql', 'performance']
    }
  ];

  useEffect(() => {
    setBookmarks(sampleBookmarks);
  }, []);

  const addBookmark = (messageId: string, title: string, content: string, tags?: string[]) => {
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      messageId,
      title,
      content,
      timestamp: new Date(),
      tags
    };
    setBookmarks(prev => [newBookmark, ...prev]);
  };

  const removeBookmark = (bookmarkId: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== bookmarkId));
  };

  const isBookmarked = (messageId: string) => {
    return bookmarks.some(bookmark => bookmark.messageId === messageId);
  };

  const toggleBookmark = (messageId: string, title: string, content: string, tags?: string[]) => {
    if (isBookmarked(messageId)) {
      const bookmark = bookmarks.find(b => b.messageId === messageId);
      if (bookmark) {
        removeBookmark(bookmark.id);
      }
    } else {
      addBookmark(messageId, title, content, tags);
    }
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark
  };
};