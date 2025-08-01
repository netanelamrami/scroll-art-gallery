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
  onAddUser?: () => void;
  onShowUserManager?: () => void;
  event?: any; // For NotificationBell
}

export function SettingsMenu({ onAddUser, onShowUserManager, event }: SettingsMenuProps) {
  const { language, t } = useLanguage();
  const { isAuthenticated, currentUser, hasMultipleUsers, logout } = useMultiUserAuth();
  
  console.log('SettingsMenu render - isAuthenticated:', isAuthenticated);
  console.log('SettingsMenu render - currentUser:', currentUser);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-700">
          <Settings className="h-5 w-5 text-white" />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={language === 'he' ? 'start' : 'end'} className="w-56 bg-background z-50">
        {/* User Section - only for authenticated users */}
        {isAuthenticated && currentUser && (
          <>
            <div className="px-2 py-2 border-b">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
                  <img 
                    src={currentUser.selfieImage} 
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {currentUser.name || currentUser.phone || currentUser.email}
                  </p>
                  {hasMultipleUsers && (
                    <p className="text-xs text-muted-foreground">
                      {t('common.activeUser') || 'משתמש פעיל'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* User Management */}
            {hasMultipleUsers && (
              <DropdownMenuItem onClick={onShowUserManager} className="gap-2">
                <Users className="h-4 w-4" />
                <span>{t('users.switchUser') || 'החלף משתמש'}</span>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem onClick={onAddUser} className="gap-2">
              <UserPlus className="h-4 w-4" />
              <span>{t('users.addUser') || 'הוסף משתמש'}</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
          </>
        )}

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

        {/* Logout - only for authenticated users */}
        {isAuthenticated && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="gap-2 text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" />
              <span>{t('auth.logout') || 'התנתק'}</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}