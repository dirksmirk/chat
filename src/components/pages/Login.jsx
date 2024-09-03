import { useEffect, useContext} from "react";
import { useNavigate } from "react-router";
import { FormControl, FormLabel, Button, TextField } from "@mui/material";
import { AuthenticateContext } from "../../Context";

const LogIn = () => {
    const { handleLogin,
      loginUser, password } = useContext(AuthenticateContext)

      const Navigate = useNavigate();
      const authenticated = localStorage.getItem('auth');

      useEffect(() => {
        if(authenticated) {
            Navigate('/chat')
        }
      }, [authenticated, Navigate])
      

    return (
        <FormControl>
          <FormLabel>Login!</FormLabel>
          <TextField required inputRef={loginUser} label="Username" />
          <TextField required inputRef={password} label="Password" />          
          <Button type="submit" onClick={handleLogin}>Submit</Button>
        </FormControl>
      );
}

export default LogIn;