import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Container, Switch } from "@mui/material";
import { useCustomTheme } from "../ThemeContext";

function SideNav() {
  const [collapsed, setCollapsed] = useState(true);
  const { mode, toggleTheme } = useCustomTheme();

  return (
    <Sidebar style={{ height: "100vh" }} collapsed={collapsed}>
      <Menu>
        <MenuItem
          icon={<MenuOutlinedIcon />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ textAlign: "center" }}
        >
          {" "}
          <h2>Sidebar</h2>
        </MenuItem>
        <NavLink to="/">
          <MenuItem icon={<HomeOutlinedIcon />}>Home</MenuItem>
        </NavLink>
        {/* Replace login with chat when logged in and vice versa */}
        <NavLink to="/log-in">
          <MenuItem icon={<PeopleOutlinedIcon />}>Login</MenuItem>
        </NavLink>
        {/* Remove register when logged in, instead display profile */}
        <NavLink to="/register">
          <MenuItem icon={<ContactsOutlinedIcon />}>Register</MenuItem>
        </NavLink>
        <NavLink to="/chat">
          <MenuItem icon={<ReceiptOutlinedIcon />}>Profile</MenuItem>
        </NavLink>
        
          {" "}
          <Switch checked={mode === "dark"} onChange={toggleTheme} />{" "}
        
      </Menu>
    </Sidebar>
  );
}

export default SideNav;
