import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, Brain, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThinkingStagesProps {
  currentStage: string;
}

export const ThinkingStages: React.FC<ThinkingStagesProps> = ({ currentStage }) => {
  return (
    <div className="flex justify-start">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-4 max-w-[85%] shadow-sm">
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center">
              <Loader2 className="w-2.5 h-2.5 animate-spin text-blue-600" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm font-semibold text-blue-900">
                🧩 Thinking...
              </h4>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"
                    style={{
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: '1.5s'
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div className="bg-white/60 rounded-lg p-3 border border-blue-100">
              <p className="text-sm text-blue-800 leading-relaxed">
                {currentStage}
              </p>
            </div>
            
            {/* Progress indicator */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1 bg-blue-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"
                  style={{ width: '60%' }}
                />
              </div>
              <Zap className="w-3 h-3 text-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};