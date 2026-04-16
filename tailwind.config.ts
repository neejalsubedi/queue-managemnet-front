import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    fontSize: {
      xs: "12px",
      sm: "13px",
      base: "14px",
      lg: "16px",
      xl: "18px",
      "2xl": "20px",
      "3xl": "24px",
      "4xl": "28px",
      "5xl": "32px",
      "6xl": "36px",
      "7xl": "40px",
      "8xl": "44px",
      "9xl": "48px",
      "10xl": "52px",
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        /* card & popover */
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",

        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",

        /* primary / secondary / accent */
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",

        /* semantic colours */
        success: "hsl(var(--success))",
        "success-foreground": "hsl(var(--success-foreground))",
        warning: "hsl(var(--warning))",
        "warning-foreground": "hsl(var(--warning-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",

        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",

        /* borders / inputs / ring */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        /* sidebar tokens mapped to friendly names */
        sidebar: "hsl(var(--sidebar-background))",
        "sidebar-foreground": "hsl(var(--sidebar-foreground))",
        "sidebar-primary": "hsl(var(--sidebar-primary))",
        "sidebar-primary-foreground": "hsl(var(--sidebar-primary-foreground))",
        "sidebar-accent": "hsl(var(--sidebar-accent))",
        "sidebar-accent-foreground": "hsl(var(--sidebar-accent-foreground))",
        "sidebar-border": "hsl(var(--sidebar-border))",
        "sidebar-ring": "hsl(var(--sidebar-ring))",
      },
      borderRadius: {
        md: "var(--radius)",
        lg: "var(--radius)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "toast-bounce-out": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "1" },
          "30%": { transform: "translateY(-10px) scale(1.05)" },
          "100%": { transform: "translateY(50px) scale(0.9)", opacity: "0" },
        },
        "toast-bounce-in": {
          "0%": { transform: "translateY(50px) scale(0.9)", opacity: "0" },
          "60%": { transform: "translateY(-5px) scale(1.05)" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
      },
      animation: {
        "toast-out": "toast-bounce-out 0.4s ease-in-out forwards",
        "toast-in": "toast-bounce-in 0.4s ease-in-out forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
