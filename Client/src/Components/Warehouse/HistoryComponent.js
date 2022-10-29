import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import NavComponent from '../NavSidebar/NavComponent';

const WhHistoryComponent = () => {
  const [logs, setLogs] = useState('')
  useEffect(() => {
    let mounted = true
    if(!mounted) return

    axios.get(`https://${process.env.REACT_APP_SERVER_ADDR}/get_wh_logs`).then(res => {
      setLogs(res.data)
    })
    return function cleanup() {
      mounted = false
    }
  }, [])

  return (
    <Grid container>
      <Grid item xs={1.7}>
        <NavComponent/>
      </Grid>
      <Grid container item xs={10}>
       {logs}
      </Grid>
    </Grid>
  )
}

export default WhHistoryComponent