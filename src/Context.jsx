import { useState, createContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

export const AuthenticateContext = createContext();

const AuthContextProvider = (props) => {

    const loginUser = useRef();
    const password = useRef();
    const mail = useRef();
    const [error, setError] = useState('');
    const [csrf, setCsrf] = useState('')
  
    const [auth, setAuth] = useState(false)
    const [decodedToken, setDecodedToken] = useState('')

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [avatar, setAvatar] = useState('')

    const logoutNavigate = useNavigate();
  
    useEffect(() => {
      fetch('https://chatify-api.up.railway.app/csrf', {
        method: 'PATCH',
      })
      .then(res => res.json())
      .then(data => setCsrf(data.csrfToken))
  }, []);
    console.log(csrf)

    useEffect(() => {
      if (decodedToken) {
        setUsername(decodedToken.user)
        setEmail(decodedToken.email)
        setAvatar(decodedToken.avatar)
      }
    }, [decodedToken])
  
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
    if (!response.ok) {
        // Handle other possible errors
        const errorData = await response.json();
        setError(errorData.error)
        console.error("Error: ", error);
        alert("An error occurred", error);
      }
      // Either set up w if so that token is saved to local or sessionstorage based on user input
      // OR just change so that token saves to a cookie that expires after a certain time
      const genToken = await response.json();
      localStorage.setItem('token', genToken.token);
      const decodedToken = JSON.parse(atob(genToken.token.split('.')[1]));
      setDecodedToken(decodedToken);
      localStorage.setItem('decodedToken', decodedToken);

      setAuth(true);
    } catch (error) {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }

    const logout = () => {
      localStorage.clear();
      setAuth(false);
      logoutNavigate('/')
    }

    return (
        <AuthenticateContext.Provider value={{ 
          handleLogin, error, 
          loginUser, password, mail,
          username, setUsername,
          email, setEmail,
          avatar, setAvatar,
          auth, logout, csrf  }}>
            {props.children}
        </AuthenticateContext.Provider>
    );
}

export default AuthContextProvider;