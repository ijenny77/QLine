/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        qline: {
          teal: "#0A6A6C",
          "teal-hover": "#085758",
          "teal-light": "#E6F1F1",
          navy: "#132A32",
          "navy-light": "#1E3C47",
          bg: "#F6F7F5",
          surface: "#FFFFFF",
          text: "#172126",
          muted: "#66757A",
          border: "#DDE3E2",
          "border-subtle": "#EDF1F0",
          success: "#167A5B",
          "success-light": "#E8F5F1",
          warning: "#B7791F",
          "warning-light": "#FEF7E8",
          danger: "#B83A3A",
          "danger-light": "#FDEEEE",
        },
      },
      fontFamily: {
        sans: ["Inter", "IBM Plex Sans", "system-ui", "sans-serif"],
        display: ["IBM Plex Sans", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        none: "0",
        sm: "2px",
        DEFAULT: "4px",
        md: "4px",
        lg: "6px",
        xl: "8px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(19, 42, 50, 0.05)",
        subtle: "0 1px 2px rgba(19, 42, 50, 0.04)",
        panel: "0 2px 8px rgba(19, 42, 50, 0.06)",
        dropdown: "0 4px 16px rgba(19, 42, 50, 0.10)",
      },
    },
  },
  plugins: [],
};
