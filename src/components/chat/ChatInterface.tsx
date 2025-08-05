import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage } from './ChatMessage';
import { ThinkingStages } from './ThinkingStages';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ChatSidebar } from './ChatSidebar';

interface Message {
  id: string;
  type: 'user' | 'system';
  content: string;
  timestamp: Date;
  tool?: string;
  isThinking?: boolean;
  thinkingStage?: string;
  tableData?: Array<Record<string, any>>;
  error?: boolean;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentThinkingStage, setCurrentThinkingStage] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const thinkingStages = [
    "🤔 Processing question and analyzing intent",
    "📋 Phase 1: Selecting appropriate tools and strategy",
    "🔧 Phase 2: Gemini tool selection and parameter optimization",
    "⚡ Phase 3: Executing NL2SQL transformation",
    "🔨 Phase 4: Querying Oracle database with generated SQL",
    "🧠 Phase 5: Interpreting query results and data patterns",
    "📊 Phase 6: Formatting response and preparing visualization",
    "✅ Finalizing enterprise-grade response"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentThinkingStage]);


  const simulateThinking = async (): Promise<string> => {
    for (let i = 0; i < thinkingStages.length; i++) {
      setCurrentThinkingStage(thinkingStages[i]);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    setCurrentThinkingStage('');
    return "Based on your query, I found 15 sales records across 3 regions in Q2. The highest performing region was North America with $2.3M in total sales.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await simulateThinking();
      
      const systemMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: response,
        timestamp: new Date(),
        tool: 'NL2SQL → Oracle DB',
        tableData: input.toLowerCase().includes('table') || input.toLowerCase().includes('sales') ? [
          { Region: 'North America', Sales: '$2,300,000', Growth: '+15%' },
          { Region: 'Europe', Sales: '$1,800,000', Growth: '+8%' },
          { Region: 'Asia Pacific', Sales: '$1,200,000', Growth: '+22%' }
        ] : undefined
      };

      setMessages(prev => [...prev, systemMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearConversation = () => {
    setMessages([]);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <ChatSidebar />
        
        <div className="flex flex-col flex-1">
          {/* Header */}
          <div className="border-b bg-card/50 backdrop-blur-sm border-border/50 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-oracle-red/10 to-oracle-purple/10 border border-oracle-red/20">
                  <img 
                    src="https://www.vectorlogo.zone/logos/oracle/oracle-icon.svg" 
                    alt="Oracle" 
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold">
                    <span 
                      className="bg-gradient-to-r from-oracle-red to-oracle-purple bg-clip-text text-transparent"
                      style={{ fontFamily: 'MuseoSans-700, sans-serif' }}
                    >
                      Oracle
                    </span>{' '}
                    <span className="text-foreground/80">NL2SQL Assistant</span>
                  </h1>
                  <p className="text-sm text-muted-foreground">Ask questions about your enterprise data</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={clearConversation}
                disabled={messages.length === 0}
                className="border-oracle-red/20 hover:bg-oracle-red/5"
              >
                Clear Chat
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-auto bg-gradient-to-b from-background to-muted/20 px-6 py-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.length === 0 && (
                <div className="text-center py-16">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-oracle-red/10 to-oracle-purple/10 border border-oracle-red/20 w-fit mx-auto mb-6">
                    <img 
                      src="https://www.vectorlogo.zone/logos/oracle/oracle-icon.svg" 
                      alt="Oracle" 
                      className="w-12 h-12 opacity-60"
                    />
                  </div>
                  <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-oracle-red to-oracle-purple bg-clip-text text-transparent">
                    Welcome to Oracle NL2SQL Assistant
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    Ask me anything about your enterprise data in natural language
                  </p>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    <div className="p-3 bg-card border border-border/50 rounded-lg text-sm text-muted-foreground">
                      "What is MTD collection in Mumbai?"
                    </div>
                    <div className="p-3 bg-card border border-border/50 rounded-lg text-sm text-muted-foreground">
                      "Show budget achievement by channel"
                    </div>
                  </div>
                </div>
              )}
              
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isLoading && currentThinkingStage && (
                <ThinkingStages currentStage={currentThinkingStage} />
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t bg-card/50 backdrop-blur-sm border-border/50 p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="flex gap-4 items-end">
                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question about your data..."
                    className="min-h-[56px] max-h-32 resize-none pr-12 border-border/50 focus:border-oracle-red/50 focus:ring-oracle-red/20 bg-background/50 backdrop-blur-sm"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-oracle-red/10"
                    disabled={isLoading}
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="h-[56px] w-[56px] p-0 bg-gradient-to-r from-oracle-red to-oracle-purple hover:from-oracle-red/90 hover:to-oracle-purple/90 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};