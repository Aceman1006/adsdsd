import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b0e",
        ink2: "#14141a",
        ink3: "#1d1d26",
        line: "#2a2a35",
        paper: "#f4ead3",
        paper2: "#e8d9b5",
        gold: "#f2b632",
        seal: "#e5484d",
        mint: "#3ee6a0",
        mute: "#8b8a99",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["'Space Grotesk'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        chunk: "4px 4px 0 0 #000",
        chunkgold: "4px 4px 0 0 #f2b632",
      },
      keyframes: {
        floaty: { "0%,100%": { transform: "translateY(0) rotate(-2deg)" }, "50%": { transform: "translateY(-10px) rotate(1deg)" } },
        stamp: { "0%": { transform: "scale(2.4) rotate(-20deg)", opacity: "0" }, "60%": { transform: "scale(.9) rotate(-12deg)", opacity: "1" }, "100%": { transform: "scale(1) rotate(-12deg)", opacity: "1" } },
        drop: { "0%": { transform: "translateY(-30px)", opacity: "0" }, "20%": { opacity: "1" }, "100%": { transform: "translateY(120px)", opacity: "0" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        stamp: "stamp .6s cubic-bezier(.2,.8,.2,1.2) both",
        drop: "drop 2.4s linear infinite",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
