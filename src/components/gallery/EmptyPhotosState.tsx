import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Camera, Clock, Image } from 'lucide-react';

interface EmptyPhotosStateProps {
  type: 'allPhotos' | 'myPhotos';
}

export const EmptyPhotosState = ({ type }: EmptyPhotosStateProps) => {
  const { t } = useLanguage();
  
  const isAllPhotos = type === 'allPhotos';
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-full p-8 mb-6">
        {isAllPhotos ? (
          <Image className="w-16 h-16 text-primary" />
        ) : (
          <Camera className="w-16 h-16 text-primary" />
        )}
      </div>
      
      <h2 className="text-2xl font-bold text-foreground mb-4">
        {t(isAllPhotos ? 'empty.allPhotos.title' : 'empty.myPhotos.title')}
      </h2>
      
      <p className="text-muted-foreground text-lg max-w-md mb-8 leading-relaxed">
        {t(isAllPhotos ? 'empty.allPhotos.description' : 'empty.myPhotos.description')}
      </p>
      
      <div className="flex items-center gap-2 text-primary">
        <Clock className="w-5 h-5" />
        <span className="text-sm font-medium">
          {t(isAllPhotos ? 'empty.allPhotos.clock' : 'empty.myPhotos.clock')}
        </span>
      </div>
    </div>
  );
};