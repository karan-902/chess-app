import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

export type ThemeMode = "dark" | "light";

const STORAGE_KEY = "sj_theme";

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
        return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
    } catch {
        return "dark";
    }
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<ThemeMode>(loadInitialMode);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", mode);
        try {
            localStorage.setItem(STORAGE_KEY, mode);
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
