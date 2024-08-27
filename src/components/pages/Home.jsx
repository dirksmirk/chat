import { 
    Stack, 
    Button, 
    Container, 
    Switch, 
} from "@mui/material";
import { useState } from "react";
import { NavLink } from 'react-router-dom';
import LogIn from "./Login";
import Register from "./register";

const Home = () => {

    return (
      <Stack>
        <NavLink to='/log-in'><Button>Login</Button></NavLink>
        <NavLink to='/register'><Button>Register</Button></NavLink>
      </Stack>
      );
}

export default Home;