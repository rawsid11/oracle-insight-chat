import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Search, Tag, Trash2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBookmarks } from '@/hooks/useBookmarks';

interface BookmarkManagerProps {
  onSelectBookmark?: (bookmarkId: string) => void;
  className?: string;
}

export const BookmarkManager: React.FC<BookmarkManagerProps> = ({ 
  onSelectBookmark, 
  className 
}) => {
  const { bookmarks, removeBookmark } = useBookmarks();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  // Get all unique tags
  const allTags = Array.from(
    new Set(bookmarks.flatMap(bookmark => bookmark.tags || []))
  );

  // Filter bookmarks
  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = searchQuery === '' || 
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag === '' || 
      (bookmark.tags && bookmark.tags.includes(selectedTag));

    return matchesSearch && matchesTag;
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
      {/* Header */}
      <div className="flex items-center gap-2">
        <Bookmark className="w-5 h-5 text-oracle-red" />
        <h3 className="font-semibold text-lg">Bookmarks</h3>
        <Badge variant="secondary" className="bg-oracle-red/10 text-oracle-red">
          {bookmarks.length}
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-oracle-red/20 focus:border-oracle-red/50 bg-background/50"
        />
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter by tag:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedTag === '' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag('')}
              className={cn(
                "text-xs h-7",
                selectedTag === '' 
                  ? "bg-gradient-to-r from-oracle-red to-oracle-purple" 
                  : "border-oracle-red/20 hover:bg-oracle-red/10"
              )}
            >
              All
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag)}
                className={cn(
                  "text-xs h-7",
                  selectedTag === tag 
                    ? "bg-gradient-to-r from-oracle-red to-oracle-purple" 
                    : "border-oracle-red/20 hover:bg-oracle-red/10"
                )}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Bookmarks List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {bookmarks.length === 0 ? 'No bookmarks yet' : 'No bookmarks match your search'}
          </div>
        ) : (
          filteredBookmarks.map((bookmark) => (
            <Card
              key={bookmark.id}
              className="p-4 border-oracle-red/20 hover:bg-oracle-red/5 transition-all duration-200 group"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-sm group-hover:text-oracle-red transition-colors line-clamp-2">
                    {bookmark.title}
                  </h4>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectBookmark?.(bookmark.id)}
                      className="h-6 w-6 p-0 hover:bg-oracle-red/10"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBookmark(bookmark.id)}
                      className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Content Preview */}
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {bookmark.content}
                </p>

                {/* Tags and Time */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {bookmark.tags?.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-oracle-red/10 text-oracle-red/80 hover:bg-oracle-red/20 cursor-pointer"
                        onClick={() => setSelectedTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(bookmark.timestamp)}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Results Summary */}
      {filteredBookmarks.length > 0 && (
        <div className="text-xs text-muted-foreground text-center py-2 border-t border-oracle-red/20">
          {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''} shown
        </div>
      )}
    </div>
  );
};