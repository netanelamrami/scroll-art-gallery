import { Button } from "@/components/ui/button";
import { Heart, Camera, Users } from "lucide-react";

interface WeddingHeroProps {
  onViewAllPhotos: () => void;
  onViewMyPhotos: () => void;
}

export const WeddingHero = ({ onViewAllPhotos, onViewMyPhotos }: WeddingHeroProps) => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1920&h=1080&fit=crop')"
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        {/* Heart Icon */}
        <div className="mb-8 p-4 rounded-full bg-white/10 backdrop-blur-md">
          <Heart className="w-12 h-12 text-white fill-white" />
        </div>

        {/* Names */}
        <div className="mb-4">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-2 tracking-wide">
            דני ושרה
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light">
            15.06.2024
          </p>
        </div>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl leading-relaxed">
          ברוכים הבאים לגלריית התמונות שלנו
          <br />
          כאן תוכלו למצוא את כל הזכרונות היפים מהיום המיוחד שלנו
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onViewAllPhotos}
            size="lg"
            className="bg-white text-black hover:bg-white/90 px-8 py-6 text-lg font-medium min-w-[200px] shadow-xl"
          >
            <Camera className="w-5 h-5 mr-2" />
            כל התמונות
          </Button>
          
          <Button
            onClick={onViewMyPhotos}
            variant="outline"
            size="lg"
            className="border-white bg-white/10 text-white hover:bg-white/20 backdrop-blur-md px-8 py-6 text-lg font-medium min-w-[200px] shadow-xl"
          >
            <Users className="w-5 h-5 mr-2" />
            התמונות שלי
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};