import React from 'react';
import { AuthFlow } from './AuthFlow';
import { event } from '@/types/event';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: event;
  onComplete: (userData: { contact: string; otp: string; selfieData: string; notifications: boolean }) => void;
}

export const AuthModal = ({ isOpen, onClose, event, onComplete }: AuthModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
      <AuthFlow 
        event={event}
        onComplete={onComplete}
        onCancel={onClose}
      />
    </div>
  );
};