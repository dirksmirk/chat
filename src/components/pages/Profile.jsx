import {
  FormControl,
  FormLabel,
  Button,
  TextField,
  Avatar,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useContext, useState } from "react";
import { AuthenticateContext } from "../../Context";

const Profile = () => {
  const {
    loginUser,
    mail,
    username,
    setUsername,
    email,
    setEmail,
    avatar,
    setAvatar,
  } = useContext(AuthenticateContext);

  const [file, setFile] = useState(null);
  const decodedToken = JSON.parse(localStorage.getItem("decodedToken"));

  const newPicture = (picture) => {
    setFile(picture);
    console.info("User uploaded a new picture!")
  };

  const pictureUpload = () => {
    var form = new FormData();
    form.append("image", file);

    fetch(
      `https://api.imgbb.com/1/upload?key=adfd1b1f8175bdf00cac17e79f8ed897`,
      {
        method: "POST",
        body: form,
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("Image uploaded successfully:", response);
        } else {
          console.error("Error uploading image:", response);
        }
        return response.json();
      })
      .then((data) => {
        setAvatar(data.data.url);
      })
      .catch((error) => {
        console.error("Network error: ", error);
      });
  };

  const handleProfile = () => {
    setUsername(loginUser.current.value);
    setEmail(mail.current.value);

    fetch("https://chatify-api.up.railway.app/user", {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        userId: decodedToken.id,
        updatedData: {
          username: username,
          email: email,
          avatar: avatar,
        },
      }),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("There was an error updating the profile: ", response);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Successfully updated your profile" + JSON.stringify(data));
        localStorage.setItem(
          "decodedToken",
          JSON.stringify({
            ...decodedToken,
            user: username,
            email: email,
            avatar: avatar,
          })
        );
      })
      .catch((error) => {
        console.error("Error connecting to server: ", error);
      });
  };

  return (
    <FormControl>
      <FormLabel>Change your settings</FormLabel>
      <TextField inputRef={loginUser} label={decodedToken.user} />
      <TextField inputRef={mail} label={decodedToken.email} />
      <Avatar
        alt="Profile picture"
        src={decodedToken.avatar}
        sx={{ width: 56, height: 56 }}
        onClick={pictureUpload}
      />
      <MuiFileInput
        size="small"
        inputProps={{ accept: ".png, .jpeg, .jpg" }}
        value={file}
        onChange={newPicture}
      />
      <Button type="submit" onClick={handleProfile}>
        Submit
      </Button>
    </FormControl>
  );
};

export default Profile;
