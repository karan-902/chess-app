import {
 createContext,
 useContext,
 useEffect,
 useState,
 type ReactNode,
} from "react";
import type { ThemeMode } from "@gopvp/common/src/types/component";
import { THEME_STORAGE_KEY } from "@gopvp/app/src/constants/storageKey";

interface IThemeContext {
 mode: ThemeMode;
 toggleTheme: () => void;
}

const ThemeContext = createContext<IThemeContext>({
 mode: "dark",
 toggleTheme: () => {},
});

function loadInitialMode(): ThemeMode {
 try {
  return localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
 } catch {
  return "dark";
 }
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
 const [mode, setMode] = useState<ThemeMode>(loadInitialMode);

 useEffect(() => {
  document.documentElement.setAttribute("data-theme", mode);
  try {
   localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {}
 }, [mode]);

 const toggleTheme = () => setMode((m) => (m === "dark" ? "light" : "dark"));

 return (
  <ThemeContext.Provider value={{ mode, toggleTheme }}>
   {children}
  </ThemeContext.Provider>
 );
}

export function useAppTheme() {
 return useContext(ThemeContext);
}
