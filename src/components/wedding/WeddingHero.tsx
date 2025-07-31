import React,{ useEffect, useState,  } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { SettingsMenu } from "@/components/ui/settings-menu";
import { Heart, Camera, Users } from "lucide-react";
import { event } from "@/types/event";

interface WeddingHeroProps {
  event: event;
  onViewAllPhotos: () => void;
  onViewMyPhotos: () => void;
}

export const WeddingHero = ({ event, onViewAllPhotos, onViewMyPhotos }: WeddingHeroProps) => {
  const { t } = useLanguage();



  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Settings Menu */}
      <div className="absolute top-6 right-6 z-20">
        <SettingsMenu />
      </div>

      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
             backgroundImage: event ? `url(${event.eventPhoto})` : 'none'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-4 pb-24">
        {/* Heart Icon */}
        {/* <div className="mb-8 p-4 rounded-full bg-white/10 backdrop-blur-md">
          <Heart className="w-12 h-12 text-white fill-white" />
        </div> */}

        {/* Names */}
        <div className="mb-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-wide">
            {event?.name}
          </h1>
          {/* <p className="text-xl md:text-2xl text-white/90 font-light">
            15.06.2024
          </p> */}
        </div>

        {/* Subtitle */}
        {/* <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl leading-relaxed">
          {t('hero.subtitle')}
          <br />
          כאן תוכלו למצוא את כל הזכרונות היפים מהיום המיוחד שלנו
        </p> */}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
          <Button
            onClick={onViewAllPhotos}
            size="lg"
            className="bg-white text-black hover:bg-white/90 px-4 py-3 text-base font-medium min-w-[150px] shadow-xl md:px-8 md:py-6 md:text-lg md:min-w-[200px]"
          >
            <Camera className="w-5 h-5 mr-2" />
            {t('hero.allPhotos')}
          </Button>
          
          <Button
            onClick={onViewMyPhotos}
            variant="outline"
            size="lg"
            className="border-white bg-white/10 text-white hover:bg-white/20 backdrop-blur-md px-4 py-3 text-base font-medium min-w-[150px] shadow-xl md:px-8 md:py-6 md:text-lg md:min-w-[200px]"
          >
            <Users className="w-5 h-5 mr-2" />
            {t('hero.myPhotos')}
          </Button>
        </div>

        {/* Privacy Agreement */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/70 max-w-sm mx-auto leading-relaxed">
            על ידי שימוש באתר אני מאשר/ת את{' '}
            <button className="underline hover:text-white/90 transition-colors">
              תנאי השימוש
            </button>
            {' '}ו
            <button className="underline hover:text-white/90 transition-colors">
              מדיניות הפרטיות
            </button>
          </p>
        </div>

        {/* Scroll Indicator */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div> */}
      </div>
    </div>
  );
};