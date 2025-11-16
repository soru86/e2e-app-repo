import { useContext } from "react";
import { ThemeContext } from "./theme-provider";

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("ThemeContext missing. Wrap your app with <ThemeProvider />.");
  return ctx;
}


