"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "@/contexts/theme-context"
import { useTranslation } from "react-i18next"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()

  const themes = [
    {
      value: "light" as const,
      label: t("theme.light"),
      icon: Sun,
    },
    {
      value: "dark" as const,
      label: t("theme.dark"),
      icon: Moon,
    },
    {
      value: "system" as const,
      label: t("theme.system"),
      icon: Monitor,
    },
  ]

  const currentTheme = themes.find((t) => t.value === theme)
  const CurrentIcon = currentTheme?.icon || Sun

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
          <CurrentIcon className="h-4 w-4" />
          <span className="sr-only">{t("theme.toggle")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {themeOption.label}
              {theme === themeOption.value && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
