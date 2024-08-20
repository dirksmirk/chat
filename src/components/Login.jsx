import { FormControl, FormLabel, Button, TextField } from "@mui/material";

const LogIn = () => {

    return (
        <FormControl>
          <FormLabel>Login!</FormLabel>
          <TextField >Username</TextField>
          <TextField >Password</TextField>
          <Button type="submit">Submit</Button>
        </FormControl>
      );
}

export default LogIn;