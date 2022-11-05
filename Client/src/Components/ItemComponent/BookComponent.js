import { Card, CardContent, CardMedia, Grid, Button, MenuItem, Rating, Stack, TextField, Typography, Autocomplete, Pagination, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import Fade from 'react-reveal/Fade'
import axios from 'axios';
import { Button as PrimeButton } from 'primereact/button'
import "primeflex/primeflex.css";
import 'primeicons/primeicons.css';
import "primereact/resources/primereact.css";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

const takeValues = [10, 20, 30, 50, 100]
const BookComponent = () => {
  const pageParams = useParams()
  const [book, setBook] = useState({})
  useEffect(() => {
    console.log(book)
  }, [book])

  useEffect(() => {
    let mounted = true
    if (!mounted) return
    console.log(`http://${process.env.REACT_APP_SERVER_ADDR}/get-with-query/${'books'}/${pageParams.id}/${'key'}`)
    axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-with-query/${'books'}/${pageParams.id}/${'key'}`)
      .then(res => {
        console.log(res.data)
        setBook(res.data.data[0])
      })
      .catch(err => alert('can`t get data'))
    return () => mounted = false
  }, [pageParams])

  return (
    <Fade>
      <Grid container sx={{ m: 10 }}>
        <Grid item xs={2}>
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
              alt="book image"
              src={book.image}
            />
            <Button>
              To Favourite
            </Button>
            <Button>
              To Collection
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={10}>
          <Stack direction='column' spacing={2} sx={{pl:2}}>
            <Typography
              fontSize={30}
            >
              {book.title}
            </Typography>
          </Stack>

        </Grid>
      </Grid>
    </Fade>
  )
}

export default BookComponent