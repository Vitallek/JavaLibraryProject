import {  Grid, Stack, TextField, Typography, Divider, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import Fade from 'react-reveal/Fade'
import axios from 'axios';
import "primeflex/primeflex.css";
import 'primeicons/primeicons.css';
import "primereact/resources/primereact.css";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { useContext,  useEffect,  useRef, useState } from 'react';
import { UserInfoContext } from '../../UserInfoContext';
import { Toast } from 'primereact/toast';
import EditIcon from '@mui/icons-material/Edit';
const enterKey = 13
const escapeKey = 27
const ProfileComponent = () => {
  const userInfoContext = useContext(UserInfoContext)
  const [user, setUser] = useState(userInfoContext)
  useEffect(() => {
    setUser(userInfoContext)
  },[userInfoContext])
  const [isEditingName, setIsEditingName] = useState(false)
  const toast = useRef(null)
  const handleChangeUserName = (e) => {
    setUser(prev => ({...prev, name: e.target.value}))
  }
  const onUserNameChanged = (e) => {
    if(e.keyCode === enterKey){
      if (e.target.value.length < 5) {
        setIsEditingName(prev => !prev)
        return toast.current.show({severity: 'error', summary: 'Имя должно содержать минимум 5 букв', detail: 'Данные обновлены'})
      }

      axios.put(`http://${process.env.REACT_APP_SERVER_ADDR}/update-username/${userInfoContext.token}`, 
      JSON.stringify({
        field: 'name',
        value: e.target.value, 
        email: user.email
      }))
      .then(response => {
        toast.current.show({severity: 'success', summary: 'Уведомление', detail: 'Данные обновлены'});
      })
      .catch(err =>toast.current.show({severity: 'error', summary: 'Ошибка', detail: 'Такое имя уже существует'}))
      setIsEditingName(prev => !prev)
    }
    if(e.keyCode === escapeKey) setIsEditingName(prev => !prev)
  }

  return (
    <Fade>
      <Toast ref={toast} position="bottom-right"/>
      <Grid container sx={{ p: 5 }}>
        <Grid item xs={3}>
          <Stack direction='column' spacing={2}>
            <Box
              component="img"
              sx={{
                cursor: 'pointer',
                p: 1,
                width: '100%',
                // maxHeight: { xs: 233, md: 167 },
                // maxWidth: { xs: 350, md: 250 },
              }}
              alt="profile image"
              src='./profileMock.jpg'
            />
          </Stack>
        </Grid>
        <Grid item xs={8}>
          <Stack direction='column' spacing={2} sx={{ml:2, maxWidth: '90%'}}>
            <Typography
              fontSize={30}
            >
              {`Почта: ${user.email}`}
            </Typography>
            
            <Divider/>

            <Stack direction='row' spacing={2} display='flex' alignItems='center'>
              {isEditingName?
              <TextField
                autoFocus
                onChange={(e) => handleChangeUserName(e)}
                value={user.name}
                id="box_num_input"
                label="Новое имя"
                onKeyDown={(e) => onUserNameChanged(e)}
              />
              :
              <Typography
                fontSize={30}
                component='span'
                gutterBottom
              >
                {`Имя: ${user.name}`}
              </Typography>}
              <IconButton onClick={() => setIsEditingName(prev => !prev)}>
                <EditIcon/>
              </IconButton>
            </Stack>
            
            <Divider/>

            <Typography
              fontSize={30}
            >
               {`Роль: ${user.role}`}
            </Typography>
            
            <Divider/>
          </Stack>
        </Grid>
      </Grid>
    </Fade>
  )
}

export default ProfileComponent