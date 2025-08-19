import React,{ useEffect, useState,  } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useMultiUserAuth } from "@/contexts/AuthContext";
import { SettingsMenu } from "@/components/ui/settings-menu";
import { Heart, Camera, Users, Loader2, Images } from "lucide-react";
import { event } from "@/types/event";
import { EventLockModal } from "./EventLockModal";

interface WeddingHeroProps {
  event: event;
  onViewAllPhotos: () => void;
  onViewMyPhotos: () => void;
  isLoadingAllPhotos?: boolean;
  isLoadingMyPhotos?: boolean;
}

export const WeddingHero = ({ event, onViewAllPhotos, onViewMyPhotos, isLoadingAllPhotos = false, isLoadingMyPhotos = false }: WeddingHeroProps) => {
  const { t, setDefaultLanguage, language } = useLanguage();
  const { isAuthenticated, currentUser } = useMultiUserAuth();
  const [loaded, setLoaded] = useState(false);
  const [isEventLockModalOpen, setIsEventLockModalOpen] = useState(false);

  // Set default language based on event language
  useEffect(() => {
    if (event?.eventLanguage) {
      const defaultLang = event.eventLanguage === 'HE' ? 'he' : 'en';
      setDefaultLanguage(defaultLang);
    }
  }, [event?.eventLanguage, setDefaultLanguage]);

  // Handle My Photos button click
  const handleMyPhotosClick = () => {
    if (isAuthenticated && currentUser) {
      // User is already authenticated, dispatch event to switch to my photos
      window.dispatchEvent(new CustomEvent('switchToMyPhotos', { detail:  currentUser }));
      
      // Scroll to gallery
      setTimeout(() => {
        document.getElementById('gallery')?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 100);
    } else {
      // User needs to authenticate first
      onViewMyPhotos();
    }
  };

  // Handle All Photos button click
  const handleAllPhotosClick = () => {
    // Check if event is locked with code
    if (event?.eventPhotoLockType === "Code") {
      setIsEventLockModalOpen(true);
    } else {
      onViewAllPhotos();
    }
  };

  // Handle successful code verification
  const handleLockSuccess = () => {
    onViewAllPhotos();
  };

  // useEffect(() => {
  //   if (event?.eventPhoto) {
  //     const img = new Image();
  //     img.src = event.eventPhoto;
  //     img.onload = () => {
  //       setLoaded(true);
  //     };
  //     img.onerror = () => {
  //       setLoaded(false);
  //     };
  //   }
  // }, [event]);
  // Return loading skeleton if event data is not yet loaded
  if (!event) {
    return (
      <div className="relative h-screen w-full overflow-hidden bg-muted animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-b from-muted to-muted-foreground/20" />
        <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-4 pb-24">
          <div className="mb-4 h-12 w-64 bg-muted-foreground/20 rounded animate-pulse" />
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
            <div className="h-12 bg-muted-foreground/20 rounded flex-1 animate-pulse" />
            <div className="h-12 bg-muted-foreground/20 rounded flex-1 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Settings Menu */}
      <div className="absolute top-6 right-6 z-20">
        <SettingsMenu event={event} />
      </div>

      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
             backgroundImage: event ? `url(${event.eventPhoto})` : 'none'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[0px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-4 pb-24">
        {/* Heart Icon */}
        {/* <div className="mb-8 p-4 rounded-full bg-white/10 backdrop-blur-md">
          <Heart className="w-12 h-12 text-white fill-white" />
        </div> */}

        {/* Names */}
        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1 tracking-wide">
            {event?.name || 'Loading...'}
          </h1>
          {event?.description && (
              <h3 className=" md:text-xl font-semibold text-white mb-1 tracking-wide" >
                {event?.description }
              </h3>
            )}
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
        <div className="flex flex-row sm:flex-row gap-4 w-full max-w-md mx-auto justify-center">
          <Button
            onClick={handleMyPhotosClick}
            variant="outline"
            size="lg"
            disabled={isLoadingMyPhotos}
            className="border-white bg-white/10 text-white hover:bg-white/20 backdrop-blur-md px-6 py-3 text-base font-medium min-w-[150px] shadow-xl md:px-8 md:py-6 md:text-lg md:min-w-[200px] disabled:opacity-50"
          >
            {language === 'he' ? (
              <>
                <span>
                  {event?.btFaceRecognitionText || t('auth.takeSelfie')}
                </span>
                {isLoadingMyPhotos ? (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <img src="/public/faceRecognitiomIcon.png" className="w-5" alt="" />
                  // <Users className="w-5 h-5 ml-2" />
                )}
              </>
            ) : (
              <>
                {isLoadingMyPhotos ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <img src="/public/faceRecognitiomIcon.png" className="w-5" alt="" />
                  // <Users className="w-5 h-5 mr-2" />
                )}
                <span>
                  {event?.btFaceRecognitionTextEN || t('auth.takeSelfie')}
                </span>
              </>
            )}
          </Button>

          {/* Show All Photos button only if withPhotos is true */}
          {event?.withPhotos && (
            <Button
              onClick={handleAllPhotosClick}
              size="lg"
              disabled={isLoadingAllPhotos}
              className="bg-white text-black hover:bg-white/90 px-4 py-3 text-base font-medium min-w-[150px] shadow-xl md:px-8 md:py-6 md:text-lg md:min-w-[200px] disabled:opacity-50"
            >
              {language === 'he' ? (
                <>
                  <span>{t('hero.allPhotos')}</span>
                  {isLoadingAllPhotos ? (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  ) : (
                    <Images className="w-5 h-5 ml-2" />
                  )}
                </>
              ) : (
                <>
                  {isLoadingAllPhotos ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Images className="w-5 h-5 mr-2" />
                  )}
                  <span>{t('hero.allPhotos')}</span>
                </>
              )}
            </Button>
          )}
        </div>

        {/* Privacy Agreement */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/70 max-w-sm mx-auto leading-relaxed">
            {t('privacy.agreement.prefix')}{' '}
            <button
              className="underline hover:text-white/90 transition-colors"
              onClick={() => window.open("https://www.pixshare.live/takanon", "_blank")}
            >
              {t('privacy.terms')}
            </button>
            {' '}{t('privacy.agreement.and')}{' '}
            <button
              className="underline hover:text-white/90 transition-colors"
              onClick={() => window.open("https://www.pixshare.live/privacy", "_blank")}
            >
              {t('privacy.policy')}
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

      {/* Event Lock Modal */}
      <EventLockModal
        isOpen={isEventLockModalOpen}
        onClose={() => setIsEventLockModalOpen(false)}
        onSuccess={handleLockSuccess}
        eventId={event?.id || 0}
      />
    </div>
  );
};