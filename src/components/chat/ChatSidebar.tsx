import React, { useState } from 'react';
import { Calendar, Clock, MessageCircle, History, ChevronRight, Search, Bookmark } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchHistory } from './SearchHistory';
import { BookmarkManager } from './BookmarkManager';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const ChatSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const [activeTab, setActiveTab] = useState('history');

  return (
    <Sidebar className={cn("border-r border-border/50", collapsed ? "w-14" : "w-80")}>
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
      </SidebarContent>
    </Sidebar>
  );
};