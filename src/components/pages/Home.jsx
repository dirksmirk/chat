import { 
    Stack, 
    Button, 
    Container, 
    Switch,
    Typography, 
} from "@mui/material";
import { useState } from "react";
import { NavLink } from 'react-router-dom';

const Home = () => {

    return (
      <Stack 
      spacing={2}
      sx={{
        justifyContent: "center",
        alignItems: "center"
      }}
      >
        <Typography variant="h1">Dispatch</Typography>
        <Typography variant="subtitle1"
        sx={{
          width: "50%"
        }}>- or des·patch </Typography>
        <Typography variant="subtitle1"
        sx={{
          width: "50%"
        }}> verb (used with object) </Typography>
        <Typography variant="subtitle1" display="block"
        sx={{
          width: "50%"
        }}> 1. to send off or away with speed, as a messenger, telegram, body of troops, etc. 
            2. to dismiss (a person), as after an audience.
            3. to put to death; kill:</Typography>

          The message was promptly dispatched.
        <Container sx={{
          width: "15%"
        }}>
          <NavLink to='/log-in'><Button>Login</Button></NavLink>
          <NavLink to='/register'><Button>Register</Button></NavLink>
        </Container>
      </Stack>
      );
}

export default Home;