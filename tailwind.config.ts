
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Custom colors for our eco theme
				eco: {
					'50': '#f0fdf4',
					'100': '#dcfce7',
					'200': '#bbf7d0',
					'300': '#86efac',
					'400': '#4ade80',
					'500': '#22c55e',
					'600': '#16a34a',
					'700': '#15803d',
					'800': '#166534',
					'900': '#14532d',
					'950': '#052e16',
				},
				earth: {
					'50': '#f9f7f4',
					'100': '#f0ece5',
					'200': '#e0d6c9',
					'300': '#cbb9a5',
					'400': '#b69b80',
					'500': '#a58363',
					'600': '#8e6c50',
					'700': '#765942',
					'800': '#624a39',
					'900': '#523f32',
					'950': '#2c211a',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				serif: ['Merriweather', 'serif'],
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'leaf-sway': {
					'0%, 100%': { transform: 'rotate(-2deg)' },
					'50%': { transform: 'rotate(2deg)' },
				},
				'fade-in-up': {
					'0%': { 
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': { 
						opacity: '1',
						transform: 'translateY(0)'
					},
				},
				'pulse-green': {
					'0%, 100%': { 
						boxShadow: '0 0 0 0 rgba(22, 163, 74, 0.7)'
					},
					'50%': { 
						boxShadow: '0 0 0 10px rgba(22, 163, 74, 0)'
					},
				},
				'blur-in': {
					'0%': { 
						opacity: '0',
						filter: 'blur(10px)'
					},
					'100%': { 
						opacity: '1',
						filter: 'blur(0)'
					},
				},
				'slide-in': {
					'0%': { 
						transform: 'translateX(-20px)',
						opacity: '0' 
					},
					'100%': { 
						transform: 'translateX(0)',
						opacity: '1'
					},
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'leaf-sway': 'leaf-sway 3s ease-in-out infinite',
				'fade-in-up': 'fade-in-up 0.5s ease-out',
				'pulse-green': 'pulse-green 2s infinite',
				'blur-in': 'blur-in 0.5s ease-out',
				'slide-in': 'slide-in 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
