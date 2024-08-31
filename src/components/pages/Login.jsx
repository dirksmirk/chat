import { useEffect, useContext} from "react";
import { useNavigate } from "react-router";
import { FormControl, FormLabel, Button, TextField, Checkbox } from "@mui/material";
import { AuthenticateContext } from "../../Context";

const LogIn = () => {
    const { handleLogin,
      loginUser, password,
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
          <TextField required inputRef={loginUser} label="Username" />
          <TextField required inputRef={password} label="Password" />
          <Checkbox label="I want to stay logged in" />
          <Button type="submit" onClick={handleLogin}>Submit</Button>
        </FormControl>
      );
}

export default LogIn;