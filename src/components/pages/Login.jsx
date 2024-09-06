import { useEffect, useContext} from "react";
import { useNavigate } from "react-router";
import { Button, TextField, Typography, Box, Stack, Snackbar, Alert } from "@mui/material";
import { AuthenticateContext } from "../../Context";
import { ThemeContext } from "../../ThemeContext";

const LogIn = () => {
    const { handleLogin,
      loginUser, password, auth,
      open, setOpen, noreg, setNoreg} = useContext(AuthenticateContext)

      const { ProfilePaper } = useContext(ThemeContext)

      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

      const Navigate = useNavigate();

      useEffect(() => {
        if(auth) {
          const timer = setTimeout(() => {
            Navigate('/chat');
          }, 2000); // 200ms = 2 seconds
      
          return () => clearTimeout(timer);
        }
      }, [auth, Navigate])
      

    return (
    <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    }}
    >
      <ProfilePaper>
        <Stack>
          <Typography variant="h4" gutterBottom >Welcome to Dispatch</Typography>
          { noreg ? (
          <Alert severity="error">Incorrect login credentials, please try again</Alert>
          ) : (
          <Typography variant="subtitle2" gutterBottom >
            Use the below fields to login
          </Typography>
          )}
          <TextField required inputRef={loginUser} label="Username" sx={{ margin: "1%" }} />
          <TextField required inputRef={password} label="Password" sx={{ margin: "1%" }} />          
          <Button 
          type="submit" 
          onClick={handleLogin}
          variant="outlined"
          color={auth ? 'success' : 'primary'}
          disabled={open}
          sx={{
            width: '50%',
            alignSelf: 'center'
          }}
          >
            {auth ? 'Successfully logged in' : 'Submit'}
          </Button>
          <Snackbar
            open={open}
            autoHideDuration={1500}
            onClose={handleClose}
            message="Successfully logged in!"
      />
        </Stack>
      </ProfilePaper>
    </Box>
      );
}

export default LogIn;