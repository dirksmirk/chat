import { FormControl, FormLabel, Button, TextField } from "@mui/material";

const Profile = () => {

    return (
        <FormControl>
          <FormLabel>Change your settings</FormLabel>
          <TextField >Username</TextField>
          <TextField >e-mail</TextField>
          <TextField >picture</TextField>
          <Button type="submit">Submit</Button>
        </FormControl>
      );
}

export default Profile;