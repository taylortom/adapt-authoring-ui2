import { createContext, useCallback, useContext, useState } from 'react'

const STORAGE_KEY = 'userPreferences'
const DEFAULTS = { sidebarOpen: true }

const UserPreferencesContext = createContext(null)

function loadPreferences () {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

function savePreferences (prefs) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
}

export function UserPreferencesProvider ({ children }) {
  const [prefs, setPrefs] = useState(loadPreferences)

  const updatePref = useCallback((key, value) => {
    setPrefs(prev => {
      const next = { ...prev, [key]: value }
      savePreferences(next)
      return next
    })
  }, [])

  const value = {
    sidebarOpen: prefs.sidebarOpen,
    setSidebarOpen: (value) => updatePref('sidebarOpen', value)
  }

  return <UserPreferencesContext.Provider value={value}>{children}</UserPreferencesContext.Provider>
}

export function usePreferences () {
  const context = useContext(UserPreferencesContext)
  if (!context) {
    throw new Error('usePreferences must be used within a UserPreferencesProvider')
  }
  return context
}
