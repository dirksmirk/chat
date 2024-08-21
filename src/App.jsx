import Switch from './components/Switch.jsx';
import SearchContextProvider from './Context';

function App() {
  return (
    <SearchContextProvider >
      <Switch />
    </SearchContextProvider>
  )
}

export default App;
