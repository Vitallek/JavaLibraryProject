import { Grid, Stack, TextField, Typography, Autocomplete, Tooltip, IconButton } from '@mui/material';
import Fade from 'react-reveal/Fade'
import axios from 'axios';
import "primeflex/primeflex.css";
import 'primeicons/primeicons.css';
import "primereact/resources/primereact.css";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { useContext, useEffect, useRef, useState } from 'react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { BookItemCard } from '../ItemCardComponent';
import { UserInfoContext } from '../../UserInfoContext';
import Fuse from 'fuse.js'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const FavoritesComponent = () => {
  const userInfoContext = useContext(UserInfoContext)
  const [searchKeys, setSearchKeys] = useState([])

  const [displayedContent, setDisplayedContent] = useState([])
  const [displayedContentFiltered, setDisplayedContentFiltered] = useState([])

  const requestContent = async () => {
    axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-favorites/${userInfoContext.email}`)
      .then(res => {
        console.log(res.data)
        const newSearchKeys = []
        res.data.data.forEach(el => {
          newSearchKeys.push(el.title)
        })
        setSearchKeys(newSearchKeys)
        return setDisplayedContent(res.data.data)
      })
      .catch(err => alert('can`t get data'))
  }

  useEffect(() => {
    setDisplayedContentFiltered(displayedContent)
  },[displayedContent])

  const searchByKey = (e) => {
    if(e.key !== 'Enter') return
    if(e.target.value.length === 0) return setDisplayedContentFiltered(displayedContent)
    const fuse = new Fuse(displayedContentFiltered,{keys:['title','author_name', 'subject']})
    const results = []
    fuse.search(e.target.value).forEach(result => {
      results.push(result.item)
    })
    setDisplayedContentFiltered(results)
  }
  useEffect(() => {
    if(!userInfoContext.email) return
    requestContent()
  }, [userInfoContext])

  return (
    <Grid container item xs={12} display='flex' direction='column'>
      <Fade>
        <Stack spacing={2} sx={{ mt: 5 }} direction='column' display='flex' alignItems='center'>
          <Stack direction='row' spacing={2} display='flex' justifyContent='center' alignItems='center'>
            <Typography
              fontSize={25}
            >
              Favorite books
            </Typography>
            {searchKeys && <Autocomplete
              selectOnFocus={false}
              options={searchKeys === undefined ? [] : searchKeys}
              sx={{ width: 300 }}
              renderInput={(props) => <TextField {...props} label="Title, author or genre" onKeyPress={e => searchByKey(e)} />}
            />}
            <Tooltip title='Press enter' placement='right'>
              <SearchRoundedIcon sx={{ color: 'action.active', mr: 1, my: 0.5, fontSize: 30, cursor: 'pointer' }} />
            </Tooltip>
            <IconButton onClick={() => setDisplayedContentFiltered(displayedContent)}>
              <HighlightOffIcon/>
            </IconButton>
          </Stack>
          <Stack 
          direction="row" 
            sx={{ 
              maxHeight: '80vh', 
              overflowY: 'auto', 
              p: 1, 
              justifyContent: 'center', 
              flexWrap: 'wrap' 
            }}>
            {displayedContentFiltered.length > 0 && displayedContentFiltered.map((item, itemIndex) => (
              <BookItemCard
                key={itemIndex}
                book={item}
              />
              ))}
          </Stack>
        </Stack>
      </Fade>

    </Grid>
  )
}

export default FavoritesComponent