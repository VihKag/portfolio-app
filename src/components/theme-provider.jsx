"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext(undefined)

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "theme" }) {
  const [theme, setThemeState] = useState(() => {
    const stored = localStorage.getItem(storageKey)
    return stored || defaultTheme
  })

  useEffect(() => {
    const root = document.documentElement
    const actualTheme =
      theme === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : theme

    root.classList.remove("light", "dark")
    root.classList.add(actualTheme)
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  const setTheme = (newTheme) => {
    setThemeState(newTheme)
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
