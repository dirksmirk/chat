import Header from './components/Header.jsx';
import SideNav from './components/SideNav.jsx';
import Switch from './components/Switch.jsx';
import SearchContextProvider from './Context';
import { CustomThemeProvider } from './ThemeContext.jsx';


function App() {
  return (
    <CustomThemeProvider>
      <SearchContextProvider>
        <div style={({ display: "flex" })}>
        <SideNav />
        <Switch />
        </div>
      </SearchContextProvider>
    </CustomThemeProvider>
  )
}

export default App;
