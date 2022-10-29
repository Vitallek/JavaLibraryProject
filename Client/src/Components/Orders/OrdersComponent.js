import { useState, useEffect, useContext, useRef } from 'react';
import { Grid, Button, Link, Stack, Card, CardMedia, CardContent, CardActions, Typography } from '@mui/material';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { UserInfoContext } from '../../UserInfoContext';
import { Toast } from 'primereact/toast';
import { Button as PrimeButton } from 'primereact/button'

let cancelTimeout
const cancelOrder = (element, email) => {
  delete element._id
  delete element.user_email
  delete element.user_phone
  axios.post(`http://${process.env.REACT_APP_SERVER_ADDR}/cancel-order/`, {vehicle:element, user:email})
    .then(response => {
      console.log(response)
    })
    .catch(err => console.log(err))
}
const OrdersComponent = ({ brands, user }) => {
  const [content, setContent] = useState([])
  const userInfoContext = useContext(UserInfoContext)
  const toast = useRef(null)
  //render component
  useEffect(() => {
    let mounted = true
    if (!mounted) return
    console.log(user.email)
    if (user.email === undefined) return
    axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-orders/${user.email}`)
      .then(response => {
        console.log(response.data)
        if (response.data.data.length === 0) return
        setContent(response.data.data)
      })
      .catch(err => console.log(err))
    return () => mounted = false
  }, [user.email])

  return (
    <Grid item xs={12} sx={{ maxHeight: '80vh', overflowY: 'scroll' }}>
      <Stack direction="row" sx={{ p: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
        {content.map((element, elIndex) =>
          <MediaCard
            key={elIndex}
            element={element}
            elIndex={elIndex}
          />
        )}
      </Stack>
    </Grid>
  )
}

export default OrdersComponent

const showConfirm = (toast, setCardStatus) => {
  toast.current?.show({
    severity: 'success', life: 5000, content: (
      <Stack direction='column' spacing={2}>
        <Typography fontSize={20}>Отменить заказ?</Typography>
        <Stack direction='row' spacing={2}>
          <PrimeButton
            type="button"
            label="Да"
            onClick={() => {
              setCardStatus(0)
              toast.current.clear()
            }}
            className="p-button-secondary"
          />
          <PrimeButton
            type="button"
            label="Нет"
            onClick={() => {
              setCardStatus(1)
              clearTimeout(cancelTimeout)
              toast.current.clear()
            }}
            className="p-button-success"
          />
        </Stack>
      </Stack>
    )
  })
}

const MediaCard = ({ element, elIndex }) => {
  const userInfoContext = useContext(UserInfoContext)
  const [cardStatus, setCardStatus] = useState(element.status)
  const toast = useRef(null)
  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <Toast ref={toast} position="bottom-right" />
      <CardMedia
        component="img"
        height="140"
        image={element.images[elIndex]}
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {`${element.brand} ${element.model} ${element.year} - ${element.price}$`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`
          - Color - ${element.color.name}
          - Transmission - ${element.transmission}
          - ${element.entertainment}
          - ${element.convenience}
          - ${element.fuelType}
          - ${element.safety}
          - ${element.seating}
          `}
        </Typography>
      </CardContent>
      <CardActions>
       {cardStatus === -1 &&
          <LoadingButton
            loading
            size="small"
          >
            Купить
          </LoadingButton >}
        {cardStatus === 0 &&
          <Button
            size="small"
            disabled
          >
            Отмена
          </Button>}
        {cardStatus === 1 &&
          <Button
            size="small"
            onClick={() => {
              showConfirm(toast, setCardStatus)
              setCardStatus(-1)

              cancelTimeout = setTimeout(() => {
                cancelOrder(element, userInfoContext.email)
                toast.current.show({severity:'success', summary: 'Вы отменили заказ', life: 3000})
              }, 5000)
            }}
          >
            Отмена
          </Button>}
        {cardStatus === 2 &&
          <Button
            size="small"
            variant='contained'
            color='warning'
          >
            В обработке
          </Button>}
        {cardStatus === 3 &&
          <Button
            size="small"
            variant='contained'
            color='success'
          >
            Можно забирать
          </Button>}
        {cardStatus === 4 &&
        <Button
          size="small"
          variant='contained'
          color='secondary'
        >
          Выполнен
        </Button>}
      </CardActions>
    </Card>
  );
}
