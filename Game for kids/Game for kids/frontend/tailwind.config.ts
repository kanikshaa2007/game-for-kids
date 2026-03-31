import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Enhanced kids-friendly bright color palette with more vibrancy
        primary: {
          DEFAULT: '#FF6B6B', // Coral red - main action color
          light: '#FF8E8E',
          dark: '#FF4747',
          50: '#FFF5F5',
          100: '#FFE8E8',
          500: '#FF6B6B',
          600: '#FF4747',
          700: '#FF2323',
          900: '#CC0000',
        },
        secondary: {
          DEFAULT: '#4ECDC4', // Turquoise - secondary actions
          light: '#6EDBD4',
          dark: '#2FB5AC',
          50: '#F0FDFC',
          100: '#CCF7F4',
          500: '#4ECDC4',
          600: '#2FB5AC',
          700: '#1E9B91',
          900: '#0F5C56',
        },
        accent: {
          DEFAULT: '#FFE66D', // Bright yellow - highlights
          light: '#FFF0A0',
          dark: '#FFDD40',
          50: '#FFFEF0',
          100: '#FFFCDB',
          500: '#FFE66D',
          600: '#FFDD40',
          700: '#FFD119',
          900: '#E6B800',
        },
        success: {
          DEFAULT: '#95E1D3', // Mint green - correct answers
          light: '#B5EDE5',
          dark: '#75D5C5',
          50: '#F0FDF9',
          100: '#CCF7F0',
          500: '#95E1D3',
          600: '#75D5C5',
          700: '#4FC3B1',
          900: '#1F8A7A',
        },
        info: {
          DEFAULT: '#A8D8EA', // Sky blue - information
          light: '#C8E8F5',
          dark: '#88C0D0',
          50: '#F0F9FF',
          100: '#E0F2FE',
          500: '#A8D8EA',
          600: '#88C0D0',
          700: '#5BA0B8',
          900: '#2E5F75',
        },
        warning: {
          DEFAULT: '#F9ED69', // Soft yellow - warnings
          light: '#FBF5A0',
          dark: '#F7E540',
          50: '#FFFEF0',
          100: '#FFFCDB',
          500: '#F9ED69',
          600: '#F7E540',
          700: '#F5DD1A',
          900: '#D4B800',
        },
        error: {
          DEFAULT: '#FF8A80', // Soft red - errors
          light: '#FFB3A8',
          dark: '#FF6B5C',
          50: '#FFF5F4',
          100: '#FFE8E5',
          500: '#FF8A80',
          600: '#FF6B5C',
          700: '#FF4D3A',
          900: '#E62E1F',
        },
        background: {
          DEFAULT: '#F7FFF7', // Soft off-white
          card: '#FFFFFF',
          overlay: 'rgba(255, 255, 255, 0.9)',
        },
        // Fun gradient colors for special effects
        rainbow: {
          start: '#FF6B6B',
          middle: '#FFE66D',
          end: '#4ECDC4',
        },
        // Theme colors for different game types
        math: {
          primary: '#FF6B6B', // Red for math
          secondary: '#FFE66D', // Yellow accents
        },
        letters: {
          primary: '#4ECDC4', // Turquoise for letters
          secondary: '#95E1D3', // Mint accents
        },
        image: {
          primary: '#A8D8EA', // Blue for images
          secondary: '#FFE66D', // Yellow accents
        },
        rhyme: {
          primary: '#95E1D3', // Green for rhymes
          secondary: '#4ECDC4', // Turquoise accents
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Comic Sans MS', 'Chalkboard', 'sans-serif'],
        body: ['var(--font-body)', 'Nunito', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'confetti': 'confetti 1s ease-out',
        // New interactive animations for kids
        'float': 'float 3s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 2s infinite',
        'scale-bounce': 'scale-bounce 0.6s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'fade-in-scale': 'fade-in-scale 0.4s ease-out',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'jello': 'jello 0.9s ease-out',
        'rubber-band': 'rubber-band 0.8s ease-out',
        'tada': 'tada 1s ease-out',
        'swing': 'swing 1s ease-out',
        'wobble': 'wobble 1s ease-out',
        'flip': 'flip 1s ease-out',
        'rotate-in': 'rotate-in 0.6s ease-out',
        'zoom-in': 'zoom-in 0.6s ease-out',
        'bounce-in': 'bounce-in 0.8s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'fade-in-down': 'fade-in-down 0.6s ease-out',
        // Special kids animations
        'plane-fly': 'plane-fly 4s linear infinite',
        'tree-sway': 'tree-sway 3s ease-in-out infinite',
        'ball-bounce': 'ball-bounce 1.5s ease-in-out infinite',
        'star-twinkle': 'star-twinkle 2s ease-in-out infinite',
        'cloud-float': 'cloud-float 8s linear infinite',
        'rainbow-pulse': 'rainbow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        // New interactive keyframes
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'scale-bounce': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in-scale': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        jello: {
          '0%, 11.1%, 100%': { transform: 'translate3d(0,0,0)' },
          '22.2%': { transform: 'skewX(-12.5deg) skewY(-12.5deg)' },
          '33.3%': { transform: 'skewX(6.25deg) skewY(6.25deg)' },
          '44.4%': { transform: 'skewX(-3.125deg) skewY(-3.125deg)' },
          '55.5%': { transform: 'skewX(1.5625deg) skewY(1.5625deg)' },
          '66.6%': { transform: 'skewX(-0.78125deg) skewY(-0.78125deg)' },
          '77.7%': { transform: 'skewX(0.390625deg) skewY(0.390625deg)' },
          '88.8%': { transform: 'skewX(-0.1953125deg) skewY(-0.1953125deg)' },
        },
        'rubber-band': {
          '0%': { transform: 'scale3d(1,1,1)' },
          '30%': { transform: 'scale3d(1.25,0.75,1)' },
          '40%': { transform: 'scale3d(0.75,1.25,1)' },
          '50%': { transform: 'scale3d(1.15,0.85,1)' },
          '65%': { transform: 'scale3d(0.95,1.05,1)' },
          '75%': { transform: 'scale3d(1.05,0.95,1)' },
          '100%': { transform: 'scale3d(1,1,1)' },
        },
        tada: {
          '0%': { transform: 'scale3d(1,1,1)' },
          '10%, 20%': { transform: 'scale3d(0.9,0.9,0.9) rotate3d(0,0,1,-3deg)' },
          '30%, 50%, 70%, 90%': { transform: 'scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg)' },
          '40%, 60%, 80%': { transform: 'scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg)' },
          '100%': { transform: 'scale3d(1,1,1)' },
        },
        swing: {
          '20%': { transform: 'rotate3d(0,0,1,15deg)' },
          '40%': { transform: 'rotate3d(0,0,1,-10deg)' },
          '60%': { transform: 'rotate3d(0,0,1,5deg)' },
          '80%': { transform: 'rotate3d(0,0,1,-5deg)' },
          '100%': { transform: 'rotate3d(0,0,1,0deg)' },
        },
        wobble: {
          '0%': { transform: 'translateX(0%)' },
          '15%': { transform: 'translateX(-25%) rotate(-5deg)' },
          '30%': { transform: 'translateX(20%) rotate(3deg)' },
          '45%': { transform: 'translateX(-15%) rotate(-3deg)' },
          '60%': { transform: 'translateX(10%) rotate(2deg)' },
          '75%': { transform: 'translateX(-5%) rotate(-1deg)' },
          '100%': { transform: 'translateX(0%)' },
        },
        flip: {
          '0%': { transform: 'perspective(400px) rotate3d(0,1,0,-360deg)', 'animation-timing-function': 'ease-out' },
          '40%': { transform: 'perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-190deg)', 'animation-timing-function': 'ease-out' },
          '50%': { transform: 'perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-170deg)', 'animation-timing-function': 'ease-in' },
          '80%': { transform: 'perspective(400px) scale3d(0.95,0.95,0.95)', 'animation-timing-function': 'ease-in' },
          '100%': { transform: 'perspective(400px) scale3d(1,1,1)', 'animation-timing-function': 'ease-in' },
        },
        'rotate-in': {
          '0%': { transform: 'rotate3d(0,0,1,-200deg)', opacity: '0' },
          '100%': { transform: 'translate3d(0,0,0)', opacity: '1' },
        },
        'zoom-in': {
          '0%': { transform: 'scale3d(0.3,0.3,0.3)', opacity: '0' },
          '50%': { opacity: '1' },
        },
        'bounce-in': {
          '0%': { transform: 'scale3d(0.3,0.3,0.3)', opacity: '0' },
          '20%': { transform: 'scale3d(1.1,1.1,1.1)' },
          '40%': { transform: 'scale3d(0.9,0.9,0.9)' },
          '60%': { transform: 'scale3d(1.03,1.03,1.03)' },
          '80%': { transform: 'scale3d(0.97,0.97,0.97)' },
          '100%': { transform: 'scale3d(1,1,1)', opacity: '1' },
        },
        'slide-in-left': {
          '0%': { transform: 'translate3d(-100%,0,0)', opacity: '0' },
          '100%': { transform: 'translate3d(0,0,0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translate3d(100%,0,0)', opacity: '0' },
          '100%': { transform: 'translate3d(0,0,0)', opacity: '1' },
        },
        'fade-in-up': {
          '0%': { transform: 'translate3d(0,40px,0)', opacity: '0' },
          '100%': { transform: 'translate3d(0,0,0)', opacity: '1' },
        },
        'fade-in-down': {
          '0%': { transform: 'translate3d(0,-40px,0)', opacity: '0' },
          '100%': { transform: 'translate3d(0,0,0)', opacity: '1' },
        },
        // Special kids animations
        'plane-fly': {
          '0%': { transform: 'translateX(-100px) translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateX(25vw) translateY(-20px) rotate(2deg)' },
          '50%': { transform: 'translateX(50vw) translateY(10px) rotate(-1deg)' },
          '75%': { transform: 'translateX(75vw) translateY(-15px) rotate(1deg)' },
          '100%': { transform: 'translateX(100vw) translateY(0px) rotate(0deg)' },
        },
        'tree-sway': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '75%': { transform: 'rotate(-1deg)' },
        },
        'ball-bounce': {
          '0%, 100%': { transform: 'translateY(0) scaleY(1)' },
          '50%': { transform: 'translateY(-30px) scaleY(0.8)' },
        },
        'star-twinkle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.2)' },
        },
        'cloud-float': {
          '0%': { transform: 'translateX(-100px)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        'rainbow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'button': '0 4px 15px rgba(0, 0, 0, 0.1)',
        'button-hover': '0 6px 20px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
