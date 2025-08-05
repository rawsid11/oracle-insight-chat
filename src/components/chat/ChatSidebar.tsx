import React, { useState } from 'react';
import { Calendar, Clock, MessageCircle, History, ChevronRight, Search, Bookmark } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchHistory } from './SearchHistory';
import { BookmarkManager } from './BookmarkManager';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
}

const todaysChats: ChatHistory[] = [
  {
    id: '1',
    title: 'Sales Analysis Q2',
    timestamp: new Date(),
    preview: 'Show me total sales in Q2 by region...'
  },
  {
    id: '2', 
    title: 'Budget Achievement',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    preview: 'What is the budget achievement by channel...'
  },
  {
    id: '3',
    title: 'Premium Collection',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    preview: 'What is MTD collection in Mumbai?'
  },
  {
    id: '4',
    title: 'Persistency Report',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    preview: 'Which regions have highest persistency?'
  }
];

export const ChatSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const [activeTab, setActiveTab] = useState('history');

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <Sidebar className={cn("border-r border-border/50", collapsed ? "w-14" : "w-80")}>
      <div className="p-4 border-b border-border/50 bg-card/30">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-oracle-red/10 to-oracle-purple/10">
                <History className="w-4 h-4 text-oracle-red" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Chat History</h2>
                <p className="text-xs text-muted-foreground">Today's conversations</p>
              </div>
            </div>
          )}
          <SidebarTrigger className="ml-auto" />
        </div>
      </div>

      <SidebarContent className="p-0">
        {!collapsed && (
          <div className="p-4 h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 bg-oracle-red/10">
                <TabsTrigger value="history">
                  <Search className="w-4 h-4 mr-2" />
                  History
                </TabsTrigger>
                <TabsTrigger value="bookmarks">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Bookmarks
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="history" className="flex-1 mt-4">
                <SearchHistory />
              </TabsContent>
              
              <TabsContent value="bookmarks" className="flex-1 mt-4">
                <BookmarkManager />
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        <SidebarGroup>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {todaysChats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton 
                    className={cn(
                      "group relative w-full justify-start px-3 py-3 hover:bg-oracle-red/5 transition-colors",
                      collapsed ? "justify-center px-2" : ""
                    )}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex-shrink-0">
                        <MessageCircle className="w-4 h-4 text-oracle-red/70" />
                      </div>
                      
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-foreground truncate">
                              {chat.title}
                            </h4>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {formatTime(chat.timestamp)}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {chat.preview}
                          </p>
                        </div>
                      )}
                      
                      {!collapsed && (
                        <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <div className="mt-auto p-4 text-center">
            <div className="text-xs text-muted-foreground">
              <p className="mb-1">Oracle NL2SQL Assistant</p>
              <p className="text-[10px] opacity-60">Enterprise Data Analytics</p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
};