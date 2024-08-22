import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FormControl, FormLabel, Button, TextField } from "@mui/material";

const Register = () => {
  // Refs to store input values
  const userName = useRef();
  const password = useRef();
  const email = useRef();
  const [csrf, setCsrf] = useState('')

  const Navigate = useNavigate();

  useEffect(() => {
    fetch('https://chatify-api.up.railway.app/csrf', {
      method: 'PATCH',
    })
    .then(res => res.json())
    .then(data => setCsrf(data.csrfToken))
}, []);
  console.log(csrf)
  async function handleSubmit(e) {
    e.preventDefault();

    if (
      userName.current.value === "" ||
      password.current.value === "" ||
      email.current.value === ""
    ) {
      alert("Alla fält måste fyllas i.");
      return; // Stoppa funktionen här om något fält är tomt
    }

    const data = {
      username: userName.current.value,
      password: password.current.value,
      email: email.current.value,
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

      // Parse the response JSON
      const result = await response.json();
      console.log(result)

      if (response.ok) {
        // Handle successful registration
        console.log("Registration successful:", result);
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
    <FormControl>
      <FormLabel>Enter your information</FormLabel>
      <TextField required inputRef={userName} label="Username" />
      <TextField required inputRef={password} label="Password" />
      <TextField required inputRef={email} label="E-mail" />
      <Button type="submit" onClick={handleSubmit}>Submit</Button>
    </FormControl>
  );
};

export default Register;
