import { Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

interface AlbumDividerProps {
  albumName: string;
  albumId: string;
  imageCount: number;
}

export const AlbumDivider = ({ albumName, albumId, imageCount }: AlbumDividerProps) => {
  const { language } = useLanguage();

  return (
    <div 
      id={`album-${albumId}`}
      className="w-full py-8 flex items-center justify-center"
      dir={language === 'he' ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-transparent via-accent/20 to-transparent border-y border-accent/30 rounded-lg backdrop-blur-sm animate-fade-in">
        <div className="flex items-center gap-2 text-foreground">
          {/* <Folder className="h-5 w-5 text-primary" /> */}
          <h2 className="text-xl font-bold">{albumName}</h2>
          <span className="text-sm text-muted-foreground">
            ({imageCount} {language === 'he' ? 'תמונות' : 'photos'})
          </span>
        </div>
      </div>
    </div>
  );
};
