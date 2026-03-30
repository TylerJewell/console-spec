import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

const colors = {
  black: "#000000",
  white: "#ffffff",
  gray: {
    "50": "#fafafa",
    "100": "#f4f4f5",
    "200": "#e4e4e7",
    "300": "#d4d4d8",
    "400": "#a1a1aa",
    "500": "#71717a",
    "600": "#52525b",
    "700": "#3f3f46",
    "800": "#27272a",
    "900": "#18181b",
  },
};

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        xxs: "0.8125rem",
        xs: "0.875rem",
        sm: "0.9375rem",
        md: "1rem",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "spin-very-slow": "spin 6s linear infinite",
        "pulse-fast": "pulse-fast 1.5s ease-in-out infinite",
        "pulse-heavy": "pulse-heavy 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      boxShadow: {
        divider: "0 1px 0 0 rgba(255, 255, 255, .05)",
        dropdownmenu: "0 12px 36px 0 rgb(0, 0, 0, .6), 0 0 8px 0 rgb(0, 0, 0, .4)",
      },
      keyframes: {
        "pulse-fast": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".5" },
        },
        "pulse-heavy": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".2" },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        dividerWeight: "1px",
        disabledOpacity: 0.5,
        fontSize: {
          tiny: "0.875rem",
          small: "0.9375rem",
          medium: "1rem",
          large: "1.125rem",
        },
        lineHeight: {
          tiny: "1rem",
          small: "1.25rem",
          medium: "1.5rem",
          large: "1.75rem",
        },
        radius: {
          small: "3px",
          medium: "6px",
          large: "9px",
        },
        borderWidth: {
          small: "1px",
          medium: "1px",
          large: "1px",
        },
      },
      themes: {
        light: {
          layout: {
            hoverOpacity: 1,
            boxShadow: {
              small: "0px 0px 5px 0px rgb(0 0 0 / 0.02), 0px 2px 10px 0px rgb(0 0 0 / 0.06), 0px 0px 1px 0px rgb(0 0 0 / 0.3)",
              medium: "0px 0px 15px 0px rgb(0 0 0 / 0.03), 0px 2px 30px 0px rgb(0 0 0 / 0.08), 0px 0px 1px 0px rgb(0 0 0 / 0.3)",
              large: "0px 0px 30px 0px rgb(0 0 0 / 0.04), 0px 30px 60px 0px rgb(0 0 0 / 0.12), 0px 0px 1px 0px rgb(0 0 0 / 0.3)",
            },
          },
          colors: {
            background: colors.white,
            foreground: {
              "50": colors.gray[50], "100": colors.gray[100], "200": colors.gray[200],
              "300": colors.gray[300], "400": colors.gray[400], "500": colors.gray[500],
              "600": colors.gray[600], "700": colors.gray[700], "800": colors.gray[800],
              "900": colors.gray[900], DEFAULT: "#1a1a1a",
            },
            focus: "#02a4a7",
            divider: "rgba(17, 17, 17, 0.1)",
            overlay: colors.black,
            primary: { DEFAULT: "#f5b60b", foreground: colors.black },
            secondary: { DEFAULT: "#02a4a7", foreground: colors.white },
            content1: { DEFAULT: colors.white, foreground: colors.black },
            content2: { DEFAULT: colors.gray[100], foreground: colors.black },
            content3: { DEFAULT: colors.gray[200], foreground: colors.black },
            content4: { DEFAULT: colors.gray[300], foreground: colors.black },
            success: {
              50: "#f1f8ef", 100: "#dbecd6", 200: "#bdd9b3", 300: "#98c58a",
              400: "#73b162", 500: "#5aa547", 600: "#4a8c3a", 700: "#3a6f2d",
              800: "#2a5221", 900: "#1a3515", DEFAULT: "#5aa547", foreground: colors.white,
            },
            warning: { DEFAULT: "#e67d05", foreground: colors.white },
            danger: { DEFAULT: "#d9331a", foreground: colors.white },
          },
        },
        dark: {
          layout: {
            hoverOpacity: 1,
            boxShadow: {
              small: "0px 0px 5px 0px rgb(0 0 0 / 0.05), 0px 2px 10px 0px rgb(0 0 0 / 0.2), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)",
              medium: "0px 0px 15px 0px rgb(0 0 0 / 0.06), 0px 2px 30px 0px rgb(0 0 0 / 0.22), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)",
              large: "0px 0px 30px 0px rgb(0 0 0 / 0.07), 0px 30px 60px 0px rgb(0 0 0 / 0.26), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)",
            },
          },
          colors: {
            background: colors.black,
            foreground: {
              "900": colors.gray[50], "800": colors.gray[100], "700": colors.gray[200],
              "600": colors.gray[300], "500": colors.gray[400], "400": colors.gray[500],
              "300": colors.gray[600], "200": colors.gray[700], "100": colors.gray[800],
              "50": colors.gray[900], DEFAULT: colors.white,
            },
            focus: "#00d8dd",
            divider: "rgba(255, 255, 255, 0.15)",
            overlay: colors.black,
            primary: { DEFAULT: "#ffce4a", foreground: colors.black },
            secondary: { DEFAULT: "#00d8dd", foreground: colors.black },
            content1: { DEFAULT: colors.gray[900], foreground: colors.white },
            content2: { DEFAULT: colors.gray[800], foreground: colors.white },
            content3: { DEFAULT: colors.gray[700], foreground: colors.white },
            content4: { DEFAULT: colors.gray[600], foreground: colors.white },
            success: {
              50: "#f0fded", 100: "#d9facd", 200: "#b8f49e", 300: "#92ec6a",
              400: "#82e055", 500: "#72d35b", 600: "#5bb847", 700: "#459336",
              800: "#306e26", 900: "#1c4816", DEFAULT: "#72d35b", foreground: colors.black,
            },
            warning: { DEFAULT: "#ff9925", foreground: colors.black },
            danger: { DEFAULT: "#fa3823", foreground: colors.black },
          },
        },
      },
    }),
  ],
} satisfies Config;
