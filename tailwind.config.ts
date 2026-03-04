import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

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
        'sharp-black': 'var(--sharp-black)',
        'sharp-white': 'var(--sharp-white)',
        'pale-black': 'var(--pale-black)',
        'pale-white': 'var(--pale-white)',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          light: 'var(--primary-light)',
          dark: 'var(--primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
          light: 'var(--secondary-light)',
          dark: 'var(--secondary-dark)',
        },
        leading: {
          DEFAULT: 'var(--leading)',
          light: 'var(--leading-light)',
          foreground: 'var(--leading-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        button: {
          primary: {
            DEFAULT: 'var(--button-primary)',
            foreground: 'var(--button-primary-foreground)',
          },
          secondary: {
            DEFAULT: 'var(--button-secondary)',
            foreground: 'var(--button-secondary-foreground)',
          },
          leading: {
            DEFAULT: 'var(--button-leading)',
            foreground: 'var(--button-leading-foreground)',
          },
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          secondary: 'var(--card-secondary)',
          foreground: 'var(--card-foreground)',
        },
      },
      fontSize: {
        '2xs': ['0.5rem', '1rem'],
      },
      backgroundImage: {
        'product-grid': "url('assets/product-grid-bg.png')",
        'details-card': "url('assets/details-bg.jpg')",
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
        'primary-dark': '5px 5px 1px var(--primary-dark)',
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
  plugins: [require('@tailwindcss/container-queries')],
} satisfies Config;

module.exports = config;
