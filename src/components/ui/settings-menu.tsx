import React from "react"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/useLanguage"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"

export function SettingsMenu() {
  const { language } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full  hover:bg-gray-700">
          <Settings className="h-5 w-5 text-white" />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={language === 'he' ? 'start' : 'end'} className="w-48 bg-background z-50">
        <DropdownMenuItem asChild className="flex justify-between">
          <div className="flex items-center justify-between w-full">
            <span>Theme</span>
            <ThemeToggle />
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="flex justify-between">
          <div className="flex items-center justify-between w-full">
            <span>Language</span>
            <LanguageToggle />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}