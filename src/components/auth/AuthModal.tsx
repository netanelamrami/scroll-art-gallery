import React, { useState } from 'react';
import { AuthFlow } from './AuthFlow';
import { event } from '@/types/event';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: event;
  onComplete: (userData: { contact: string; otp: string; selfieData: string; notifications: boolean }) => void;
}

export const AuthModal = ({ isOpen, onClose, event, onComplete }: AuthModalProps) => {
  const [users, setUsers] = useState([]);
  if (!isOpen) return null;

  return (
    <AuthFlow 
      event={event}
      onComplete={onComplete}
      onCancel={onClose}
      setUsers={setUsers}
    />
  );
};