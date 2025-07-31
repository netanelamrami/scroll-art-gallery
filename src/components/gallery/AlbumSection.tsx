import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Folder, Image, ChevronDown, ChevronUp, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { DownloadModal } from "./DownloadModal";
import { GalleryImage } from "@/types/gallery";

interface Album {
  id: string;
  name: string;
  imageCount: number;
  thumbnail?: string;
}

interface AlbumSectionProps {
  albums: Album[];
  onAlbumClick: (albumId: string) => void;
  selectedAlbum?: string;
  allImages?: GalleryImage[];
}

const mockAlbums: Album[] = [
  { id: "reception", name: "קבלת פנים", imageCount: 67, thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=300&fit=crop" },
  { id: "dance", name: "ריקודים", imageCount: 89, thumbnail: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&h=300&fit=crop" },
  { id: "outdoor", name: "צילומי חוץ", imageCount: 45, thumbnail: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&h=300&fit=crop" },
  { id: "couples", name: "צילומי זוג", imageCount: 23, thumbnail: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=300&h=300&fit=crop" },
  { id: "family", name: "משפחה", imageCount: 34, thumbnail: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=300&h=300&fit=crop" },
];

export const AlbumSection = ({ albums = [], onAlbumClick, selectedAlbum, allImages = [] }: AlbumSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadAlbumImages, setDownloadAlbumImages] = useState<GalleryImage[]>([]);

  // Separate favorites album from others
  const favoritesAlbum = albums.find(album => album.id === 'favorites');
  const otherAlbums = [...mockAlbums]; // Use mock albums for now

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAlbumDownload = (albumId: string, imageCount: number) => {
    // For now, use all images as album images
    // You can customize this to filter by album later
    const albumImages = allImages; 
    setDownloadAlbumImages(albumImages);
    setShowDownloadModal(true);
  };

  return (
    <div className="w-full px-2 mb-2 sticky top-16 bg-background/95 backdrop-blur-sm border-b border-border pb-2 z-40">
      {/* Collapsed view - horizontal bar */}
      <div className="flex items-center justify-between gap-2 mb-2 overflow-hidden">
        {/* Favorites album on the left */}
        <div className="flex items-center flex-shrink-0">
          {favoritesAlbum && (
            <Button
              variant={selectedAlbum === 'favorites' ? "default" : "ghost"}
              className="h-8 px-2 text-xs sm:px-3 sm:text-sm flex items-center gap-1 sm:gap-2 whitespace-nowrap"
              onClick={() => onAlbumClick('favorites')}
            >
              <span className="text-red-500 text-sm sm:text-base">❤️</span>
              <span className="hidden sm:inline">נבחרות</span>
              <span className="text-xs text-muted-foreground">({favoritesAlbum.imageCount})</span>
            </Button>
          )}
        </div>

        {/* Center section with expand button */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleExpand}
            className="h-6 w-6 sm:h-8 sm:w-8 p-0 rounded-full hover:bg-accent"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
        </div>

        {/* Other albums on the right - collapsed view */}
        <div className="flex items-center gap-1 overflow-x-auto flex-shrink min-w-0">
          {otherAlbums.slice(0, 2).map((album) => (
            <div key={album.id} className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant={selectedAlbum === album.id ? "default" : "ghost"}
                className="h-8 px-2 text-xs whitespace-nowrap"
                onClick={() => onAlbumClick(album.id)}
              >
                {album.name}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-primary/10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAlbumDownload(album.id, album.imageCount);
                }}
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {otherAlbums.length > 2 && (
            <Button
              variant="ghost"
              className="h-8 px-2 text-xs flex-shrink-0"
              onClick={handleToggleExpand}
            >
              +{otherAlbums.length - 2}
            </Button>
          )}
        </div>
      </div>

      {/* Expanded view - full album grid */}
      {isExpanded && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 mt-4">
          {/* Favorites album first */}
          {favoritesAlbum && (
            <div className="relative">
              <Button
                variant={selectedAlbum === 'favorites' ? "default" : "ghost"}
                className="h-auto p-1 sm:p-2 flex flex-col items-center group hover:bg-accent w-full"
                onClick={() => onAlbumClick('favorites')}
              >
                <div className="relative w-full aspect-square mb-1 overflow-hidden rounded-lg">
                  <div className="w-full h-full bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900 flex items-center justify-center">
                    <span className="text-lg sm:text-2xl">❤️</span>
                  </div>
                  <div className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 bg-black/70 text-white text-xs px-1 sm:px-1.5 py-0.5 rounded">
                    {favoritesAlbum.imageCount}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-center">{favoritesAlbum.name.replace('❤️ נבחרות', 'נבחרות')}</span>
                </div>
              </Button>
              
              {/* Download button for favorites */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0 bg-black/20 hover:bg-black/40 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAlbumDownload('favorites', favoritesAlbum.imageCount);
                }}
              >
                <Download className="h-3 w-3 text-white" />
              </Button>
            </div>
          )}

          {/* Other albums */}
          {otherAlbums.map((album) => (
            <div key={album.id} className="relative">
              <Button
                variant={selectedAlbum === album.id ? "default" : "ghost"}
                className="h-auto p-1 sm:p-2 flex flex-col items-center group hover:bg-accent w-full"
                onClick={() => onAlbumClick(album.id)}
              >
                <div className="relative w-full aspect-square mb-1 overflow-hidden rounded-lg">
                  <img
                    src={album.thumbnail}
                    alt={album.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 bg-black/70 text-white text-xs px-1 sm:px-1.5 py-0.5 rounded">
                    {album.imageCount}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Folder className="w-3 h-3 text-muted-foreground hidden sm:block" />
                  <span className="text-xs font-medium text-center">{album.name}</span>
                </div>
              </Button>
              
              {/* Download button for each album */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0 bg-black/20 hover:bg-black/40 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAlbumDownload(album.id, album.imageCount);
                }}
              >
                <Download className="h-3 w-3 text-white" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Download Modal */}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        imageCount={downloadAlbumImages.length}
        images={downloadAlbumImages}
        autoDownload={downloadAlbumImages.length <= 20}
      />
    </div>
  );
};
