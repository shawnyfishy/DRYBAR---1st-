'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type DrawerType = 'menu' | 'contacts' | null;

interface MenuContextValue {
  isOpen: boolean;
  activeDrawer: DrawerType;
  open: () => void;
  openMenu: () => void;
  openContacts: () => void;
  close: () => void;
  toggleMenu: () => void;
  toggleContacts: () => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);

  const openMenu = useCallback(() => setActiveDrawer('menu'), []);
  const openContacts = useCallback(() => setActiveDrawer('contacts'), []);
  const close = useCallback(() => setActiveDrawer(null), []);

  const toggleMenu = useCallback(() => {
    setActiveDrawer((prev) => (prev === 'menu' ? null : 'menu'));
  }, []);

  const toggleContacts = useCallback(() => {
    setActiveDrawer((prev) => (prev === 'contacts' ? null : 'contacts'));
  }, []);

  return (
    <MenuContext.Provider
      value={{
        isOpen: activeDrawer !== null,
        activeDrawer,
        open: openMenu,
        openMenu,
        openContacts,
        close,
        toggleMenu,
        toggleContacts,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used within a MenuProvider');
  return ctx;
}
