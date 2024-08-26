import { useState, createContext, useEffect, useRef } from 'react';

export const AuthenticateContext = createContext();

const AuthContextProvider = (props) => {

    const userName = useRef();
    const password = useRef();
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [csrf, setCsrf] = useState('')
  
    const [auth, setAuth] = useState((sessionStorage.getItem('auth') === 'true') || false)
  
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
      const genToken = await response.json();
      setToken(genToken.token);
      sessionStorage.setItem('token', genToken.token);
      setAuth(true);
   } catch (error) {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  
    useEffect(() => {
      if (token) {
          // You can store the token in session storage for future requests
          console.log('JWT Token:', token);
      }
  }, [token]); // I CAN SEE THE TOKEN FINALLY

    return (
        <AuthenticateContext.Provider value={{ 
          handleLogin, token, error, 
          userName, password,
          auth  }}>
            {props.children}
        </AuthenticateContext.Provider>
    );
}

export default AuthContextProvider;