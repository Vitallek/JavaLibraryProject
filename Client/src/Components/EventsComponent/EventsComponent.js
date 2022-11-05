import { Card, CardContent, CardMedia, Grid, Link, MenuItem, Rating, Stack, Switch, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Fade from 'react-reveal/Fade'
import axios from 'axios';
import {Button as PrimeButton} from 'primereact/button'
import "primeflex/primeflex.css";
import 'primeicons/primeicons.css';
import "primereact/resources/primereact.css";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavComponent from './StoryNavComponent';

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
    axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-all/events/100/0`)
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
          <NavComponent menu={content} setSelectedStory={setSelectedStory}/>
        </Grid>
        <Grid item xs={4}>
          <Stack direction='column' spacing={2} display='flex' alignItems='center'>
          <Typography sx={{fontSize:20}}>
              {selectedStory.title}
            </Typography>
          <Typography component='span' style={{whiteSpace: 'pre-line'}} >
            {selectedStory.data}
          </Typography>
          </Stack>
          
        </Grid>
        <Grid item xs={5} sx={{ml:2}}>
          <Stack direction='column' spacing={2} display='flex' alignItems='center'>
            <Typography sx={{fontSize:20}}>
              {readMode ? 'Режим котят' : 'Режим маньяка'}
            </Typography>
            <Switch label="" onChange={handleChangeReadingMode}/>
            <Stack direction="row" sx={{ p: 1, justifyContent:'center',flexWrap: 'wrap' }}>
            {images.map((image, index) => 
              <Box
                key={index}
                component="img"
                sx={{
                  cursor:'pointer',
                  p: 1,
                  maxHeight:200,
                  // width: '100%',
                  // maxHeight: { xs: 233, md: 167 },
                  // maxWidth: { xs: 350, md: 250 },
                }}
                alt="image"
                src={image.urls.regular}
              />
            )}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Fade>
  )
}

export default EventsComponent