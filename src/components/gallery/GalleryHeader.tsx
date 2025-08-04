
import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Grid, LayoutGrid, Grid3x3, MoreVertical, Download, CheckSquare, Share2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { event } from "@/types/event";
import { UserAvatarStack } from "@/components/ui/UserAvatarStack";


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
  onAuthComplete
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
      <div className="w-full px-4 py-2 pb-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">
              {event.name} 
            </h1>
          </div>
          
          {/* User Management */}
          <div className="flex items-center gap-2">
            <UserAvatarStack 
              event={event}
              onAuthComplete={onAuthComplete}
              className="ml-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
