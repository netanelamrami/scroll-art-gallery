
import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Grid, LayoutGrid, Grid3x3, MoreVertical, Download, CheckSquare, Share2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { event } from "@/types/event";
import { UserAvatarStack } from "@/components/ui/UserAvatarStack";
import { NotificationBell } from "../notifications/NotificationBell";

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
  onAuthComplete?: (userData: { contact: string; otp: string; selfieData: string; notifications: boolean }) => void;
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
  selectedCount,
  onAuthComplete,
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
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm w-full left-0 flex" dir={language === 'he' ? 'rtl' : 'ltr'} >
      <div className="w-full px-2 py-2 pb-1 left-0">
        <div className="flex items-center justify-between left-0">
          <div className="flex ">
            <h1 className="text-lg font-bold text-foreground left-0" dir="ltr">
              {event.name} 
            </h1>
          </div>
          <div className="flex items-center gap-1">

             {/* Notification Bell */}
            {!isSelectionMode && (
              <NotificationBell event={event}/>
            )}

          {/* User Management */}
          <div className="flex items-center ">
            <UserAvatarStack 
              event={event}
              onAuthComplete={onAuthComplete}
              className="ml-2"
              />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
