import SearchIcon from '@mui/icons-material/Search';
import { Button, Grid, MenuItem, Stack, TextField, Typography, Fade } from '@mui/material';
import { Button as PrimeButton } from 'primereact/button'
import { Box } from '@mui/system';
import axios from 'axios';
import "primeflex/primeflex.css";
import 'primeicons/primeicons.css';
import { Carousel } from 'primereact/carousel';
import "primereact/resources/primereact.css";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { Slider } from 'primereact/slider';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MIN_YEAR = 2000
const MIN_PRICE = 0
const MAX_YEAR = new Date().getFullYear()
const MAX_PRICE = 200000
const SELECT_W_MIN_1 = '20vw'
const SELECT_W_MIN_2 = '30vw'
const SELECT_W_MAX_1 = '30vw'
const SELECT_W_MAX_2 = '50vw'

const handleSearch = (searchParams, navigate) => {
  navigate(`/vehicles/${searchParams.brand}/${searchParams.model}/${searchParams.minYear}/${searchParams.maxYear}/${searchParams.minPrice}/${searchParams.maxPrice}/${searchParams.mileage}`)
}
const HomePage = ({ brands }) => {
  let contentItemIndex = 0
  const [content, setContent] = useState([])
  const [searchParams, setSearchParams] = useState({
    brand: '',
    model: '',
    maxPrice: MAX_PRICE,
    minPrice: MIN_PRICE,
    minYear: MIN_YEAR,
    maxYear: MAX_YEAR,
    mileage: 300000
  })
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    if (!mounted) return
    // axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-content/carousel`)
    //   .then(res => setContent(res.data))
    //   .catch(err => alert('error occured'))
    axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-all/mercedes-benz`)
      .then(res => {
        setContent(res.data.data.slice(0, 5))
      })
      .catch(err => alert('error occured'))
    return () => mounted = false
  }, [])
  const itemTemplate = (element) => {
    return (
      // <div className="product-item">
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Stack
          sx={{ pr: 4, display: 'flex', justifyContent: 'center' }}
          direction='column'
          spacing={2}
        >
          <Typography
            fontSize={30}
          >
            Explore cars
          </Typography>
          <Typography
            fontSize={20}
          >
            For customers around the world
          </Typography>
          <Button
            startIcon={<SearchIcon />}
            variant='contained'
            color='secondary'
            sx={{ maxWidth: 200 }}
            onClick={() => navigate('vehicles/Mercedes-Benz')}
          >
            Перейти
          </Button>
        </Stack>

        <Box
          component='img'
          src={element.images[contentItemIndex]}
          sx={{ height: '30vh' }}
          onError={(e) => e.target.src = 'http://unblast.com/wp-content/uploads/2019/06/404-Error-Page-Donut-Template.jpg'}
        />
      </Box>
      // </div>
    )
  }

  return (
    <>
      <Grid item xs={12} sx={{ p: 1, maxHeight: '40vh' }}>
        <Carousel
          value={content}
          numVisible={1}
          numScroll={1}
          className="custom-carousel"
          circular
          showIndicators={false}
          onPageChange={e => {
            if (contentItemIndex > 30) contentItemIndex = 0
            contentItemIndex += 1
          }}
          autoplayInterval={5000}
          itemTemplate={itemTemplate}
        />
      </Grid>
      <Grid item xs={12} sx={{ p: 1, maxHeight: '20vh' }}>
        <Typography
          sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          fontSize={30}
        >
          Давайте начнём
        </Typography>
        <Stack direction='row' sx={{ p: 3, display: 'flex', justifyContent: 'center' }} spacing={2}>
          <TextField
            label='Brand...'
            select
            value={searchParams.brand}
            sx={{ minWidth: SELECT_W_MIN_1, maxWidth: SELECT_W_MAX_1 }}
            onChange={(e) => setSearchParams(prev => ({ ...prev, brand: e.target.value }))}
          >
            {brands.map(brand => <MenuItem key={brand.brand} value={brand.brand}>{brand.brand}</MenuItem>)}
          </TextField>
          {brands.find(brand => brand.brand === searchParams.brand) === undefined
            ?
            <TextField
              label="Model"
              disabled
              value={searchParams.model}
              sx={{ minWidth: SELECT_W_MIN_1, maxWidth: SELECT_W_MAX_1 }}
            />
            :
            <TextField
              label="Model"
              disabled={searchParams.brand.length === 0}
              select
              value={searchParams.model}
              sx={{ minWidth: SELECT_W_MIN_1, maxWidth: SELECT_W_MAX_1 }}
              onChange={(e) => setSearchParams(prev => ({ ...prev, model: e.target.value }))}
            >
              {brands.find(brand => brand.brand === searchParams.brand).models.map(model =>
                <MenuItem key={model} value={model}>{model}</MenuItem>
              )}
            </TextField>
          }
          <TextField
            id='mileage-select'
            label='Max mileage'
            variant="standard"
            onFocus={event => {
              event.target.select();
            }}
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
          <PrimeButton
            disabled={searchParams.brand.length === 0 || searchParams.model.length === 0}
            onClick={e => handleSearch(searchParams, navigate)}
            style={{ minWidth: SELECT_W_MIN_1, maxWidth: SELECT_W_MAX_1, fontSize: 20 }}
          >
            Поиск
          </PrimeButton>
        </Stack>
      </Grid>
    </>

  )
}

export default HomePage