import { createContext } from "react";

export const ThemeProviderContext = createContext({
  theme: "light",
  setTheme: () => {}
});
