import { Card, CardContent, CardMedia, Grid, Select, MenuItem, Rating, Stack, TextField, Typography, Autocomplete, Pagination, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import Fade from 'react-reveal/Fade'
import axios from 'axios';
import { Button as PrimeButton } from 'primereact/button'
import "primeflex/primeflex.css";
import 'primeicons/primeicons.css';
import "primereact/resources/primereact.css";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { AuthorItemCard, BookItemCard, SubjectItemCard } from './ItemCardComponent';

const takeValues = [10, 20, 30, 50, 100]

const requestContent = async (setDisplayedContent, selectedField, take, skip) => {
  axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-all/${selectedField.toLocaleLowerCase()}/${take}/${take * skip}`)
    .then(res => {
      console.log(res.data)
      if(selectedField.toLocaleLowerCase() === 'books') setDisplayedContent(res.data.data.slice().sort((el1,el2) => el2.links.length - el1.links.length))
    })
    .catch(err => alert('can`t get data'))
}

const SearchComponent = () => {
  const [searchKeys, setSearchKeys] = useState({})
  const [fields, setFields] = useState([])
  const [selectedField, setSelectedField] = useState('Books')

  const [displayedContent, setDisplayedContent] = useState([])
  const [skipTakeParams, setSkipTakeParams] = useState({
    take: 10,
    skip: 0
  })
  const handleChangePage = (value) => {
    setSkipTakeParams(prev => ({ ...prev, skip: value }))
  }
  const searchByKey = (e, collection) => {
    if (e.key !== 'Enter') return
    axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-with-query/${collection}/${e.target.value}/title`)
      .then(res => {
        setDisplayedContent(res.data.data)
      })
      .catch(err => alert('can`t get data'))
  }

  useEffect(() => {
    requestContent(setDisplayedContent, selectedField, skipTakeParams.take, skipTakeParams.skip)
  }, [selectedField])

  useEffect(() => {
    let mounted = true
    if (!mounted) return
    // axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-content/carousel`)
    //   .then(res => setContent(res.data))
    //   .catch(err => alert('error occured'))
    axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-search-keys`)
      .then(res => {
        delete res.data.code
        let processedData = {
          books: [],
          authors: [],
          subjects: []
        }
        for (const [key, items] of Object.entries(res.data)) {
          items.forEach((element, index) => {
            delete element._id
            if (key === 'books') processedData.books.push(element.title)
            if (key === 'authors') processedData.authors.push(element.author_name)
            if (key === 'subjects') processedData.subjects.push(element.subject)
          })
        }
        setSearchKeys(processedData)
        setFields(Object.keys(processedData).map(field => field.charAt(0).toUpperCase() + field.slice(1)))
      })
      .catch(err => alert('can`t get filter options'))
    return () => mounted = false
  }, [])

  return (
    <Grid container item xs={12} display='flex' direction='column'>
      <Fade>
        <Stack spacing={2} sx={{ mt: 5 }} direction='column' display='flex' alignItems='center'>
          <Stack direction='row' spacing={2} display='flex' justifyContent='center' alignItems='center'>
            <Typography
              fontSize={25}
            >
              Search field
            </Typography>
            <Select
              sx={{ minWidth: "10vw" }}
              value={searchKeys[selectedField.toLowerCase()] === undefined ? '' : selectedField}
              onChange={e => setSelectedField(e.target.value)}
            >
              {fields.map(field => (
                <MenuItem key={field} value={field}>
                  {field}
                </MenuItem>
              ))}
            </Select>
            {searchKeys.books && <Autocomplete
              selectOnFocus={false}
              options={searchKeys[selectedField.toLowerCase()] === undefined ? [] : searchKeys?.[selectedField.toLowerCase()]}
              sx={{ width: 300 }}
              renderInput={(props) => <TextField {...props} label={selectedField} onKeyPress={e => searchByKey(e, selectedField)} />}
            />}
            <Tooltip title='Press enter' placement='right'>
              <SearchRoundedIcon sx={{ color: 'action.active', mr: 1, my: 0.5, fontSize: 30, cursor: 'pointer' }} />
            </Tooltip>
          </Stack>
          <Stack direction="row" sx={{ maxHeight: '80vh', overflowY: 'scroll', p: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {displayedContent.length > 0 && displayedContent.map((item, itemIndex) => {
              if (selectedField.toLocaleLowerCase() === 'books') return (
                <BookItemCard
                  key={itemIndex}
                  book={item}
                  bookIndex={itemIndex}
                />
              )
              if (selectedField.toLocaleLowerCase() === 'authors') return (
                <AuthorItemCard
                  key={itemIndex}
                  author={item}
                  authorIndex={itemIndex}
                />
              )
              if (selectedField.toLocaleLowerCase() === 'subjects') return (
                <SubjectItemCard
                  key={itemIndex}
                  subject={item}
                  subjectIndex={itemIndex}
                />
              )
            })}
          </Stack>
          <Stack direction='row' spacing={2} display='flex' alignItems='center'>
            <Typography
              fontSize={20}
            >
              Show
            </Typography>
            <Select
              value={skipTakeParams.take}
              onChange={e => {
                setSkipTakeParams(prev => ({ ...prev, take: e.target.value }))
                requestContent(setDisplayedContent, selectedField, e.target.value, skipTakeParams.skip)
              }}
            >
              {takeValues.map(field => (
                <MenuItem key={field} value={field}>
                  {field}
                </MenuItem>
              ))}
            </Select>
            <Pagination
              size='large'
              count={searchKeys[selectedField.toLowerCase()] === undefined ? 10 : Math.floor(searchKeys[selectedField.toLocaleLowerCase()].length / skipTakeParams.take)}
              variant="outlined"
              shape="rounded"
              onChange={(e, value) => requestContent(setDisplayedContent, selectedField, skipTakeParams.take, value)}
            />
          </Stack>
        </Stack>
      </Fade>

    </Grid>
  )
}

export default SearchComponent