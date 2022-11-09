import { Grid, Typography, Stack, Box, Link } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Fade from 'react-reveal/Fade'
const AboutCompany = () => {

  useEffect(() => {
    let mounted = true
    if (!mounted) return
    // axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-content/carousel`)
    //   .then(res => setContent(res.data))
    //   .catch(err => alert('error occured'))
    return () => mounted = false
  }, [])

  return (
    <Grid item xs={12} sx={{ p: 1 }}>
      <Fade>
        <Typography
          sx={{ m: 3, display: 'flex', justifyContent: 'center' }}
          fontSize={50}
        >
          A-Library
        </Typography>
        <Stack direction='row' display='flex' alignItems='center' spacing={2} sx={{ p: 10, pt: 1 }}>
          <Box
            component="img"
            sx={{
              borderRadius: 30,
              cursor: 'pointer',
              height: '20vw',
              p: 1
              // width: '100%',
              // maxHeight: { xs: 233, md: 167 },
              // maxWidth: { xs: 350, md: 250 },
            }}
            alt="bg image"
            src="/home_bg.jpg"
          />

          <Typography
            component='div'
            sx={{ m: 3, width: '100%', display: 'flex', justifyContent: 'center' }}
            fontSize={30}
          >
            <Stack direction='column'>
              <div>
                <strong>A-Library </strong>
                provides free, high-quality educational resources for anyone, anywhere.
              </div>
              <div>
              А ещё тут должно быть <strong>описание</strong>, но мне лень его придумывать, так что продублирую главный экран
              </div>
            </Stack>

          </Typography>
        </Stack>
      </Fade>
    </Grid>
  )
}

export default AboutCompany