import { useState, createContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

export const AuthenticateContext = createContext();

const AuthContextProvider = (props) => {

    const userName = useRef();
    const password = useRef();
    const [error, setError] = useState('');
    const [csrf, setCsrf] = useState('')
  
    const [auth, setAuth] = useState((sessionStorage.getItem('auth') === 'true') || false)

    const logoutNavigate = useNavigate();
  
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
      const decodedJwt = JSON.parse(atob(genToken.token.split('.')[1]));
      localStorage.setItem('decodedToken', decodedJwt);
      setAuth(true);
   } catch (error) {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }

    const logout = () => {
      localStorage.removeItem('token')
      setAuth(false);
      logoutNavigate('/')
    }

    return (
        <AuthenticateContext.Provider value={{ 
          handleLogin, error, 
          userName, password,
          auth, logout, csrf  }}>
            {props.children}
        </AuthenticateContext.Provider>
    );
}

export default AuthContextProvider;