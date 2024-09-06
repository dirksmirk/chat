import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { FormControl, FormLabel, Button, TextField, Box, Alert, Snackbar } from "@mui/material";
import { AuthenticateContext } from "../../Context";
import { ThemeContext } from "../../ThemeContext";

const Register = () => {
  const { csrf, loginUser, password, mail, noreg, setNoreg, open, setOpen } = useContext(AuthenticateContext)
  const { ProfilePaper } = useContext(ThemeContext)
  const Navigate = useNavigate();
  const authenticated = localStorage.getItem('auth');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
        if(authenticated) {
            Navigate('/chat')
        }
  }, [authenticated, Navigate])
  
  async function handleSubmit(e) {
    e.preventDefault();

    if (
      loginUser.current.value === "" ||
      password.current.value === "" ||
      mail.current.value === ""
    ) {
      alert("Alla fält måste fyllas i.");
      return; // Stoppa funktionen här om något fält är tomt
    }

    const data = {
      username: loginUser.current.value,
      password: password.current.value,
      email: mail.current.value,
      avatar: "https://i.ibb.co/j898464/pavatar.jpg",
      csrfToken: csrf,
    };
    console.log(data)
    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setOpen(true)
        setNoreg(false)
        // Handle successful registration
        console.log("Registration successful: ", result.message);
        setTimeout(() => {
          Navigate('/log-in');
        }, 2000);
      } else {
        // Handle error response
        if (result.error === "Username or email already exists") {
          setNoreg(true)
          // Alert the user about the existing username
          console.error("The username or email you entered already exists. Please choose a different one.")
        }
        else {
          // Handle other possible errors
          console.error("Error:", result.message);
          alert("An error occurred: " + result.message);
        }
      }
    } catch (error) {
      // Handle network or other unexpected errors
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  }

  return (
    <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    }}
    >
      <ProfilePaper elevation={4}>
      <FormControl>
        <FormLabel gutterBottom>Enter your information</FormLabel>
        { noreg && (
          <Alert severity="error">That username or email already exists</Alert>
        )}
        <TextField required inputRef={loginUser} label="Username" sx={{ margin: "1%" }} />
        <TextField required inputRef={password} label="Password" sx={{ margin: "1%" }} />
        <TextField required inputRef={mail} label="E-mail" sx={{ margin: "1%" }} />
      <Button 
      type="submit" 
      onClick={handleSubmit}
      variant="outlined"
      sx={{
        mt: '3%',
        width: '50%',
        alignSelf: 'center'
      }}
      >Submit</Button>
      <Snackbar
            open={open}
            autoHideDuration={1500}
            onClose={handleClose}
            message="Your account was created!"
      />
    </FormControl>
      </ProfilePaper>
    </Box>
  );
};

export default Register;
