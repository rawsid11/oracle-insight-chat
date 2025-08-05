import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Bookmark, BookmarkCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnhancedTable } from './EnhancedTable';
import { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
  isBookmarked?: boolean;
  onToggleBookmark?: (title: string, content: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isBookmarked = false, 
  onToggleBookmark 
}) => {
  const isUser = message.type === 'user';
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[80%] space-y-2", isUser && "order-2")}>
        
        {/* Tool Badge and Bookmark */}
        {!isUser && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {message.tool && (
                <Badge variant="secondary" className="text-xs bg-oracle-red/10 text-oracle-red border-oracle-red/20">
                  🔧 Tool used: {message.tool}
                </Badge>
              )}
            </div>
            
            {/* Bookmark Button */}
            {onToggleBookmark && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleBookmark(
                  `${message.tool ? message.tool + ' - ' : ''}Response`,
                  message.content
                )}
                className="h-7 w-7 p-0 hover:bg-oracle-red/10"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4 text-oracle-red" />
                ) : (
                  <Bookmark className="w-4 h-4 text-muted-foreground hover:text-oracle-red" />
                )}
              </Button>
            )}
          </div>
        )}
        
        {/* Message Bubble */}
        <Card className={cn(
          "p-4 relative",
          isUser 
            ? "bg-primary text-primary-foreground ml-auto" 
            : message.error 
              ? "bg-destructive/10 border-destructive/20" 
              : "bg-chat-system-bubble"
        )}>
          
          {/* Error Icon */}
          {message.error && (
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-destructive font-medium">Error</p>
                <p className="text-sm text-muted-foreground">{message.content}</p>
              </div>
            </div>
          )}
          
          {/* Success Icon for System Messages */}
          {!message.error && !isUser && (
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          )}
          
          {/* User Message */}
          {isUser && (
            <p className="text-sm">{message.content}</p>
          )}
          
          {/* Table Data */}
          {message.tableData && !message.error && (
            <div className="mt-4">
              <EnhancedTable data={message.tableData} />
            </div>
          )}
        </Card>
        
        {/* Timestamp */}
        <div className={cn(
          "text-xs text-muted-foreground",
          isUser ? "text-right" : "text-left"
        )}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};