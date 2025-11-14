"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  updateProfile: (data: Partial<User>) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  resetPassword: (email: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("pos-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (email === "admin@pos.com" && password === "admin123") {
        const userData = {
          id: "1",
          email: "admin@pos.com",
          name: "Admin User",
          role: "admin",
        }
        setUser(userData)
        localStorage.setItem("pos-user", JSON.stringify(userData))
        return true
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("pos-user")
  }

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("pos-user", JSON.stringify(updatedUser))
      return true
    } catch {
      return false
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return true
    } catch {
      return false
    }
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return true
    } catch {
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        updateProfile,
        changePassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
