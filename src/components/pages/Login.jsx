import { useEffect, useContext} from "react";
import { useNavigate } from "react-router";
import { FormControl, FormLabel, Button, TextField, Typography, Box } from "@mui/material";
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
        <FormControl>
          <FormLabel>Welcome to Dispatch</FormLabel>
          <Typography>
            Use the below fields to login
          </Typography>
          <TextField required inputRef={loginUser} label="Username" />
          <TextField required inputRef={password} label="Password" />          
          <Button type="submit" onClick={handleLogin}>Submit</Button>
        </FormControl>
      </ProfilePaper>
    </Box>
      );
}

export default LogIn;