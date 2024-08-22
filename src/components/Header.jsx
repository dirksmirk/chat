import { NavLink } from 'react-router-dom';

const Header = () => {

    return (
        <>
            <NavLink to='/profile'>Home</NavLink>
            <NavLink to='/log-in'>Login</NavLink>
            <NavLink to='/chat'>Chat</NavLink>
            <NavLink to='/'>Register</NavLink>
        </>
    )
}

export default Header;