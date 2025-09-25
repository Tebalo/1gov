import React from 'react';
import { Check, Clock, Circle } from 'lucide-react';

interface Stage {
  id: number;
  name: string;
  description: string;
}

type StageStatus = 'completed' | 'current' | 'pending';

interface TeacherRegistrationStagesProps {
  currentStage?: number;
}

export const TeacherRegistrationStages: React.FC<TeacherRegistrationStagesProps> = ({ currentStage = 1 }) => {
  const stages: Stage[] = [
    { id: 0, name: 'Create', description: 'Account created' },
    { id: 1, name: 'Screening', description: 'Under review' },
    { id: 2, name: 'Assessment', description: 'Skills evaluation' },
    { id: 3, name: 'Approval', description: 'Final review' },
    { id: 4, name: 'Endorsement', description: 'Certificate ready' }
  ];

  const getStageStatus = (stageIndex: number): StageStatus => {
    if (stageIndex < currentStage) return 'completed';
    if (stageIndex === currentStage) return 'current';
    return 'pending';
  };

  const getStageIcon = (status: StageStatus): React.ReactNode => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-white" />;
      case 'current':
        return <Clock className="h-4 w-4 text-white" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStageStyles = (status: StageStatus, isFirst: boolean, isLast: boolean): string => {
    let baseStyles = "relative flex items-center justify-between px-4 py-3 text-sm font-medium transition-all duration-300 min-w-[140px] border-r border-white/20";
    
    // Handle rounded corners
    if (isFirst) baseStyles += " rounded-l-lg";
    if (isLast) baseStyles += " rounded-r-lg border-r-0";
    
    switch (status) {
      case 'completed':
        return `${baseStyles} bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg`;
      case 'current':
        return `${baseStyles} bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg`;
      default:
        return `${baseStyles} bg-gray-100 text-gray-600 shadow-sm`;
    }
  };

  return (
    <div className="inline-flex rounded-lg overflow-hidden shadow-lg">
      {stages.map((stage, index) => {
        const status = getStageStatus(index);
        const isFirst = index === 0;
        const isLast = index === stages.length - 1;
        
        return (
          <div
            key={stage.id}
            className={getStageStyles(status, isFirst, isLast) + "w-full"}
          >
            <span className="font-semibold">{stage.name}</span>
            {getStageIcon(status)}
            
            {/* Current stage pulse indicator */}
            {status === 'current' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};