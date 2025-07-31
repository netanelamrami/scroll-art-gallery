import React from "react";
import { Button } from "@/components/ui/button";
import { Folder, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface Album {
  id: string;
  name: string;
  imageCount: number;
  thumbnail?: string;
}

interface AlbumSectionProps {
  albums: Album[];
  onAlbumClick: (albumId: string) => void;
}

const mockAlbums: Album[] = [
  { id: "ceremony", name: "חופה", imageCount: 45, thumbnail: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&h=300&fit=crop" },
  { id: "reception", name: "קבלת פנים", imageCount: 67, thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=300&fit=crop" },
  { id: "dance", name: "ריקודים", imageCount: 89, thumbnail: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&h=300&fit=crop" },
  { id: "couples", name: "צילומי זוג", imageCount: 23, thumbnail: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=300&h=300&fit=crop" },
  { id: "family", name: "משפחה", imageCount: 34, thumbnail: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=300&h=300&fit=crop" },
  { id: "details", name: "פרטים", imageCount: 19, thumbnail: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=300&h=300&fit=crop" },
];

export const AlbumSection = ({ albums = mockAlbums, onAlbumClick }: AlbumSectionProps) => {
  return (
    <div className="w-full px-4 mb-2 sticky top-16 bg-background/95 backdrop-blur-sm border-b border-border pb-2 z-40">
      <h2 className="text-lg font-bold mb-2 text-center">אלבומים</h2>
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2">
          {albums.map((album) => (
            <Button
              key={album.id}
              variant="ghost"
              className="h-auto p-2 flex flex-col items-center group hover:bg-accent"
              onClick={() => onAlbumClick(album.id)}
            >
              <div className="relative w-full aspect-square mb-1 overflow-hidden rounded-lg">
                <img
                  src={album.thumbnail}
                  alt={album.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {album.imageCount}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Folder className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs font-medium text-center">{album.name}</span>
              </div>
            </Button>
          ))}
        </div>
    </div>
  );
};