import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage } from './ChatMessage';
import { ThinkingStages } from './ThinkingStages';

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
  const [darkMode, setDarkMode] = useState(false);
  const [currentThinkingStage, setCurrentThinkingStage] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const thinkingStages = [
    "🤔 Processing question and analyzing intent...",
    "📋 Phase 1: Selecting appropriate tools and strategy...",
    "🔧 Phase 2: Gemini tool selection and parameter optimization...",
    "⚡ Phase 3: Executing NL2SQL transformation...",
    "🔨 Phase 4: Querying Oracle database with generated SQL...",
    "🧠 Phase 5: Interpreting query results and data patterns...",
    "📊 Phase 6: Formatting response and preparing visualization...",
    "✅ Finalizing enterprise-grade response..."
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentThinkingStage]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const simulateThinking = async (): Promise<string> => {
    for (let i = 0; i < thinkingStages.length; i++) {
      setCurrentThinkingStage(thinkingStages[i]);
      await new Promise(resolve => setTimeout(resolve, 1500));
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
    <div className={cn("flex flex-col h-screen", darkMode && "dark")}>
      {/* Header */}
      <div className="border-b bg-card border-border p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <img 
              src="https://www.vectorlogo.zone/logos/oracle/oracle-icon.svg" 
              alt="Oracle" 
              className="w-8 h-8"
            />
            <div>
              <h1 className="text-xl font-bold">
                <span 
                  className="bg-gradient-to-r from-oracle-red to-oracle-purple bg-clip-text text-transparent"
                  style={{ fontFamily: 'MuseoSans-700, sans-serif' }}
                >
                  Oracle
                </span>{' '}
                NL2SQL Assistant
              </h1>
              <p className="text-sm text-muted-foreground">Ask questions about your enterprise data</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearConversation}
              disabled={messages.length === 0}
            >
              Clear Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-auto bg-chat-background p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <img 
                src="https://www.vectorlogo.zone/logos/oracle/oracle-icon.svg" 
                alt="Oracle" 
                className="w-16 h-16 mx-auto mb-4 opacity-20"
              />
              <h2 className="text-xl font-semibold mb-2 text-muted-foreground">
                Welcome to Oracle NL2SQL Assistant
              </h2>
              <p className="text-muted-foreground">
                Ask me anything about your enterprise data in natural language
              </p>
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
      <div className="border-t bg-card border-border p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about your data..."
                className="min-h-[52px] max-h-32 resize-none pr-12"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 h-8 w-8 p-0"
                disabled={isLoading}
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-[52px] w-[52px] p-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};