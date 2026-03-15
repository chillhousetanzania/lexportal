import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Button, Card } from '../ui';
import { cn } from '../ui';
import { 
  ChevronLeft, ChevronRight, Check, FileText, Users, User, Paperclip,
  AlertCircle, Eye, Save
} from 'lucide-react';

// Step components
import { CaseDetailsStep } from './steps/CaseDetailsStep';
import { PlaintiffStep } from './steps/PlaintiffStep';
import { DefendantStep } from './steps/DefendantStep';
import { AttachmentsStep } from './steps/AttachmentsStep';
import { ReviewStep } from './steps/ReviewStep';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  component: React.FC<{
    data: any;
    updateData: (data: any) => void;
    isValid: boolean;
    setIsValid: (valid: boolean) => void;
  }>;
}

const wizardSteps: WizardStep[] = [
  {
    id: 'case-details',
    title: 'Case Details',
    description: 'Basic case information',
    icon: FileText,
    component: CaseDetailsStep,
  },
  {
    id: 'plaintiff',
    title: 'Plaintiff(s)',
    description: 'Add plaintiff information',
    icon: Users,
    component: PlaintiffStep,
  },
  {
    id: 'defendant',
    title: 'Defendant(s)',
    description: 'Add defendant information',
    icon: User,
    component: DefendantStep,
  },
  {
    id: 'attachments',
    title: 'Attachments',
    description: 'Upload supporting documents',
    icon: Paperclip,
    component: AttachmentsStep,
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Review and submit your case',
    icon: Eye,
    component: ReviewStep,
  },
];

interface CaseWizardProps {
  onClose?: () => void;
  onComplete?: (caseData: any) => void;
}

export const CaseWizard: React.FC<CaseWizardProps> = ({ onClose, onComplete }) => {
  const { setCurrentPage } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<Record<string, any>>({});
  const [stepValidation, setStepValidation] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateData = useCallback((stepId: string, data: any) => {
    setWizardData(prev => ({
      ...prev,
      [stepId]: data,
    }));
  }, []);

  const updateStepValidation = useCallback((stepId: string, isValid: boolean) => {
    setStepValidation(prev => ({
      ...prev,
      [stepId]: isValid,
    }));
  }, []);

  const currentStepData = wizardData[wizardSteps[currentStep].id] || {};
  const isCurrentStepValid = stepValidation[wizardSteps[currentStep].id] || false;

  const canGoNext = currentStep < wizardSteps.length - 1 && isCurrentStepValid;
  const canGoBack = currentStep > 0;

  const handleNext = () => {
    if (canGoNext) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (canGoBack) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSaveDraft = async () => {
    // Save draft logic here
    console.log('Saving draft:', wizardData);
    // Show toast notification
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Submit case logic here
      console.log('Submitting case:', wizardData);
      onComplete?.(wizardData);
      setCurrentPage('cases');
    } catch (error) {
      console.error('Error submitting case:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    if (newDirection > 0 && canGoNext) {
      setPage([page + newDirection, newDirection]);
      setCurrentStep(prev => prev + 1);
    } else if (newDirection < 0 && canGoBack) {
      setPage([page + newDirection, newDirection]);
      setCurrentStep(prev => prev - 1);
    }
  };

  const CurrentStepComponent = wizardSteps[currentStep].component;

  return (
    <div className="min-h-screen bg-grey-light p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-navy uppercase tracking-tight">New eCase Filing</h1>
            <p className="text-sm text-slate-500 mt-1">Complete the form to file a new case</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={handleSaveDraft}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </Button>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200"></div>
          <div 
            className="absolute top-5 left-0 h-0.5 bg-gold transition-all duration-300"
            style={{ width: `${((currentStep) / (wizardSteps.length - 1)) * 100}%` }}
          ></div>
          
          <div className="relative flex justify-between">
            {wizardSteps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const StepIcon = step.icon;
              
              return (
                <div
                  key={step.id}
                  className={cn(
                    'flex flex-col items-center cursor-pointer transition-all duration-200',
                    isActive ? 'scale-110' : 'scale-100'
                  )}
                  onClick={() => {
                    if (isCompleted || isActive) {
                      setCurrentStep(index);
                      setPage([index, index > currentStep ? 1 : -1]);
                    }
                  }}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200',
                    isActive 
                      ? 'bg-gold border-gold text-white shadow-lg' 
                      : isCompleted 
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'bg-white border-slate-300 text-slate-400'
                  )}>
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={cn(
                      'text-xs font-medium',
                      isActive ? 'text-navy' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                    )}>
                      {step.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="w-full"
            >
              <CurrentStepComponent
                data={currentStepData}
                updateData={(data) => updateData(wizardSteps[currentStep].id, data)}
                isValid={isCurrentStepValid}
                setIsValid={(valid) => updateStepValidation(wizardSteps[currentStep].id, valid)}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3">
              {canGoBack && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!isCurrentStepValid && (
                <div className="flex items-center gap-2 text-amber-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  Please complete all required fields
                </div>
              )}
              
              {currentStep === wizardSteps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!isCurrentStepValid || isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Case'}
                  <Check className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canGoNext}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
