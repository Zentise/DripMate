import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AppContext = createContext(null);

const LS_KEYS = {
  wardrobe: 'dripmate_wardrobe',
  fits: 'dripmate_fits',
  selected: 'dripmate_selected_item',
  theme: 'theme',
};

export const AppProvider = ({ children }) => {
  const [wardrobe, setWardrobe] = useState(() => {
    const raw = localStorage.getItem(LS_KEYS.wardrobe);
    return raw ? JSON.parse(raw) : [];
  });
  const [fits, setFits] = useState(() => {
    const raw = localStorage.getItem(LS_KEYS.fits);
    return raw ? JSON.parse(raw) : [];
  });
  const [selectedItem, setSelectedItem] = useState(() => {
    const raw = localStorage.getItem(LS_KEYS.selected);
    return raw ? JSON.parse(raw) : null;
  });
  const [theme, setTheme] = useState(() => localStorage.getItem(LS_KEYS.theme) || 'dark');

  useEffect(() => { localStorage.setItem(LS_KEYS.wardrobe, JSON.stringify(wardrobe)); }, [wardrobe]);
  useEffect(() => { localStorage.setItem(LS_KEYS.fits, JSON.stringify(fits)); }, [fits]);
  useEffect(() => { selectedItem ? localStorage.setItem(LS_KEYS.selected, JSON.stringify(selectedItem)) : localStorage.removeItem(LS_KEYS.selected); }, [selectedItem]);
  useEffect(() => {
    localStorage.setItem(LS_KEYS.theme, theme);
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
  }, [theme]);

  const value = useMemo(() => ({
    wardrobe, setWardrobe,
    fits, setFits,
    selectedItem, setSelectedItem,
    theme, setTheme,
  }), [wardrobe, fits, selectedItem, theme]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
