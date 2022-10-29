import './UserStuffPanel.css'
import { Box, Stack } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const calculateLength = (cart) => {
  let reserveAmount = 0
  cart.forEach(element => {
    reserveAmount += element.reserves.length
  });
  return reserveAmount
}

const UserStuffPanel = ({cart}) => {
  const navigate = useNavigate()
  const [cartLength, setCartLength] = useState(calculateLength(cart))

  useEffect(() => {
    //custom method to increase or decrease amount of reserves in cart
    //TODO
    //i dont know how to avoid foreach and use js features
    setCartLength(calculateLength(cart))
  }, [cart])

  return (
    <>
      <Stack className='menu-wrapper' spacing={2} sx={{p:1}} direction='row' textAlign='center'>
        <Box onClick={() => {navigate('/cart')}} style={{cursor: 'pointer'}}>
          {cartLength === 0 ? null : <Box className='cart-counter'>{cartLength}</Box>}
          <ShoppingBagOutlinedIcon sx={{ fontSize: 35 }} />
        </Box>
      </Stack>
    </>
  )
}

export default UserStuffPanel;
