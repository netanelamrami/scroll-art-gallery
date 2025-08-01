
import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Grid, LayoutGrid, Grid3x3, MoreVertical, Download, CheckSquare, Share2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { event } from "@/types/event";
import { NotificationBell } from "@/components/notifications/NotificationBell";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface GalleryHeaderProps {
  event: event;
  totalImages: number;
  columns: number;
  onColumnsChange: (columns: number) => void;
  onDownloadAll: () => void;
  onDownloadSelected: () => void;
  onToggleSelection: () => void;
  onShare: () => void;
  isSelectionMode: boolean;
  selectedCount: number;
}

export const GalleryHeader = ({
  event,
  totalImages,
  columns,
  onColumnsChange,
  onDownloadAll,
  onDownloadSelected,
  onToggleSelection,
  onShare,
  isSelectionMode,
  selectedCount
}: GalleryHeaderProps) => {
  const { t, language } = useLanguage();
  // Check if mobile for different column options
  const isMobile = window.innerWidth < 768;
  const columnOptions = isMobile 
    ? [
        { value: 1, icon: Grid, label: "עמודה 1" },
        { value: 2, icon: LayoutGrid, label: "עמודות 2" },
        { value: 3, icon: Grid3x3, label: "עמודות 3" },
      ]
    : [
        { value: 3, icon: Grid, label: "עמודות 3" },
        { value: 4, icon: LayoutGrid, label: "עמודות 4" },
        { value: 5, icon: Grid3x3, label: "עמודות 5" },
      ];

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm w-full">
      <div className="w-full px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {event.name} 
            </h1>
            {/* <p className="text-muted-foreground mt-1">
              {isSelectionMode && selectedCount > 0 
                ? `${selectedCount} ${t('gallery.selectedImages')} ${totalImages.toLocaleString()}`
                : `${totalImages.toLocaleString()} ${t('gallery.totalImages')}`
              }
            </p> */}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Selection mode indicator and controls */}
            {isSelectionMode && (
              <div className="flex items-center gap-2 mr-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDownloadSelected}
                  disabled={selectedCount === 0}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  {t('gallery.downloadSelected')} ({selectedCount})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleSelection}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  {t('gallery.cancelSelection')}
                </Button>
              </div>
            )}

            {/* Notification Bell */}
            {!isSelectionMode && (
              <NotificationBell event={event} />
            )}

            {/* More options menu */}
            {!isSelectionMode && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={language === 'he' ? 'start' : 'end'} className="w-48 bg-background z-50">
                  {/* Column options in dropdown */}
                  <div className="px-2 py-1.5">
                    <span className="text-sm font-medium text-muted-foreground">{t('gallery.columns')}</span>
                    <div className="flex items-center gap-1 mt-2">
                      {columnOptions.map(({ value, icon: Icon, label }) => (
                        <Button
                          key={value}
                          variant={columns === value ? "default" : "ghost"}
                          size="sm"
                          onClick={() => onColumnsChange(value)}
                          className={cn(
                            "gap-1 h-8 px-2",
                            columns === value && "bg-primary text-primary-foreground"
                          )}
                          title={label}
                        >
                          <Icon className="h-3 w-3" />
                          <span className="text-xs">{value}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onDownloadAll}>
                    <Download className="h-4 w-4 mr-2" />
                    {t('gallery.downloadAll')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onToggleSelection}>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    {t('gallery.selectImages')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    {t('gallery.share')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
