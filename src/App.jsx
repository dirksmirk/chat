import Header from './components/Header.jsx';
import Switch from './components/Switch.jsx';
import SearchContextProvider from './Context';

function App() {
  return (
    <SearchContextProvider >
      <Header />
      <Switch />
    </SearchContextProvider>
  )
}

export default App;
