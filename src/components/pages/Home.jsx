import { Stack, Button, Container, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <Stack
      spacing={2}
      sx={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h1">Dispatch</Typography>
      <Container
        sx={{
          justifyContent: "center",
          alignItems: "center",
          width: "50%",
        }}
      >
        <Typography variant="subtitle1">- or des·patch </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            width: "50%",
          }}
        >
          {" "}
          verb (used with object){" "}
        </Typography>
        <Typography
          variant="subtitle1"
          display="block"
          sx={{
            width: "50%",
          }}
        >
          {" "}
          1. to send off or away with speed, as a messenger, telegram, body of
          troops, etc.{" "}
        </Typography>
        <Typography>
          {" "}
          2. to dismiss (a person), as after an audience.
        </Typography>
        <Typography> 3. to put to death; kill:</Typography>
        <Typography>The message was promptly dispatched.</Typography>
      </Container>
      <Container
        spacing={3}
        sx={{
          alignItems: "center",
          justifyContent: "space-evenly",
          width: "15%",
        }}
      >
        <NavLink to="/log-in">
          <Button>Login</Button>
        </NavLink>
        <NavLink to="/register">
          <Button>Register</Button>
        </NavLink>
      </Container>
    </Stack>
  );
};

export default Home;
