import { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Button, Link, Stack, Typography, TextField, MenuItem, IconButton } from '@mui/material';
import { Slider } from 'primereact/slider';
import { Box } from '@mui/system';
import axios from 'axios';
import {BookItemCard} from '../Search/ItemCardComponent';
import { Button as PrimeButton } from 'primereact/button'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const MIN_YEAR = 2000
const MIN_PRICE = 0
const MAX_YEAR = new Date().getFullYear()
const MAX_PRICE = 200000
const SELECT_W_MIN_1 = '20vw'
const SELECT_W_MIN_2 = '30vw'
const SELECT_W_MAX_1 = '30vw'
const SELECT_W_MAX_2 = '50vw'

const AllFromBrandComponent = ({brands}) => {
  const pageParams = useParams()
  const [content, setContent] = useState([])
  const [filteredContent, setFilteredContent] = useState([])
  const [searchParams, setSearchParams] = useState({
    brand: '',
    model: '',
    maxPrice: MAX_PRICE,
    minPrice: MIN_PRICE,
    minYear: MIN_YEAR,
    maxYear: MAX_YEAR,
    mileage: 300000
  })
  //render component
  useEffect(() => {
    let mounted = true
    if (!mounted) return

    if (pageParams.brand.length === 0) return
    console.log(pageParams)
    let newSearchParams = {...pageParams}
    if (newSearchParams.model === undefined) newSearchParams.model = ''
    if (newSearchParams.maxPrice === undefined) newSearchParams.maxPrice = MAX_PRICE
    if (newSearchParams.minPrice === undefined) newSearchParams.minPrice = MIN_PRICE
    if (newSearchParams.minYear === undefined) newSearchParams.minYear = MIN_YEAR
    if (newSearchParams.maxYear === undefined) newSearchParams.maxYear = MAX_YEAR
    if (newSearchParams.mileage === undefined) newSearchParams.mileage = 300000
    setSearchParams(newSearchParams)
    axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-all/${pageParams.brand.replace(/ /g,'-').toLowerCase()}`)
      .then(response => {
        console.log(response.data)
        setContent(response.data.data)
      })
      .catch(err => console.log(err))

    return () => mounted = false
  }, [pageParams])

  useEffect(() => {
    if(content.length === 0) return
    filterVehicles(content, searchParams)
  }, [content])

  const filterVehicles = (content,searchParams) => {
    console.log(brands)
    console.log(searchParams)
    if(searchParams.brand.length === 0) {
      setFilteredContent(content)
      return
    }
    setFilteredContent(content.filter(el => {
      if(searchParams.model === ''){
        return (
          el.price >= searchParams.minPrice &&
          el.price <= searchParams.maxPrice &&
          el.year >= searchParams.minYear &&
          el.year <= searchParams.maxYear &&
          el.mileage <= searchParams.mileage
        )
      } else {
        return (
          el.model === searchParams.model &&
          el.price >= searchParams.minPrice &&
          el.price <= searchParams.maxPrice &&
          el.year >= searchParams.minYear &&
          el.year <= searchParams.maxYear &&
          el.mileage <= searchParams.mileage
        )
      }
    }))
  }
  return (
    <>
      <Grid item xs={12} sx={{ p: 1, maxHeight:'20vh' }}>
        <Stack direction='row' sx={{ p: 3, display: 'flex', justifyContent: 'center' }} spacing={2}>
          <TextField
            label='Brand...'
            value={searchParams.brand.replace(/-/g,' ')}
            disabled
            sx={{ minWidth: SELECT_W_MIN_1, maxWidth: SELECT_W_MAX_1 }}
          />
          
          {brands.find(brand => brand.brand.toLowerCase() === searchParams.brand.replace(/-/g,' ').toLowerCase()) === undefined
            ?
            <TextField
              label="Model"
              disabled
              value='Model'
              sx={{ minWidth: SELECT_W_MIN_1, maxWidth: SELECT_W_MAX_1 }}
            />
            :
            <TextField
              label="Model"
              select
              value={searchParams.model}
              sx={{ minWidth: SELECT_W_MIN_1, maxWidth: SELECT_W_MAX_1 }}
              onChange={(e) => setSearchParams(prev => ({ ...prev, model: e.target.value }))}
            >
              {brands.find(brand => brand.brand.toLowerCase() === searchParams.brand.replace(/-/g,' ').toLowerCase()).models.map(model =>
                <MenuItem key={model} value={model}>{model}</MenuItem>
              )}
            </TextField>
          }
          <IconButton onClick={e => setSearchParams(prev => ({
            ...prev,
            model: '',
          }))}>
            <DeleteForeverIcon/>
          </IconButton>
          
          <TextField
            id='mileage-select'
            label='Max mileage'
            variant="standard"
            onFocus={event => {
              event.target.select();
            }}
            focused
            sx={{ minWidth: SELECT_W_MIN_1, maxWidth: SELECT_W_MAX_1 }}
            value={searchParams.mileage}
            onChange={(e) => {
              if (e.target.value.length === 0) {
                setSearchParams(prev => ({ ...prev, mileage: '' }))
                return
              }
              if (!/^[0-9]*$/.test(e.target.value)) {
                e.preventDefault()
                return
              }
              setSearchParams(prev => ({ ...prev, mileage: parseInt(e.target.value) }))
            }}
          />
          <IconButton onClick={e => setSearchParams(prev => ({
            ...prev,
            mileage: 300000,
          }))}>
            <DeleteForeverIcon/>
          </IconButton>
        </Stack>
        <Stack direction='row' sx={{ p: 3, display: 'flex', justifyContent: 'center' }} spacing={2}>
          <Box>
            <Typography
              sx={{ mb: 1, minWidth: SELECT_W_MIN_1, maxWidth: SELECT_W_MAX_1 }}
            >
              {`Year range`}
            </Typography>
            <Typography
              sx={{ mb: 1, minWidth: SELECT_W_MIN_1, maxWidth: SELECT_W_MAX_1 }}
            >
              {`${searchParams.minYear} – ${searchParams.maxYear}`}
            </Typography>
            <Slider
              min={MIN_YEAR}
              max={MAX_YEAR}
              range
              style={{ minWidth: SELECT_W_MIN_1, maxWidth: SELECT_W_MAX_1 }}
              value={[searchParams.minYear, searchParams.maxYear]}
              onChange={(e) => setSearchParams(prev => ({ ...prev, minYear: e.value[0], maxYear: e.value[1] }))}
            // onChange={(e) => console.log(e.value)}
            />
          </Box>
          <IconButton onClick={e => setSearchParams(prev => ({
            ...prev,
            minYear: MIN_YEAR,
            maxYear: MAX_YEAR,
          }))}>
            <DeleteForeverIcon />
          </IconButton>
          
          <Box sx={{ pl: 1 }}>
            <Typography
              sx={{ mb: 1, minWidth: SELECT_W_MIN_1, maxWidth: SELECT_W_MAX_1 }}
            >
              {`Price range`}
            </Typography>
            <Typography
              sx={{ mb: 1, minWidth: SELECT_W_MIN_1, maxWidth: SELECT_W_MAX_1 }}
            >
              {`${searchParams.minPrice} – ${searchParams.maxPrice}`}
            </Typography>
            <Slider
              min={MIN_PRICE}
              max={MAX_PRICE}
              range
              style={{ minWidth: SELECT_W_MIN_1, maxWidth: SELECT_W_MAX_1 }}
              value={[searchParams.minPrice, searchParams.maxPrice]}
              onChange={(e) => setSearchParams(prev => ({ ...prev, minPrice: e.value[0], maxPrice: e.value[1] }))}
            // onChange={(e) => console.log(e.value)}
            />
          </Box>
          <IconButton onClick={e => setSearchParams(prev => ({
            ...prev,
            minPrice: MIN_PRICE,
            maxPrice: MAX_PRICE,
          }))}>
            <DeleteForeverIcon />
          </IconButton>
          <PrimeButton
            onClick={() => filterVehicles(content, searchParams)}
            style={{ minWidth: SELECT_W_MIN_1, maxWidth: SELECT_W_MAX_1, fontSize: 20 }}
          >
            Поиск
          </PrimeButton>
        </Stack>
      </Grid>
      <Grid item xs={12} sx={{maxHeight: '80vh',overflowY:'scroll'}}>
        <Stack direction="row" sx={{ p: 1, justifyContent:'center',flexWrap: 'wrap' }}>
          {filteredContent.map((element, elIndex) => 
          <BookItemCard 
            key={elIndex} 
            element={element} 
            elIndex={elIndex} 
          />
          )}
        </Stack>
      </Grid>
    </>
  )
}

export default AllFromBrandComponent;