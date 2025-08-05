import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThinkingStage } from '@/types/chat';

interface AdvancedThinkingStagesProps {
  currentStage: string;
}

export const AdvancedThinkingStages: React.FC<AdvancedThinkingStagesProps> = ({ currentStage }) => {
  const [stages, setStages] = useState<ThinkingStage[]>([]);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

  const allStages: ThinkingStage[] = [
    {
      id: '1',
      title: 'Question Analysis',
      description: 'Processing question and analyzing intent',
      status: 'pending'
    },
    {
      id: '2', 
      title: 'Tool Selection',
      description: 'Selecting appropriate tools and strategy',
      status: 'pending'
    },
    {
      id: '3',
      title: 'AI Optimization',
      description: 'Gemini tool selection and parameter optimization',
      status: 'pending'
    },
    {
      id: '4',
      title: 'SQL Generation',
      description: 'Executing NL2SQL transformation',
      status: 'pending'
    },
    {
      id: '5',
      title: 'Database Query',
      description: 'Querying Oracle database with generated SQL',
      status: 'pending'
    },
    {
      id: '6',
      title: 'Data Analysis',
      description: 'Interpreting query results and data patterns',
      status: 'pending'
    },
    {
      id: '7',
      title: 'Response Formatting',
      description: 'Formatting response and preparing visualization',
      status: 'pending'
    },
    {
      id: '8',
      title: 'Finalization',
      description: 'Finalizing enterprise-grade response',
      status: 'pending'
    }
  ];

  useEffect(() => {
    setStages(allStages);
  }, []);

  useEffect(() => {
    if (currentStage) {
      const stageIndex = allStages.findIndex(stage => 
        currentStage.toLowerCase().includes(stage.title.toLowerCase())
      );
      
      if (stageIndex !== -1) {
        setCurrentStageIndex(stageIndex);
        setOverallProgress(((stageIndex + 1) / allStages.length) * 100);
        
        setStages(prev => prev.map((stage, index) => ({
          ...stage,
          status: index < stageIndex ? 'completed' : 
                 index === stageIndex ? 'active' : 'pending'
        })));
      }
    }
  }, [currentStage]);

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'active':
        return <Clock className="w-4 h-4 text-oracle-red animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Circle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="p-6 border-oracle-red/20 bg-gradient-to-br from-oracle-red/5 to-oracle-purple/5 backdrop-blur-sm">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-oracle-red to-oracle-purple animate-pulse" />
              <div className="absolute inset-0 w-8 h-8 rounded-full bg-gradient-to-r from-oracle-red to-oracle-purple animate-ping opacity-20" />
            </div>
            <div>
              <h3 className="font-semibold text-lg bg-gradient-to-r from-oracle-red to-oracle-purple bg-clip-text text-transparent">
                Processing Query
              </h3>
              <p className="text-sm text-muted-foreground">
                Stage {currentStageIndex + 1} of {allStages.length}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-oracle-red">
              {Math.round(overallProgress)}%
            </div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="space-y-2">
          <Progress 
            value={overallProgress} 
            className="h-2 bg-muted"
          />
        </div>

        {/* Current Stage Highlight */}
        {currentStage && (
          <div className="p-3 rounded-lg bg-gradient-to-r from-oracle-red/10 to-oracle-purple/10 border border-oracle-red/20">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-oracle-red animate-pulse" />
              <span className="font-medium text-oracle-red">Currently:</span>
              <span className="text-foreground">{currentStage}</span>
            </div>
          </div>
        )}

        {/* Detailed Stages */}
        <div className="space-y-2">
          {stages.map((stage, index) => (
            <div
              key={stage.id}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg transition-all duration-200",
                stage.status === 'active' && "bg-oracle-red/10 border border-oracle-red/20",
                stage.status === 'completed' && "bg-green-50 border border-green-200",
                stage.status === 'pending' && "opacity-60"
              )}
            >
              <div className="flex-shrink-0">
                {getStageIcon(stage.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm font-medium",
                    stage.status === 'active' && "text-oracle-red",
                    stage.status === 'completed' && "text-green-700",
                    stage.status === 'pending' && "text-muted-foreground"
                  )}>
                    {stage.title}
                  </span>
                  {stage.status === 'active' && (
                    <div className="flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-oracle-red animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1 h-1 rounded-full bg-oracle-red animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1 h-1 rounded-full bg-oracle-red animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>
                <p className={cn(
                  "text-xs mt-1",
                  stage.status === 'active' && "text-oracle-red/80",
                  stage.status === 'completed' && "text-green-600",
                  stage.status === 'pending' && "text-muted-foreground"
                )}>
                  {stage.description}
                </p>
              </div>
              {stage.status === 'active' && (
                <div className="flex-shrink-0">
                  <div className="w-4 h-4 border-2 border-oracle-red border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};