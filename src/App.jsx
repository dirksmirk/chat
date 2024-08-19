import Register from './components/register'
import Switch from './components/Switch.jsx';
import SearchContextProvider from './Context';

function App() {
  return (
    <SearchContextProvider >
      <Register />
    </SearchContextProvider>
  )
}

export default App;
