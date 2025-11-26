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
      <div className="inline-flex items-center gap-2 px-6 py-3 bg-background/95 border border-border/50 rounded-full shadow-sm backdrop-blur-sm animate-fade-in">
        <span className="text-2xl font-bold text-foreground">{albumName}</span>
        <span className="text-lg text-muted-foreground">
          ({imageCount})
        </span>
      </div>
    </div>
  );
};
