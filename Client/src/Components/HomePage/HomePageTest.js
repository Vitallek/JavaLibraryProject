import { Grid, Button } from '@mui/material';
import * as FCG from 'fantasy-content-generator'
const HomePageTest = ({ }) => {

  //   useEffect(() => {
  //     let mounted = true
  //     if (!mounted) return
  //     axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-all/mercedes-benz`)
  //       .then(res => {
  //         setContent(res.data.data.slice(0, 5))
  //       })
  //       .catch(err => alert('error occured'))
  //     return () => mounted = false
  //   }, [])

  return (
    <Grid item xs={12} sx={{ p: 1, maxHeight: '40vh' }}>
      {JSON.stringify(FCG.Storyhooks.generate())}
    </Grid>
  )
}

export default HomePageTest