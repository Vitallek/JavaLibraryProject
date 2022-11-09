import React, { useRef } from 'react';
import Cookies from 'js-cookie'

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios'
//hash function
import { sha256 } from 'crypto-hash'

const enterKey = 13
const handleEnterPush = (e, passwordInput, emailInput) => {
  if (e.keyCode === enterKey) LogInOnClick(passwordInput, emailInput)
}

const LogInOnClick = (passwordInput, emailInput) => {
  sha256(passwordInput, process.env.REACT_APP_PASSWORD_SALT).then(hash => {
    let passwordHash = hash
    axios.post(`http://${process.env.REACT_APP_SERVER_ADDR}/login`, {
      email: emailInput,
      password: passwordHash,
    }).then(response => {
      const responseJSON = response.data
      console.log(responseJSON)
      if (responseJSON.code === 401) {
        alert('Password incorrect')
        return
      }
      if (responseJSON.code === 409) {
        alert('No user found')
        return
      }
      if (responseJSON.code === 200) {
        Cookies.set('token', JSON.stringify({
          token: responseJSON.data.token,
        }))
        window.location.reload()
      }
    })
  })
}

const SignIn = () => {
  const emailInput = useRef(null)
  const passwordInput = useRef(null)

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            onKeyDown={e => handleEnterPush(e, passwordInput.current.value, emailInput.current.value)}
            margin="normal"
            required
            fullWidth
            inputRef={emailInput}
            label="Почта"
            name="username"
            autoFocus
          />
          <TextField
            onKeyDown={e => handleEnterPush(e, passwordInput.current.value, emailInput.current.value)}
            margin="normal"
            required
            fullWidth
            inputRef={passwordInput}
            label="Пароль"
            name="password"
            type="password"
          />
          <Button
            onClick={() => LogInOnClick(passwordInput.current.value, emailInput.current.value)}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, borderRadius: 10 }}
          >
            {'Войти'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default SignIn