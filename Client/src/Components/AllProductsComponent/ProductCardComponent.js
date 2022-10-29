import { useContext, useEffect, useState, useRef } from 'react';
import { Stack, Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { UserInfoContext } from '../../UserInfoContext';
import { Toast } from 'primereact/toast';
import { Button as PrimeButton } from 'primereact/button'
import axios from 'axios'
let buyTimeout
const processOrder = (element,userInfoContext) => {
  element.user_email = userInfoContext.email
  element.user_phone = userInfoContext.phone
  delete element._id
  axios.post(`http://${process.env.REACT_APP_SERVER_ADDR}/order-vehicle/`, element)
    .then(response => {
      console.log(response)
    })
    .catch(err => console.log(err))
}
const showConfirm = (toast, setCardStatus) => {
  toast.current?.show({
    severity: 'success', life: 5000, content: (
      <Stack direction='column' spacing={2}>
        <Typography fontSize={20}>Поздравляем!</Typography>
        <Typography fontSize={15}>Вы заказали автомобиль</Typography>
        <Stack direction='row' spacing={2}>
          {/* <PrimeButton
            type="button"
            label="Посмотреть"
            onClick={() => {
              processOrder(element)
              // clearTimeout(buyTimeout)
              // setCardStatus(2)
              // toast.current.clear()
              navigate('/orders')
            }}
            className="p-button-success"
          /> */}
          <PrimeButton
            type="button"
            label="Отмена"
            onClick={() => {
              clearTimeout(buyTimeout)
              setCardStatus(0)
              toast.current.clear()
            }}
            className="p-button-secondary"
          />
        </Stack>
      </Stack>
    )
  })
}

const MediaCard = ({ element, elIndex }) => {
  const userInfoContext = useContext(UserInfoContext)
  const [cardStatus, setCardStatus] = useState(0)
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
        {cardStatus === 0 &&
          <Button
            size="small"
            onClick={() => {
              if (userInfoContext.auth === false) {
                toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Пожалуйста, авторизуйтесь', life: 3000 });
                return
              }
              setCardStatus(1)
              showConfirm(toast, setCardStatus)

              buyTimeout = setTimeout(() => {
                setCardStatus(2)
                processOrder(element, userInfoContext)
                toast.current.show({severity:'success', summary: 'Заказ создан', life: 3000});
              }, 5000)
            }}
          >
            Купить
          </Button>}
        {cardStatus === 1 &&
          <LoadingButton
            loading
            size="small"
          >
            Купить
          </LoadingButton >}
        {cardStatus === 2 &&
          <Button
            disabled
            size="small"
          >
            Купить
          </Button >}
      </CardActions>
    </Card>
  );
}
export default MediaCard