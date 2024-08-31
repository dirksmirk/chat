import { FormControl, FormLabel, Button, TextField, Avatar } from "@mui/material";
import { useContext } from "react";
import { AuthenticateContext } from "../../Context";

const Profile = () => {
  const { loginUser, mail,
          username, setUsername,
          email, setEmail,
          avatar, setAvatar,
   } = useContext(AuthenticateContext)
   console.log(username)
   console.log(email)
   console.log(avatar)

   const handleProfile = () => {
     setUsername(loginUser.current.value)
     setEmail(mail.current.value)
     setAvatar(loginUser.current.value)
  }
  
    return (
        <FormControl>
          <FormLabel>Change your settings</FormLabel>
          <TextField inputRef={loginUser} label={username} />
          <TextField inputRef={mail} label={email} />
          <Avatar alt="Profile picture" src={avatar} sx={{ width: 56, height: 56 }} />
          <Button type="submit" onClick={handleProfile}>Submit</Button>
        </FormControl>
      );
}

export default Profile;