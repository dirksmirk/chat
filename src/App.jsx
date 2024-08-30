import SideNav from './components/SideNav.jsx';
import Switch from './components/Switch.jsx';


function App() {
  return (
      <div style={({ display: "flex" })}>
        <SideNav />
        <Switch />
      </div>
  )
}

export default App;
