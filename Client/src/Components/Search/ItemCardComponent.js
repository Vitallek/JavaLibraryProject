import { useContext, useEffect, useState, useRef } from 'react';
import { Stack, Card, CardActions, CardContent, CardMedia, Button, Typography, Rating } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { UserInfoContext } from '../../UserInfoContext';
import { Toast } from 'primereact/toast';
import { Button as PrimeButton } from 'primereact/button'
import axios from 'axios'
let buyTimeout
const processOrder = (element, userInfoContext) => {
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

export const BookItemCard = ({ book, bookIndex }) => {
  const userInfoContext = useContext(UserInfoContext)
  const [cardStatus, setCardStatus] = useState(0)
  const toast = useRef(null)
  return (
    <Card
      key={bookIndex}
      sx={{
        minWidth: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '350px',
        m: 2
      }}
    >
      <Toast ref={toast} position="bottom-right" />
      <CardMedia
        component="img"
        height={200}
        image={book.image}
        alt="green iguana"
      />
      <CardContent>
        <div>
          <strong>{book.title}</strong>{` - `}<br />
          <span>{book.author_name}</span>

        </div>
      </CardContent>
      <CardContent>
        <Typography display='flex' alignItems='center'>
          <Typography component="legend">{parseFloat(book.rate).toFixed(1)}</Typography>
          <Rating name="read-only" value={Math.floor(book.rate)} readOnly />
        </Typography>
      </CardContent>
    </Card>
  );
}