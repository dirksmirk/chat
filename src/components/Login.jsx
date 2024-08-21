import { useRef, useState, useEffect} from "react";
import { FormControl, FormLabel, Button, TextField } from "@mui/material";

const LogIn = () => {
  const userName = useRef();
  const password = useRef();
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [csrf, setCsrf] = useState('')

  useEffect(() => {
    fetch('https://chatify-api.up.railway.app/csrf', {
      method: 'PATCH',
    })
    .then(res => res.json())
    .then(data => setCsrf(data.csrfToken))
}, []);
  console.log(csrf)

  async function handleLogin(e) {
    e.preventDefault(e);
    
    const data = {
      username: userName.current.value,
      password: password.current.value,
      csrfToken: csrf,
    };

    try {
      const response = await fetch(
        'https://chatify-api.up.railway.app/auth/token', 
        { method: 'POST',
          headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
  );
  if (response.ok) {
    // Handle successful registration
    console.log("Login succesful!");
  } else {
      // Handle other possible errors
      const errorData = await response.json();
      setError(errorData.error)
      console.error("Error: ", error);
      alert("An error occurred", error);
    }

  const genToken = await response.json();
  setToken(genToken.token);

  // You can store the token in local storage for future requests
  localStorage.setItem('token', token);
  
 } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  }

    return (
        <FormControl>
          <FormLabel>Login!</FormLabel>
          <TextField required inputRef={userName} label="Username" />
          <TextField required inputRef={password} label="Password" />
          <Button type="submit" onClick={handleLogin}>Submit</Button>
        </FormControl>
      );
}

export default LogIn;