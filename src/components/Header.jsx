import { NavLink } from 'react-router-dom';
import { Container, Switch } from '@mui/material';
import { useCustomTheme } from '../ThemeContext';

const Header = () => {
    const { mode, toggleTheme } = useCustomTheme();

    return (
        <>
            <Container maxWidth="lg">
                <Switch checked={mode === "dark"} onChange={toggleTheme} />
            </Container>
            <Container>
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/log-in'>Login</NavLink>
                <NavLink to='/chat'>Chat</NavLink>
                <NavLink to='/register'>Register</NavLink>
            </Container>
        </>
    )
}

export default Header;