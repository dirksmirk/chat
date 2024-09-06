import { useState, createContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

export const AuthenticateContext = createContext();

const AuthContextProvider = (props) => {

    const loginUser = useRef();
    const password = useRef();
    const mail = useRef();
    const [error, setError] = useState('');
    const [csrf, setCsrf] = useState('');
    const [avatar, setAvatar] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [decodedToken, setDecodedToken] = useState('')
    const [auth, setAuth] = useState('');
    const [open, setOpen] = useState(false);
    const [noreg, setNoreg] = useState(false);


    const logoutNavigate = useNavigate();

/*     const decodedToken = JSON.parse(localStorage.getItem("decodedToken"));
 */  
    useEffect(() => {
      fetch('https://chatify-api.up.railway.app/csrf', {
        method: 'PATCH',
      })
      .then(res => res.json())
      .then(data => setCsrf(data.csrfToken))
  }, []);

  useEffect(() => {
    if (auth) {
      localStorage.setItem('auth', true);
    }
  }, [auth])
  
  useEffect(() => {
    if (auth) {
      setDecodedToken(JSON.parse(localStorage.getItem("decodedToken")))
    }
  }, [auth])

    async function handleLogin(e) {
      e.preventDefault(e);
      
      const data = {
        username: loginUser.current.value,
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

    const result = await response.json();

    if (response.ok) {
      setNoreg(false)
      // Handle successful registration
      const genToken = await response.json();
      localStorage.setItem('token', genToken.token);
      const decToken = JSON.parse(atob(genToken.token.split('.')[1]));
      localStorage.setItem('decodedToken', JSON.stringify(decToken));
      setAuth(true)
      setOpen(true)
      console.log("Successfully logged in!");
    } else {
      // Handle error response
      if (result.error === "Invalid credentials") {
        setNoreg(true)
        // Alert the user about the existing username
        console.error("Invalid login credentials. Please try again")
      }
      else {
        // Handle other possible errors
        console.error("Error:", result.message);
      }
    }
    } catch (error) {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }

    const logout = () => {
      localStorage.clear();
      setAuth(false)
      logoutNavigate('/log-in')
    }

    return (
        <AuthenticateContext.Provider value={{ 
          handleLogin, error, auth,
          loginUser, password, mail,
          avatar, setAvatar,
          logout, csrf,
          decodedToken, setDecodedToken,
          email, setEmail,
          username, setUsername,
          open, setOpen,
          noreg, setNoreg}}>
            {props.children}
        </AuthenticateContext.Provider>
    );
}

export default AuthContextProvider;