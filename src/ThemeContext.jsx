import { createContext, useState, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Create the ThemeContext
export const ThemeContext = createContext();

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
const CustomThemeProvider = (props) => {
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
        {props.children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Create a custom hook to use the ThemeContext
export default CustomThemeProvider;
