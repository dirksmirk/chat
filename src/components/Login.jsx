import { FormControl, FormLabel, Button, TextField } from "@mui/material";

const LogIn = () => {


  
    return (
        <FormControl>
          <FormLabel>Login!</FormLabel>
          <TextField required label="Username" />
          <TextField required label="Password" />
          <Button type="submit">Submit</Button>
        </FormControl>
      );
}

export default LogIn;