import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import validator from 'validator';
import Axios from '../../config/Axios';
import { actionTypes } from '../../store/reducer';
import { useStateValue } from '../../store/StateProvider';
import SnackBar from '../../layouts/SnackBar';
import Loading from '../../layouts/Loading';

const theme = createTheme();

function Login() {
  const [, dispatch] = useStateValue();
  function ShowSnakBar(severity, msg) {
      dispatch({
          type: actionTypes.SET_SNACKBAR,
          snackbar: true,
          severity: severity,
          msg: msg
      });
  }
  const [loading, setLoading] = useState(true);
  const [input_email, setInput_email] = useState("");
  const [input_password, setInput_password] = useState("");

  useEffect(()=>{
    setLoading(false);
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!validator.isEmail(input_email)){
      ShowSnakBar("warning", "Please enter a valid email address.");
    } else if(input_password.length < 8){
      ShowSnakBar("warning", "Password length must be at least 8 characters long.");
    } else {

      let request = {
        email:input_email,
        password:input_password
      }

      setLoading(true);
      try {
        let req = await Axios.post('/login', request);

        let userArray = JSON.stringify(req.data.result);

        localStorage.setItem('gym_user', userArray);
        dispatch({
          type: actionTypes.SET_USER,
          user: req.data.result.email,
          token: req.data.result.token,
          expire: req.data.result.expire
        });
      } catch (err) {
        if(err.response.data.error){
          ShowSnakBar("error", err.response.data.error);
        } else {
          ShowSnakBar("error", "Unexpected error occurred while trying to login");
        }
      }

    }

  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={input_email}
              onChange={(e)=>{setInput_email(e.target.value)}}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={input_password}
              onChange={(e)=>{setInput_password(e.target.value)}}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
      {loading && <Loading />}
      <SnackBar />
    </ThemeProvider>
  );
}

export default Login