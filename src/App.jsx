import Header from './components/Header.jsx';
import Switch from './components/Switch.jsx';
import SearchContextProvider from './Context';
import { CustomThemeProvider } from './ThemeContext.jsx';


function App() {
  return (
    <CustomThemeProvider>
      <SearchContextProvider>
        <Header />
        <Switch />
      </SearchContextProvider>
    </CustomThemeProvider>
  )
}

export default App;
