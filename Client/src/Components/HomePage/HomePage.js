import {Divider, Grid, Link,  Stack, Typography } from '@mui/material';
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
import { AuthorItemCard, BookItemCard, SubjectItemCard } from '../ItemCardComponent';

const stackResponsiveProps = { 
  ml:5,
  p: 5, 
  pt: 1, 
  overflowX:'auto', 
  width:'80vw' ,
  display:'flex',
  justifyContent:'space-between',
  alignItems:'center'
}
const HomePage = () => {
  const [content, setContent] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    if (!mounted) return
    // axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-content/carousel`)
    //   .then(res => setContent(res.data))
    //   .catch(err => alert('error occured'))
    axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-top-rated-data`)
      .then(res => {
        console.log(res.data)
        setContent(res.data)
      })
      .catch(err => alert('error occured'))
    return () => mounted = false
  }, [])

  return (
    <Grid container item xs={12} display='flex' alignItems='center' direction='column'>
      <Fade>
        <Typography
          sx={{ m: 3, display: 'flex', justifyContent: 'center' }}
          fontSize={50}
        >
          A-Library
        </Typography>
        <Stack direction='row' display='flex' alignItems='center' spacing={2} sx={{ p: 10, pt: 1 }}>
          <Box
            onClick={() => navigate('/')}
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
              <Link sx={{ mt: 5, cursor: 'pointer' }} underline='none' href='/about'>Узнать больше</Link>
            </Stack>

          </Typography>
        </Stack>
      </Fade>
      <Fade>
        <Typography
          sx={{ m: 3, ml: 7, mb: 1, display: 'flex', justifyContent: 'flex-start' }}
          fontSize={30}
          fontWeight={600}
          color='gray'
        >
          Лучшие книги
        </Typography>
        <Stack 
          direction='row' 
          spacing={2} 
          sx={{...stackResponsiveProps}}>
          {content.books?.sort((el1, el2) => el2.rate - el1.rate).slice(0, 5).map((book, index) =>
            <BookItemCard key={index} book={book}/>
          )}
        </Stack>
        <Divider/>
      </Fade>
      <Fade>
        <Typography
          sx={{ m: 3, ml: 7, mb: 1, display: 'flex', justifyContent: 'flex-start' }}
          fontSize={30}
          fontWeight={600}
          color='gray'
        >
          Лучшие авторы
        </Typography>
        <Stack 
          direction='row' 
          spacing={2} 
          sx={{...stackResponsiveProps}}>
          {content.authors?.sort((el1, el2) => el2.rate - el1.rate).slice(0, 5).map((author, index) =>
            <AuthorItemCard key={index} author={author}/>
          )}
        </Stack>
        <Divider/>
      </Fade>
      <Fade>
        <Typography
          sx={{ m: 3, ml: 7, mb: 1, display: 'flex', justifyContent: 'flex-start' }}
          fontSize={30}
          fontWeight={600}
          color='gray'
        >
          Лучшие жанры
        </Typography>
        <Stack 
          direction='row' 
          spacing={2} 
          sx={{...stackResponsiveProps}}>
          {content.subjects?.sort((el1, el2) => el2.rate - el1.rate).slice(0, 5).map((subject, index) =>
            <SubjectItemCard key={index} subject={subject}/>
          )}
        </Stack>
        <Divider/>
      </Fade>
      <Fade>
        <Box display='flex' justifyContent='center' sx={{ mb: 10, mt: 10 }}>
          <PrimeButton variant='contained' onClick={() => navigate('/search')}>
            Перейти к книгам
          </PrimeButton>
        </Box>
      </Fade>
    </Grid>
  )
}

export default HomePage