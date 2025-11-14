"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"

type Language = "en" | "vi"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, options?: any) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation()
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    // Initialize language from i18n
    setLanguageState(i18n.language as Language)
  }, [i18n.language])

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang)
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
