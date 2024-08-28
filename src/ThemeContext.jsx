import { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Create the ThemeContext
const ThemeContext = createContext();

// Define dark and light themes
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "hsl(230, 17%, 14%)"
    }
  }
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "hsl(0, 0%, 100%)"
    }
  }
});

// Create a ThemeProvider component
export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // Memoize the theme to prevent unnecessary re-renders
  const selectedTheme = useMemo(() => (mode === "dark" ? darkTheme : lightTheme), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={selectedTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Create a custom hook to use the ThemeContext
export const useCustomTheme = () => useContext(ThemeContext);
