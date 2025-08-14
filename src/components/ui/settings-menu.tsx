import React from "react"
import { Settings, LogOut, Bell, Users, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/useLanguage"
import { useMultiUserAuth } from "@/contexts/AuthContext"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Languages } from "lucide-react"

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
  const { language, t ,setLanguage} = useLanguage();
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-700">
          <Settings className="h-5 w-5 text-white" />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={ 'end'} className="w-48 bg-background z-50">

        {/* Notifications */}
        {/* <DropdownMenuItem asChild className="flex justify-between">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>{t('notifications.title') || 'התראות'}</span>
            </div>
            {event && <NotificationBell event={event} />}
          </div>
        </DropdownMenuItem> */}

        {/* <DropdownMenuSeparator /> */}

        {/* Settings */}
        <DropdownMenuItem asChild className="flex justify-between" dir={language === 'he' ? 'rtl' : 'ltr'}
         onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          <div className="flex items-center justify-between w-full" >
          <span>{theme === "light" ? t('gallery.dark')  :t('gallery.light') }</span>
          <Button
              variant="ghost"
              size="icon"
              className="relative">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>

          </Button>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="flex justify-between" dir={language === 'he' ? 'rtl' : 'ltr'}
          onClick={() => setLanguage(language === "he" ? "en" : "he")}>
          <div className="flex items-center justify-between w-full">
            <span>{t('gallery.language') || 'שפה'}</span>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Languages className="h-4 w-4" />
              {language === "he" ? "EN" : "עב"}
            </Button>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}