import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThinkingStagesProps {
  currentStage: string;
}

export const ThinkingStages: React.FC<ThinkingStagesProps> = ({ currentStage }) => {
  return (
    <div className="flex justify-start">
      <Card className="bg-chat-thinking-bg text-chat-thinking-text p-4 max-w-[80%] border-chat-thinking-bg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Brain className="w-5 h-5 text-oracle-red" />
            <Loader2 className="w-3 h-3 animate-spin absolute -top-1 -right-1 text-oracle-purple" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              🧩 Thinking Os
            </p>
            <p className="text-xs text-chat-thinking-text mt-1">
              {currentStage}
            </p>
          </div>
        </div>
        
        {/* Animated dots */}
        <div className="flex gap-1 mt-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full bg-oracle-red/60 animate-pulse",
                `animation-delay-${i * 200}ms`
              )}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};