import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { FormControl, FormLabel, Button, TextField, Box } from "@mui/material";
import { AuthenticateContext } from "../../Context";
import { ThemeContext } from "../../ThemeContext";

const Register = () => {
  const { csrf, loginUser, password, mail } = useContext(AuthenticateContext)
  const { ProfilePaper } = useContext(ThemeContext)

  const Navigate = useNavigate();
  const authenticated = localStorage.getItem('auth');

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
        // Handle successful registration
        console.log("Registration successful: ", result.message);
        Navigate('/log-in');
      } else {
        // Handle error response
        if (result.error === "Username or email already exists") {  
          // Alert the user about the existing username
          alert(
            "The username or email you entered already exists. Please choose a different one."
          );
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
        <FormLabel>Enter your information</FormLabel>
        <TextField required inputRef={loginUser} label="Username" />
        <TextField required inputRef={password} label="Password" />
        <TextField required inputRef={mail} label="E-mail" />
      <Button type="submit" onClick={handleSubmit}>Submit</Button>
    </FormControl>
      </ProfilePaper>
    </Box>
  );
};

export default Register;
