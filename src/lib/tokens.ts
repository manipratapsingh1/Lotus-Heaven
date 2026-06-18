// Design tokens for Lotus Heaven Hotel

export const designTokens = {
  colors: {
    primary: '#0F6FFF', // Electric Blue
    primaryDark: '#0A4FCC',
    accent: '#7C3AED', // Violet
    accentDark: '#6D28D9',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    background: {
      start: '#071133',
      end: '#0B1224',
    },
    glass: 'rgba(255, 255, 255, 0.06)',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  radii: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  fonts: {
    primary: '"Inter", sans-serif',
    heading: '"Poppins", sans-serif',
  },
  shadows: {
    elegant: '0 10px 30px -10px rgba(15, 111, 255, 0.3)',
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  blur: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
};

// Function to apply design tokens as CSS variables
export const applyDesignTokens = () => {
  const root = document.documentElement;
  
  // Apply colors as HSL for better theming support
  root.style.setProperty('--color-primary', '213 100% 53%'); // #0F6FFF
  root.style.setProperty('--color-accent', '257 69% 54%'); // #7C3AED
  root.style.setProperty('--color-success', '158 64% 52%'); // #10B981
  root.style.setProperty('--color-warning', '38 92% 50%'); // #F59E0B
  root.style.setProperty('--color-danger', '0 84% 60%'); // #EF4444
};
