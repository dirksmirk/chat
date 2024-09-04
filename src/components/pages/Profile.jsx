import {
  FormControl,
  FormLabel,
  Button,
  TextField,
  Avatar,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  styled
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { MuiFileInput } from "mui-file-input";
import { useContext, useRef, useState } from "react";
import { AuthenticateContext } from "../../Context";

const Profile = () => {
  const {
    loginUser,
    mail,
    avatar,
    setAvatar,
  } = useContext(AuthenticateContext);

  const deleteUser = useRef();
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false)
  const decodedToken = JSON.parse(localStorage.getItem("decodedToken"));

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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
    const updatedUsername = loginUser.current.value;
    const updatedEmail = mail.current.value;

    fetch("https://chatify-api.up.railway.app/user", {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        userId: decodedToken.id,
        updatedData: {
          username: updatedUsername,
          email: updatedEmail,
          avatar: avatar
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
        console.log(data)
        localStorage.setItem(
          "decodedToken",
          JSON.stringify({
            ...decodedToken,
            user: updatedUsername,
            email: updatedEmail,
            avatar: avatar,
          })
        );
      })
      .catch((error) => {
        console.error("Error connecting to server: ", error);
      })
      .finally(() => {
        console.log(localStorage.getItem("decodedToken"))
      })
  };

  const DeleteProfile = () => {
    if (decodedToken.user === deleteUser.current.value) {
      fetch(`https://chatify-api.up.railway.app/users/${decodedToken.userId}`,
    {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    })
    .then((response) => {
      if (!response.ok) {
        console.error(`Something went wrong in deleting user ${decodedToken.userId}:`, response)
      }
      return response.json();
    })
    .then((data) => {

    })
    .catch((error) => {
      console.error("There was an error from the server when trying delete the user: ", error )
    })
  } else {
    console.log("Incorrect username!")
  }
  }

  return (
    <Container>
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
    <Button variant="outlined" onClick={handleClickOpen}>
      Delete my account
    </Button>
    <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Are you sure you want to delete your account?
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            Deleting your account will remove all of your conversations and chat messages, as well as all your account information.
          </Typography>
          <Typography gutterBottom>
            This action can not be reversed in any way.
          </Typography>
          <Typography gutterBottom>
            To delete your account you need to enter your username in the box below
          </Typography>
          <TextField inputRef={deleteUser} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" autoFocus onClick={DeleteProfile}>
            I want to delete my account
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Container>
  );
};

export default Profile;
