import { useEffect, useContext} from "react";
import { useNavigate } from "react-router";
import { FormControl, FormLabel, Button, TextField } from "@mui/material";
import { AuthenticateContext } from "../../Context";

const LogIn = () => {
    const { handleLogin,
      userName, password,
      auth } = useContext(AuthenticateContext)

      const Navigate = useNavigate();

      useEffect(() => {
        if(auth) {
            Navigate('/chat')
        }
      }, [auth, Navigate])
      

    return (
        <FormControl>
          <FormLabel>Login!</FormLabel>
          <TextField required inputRef={userName} label="Username" />
          <TextField required inputRef={password} label="Password" />
          <Button type="submit" onClick={handleLogin}>Submit</Button>
        </FormControl>
      );
}

export default LogIn;