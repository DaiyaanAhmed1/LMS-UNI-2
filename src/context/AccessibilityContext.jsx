import React, { createContext, useContext, useState } from 'react';

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [showBar, setShowBar] = useState(false);
  const [fontSize, setFontSize] = useState('medium'); // 'small', 'medium', 'large'
  const [fontFamily, setFontFamily] = useState('default'); // 'default', 'serif', 'sans-serif'
  const [colorTheme, setColorTheme] = useState('default'); // 'default', 'high-contrast', 'yellow', 'blue'

  const value = {
    showBar,
    setShowBar,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    colorTheme,
    setColorTheme,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
} 