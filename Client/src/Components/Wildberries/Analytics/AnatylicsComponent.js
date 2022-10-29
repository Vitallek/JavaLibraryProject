import React, {useState, useEffect} from 'react';

import NavComponent from '../../NavSidebar/NavComponent';
import { Grid } from '@mui/material';

import Dnd from './DragAndDrop/Dnd';
import CallApiWildberries from '../../Utility/Wildberries/CallApiWildberries';
import ProcessSellAnalyticsJSON from './Utility/ProcessSellAnalyticsJSON';
import SellAnalyticsTable from './SellAnalyticsTable/SellAnalyticsTable';

const AnalyticsComponent = () => {
  const [doc, setDoc] = useState([])
  const [isDocLoaded, setIsDocLoaded] = useState(false)

  const [combinedData, setCombinedData] = useState([])

  useEffect(() => {
    //wbStocks is main
    if (doc.length === 0) return
    CallApiWildberries(
      'get',
      'https://suppliers-api.wildberries.ru/api/v2/stocks?skip=0&take=1000',
      `https://${process.env.REACT_APP_SERVER_ADDR}/wb-get-stocks`).then(stocks => {
        setCombinedData(ProcessSellAnalyticsJSON(stocks, doc))
        setIsDocLoaded(true)
    })
    
  }, [doc])

  return (
    <Grid container>
      <Grid item xs={1.7}>
        <NavComponent/>
      </Grid>
      <Grid container item xs={10}>
        <Grid item xs={3} className='dnd-wrapper'>
          {/* <Stack direction="column" spacing={2}> */}
            <Dnd setDoc={setDoc} isDocLoaded={isDocLoaded} setIsDocLoaded={setIsDocLoaded} />

          {/* </Stack> */}
        </Grid>

        <Grid item xs={9}>
          <SellAnalyticsTable combinedData={combinedData}/>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default AnalyticsComponent