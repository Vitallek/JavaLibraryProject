import { Card, CardContent, CardMedia, Grid, Button, MenuItem, Rating, Stack, TextField, Typography, Autocomplete, Pagination, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import Fade from 'react-reveal/Fade'
import axios from 'axios';
import { Button as PrimeButton } from 'primereact/button'
import "primeflex/primeflex.css";
import 'primeicons/primeicons.css';
import "primereact/resources/primereact.css";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CommentsComponent from './Comments';
import { UserInfoContext } from '../../UserInfoContext';

const takeValues = [10, 20, 30, 50, 100]
const BookComponent = () => {
  const userInfoContext = useContext(UserInfoContext)
  const pageParams = useParams()
  const [book, setBook] = useState({})
  const commentRef = useRef(null)

  const placeComment = (text) => {
    let updatedBook = structuredClone(book)
    if (updatedBook.comments === undefined) updatedBook.comments = []
    const comment = {
      author: userInfoContext.name,
      date: `${new Date().getTime()}`,
      text: text,
    }
    updatedBook.comments.push(comment)
    axios.put(`http://${process.env.REACT_APP_SERVER_ADDR}/place-comment/${book.key}`, JSON.stringify(comment))
      .then(response => console.log(response))
      .catch(err => console.log(err))
    setBook(updatedBook)
  }
  useEffect(() => {
    console.log(book)
  }, [book])

  useEffect(() => {
    let mounted = true
    if (!mounted) return
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
        <Grid item xs={9}>
          <Stack direction='column' spacing={2} sx={{ml:2}}>
            <Typography
              fontSize={30}
            >
              {book.title}
            </Typography>

            <Stack direction='row' spacing={2}>
              <Typography
                fontSize={20}
              >
                {`Author: ${book.author_name}`}
              </Typography>
              <Typography
                fontSize={20}
              >
                {`First publish year: ${book.first_publish_year}`}
              </Typography>
              <Typography component="legend">{parseFloat(book.rate).toFixed(1)}
                <Rating name="read-only" value={Math.floor(book.rate)} readOnly />
              </Typography>
            </Stack>

            <Typography
              fontSize={30}
            >
              {'Description'}
            </Typography>
            <Typography component='span' style={{ whiteSpace: 'pre-line' }} >
              {book.description}
            </Typography>

            {book.comments && book.comments.length > 0 
            ? 
            <CommentsComponent comments={book.comments}/>
            :
            <Typography
              fontSize={20}
            >
              {'No comments yet...'}
            </Typography>
            }
            {userInfoContext.auth ?
            <Stack direction='column' sx={{maxWidth: '60%'}} spacing={2}>
              <TextField
                inputRef={commentRef}
                label="Maximum length: 1000"
                multiline
                rows={5}
                inputProps={{ maxLength: 1000 }}
                defaultValue="Amazing book!"
                variant="filled"
              />
              <Button variant="contained" onClick={() => placeComment(commentRef.current.value)}>
                Comment
              </Button>
            </Stack>
            :
            <Typography
              fontSize={20}
            >
              {'Authorize to write comments'}
            </Typography>
            }
          </Stack>
        </Grid>
      </Grid>
    </Fade>
  )
}

export default BookComponent