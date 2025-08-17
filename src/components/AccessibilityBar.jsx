import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

const fontSizes = [
  { label: 'A-', value: 'small' },
  { label: 'A', value: 'medium' },
  { label: 'A+', value: 'large' },
];

const fontFamilies = [
  { label: 'R', value: 'default' },
  { label: 'A', value: 'serif' },
];

const colorThemes = [
  { label: <span style={{background:'#fff',color:'#000',padding:'0 6px',borderRadius:2}}>A</span>, value: 'default' },
  { label: <span style={{background:'#000',color:'#fff',padding:'0 6px',borderRadius:2}}>A</span>, value: 'high-contrast' },
  { label: <span style={{background:'#FFD600',color:'#000',padding:'0 6px',borderRadius:2}}>A</span>, value: 'yellow' },
  { label: <span style={{background:'#1976D2',color:'#fff',padding:'0 6px',borderRadius:2}}>A</span>, value: 'blue' },
];

export default function AccessibilityBar() {
  const {
    fontSize, setFontSize,
    fontFamily, setFontFamily,
    colorTheme, setColorTheme
  } = useAccessibility();

  return (
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
      {fontFamilies.map(f => (
        <button
          key={f.value}
          onClick={() => setFontFamily(f.value)}
          style={{
            fontWeight: fontFamily === f.value ? 'bold' : 'normal',
            fontFamily: f.value === 'serif' ? 'serif' : 'inherit',
            marginRight: 4,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            outline: fontFamily === f.value ? '2px solid #1976D2' : 'none',
            color: '#222'
          }}
          aria-label={`Set font family ${f.label}`}
        >
          {f.label}
        </button>
      ))}
      <span style={{marginLeft:16,marginRight:8}}>Site color</span>
      {colorThemes.map(f => (
        <button
          key={f.value}
          onClick={() => setColorTheme(f.value)}
          style={{
            marginRight: 4,
            background: 'none',
            border: colorTheme === f.value ? '2px solid #1976D2' : '1px solid #ccc',
            borderRadius: 4,
            cursor: 'pointer',
            padding: 0,
            outline: 'none',
            minWidth: 32,
            minHeight: 32
          }}
          aria-label={`Set color theme ${f.value}`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
} 