import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackToTopButtonProps {
  showAfterScroll?: number;
  className?: string;
  isSelectionMode?: boolean;
}

export const BackToTopButton = ({ 
  showAfterScroll = 1000, 
  className,
  isSelectionMode = false
}: BackToTopButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > showAfterScroll && !isSelectionMode);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll, isSelectionMode]);

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
  "fixed right-6 z-50 h-12 w-12 rounded-full shadow-lg transition-all duration-300 transform",
  "bg-white  hover:bg-white md:bg-primary text-primary-foreground",
  "hover:scale-110 active:scale-95",
  isVisible ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-16 opacity-0 pointer-events-none",
  className,
  "sm:bottom-6 bottom-24", // בגדלים קטנים 12 מלמטה, בגדולים 6
)}
      size="icon"
    >
<ArrowUp className="h-5 w-5  text-black" />
    </Button>
  );
};