import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

const fontSizes = [
  { label: 'A-', value: 'small' },
  { label: 'A', value: 'medium' },
  { label: 'A+', value: 'large' },
];

const fontFamilies = [
  { 
    label: 'Default', 
    value: 'default',
    preview: 'Aa',
    description: 'Helvetica font (clean sans-serif)'
  },
  { 
    label: 'Dyslexic', 
    value: 'dyslexic',
    preview: 'Aa',
    description: 'Dyslexic-friendly fonts'
  },
];

const colorThemes = [
  { label: <span style={{background:'#fff',color:'#000',padding:'0 6px',borderRadius:2}}>A</span>, value: 'default' },
  { label: <span style={{background:'#000',color:'#fff',padding:'0 6px',borderRadius:2}}>A</span>, value: 'high-contrast' },
  { label: <span style={{background:'#FFD600',color:'#000',padding:'0 6px',borderRadius:2}}>A</span>, value: 'yellow' },
  { label: <span style={{background:'#1976D2',color:'#fff',padding:'0 6px',borderRadius:2}}>A</span>, value: 'blue' },
];

export default function AccessibilityBar() {
  const [showFontPopup, setShowFontPopup] = useState(false);
  const {
    fontSize, setFontSize,
    fontFamily, setFontFamily,
    colorTheme, setColorTheme
  } = useAccessibility();

  const handleFontChange = (newFontFamily) => {
    setFontFamily(newFontFamily);
    setShowFontPopup(false);
  };

  const getCurrentFontLabel = () => {
    const currentFont = fontFamilies.find(f => f.value === fontFamily);
    return currentFont ? currentFont.label : 'Default';
  };

  return (
    <>
      <div style={{
        width: '100%',
        background: '#f8f9fa',
        borderBottom: '1px solid #e0e0e0',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        zIndex: 1000,
        position: 'sticky',
        top: 0
      }}>
        <span style={{marginRight:8}}>Font size</span>
        {fontSizes.map(f => (
          <button
            key={f.value}
            onClick={() => setFontSize(f.value)}
            style={{
              fontWeight: fontSize === f.value ? 'bold' : 'normal',
              fontSize: f.value === 'small' ? 14 : f.value === 'large' ? 20 : 16,
              marginRight: 4,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              outline: fontSize === f.value ? '2px solid #1976D2' : 'none',
              color: '#222'
            }}
            aria-label={`Set font size ${f.label}`}
          >
            {f.label}
          </button>
        ))}
        
        <span style={{marginLeft:16,marginRight:8}}>Font</span>
        <button
          onClick={() => setShowFontPopup(!showFontPopup)}
          style={{
            padding: '6px 12px',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: 4,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            color: '#222',
            minWidth: 120
          }}
          aria-label="Change font family"
        >
          <span style={{fontSize: 16}}>🔤</span>
          <span>{getCurrentFontLabel()}</span>
          <span style={{fontSize: 12}}>▼</span>
        </button>

        <span style={{marginLeft:16,marginRight:8}}>Site color</span>
        {colorThemes.map(f => (
          <button
            key={f.value}
            onClick={() => {
              console.log('Color theme button clicked:', f.value);
              setColorTheme(f.value);
            }}
            style={{
              marginRight: 4,
              background: 'none',
              border: colorTheme === f.value ? '2px solid #1976D2' : '1px solid #ccc',
              borderRadius: 4,
              cursor: 'pointer',
              padding: 0,
              outline: 'none',
              minWidth: 32,
              minHeight: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label={`Set color theme ${f.value}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Font Popup */}
      {showFontPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={() => setShowFontPopup(false)}>
          <div style={{
            background: '#fff',
            borderRadius: 8,
            padding: 20,
            minWidth: 300,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{margin: '0 0 16px 0', color: '#333'}}>Choose Font</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
              {fontFamilies.map(font => (
                <button
                  key={font.value}
                  onClick={() => handleFontChange(font.value)}
                  style={{
                    padding: '12px 16px',
                    background: fontFamily === font.value ? '#e3f2fd' : '#f8f9fa',
                    border: fontFamily === font.value ? '2px solid #1976D2' : '1px solid #e0e0e0',
                    borderRadius: 6,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    transition: 'all 0.2s',
                    fontFamily: font.value === 'poppins' ? '"Poppins", sans-serif' : 
                               font.value === 'dyslexic' ? 'Lexend, monospace' : 
                               'system-ui, sans-serif'
                  }}
                >
                  <span style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: fontFamily === font.value ? '#1976D2' : '#666'
                  }}>
                    {font.preview}
                  </span>
                  <div>
                    <div style={{
                      fontWeight: 'bold',
                      color: fontFamily === font.value ? '#1976D2' : '#333'
                    }}>
                      {font.label}
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: '#666',
                      marginTop: 2
                    }}>
                      {font.description}
                    </div>
                  </div>
                  {fontFamily === font.value && (
                    <span style={{marginLeft: 'auto', color: '#1976D2'}}>✓</span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFontPopup(false)}
              style={{
                marginTop: 16,
                padding: '8px 16px',
                background: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: 4,
                cursor: 'pointer',
                color: '#666'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
} 