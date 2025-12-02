import { createContext } from 'react'

interface SidebarContextType {
  isCollapsed: boolean
  toggleSidebar: () => void
  setCollapsed: (collapsed: boolean) => void
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined)
