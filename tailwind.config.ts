import type { Config } from 'tailwindcss';
import theme, { fontFamily } from 'tailwindcss/defaultTheme';

const config = {
  prefix: '',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    fontFamily: {
      fontFamily: 'sans',
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        AeroFlux: 'var(--aeroflux)',
        Steps: 'var(--steps)',
        Raitor: 'var(--raitor)',
      },
      colors: {
        green: {
          DEFAULT: 'var(--green)',
          light: 'var(--green-light)',
          dark: 'var(--green-dark)',
        },
        orange: {
          DEFAULT: 'var(--orange)',
          light: 'var(--orange-light)',
          dark: 'var(--orange-dark)',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        leading: {
          DEFAULT: 'hsl(var(--leading))',
          light: 'hsl(var(--leading-light))',
          foreground: 'hsl(var(--leading-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          secondary: 'hsl(var(--card-secondary))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontSize: {
        '2xs': ['0.5rem', '1rem'],
      },
      width: {
        scrollScreen: 'calc(100vw - 17px)',
      },
      gridTemplateRows: {
        '2-to-1': 'minmax(0, 2fr) minmax(0, 1fr)',
      },
      gridTemplateColumns: {
        '2-to-1': 'minmax(0, 2fr) minmax(0, 1fr)',
      },
      boxShadow: {
        leading: '0 0 20px hsl(var(--leading))',
      },
      dropShadow: {
        'green-dark': '5px 5px 1px var(--green-dark)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-down': {
          from: { opacity: '0', top: '-20px' },
          to: { opacity: '1', top: '0' },
        },
        'fade-in-down-large': {
          from: { opacity: '0', top: '-100px' },
          to: { opacity: '1', top: '0' },
        },
      },
      animation: {
        entry: 'fade-in-down 0.5s ease 0s 1 forwards',
        'entry-delayed': 'fade-in-down 0.5s ease var(--delay) forwards',
        'entry-main': 'fade-in-down-large 0.5s ease 0s 1 forwards',
        'fade-in': 'fade-in 0.5s forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;

module.exports = config;
