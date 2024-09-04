import {
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
  styled,
  Grid
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { MuiFileInput } from "mui-file-input";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthenticateContext } from "../../Context";

const Profile = () => {
  const {
    loginUser,
    mail,
    avatar,
    setAvatar,
    logout,
    decodedToken,
    setDecodedToken,
    email,
    setEmail,
    username,
    setUsername
  } = useContext(AuthenticateContext);

  const deleteUser = useRef();
  const [file, setFile] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pictureOpen, setPictureOpen] = useState(false);
  const [userDeleted, setUserDeleted] = useState(false);

  useEffect(() => {
      setDecodedToken(JSON.parse(localStorage.getItem("decodedToken")))
  }, [])

  useEffect(() => {
    setUsername(decodedToken.user);
    setEmail(decodedToken.email);
    setAvatar(decodedToken.avatar);
  }, [])

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

  const handleDeleteClickOpen = () => {
    setDeleteOpen(true);
  };
  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };
  const handlePictureOpen = () => {
    setPictureOpen(true);
  };
  const handlePictureClose = () => {
    setPictureOpen(false);
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
    setUsername(loginUser.current.value)
    setEmail(mail.current.value)

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
            user: username,
            email: email,
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
      fetch(`https://chatify-api.up.railway.app/users/${decodedToken.id}`,
    {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    })
    .then((response) => {
      if (!response.ok) {
        console.error(`Something went wrong in deleting user ${decodedToken.id}:`, response)
      }
      return response.json();
    })
    .then((data) => {
      console.log(data)
      setUserDeleted(true)
      setTimeout(() => {
        handleDeleteClose();
        logout();
      }, 2000);
    })
    .catch((error) => {
      console.error("There was an error from the server when trying delete the user: ", error )
    })
  } else {
    console.log("Incorrect username!")
  }};

  return (
    <Grid container spacing={2}>
    <Grid item>
      <Typography>Change your settings</Typography>
      <TextField inputRef={loginUser} label={decodedToken.user} />
      <TextField inputRef={mail} label={decodedToken.email} />
      <Button type="submit" onClick={handleProfile}>
        Submit
      </Button>
    </Grid>
    <Grid item>
    <Avatar
        alt="Profile picture"
        src={decodedToken.avatar}
        sx={{ width: 56, height: 56 }}
        onClick={handlePictureOpen}
        />
    </Grid>
      <BootstrapDialog
        onClose={handlePictureClose}
        aria-labelledby="customized-dialog-title"
        open={pictureOpen}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Update your profile picture!
        </DialogTitle>
            <IconButton
            aria-label="close"
            onClick={handlePictureClose}
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
              Upload your new picture here! Press the submit button below when you have selected your picture            
            </Typography>
          <MuiFileInput
        size="small"
        inputProps={{ accept: ".png, .jpeg, .jpg" }}
        value={file}
        onChange={newPicture}
        />
        </DialogContent>
            <DialogActions>
            <Button variant="outlined" autoFocus onClick={pictureUpload}>
              Submit
            </Button>
          </DialogActions>
      </BootstrapDialog>

    <Grid item>
    <Button variant="outlined" color="error" onClick={handleDeleteClickOpen}>
      Delete my account
    </Button>
    </Grid>
    <BootstrapDialog
        onClose={handleDeleteClose}
        aria-labelledby="customized-dialog-title"
        open={deleteOpen}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Are you sure you want to delete your account?
        </DialogTitle>
        { !userDeleted && (
            <IconButton
            aria-label="close"
            onClick={handleDeleteClose}
            sx={(theme) => ({
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
          )}
          { userDeleted ? (
          <DialogContent dividers>
            <Typography gutterBottom>
              Your account has now been deleted! You will now be redirected to the home page
            </Typography>
            </DialogContent>
          ) : (
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
          )}
          { !userDeleted && (
            <DialogActions>
            <Button variant="outlined" color="error" autoFocus onClick={DeleteProfile}>
              I want to delete my account
            </Button>
          </DialogActions>
          )}
      </BootstrapDialog>
      </Grid>
  );
};

export default Profile;
