import { useEffect, useContext} from "react";
import { useNavigate } from "react-router";
import { Button, TextField, Typography, Box, Stack } from "@mui/material";
import { AuthenticateContext } from "../../Context";
import { ThemeContext } from "../../ThemeContext";

const LogIn = () => {
    const { handleLogin,
      loginUser, password, auth} = useContext(AuthenticateContext)

      const { ProfilePaper } = useContext(ThemeContext)


      const Navigate = useNavigate();

      useEffect(() => {
        if(auth) {
            Navigate('/chat')
        }
      }, [auth, Navigate])
      

    return (
    <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    }}
    >
      <ProfilePaper>
        <Stack>
          <Typography variant="h4" gutterBottom >Welcome to Dispatch</Typography>
          <Typography variant="subtitle2" gutterBottom >
            Use the below fields to login
          </Typography>
          <TextField required inputRef={loginUser} label="Username" sx={{ margin: "1%" }} />
          <TextField required inputRef={password} label="Password" sx={{ margin: "1%" }} />          
          <Button type="submit" onClick={handleLogin}>Submit</Button>
        </Stack>
      </ProfilePaper>
    </Box>
      );
}

export default LogIn;