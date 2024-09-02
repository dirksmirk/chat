import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { Divider, Switch} from "@mui/material";
import { ThemeContext } from "../ThemeContext";
import { AuthenticateContext } from "../Context";

function SideNav() {
  const { logout } = useContext(AuthenticateContext)
  const [collapsed, setCollapsed] = useState(true);
  const { mode, toggleTheme } = useContext(ThemeContext);

  return (
    <Sidebar style={{ height: "100vh" }} collapsed={collapsed}>
      <Menu>
        <MenuItem
          icon={<MenuOutlinedIcon />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ textAlign: "center" }}
        >
          { localStorage.getItem('auth') ? (
              <h2>Hi user!</h2>
          ) : (
             <h2>Navigation</h2>
          )}
        </MenuItem>
        <NavLink to="/">
          <MenuItem icon={<HomeOutlinedIcon />}>Home</MenuItem>
        </NavLink>
        {/* Replace login with chat when logged in and vice versa */}
        { localStorage.getItem('auth') ? (
        <NavLink to="/chat">
          <MenuItem icon={<ChatOutlinedIcon />}>Chat</MenuItem>
        </NavLink>
        ) : ( 
          <NavLink to="/log-in">
          <MenuItem icon={<LoginOutlinedIcon />}>Login</MenuItem>
        </NavLink>
        )}
        {/* Remove register when logged in, instead display profile */}
        { localStorage.getItem('auth') ? (
          <NavLink to="/profile">
            <MenuItem icon={<AccountBoxOutlinedIcon />}>Profile</MenuItem>
          </NavLink>
        ) : (
          <NavLink to="/register">
            <MenuItem icon={<PersonAddAltOutlinedIcon />}>Register</MenuItem>
          </NavLink>
        )}
        {/* Insert logout button when logged in */}
        { localStorage.getItem('auth') && (
          <MenuItem
            icon={<LogoutIcon />}
            onClick={logout}
          >
            Logout
          </MenuItem>
        )}
        <Divider variant="middle" component="menu" />
          <Switch checked={mode === "dark"} onChange={toggleTheme} />
      </Menu>
    </Sidebar>
  );
}

export default SideNav;
