import { Grid, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

const AboutCompany = ({ brands }) => {

  useEffect(() => {
    let mounted = true
    if (!mounted) return
    console.log(brands)
    // axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-content/carousel`)
    //   .then(res => setContent(res.data))
    //   .catch(err => alert('error occured'))
    return () => mounted = false
  }, [])

  return (
    <Grid item xs={12} sx={{ p: 1 }}>
      <Typography>
        Company-desc
      </Typography>
    </Grid>
  )
}

export default AboutCompany