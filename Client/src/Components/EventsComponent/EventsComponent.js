import { Card, CardContent, CardMedia, Grid, Link, MenuItem, Rating, Stack, Switch, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Fade from 'react-reveal/Fade'
import axios from 'axios';
import { Button as PrimeButton } from 'primereact/button'
import "primeflex/primeflex.css";
import 'primeicons/primeicons.css';
import "primereact/resources/primereact.css";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavComponent from './StoryNavComponent';
import PetsIcon from '@mui/icons-material/Pets';

const EventsComponent = () => {
  const [content, setContent] = useState([])
  const [selectedStory, setSelectedStory] = useState('')
  const [readMode, setReadMode] = useState(true)
  const [images, setImages] = useState([])
  const handleChangeReadingMode = () => {
    setReadMode(prev => {
      let query = 'kitties'
      if (prev === true) query = 'Scary images & pictures'
      axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-images/${query}`)
        .then(res => {
          const resJSON = JSON.parse(res.data.data)
          setImages(resJSON.results)
        })
        .catch(err => alert('error occured'))
      return !prev
    })
  }

  useEffect(() => {
    let mounted = true
    if (!mounted) return
    axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-all/events`)
      .then(res => {
        console.log(res.data)
        setContent(res.data.data)
      })
      .catch(err => alert('error occured'))
    axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-images/kittens`)
      .then(res => {
        const resJSON = JSON.parse(res.data.data)
        setImages(resJSON.results)
      })
      .catch(err => alert('error occured'))
    return () => mounted = false
  }, [])

  return (
    <Fade>
      <Grid container>
        <Grid item xs={2}>
          <NavComponent menu={content} setSelectedStory={setSelectedStory} />
        </Grid>
        <Grid container item xs={10}>
          <Stack>
            <Typography sx={{ fontSize: 30 }}>
              {'Здесь собраны авторские рассказы в честь Хеллоуина'}
            </Typography>
            <Stack direction='row' spacing={2} sx={{ mr: 5, ml: 5 }}>
              <Box display='flex' alignItems='center'>
                <PetsIcon color={readMode ? 'action' : 'primary'} />
                <Switch onChange={handleChangeReadingMode} />
              </Box>
              <Typography sx={{ fontSize: 20 }}>
                {'Если вам страшно читать, можно включить котят'}
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: 30 }}>
              {selectedStory.title && `Title - ${selectedStory.title}`}
            </Typography>
            <Grid container>
              <Grid item xs={!readMode ? 6 : 12}>
                <Stack direction='column' sx={{maxHeight:'85vh', overflowY:'scroll'}} spacing={2} display='flex' alignItems='center'>
                  <Typography component='span' style={{ whiteSpace: 'pre-line' }} >
                    {selectedStory.data}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={5.5} sx={{ml:1}}>
                <Fade>
                  {!readMode && <iframe style={{ width: '100%', height: '85vh' }} src='https://www.pexels.com/search/kitten/' />}
                </Fade>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
      </Grid>
    </Fade>
  )
}

export default EventsComponent