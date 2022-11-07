import { Card, CardContent, CardMedia, Grid, Button, MenuItem, Rating, Stack, TextField, Typography, Autocomplete, Pagination, Tooltip, Link, Divider } from '@mui/material';
import { Box } from '@mui/system';
import Fade from 'react-reveal/Fade'
import axios from 'axios';
import "primeflex/primeflex.css";
import 'primeicons/primeicons.css';
import "primereact/resources/primereact.css";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import CommentsComponent from './Comments';
import { UserInfoContext } from '../../UserInfoContext';
import FavoriteIcon from '@mui/icons-material/Favorite';

const takeValues = [10, 20, 30, 50, 100]
const BookComponent = () => {
  const userInfoContext = useContext(UserInfoContext)
  const pageParams = useParams()
  const [book, setBook] = useState({})
  const commentRef = useRef(null)
  const [placeCommentAvailable, setPlaceCommentAvailable] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  const placeComment = (text) => {
    if(!text) return
    setPlaceCommentAvailable(false)
    setTimeout(() => {
      setPlaceCommentAvailable(true)
    }, 3000);

    let updatedBook = structuredClone(book)
    if (updatedBook.comments === undefined) updatedBook.comments = []
    const comment = {
      author: userInfoContext.name,
      email: userInfoContext.email,
      date: `${new Date().getTime()}`,
      text: text,
      id: `${userInfoContext.email+updatedBook.comments.length}`
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

  useEffect(() => {
    if(userInfoContext.favorites && userInfoContext.favorites.some(favorite => favorite === book.key)){
      setIsFavorite(true)
    } 
  },[userInfoContext])

  const handleSetFavorite = () => {
    if(!userInfoContext.auth) {
      return alert('Unauthorized action')
    }
    if(!isFavorite){
      axios.put(`http://${process.env.REACT_APP_SERVER_ADDR}/add-to-favorite`, JSON.stringify({
        email: userInfoContext.email,
        key: book.key
      }))
      .then(response => setIsFavorite(prev => !prev))
      .catch(err => console.log(err))
    } else {
      axios.delete(`http://${process.env.REACT_APP_SERVER_ADDR}/remove-from-favorite`, {data:JSON.stringify({
        email: userInfoContext.email,
        key: book.key
      })})
      .then(response => setIsFavorite(prev => !prev))
      .catch(err => console.log(err))
    }
  }

  return (
    <Fade>
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
              alt="book image"
              src={book.image}
            />
            <Box display='flex' justifyContent='center' alignItems='center'>
              <FavoriteIcon color={!isFavorite ? 'action' : 'primary'} />
              <Button disabled={!userInfoContext.auth} color={!isFavorite ? 'inherit' : 'primary'} onClick={handleSetFavorite}>
                To Favorite
              </Button>
            </Box>
            {/* decide to delete */}
            {/* <Box display='flex' justifyContent='center' alignItems='center'>
              <StarIcon color={!inCollection ? 'action' : 'primary'} />
              <Button color={!inCollection ? 'inherit' : 'primary'} onClick={handleOpenCollectionDialog}>
                To Collection
              </Button>
              <CollectionDialog  
                open={openAddItemDialog}
                onClose={handleCloseCollectionDialog}
                collections={userInfoContext.collections}
              />
            </Box> */}
            {book.links && book.links.length > 0 &&
              <>
              <Typography
                fontSize={20}
              >
                Links
              </Typography>
              <Divider/>
                {book.links.map((link, index) => <Link key={index} sx={{mt:5, cursor:'pointer'}} underline='none' target='_blank' href={link.url}>{link.title}</Link>)}
              </>
            }
          </Stack>
        </Grid>
        <Grid item xs={8}>
          <Stack direction='column' spacing={2} sx={{ml:2, maxWidth: '90%'}}>
            <Typography
              fontSize={30}
            >
              {book.title}
            </Typography>
            
            <Divider/>

            <Typography
              fontSize={20}
            >
              {`Genre: ${book.subject}`}
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
            
            {book.description && 
            <>
              <Typography
                fontSize={30}
              >
                {'Description'}
              </Typography>
              <Typography component='span' style={{ whiteSpace: 'pre-line'}}>
                {book.description.value === undefined 
                ?
                `${book.description}`
                :
                `${book.description.value}`
                }
                
              </Typography>
            </>}

            <Divider/>

            {book.comments && book.comments.length > 0 
            ? 
            // <CommentsComponent comments={[...book.comments].sort((el1,el2) => el1.date - el2.date)} bookKey={book.key}/>
            <CommentsComponent comments={book.comments} bookKey={book.key}/>
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
                defaultValue='Awesome book!'
                inputProps={{ maxLength: 1000 }}
                variant="filled"
              />
              <Button disabled={!placeCommentAvailable} variant="contained" onClick={_ => placeComment(commentRef.current.value)}>
                Comment
              </Button>
            </Stack>
            :
            <Typography
              fontSize={20}
              color="gray"
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