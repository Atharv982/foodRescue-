import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core Brand Palette
        forest: '#285C45',
        evergreen: '#193D30',
        cream: '#F7F4EC',
        charcoal: '#202823',
        coral: '#F4775B',
        'muted-sage': '#DDE9DF',
        'soft-grey': '#E7E8E3',
        // Backward-compatible tokens mapped to brand palette
        ink: '#202823',
        moss: '#285C45',
        sage: '#DDE9DF',
        citrus: '#F1B84B',
        tomato: '#F4775B',
        // Topic-Specific Visual Identities
        logistics: {
          DEFAULT: '#2B6CB0',
          dark: '#1A365D',
          light: '#EBF8FF',
          border: '#BEE3F8',
        },
        shelter: {
          DEFAULT: '#6B46C1',
          dark: '#322659',
          light: '#FAF5FF',
          border: '#E9D8FD',
        },
        impact: {
          DEFAULT: '#059669',
          dark: '#064E3B',
          light: '#ECFDF5',
          border: '#A7F3D0',
        },
        venue: {
          DEFAULT: '#B45309',
          dark: '#78350F',
          light: '#FFFBEB',
          border: '#FDE68A',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        display: ['var(--font-manrope)', 'Manrope', 'sans-serif']
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        soft: '0 18px 55px rgba(28, 36, 31, 0.09)',
        card: '0 4px 20px -2px rgba(28, 36, 31, 0.06), 0 2px 6px -1px rgba(28, 36, 31, 0.04)',
        hover: '0 20px 40px -8px rgba(40, 92, 69, 0.16), 0 8px 16px -4px rgba(28, 36, 31, 0.06)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at 1px 1px, rgba(28,36,31,.09) 1px, transparent 0)',
        'mesh-warm': 'radial-gradient(at 0% 0%, rgba(221,233,223,0.6) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(247,244,236,0.8) 0px, transparent 50%)',
      }
    }
  },
  plugins: []
};

export default config;
