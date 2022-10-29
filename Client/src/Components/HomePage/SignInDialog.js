import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SignIn from './SignIn';
import SignUp from './SignUp';

const SignInDialog = ({ dialogOpen, setOpen }) => {

  const handleClose = () => {
    setOpen(prev => ({...prev, isOpen: false}))
  }

  return (
    <Dialog
      open={dialogOpen.isOpen}
      onClose={handleClose}
      // aria-labelledby="alert-dialog-title"
      // aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {dialogOpen.type === 1 ? 'Регистрация' : 'Вход'}
      </DialogTitle>
      <DialogContent>
        {dialogOpen.type === 1 ? <SignUp/> : <SignIn/>}
      </DialogContent>
      <DialogActions>
        {dialogOpen.type === 1 ? 
        <Button variant="outlined" onClick={() => setOpen(prev => ({...prev, type: 0}))}>
          Уже есть аккаунт?
        </Button> 
        : 
        <Button variant="outlined" onClick={() => setOpen(prev => ({...prev, type: 1}))}>
          Зарегистрироваться
        </Button> 
        }
      </DialogActions>
    </Dialog>
  )
}

export default SignInDialog