import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackToTopButtonProps {
  showAfterScroll?: number;
  className?: string;
}

export const BackToTopButton = ({ 
  showAfterScroll = 300, 
  className 
}: BackToTopButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > showAfterScroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll]);

  const scrollToGallery = () => {
    const galleryElement = document.getElementById('gallery');
    if (galleryElement) {
      galleryElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback to top if gallery not found
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Button
      onClick={scrollToGallery}
      className={cn(
        "fixed bottom-20 right-4 z-50 h-12 w-12 rounded-full shadow-lg transition-all duration-300 transform",
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        "hover:scale-110 active:scale-95",
        "sm:bottom-6 sm:right-6", // Desktop positioning
        isVisible 
          ? "translate-y-0 opacity-100 pointer-events-auto" 
          : "translate-y-16 opacity-0 pointer-events-none",
        className
      )}
      size="icon"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
};