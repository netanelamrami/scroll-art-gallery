import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Folder, Image, ChevronDown, ChevronUp, Download, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { DownloadModal } from "./DownloadModal";
import { GalleryImage } from "@/types/gallery";
import { Album } from "@/types/gallery";
import { useLanguage } from "@/hooks/useLanguage";

interface AlbumSectionProps {
  albums: Album[];
  onAlbumClick: (albumId: string) => void;
  selectedAlbum?: string;
  allImages?: GalleryImage[];
  getImagesByAlbum?: (albumId: string) => GalleryImage[];
}

export const AlbumSection = ({ albums = [], onAlbumClick, selectedAlbum, allImages = [], getImagesByAlbum }: AlbumSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadAlbumImages, setDownloadAlbumImages] = useState<GalleryImage[]>([]);
  const [downloadAlbumName, setDownloadAlbumName] = useState<string>("");
  const { language } = useLanguage();

  // Separate favorites album from API albums
  const favoritesAlbum = albums.find(album => album.id === 'favorites');
  const apiAlbums = albums.filter(album => album.id !== 'favorites');

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAlbumDownload = (albumId: string, imageCount: number) => {
    // Get album name and images for display
    let albumName = "";
    let albumImages: GalleryImage[] = [];
    
    if (albumId === 'favorites') {
      albumName = language === 'he' ? "נבחרות" : "Favorites";
      // For favorites, use a subset of images as mock data
      albumImages = allImages.slice(0, Math.min(imageCount, allImages.length));
    } else {
      const album = apiAlbums.find(a => a.id === albumId);
      albumName = album?.name || (language === 'he' ? "אלבום" : "Album");
      // Get images from album using the provided function
      albumImages = getImagesByAlbum ? getImagesByAlbum(albumId) : [];
    }
    
    setDownloadAlbumImages(albumImages);
    setDownloadAlbumName(albumName);
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
              <Star className="text-yellow-500 h-3 w-3 sm:h-4 sm:w-4 fill-current" />
              <span className="hidden sm:inline">{language === 'he' ? 'נבחרות' : 'Favorites'}</span>
              <span className="text-xs text-muted-foreground">({favoritesAlbum.imageCount})</span>
            </Button>
          )}
        </div>

        {/* Other albums on the right - collapsed view with expand button */}
        <div className="flex items-center gap-1 overflow-x-auto flex-shrink min-w-0">
          {/* Show selected album first if it's not in the initial visible albums */}
          {(() => {
            const visibleCount = window.innerWidth >= 768 ? 4 : 2; // More albums on larger screens
            let albumsToShow = [...apiAlbums];
            
            // If an album is selected and it's NOT in the first visible albums, bring it to front
            if (selectedAlbum && selectedAlbum !== 'favorites') {
              const selectedAlbumData = apiAlbums.find(album => album.id === selectedAlbum);
              const selectedAlbumIndex = apiAlbums.findIndex(album => album.id === selectedAlbum);
              
              // Only move to front if it's not already in the visible range
              if (selectedAlbumData && selectedAlbumIndex >= visibleCount) {
                albumsToShow = albumsToShow.filter(album => album.id !== selectedAlbum);
                albumsToShow.unshift(selectedAlbumData);
              }
            }
            
            return albumsToShow.slice(0, visibleCount).map((album) => (
              <Button
                key={album.id}
                variant={selectedAlbum === album.id ? "default" : "ghost"}
                className="h-8 px-2 text-xs whitespace-nowrap"
                onClick={() => onAlbumClick(album.id)}
              >
                {album.name}
              </Button>
            ));
          })()}
          {(() => {
            const visibleCount = window.innerWidth >= 768 ? 4 : 2;
            return apiAlbums.length > visibleCount && (
              <Button
                variant="ghost"
                className="h-8 px-2 text-xs flex-shrink-0"
                onClick={handleToggleExpand}
              >
                +{apiAlbums.length - visibleCount}
              </Button>
            );
          })()}
          {/* Expand button moved here to be close to albums */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleExpand}
            className="h-6 w-6 sm:h-8 sm:w-8 p-0 rounded-full hover:bg-accent ml-1"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
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
                   <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 flex items-center justify-center">
                     <Star className="text-lg sm:text-2xl text-yellow-500 fill-current" />
                   </div>
                  <div className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 bg-black/70 text-white text-xs px-1 sm:px-1.5 py-0.5 rounded">
                    {favoritesAlbum.imageCount}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-center">
                    {language === 'he' ? favoritesAlbum.name.replace('❤️ נבחרות', 'נבחרות') : 'Favorites'}
                  </span>
                </div>
              </Button>
              
              {/* Download button for favorites */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAlbumDownload('favorites', favoritesAlbum.imageCount);
                }}
              >
                <Download className="h-3 w-3 text-white" />
              </Button>
            </div>
          )}

          {/* API Albums */}
          {apiAlbums.map((album) => (
            <div key={album.id} className="relative">
              <Button
                variant={selectedAlbum === album.id ? "default" : "ghost"}
                className="h-auto p-1 sm:p-2 flex flex-col items-center group hover:bg-accent w-full"
                onClick={() => onAlbumClick(album.id)}
              >
                <div className="relative w-full aspect-square mb-1 overflow-hidden rounded-lg">
                  {album.thumbnail ? (
                    <img
                      src={album.thumbnail}
                      alt={album.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                      <Folder className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
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
                className="absolute top-2 right-2 h-6 w-6 p-0 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full"
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
        albumName={downloadAlbumName}
      />
    </div>
  );
};
