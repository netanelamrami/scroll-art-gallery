import React from "react"
import { Settings, LogOut, Bell, Users, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/useLanguage"
import { useMultiUserAuth } from "@/hooks/useMultiUserAuth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { NotificationBell } from "@/components/notifications/NotificationBell"

interface SettingsMenuProps {
  event?: any; // For NotificationBell
}

export function SettingsMenu({ event }: SettingsMenuProps) {
  const { language, t } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-700">
          <Settings className="h-5 w-5 text-white" />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={language === 'he' ? 'start' : 'end'} className="w-56 bg-background z-50">

        {/* Notifications */}
        <DropdownMenuItem asChild className="flex justify-between">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>{t('notifications.title') || 'התראות'}</span>
            </div>
            {event && <NotificationBell event={event} />}
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Settings */}
        <DropdownMenuItem asChild className="flex justify-between">
          <div className="flex items-center justify-between w-full">
            <span>{t('gallery.theme') || 'ערכת נושא'}</span>
            <ThemeToggle />
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="flex justify-between">
          <div className="flex items-center justify-between w-full">
            <span>{t('gallery.language') || 'שפה'}</span>
            <LanguageToggle />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}