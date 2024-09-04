import { useEffect, useContext} from "react";
import { useNavigate } from "react-router";
import { FormControl, FormLabel, Button, TextField, Typography } from "@mui/material";
import { AuthenticateContext } from "../../Context";

const LogIn = () => {
    const { handleLogin,
      loginUser, password, auth} = useContext(AuthenticateContext)

      const Navigate = useNavigate();

      useEffect(() => {
        if(auth) {
            Navigate('/chat')
        }
      }, [auth, Navigate])
      

    return (
        <FormControl>
          <FormLabel>Welcome to Dispatch</FormLabel>
          <Typography>
            Use the below fields to login
          </Typography>
          <TextField required inputRef={loginUser} label="Username" />
          <TextField required inputRef={password} label="Password" />          
          <Button type="submit" onClick={handleLogin}>Submit</Button>
        </FormControl>
      );
}

export default LogIn;