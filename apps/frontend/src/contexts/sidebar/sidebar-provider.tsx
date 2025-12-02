'use client'

import type React from 'react'

import { useState, useEffect } from 'react'

import { SidebarContext } from './sidebar-context'

export default function SidebarProvider({ children }: React.PropsWithChildren) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Carregar estado do localStorage na inicialização
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed')
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState))
    }
  }, [])

  // Salvar estado no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed))
  }, [isCollapsed])

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev)
  }

  const setCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed)
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}
