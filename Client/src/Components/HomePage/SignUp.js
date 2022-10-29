import React, { useRef } from 'react';
import Cookies from 'js-cookie';
import { sha256 } from 'crypto-hash';
import axios from 'axios';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Toast } from 'primereact/toast';
import { Container } from '@mui/system';

const enterKey = 13
const handleEnterPush = (e, passwordInput, emailInput, phoneInput, nameInput, toast) => {
  if (e.keyCode === enterKey) RegisterOnClick(passwordInput, emailInput, phoneInput, nameInput, toast)
}

const RegisterOnClick = (passwordInput, emailInput, phoneInput, nameInput, toast) => {
  if(passwordInput.length === 0 ||
    emailInput.length === 0 ||
    phoneInput.length === 0 ||
    nameInput.length === 0) {
      toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Остались пустые поля' })
      return
    }
  sha256(passwordInput, process.env.REACT_APP_PASSWORD_SALT).then(hash => {
    let passwordHash = hash
    axios.post(`http://${process.env.REACT_APP_SERVER_ADDR}/register`, {
      email: emailInput,
      password: passwordHash,
      phone: phoneInput,
      name: nameInput,
      role: 'user'
    }).then(response => {
      console.log(response)
      const responseJSON = response.data
      if (responseJSON.code === 409) {
        alert('User already exists')
        return
      }
      if (responseJSON.code === 200) {
        Cookies.set('token', JSON.stringify({
          token: responseJSON.token,
        }))
        window.location.reload()
      }
    })
  })
}

const SignUp = ({ switchForm }) => {
  const emailInput = useRef(null)
  const passwordInput = useRef(null)
  const phoneInput = useRef(null)
  const nameInput = useRef(null)
  const toast = useRef(null)
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Toast ref={toast} position="bottom-right"/>
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
            onKeyDown={(e) => {
              handleEnterPush(e, passwordInput.current.value, emailInput.current.value, phoneInput.current.value, nameInput.current.value, toast)
            }}
            margin="normal"
            required
            fullWidth
            inputRef={emailInput}
            label="Почта"
            name="email"
            autoFocus
          />
          <TextField
            onKeyDown={(e) => {
              handleEnterPush(e, passwordInput.current.value, emailInput.current.value, phoneInput.current.value, nameInput.current.value, toast)
            }} margin="normal"
            required
            fullWidth
            inputRef={passwordInput}
            label="Пароль"
            name="password"
            type="password"
          />
          <TextField
            onKeyDown={(e) => {
              handleEnterPush(e, passwordInput.current.value, emailInput.current.value, phoneInput.current.value, nameInput.current.value, toast)
            }} margin="normal"
            required
            fullWidth
            inputRef={nameInput}
            label="Имя"
            name="name"
            type="name"
          />
          <TextField
            onKeyDown={(e) => {
              handleEnterPush(e, passwordInput.current.value, emailInput.current.value, phoneInput.current.value, nameInput.current.value, toast)
            }} margin="normal"
            required
            fullWidth
            inputRef={phoneInput}
            label="Телефон"
            name="phone"
            type="phone"
          />
          <Button
            onClick={(e) => { 
              RegisterOnClick(
                passwordInput.current.value, 
                emailInput.current.value, 
                phoneInput.current.value, 
                nameInput.current.value,
                toast) 
            }}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {'Зарегистрироваться'}
          </Button>
          {/* <Grid container justifyContent="flex-end">
            <Grid item>
              <Button variant="outlined" onClick={() => {switchForm(prev => ({...prev, type: 0}))}}>
                {"Уже есть аккаунт?"}
              </Button>
            </Grid>
          </Grid> */}
        </Box>
      </Box>
    </Container>
  );
}

export default SignUp