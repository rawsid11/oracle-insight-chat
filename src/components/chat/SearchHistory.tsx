import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Clock, X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatHistory } from '@/hooks/useChatHistory';

interface SearchHistoryProps {
  onSelectChat?: (chatId: string) => void;
  className?: string;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({ 
  onSelectChat, 
  className 
}) => {
  const { chatHistory, searchQuery, isSearching, searchHistory } = useChatHistory();
  const [showFilters, setShowFilters] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');

  const handleSearchChange = (value: string) => {
    searchHistory(value);
  };

  const clearSearch = () => {
    searchHistory('');
  };

  const filteredByTime = chatHistory.filter(chat => {
    const now = new Date();
    const chatDate = new Date(chat.timestamp);
    
    switch (timeFilter) {
      case 'today':
        return chatDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return chatDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return chatDate >= monthAgo;
      default:
        return true;
    }
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-20 border-oracle-red/20 focus:border-oracle-red/50 bg-background/50"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="h-6 w-6 p-0 hover:bg-oracle-red/10"
          >
            <Filter className="w-3 h-3" />
          </Button>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-6 w-6 p-0 hover:bg-oracle-red/10"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Time Filters */}
      {showFilters && (
        <Card className="p-3 border-oracle-red/20 bg-gradient-to-r from-oracle-red/5 to-oracle-purple/5">
          <div className="flex gap-2 flex-wrap">
            {(['today', 'week', 'month', 'all'] as const).map((filter) => (
              <Button
                key={filter}
                variant={timeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFilter(filter)}
                className={cn(
                  "text-xs h-7",
                  timeFilter === filter 
                    ? "bg-gradient-to-r from-oracle-red to-oracle-purple text-white" 
                    : "border-oracle-red/20 hover:bg-oracle-red/10"
                )}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Search Results */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {isSearching ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-oracle-red border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredByTime.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery ? 'No conversations found' : 'No conversations yet'}
          </div>
        ) : (
          filteredByTime.map((chat) => (
            <Card
              key={chat.id}
              className="p-3 border-oracle-red/20 hover:bg-oracle-red/5 cursor-pointer transition-all duration-200 group"
              onClick={() => onSelectChat?.(chat.id)}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-sm group-hover:text-oracle-red transition-colors line-clamp-1">
                    {chat.title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0 ml-2">
                    <Clock className="w-3 h-3" />
                    {formatTime(chat.timestamp)}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {chat.preview}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Results Summary */}
      {!isSearching && filteredByTime.length > 0 && (
        <div className="text-xs text-muted-foreground text-center py-2 border-t border-oracle-red/20">
          {filteredByTime.length} conversation{filteredByTime.length !== 1 ? 's' : ''} found
        </div>
      )}
    </div>
  );
};