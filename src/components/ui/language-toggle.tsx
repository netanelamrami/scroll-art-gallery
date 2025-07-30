import React from "react"
import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/useLanguage"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "he" ? "en" : "he")}
      className="gap-2"
    >
      <Languages className="h-4 w-4" />
      {language === "he" ? "EN" : "עב"}
    </Button>
  )
}