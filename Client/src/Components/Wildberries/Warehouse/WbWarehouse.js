import React, { useEffect, useState } from 'react';

import NavComponent from '../../NavSidebar/NavComponent';
import { Grid, Button, Tabs, Tab, Stack } from '@mui/material';
import CallApiWildberries from '../../Utility/Wildberries/CallApiWildberries';

import '@fontsource/roboto/400.css';
import Dnd from './DragAndDrop/Dnd';

import { CompareStocksWB_Prem, ComparePriceWB_Prem, CompareDiscountWB_Prem } from './Utility/CompareDataWB_Prem';
import WbCombinedTable from './WbCombinedTable/WbCombinedTable';
import CreateCombinedData from './Utility/CreateCombinedData';
import WbStocksComponent from './WbStocksComponent/WbStocksComponent';
import WbPricesComponent from './WbPricesComponent/WbPricesComponent';
import WbDiscountsComponent from './WbDiscountsComponent/WbDiscountsComponent';
import { getWbWarehouseConfig } from '../../Utility/Wildberries/CallApiWildberries';

const pushStocks = (wbNewStocks, premStocks) => {
  if (!window.confirm('Загрузить остатки?')) return
  CallApiWildberries(
    'post', 
    'https://suppliers-api.wildberries.ru/api/v2/stocks', 
    `https://${process.env.REACT_APP_SERVER_ADDR}/wb-post-stocks`, 
    JSON.stringify({wbNewStocks: wbNewStocks, premStocks: premStocks})
  )
  .then(data => {
    if (data != null) {
      console.log(data)
      alert('Остатки были загружены')
    }
  })
  .catch(e => {
    alert(JSON.stringify(e))
    console.log(e)
  })
}
const pushPrice = (wbNewPrice) => {
  if (!window.confirm('Загрузить цены?')) return
  CallApiWildberries('post', 'https://suppliers-api.wildberries.ru/public/api/v1/prices', `https://${process.env.REACT_APP_SERVER_ADDR}/wb-post-price`, JSON.stringify(wbNewPrice))
      .then(data => {
        if (data != null) {
          console.log(data)
          alert('Цены были загружены')
        }
      })
      .catch(e => {
        alert(JSON.stringify(e))
        console.log(e)
      })
}
const pushDiscount = (wbNewDiscount) => {
  if (!window.confirm('Загрузить скидки?')) return
  CallApiWildberries('post', 'https://suppliers-api.wildberries.ru/public/api/v1/updateDiscounts', `https://${process.env.REACT_APP_SERVER_ADDR}/wb-post-discount`, JSON.stringify(wbNewDiscount))
  .then(data => {
    if (data != null) {
      console.log(data)
      alert('Скидки были загружены')
    }
  })
  .catch(e => {
    alert(JSON.stringify(e))
    console.log(e)
  })
}

const WbWarehouse = () => {
  const [activeTab, setActiveTab] = useState(0)

  const [config, setConfig] = useState({})

  const [premStocks, setPremStocks] = useState([])
  const [isPriceLoaded, setIsPriceLoaded] = useState(false)

  const [wbStocks, setWbStocks] = useState([])
  const [wbInfo, setWbInfo] = useState([])

  const [wbNewStocks, setNewWbStocks] = useState([])
  const [wbNewPrice, setNewWbPrice] = useState([])
  const [wbNewDiscount, setNewWbDiscount] = useState([])

  const [combinedData, setCombinedData] = useState([])

  //on page load get two main json from WB
  useEffect(() => {
    let mounted = true
    if(!mounted) return
    
    getWbWarehouseConfig(`https://${process.env.REACT_APP_SERVER_ADDR}/wb-get-wh-config`).then((config) => {
      setConfig(config)
    })

    CallApiWildberries(
      'get',
      'https://suppliers-api.wildberries.ru/api/v2/stocks?skip=0&take=1000',
      `https://${process.env.REACT_APP_SERVER_ADDR}/wb-get-stocks`).then(stocks => {
        setWbStocks(stocks)
      })

    CallApiWildberries(
      'get',
      'https://suppliers-api.wildberries.ru/public/api/v1/info?quantity=0',
      `https://${process.env.REACT_APP_SERVER_ADDR}/wb-get-info`).then(info => {
        setWbInfo(info)
      })
      
    return function cleanup() {
      mounted = false
    }
  }, [])

  //process json-s from WB to create combined table 
  useEffect(() => {
    console.log(wbStocks)
    try {
      if (typeof wbInfo != 'undefined' &&
        typeof wbStocks != 'undefined') {
        setCombinedData(CreateCombinedData(wbStocks, wbInfo))
        setNewWbDiscount(CompareDiscountWB_Prem(premStocks, wbStocks, config))
      }
    } catch (error) {
      console.log(error)
    }
  }, [wbInfo, wbStocks])

  useEffect(() => {
    console.log(wbNewStocks)
  }, [wbNewStocks])

  //load prem price
  useEffect(() => {
    if (premStocks.length > 0) {
      setIsPriceLoaded(true)
      //set stocks
      setNewWbStocks(CompareStocksWB_Prem(premStocks, wbStocks, config))
      //set prices
      ComparePriceWB_Prem(premStocks, wbStocks, config).then(data => {
        setNewWbPrice(data)
      })
      console.log(premStocks.length)
    }
  }, [premStocks])

  const switchTab = (event, value) => {
    setActiveTab(value)
  }

  return (
    <Grid container>
      <Grid item xs={1.7}>
        <NavComponent />
      </Grid>
      <Grid container item xs={10}>
        <Grid item xs={3} className='dnd-wrapper'>
          <Stack direction="column" spacing={2}>
            <Dnd setPremPrice={setPremStocks} isPriceLoaded={isPriceLoaded} setIsPriceLoaded={setIsPriceLoaded} />

            <Button variant="contained" color="secondary" disabled={!isPriceLoaded} onClick={() => { pushStocks(wbNewStocks, premStocks) }}>{`Выгрузить остатки`}</Button>
            <Button variant="contained" color="secondary" disabled={!isPriceLoaded} onClick={() => { pushPrice(wbNewPrice) }}>{`Выгрузить цены`}</Button>
            <Button variant="contained" color="secondary" disabled={wbNewDiscount.length === 0} onClick={() => { pushDiscount(wbNewDiscount) }}>
              {`Выгрузить скидку ${config.custom?.discount.defaultDiscount}%`}
            </Button>
          </Stack>
        </Grid>

        <Grid item xs={9}>
          <Tabs
            onChange={switchTab}
            value={activeTab}
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab label="Общее" />
            <Tab label="Остатки" />
            <Tab label="Цены" />
            <Tab label="Скидки" />
          </Tabs>
          {activeTab === 0 && <WbCombinedTable
            combinedData={combinedData}
            wbStocks={wbStocks}
          />}
          {activeTab === 1 && <WbStocksComponent
            config={config}
            setConfig={setConfig}
            combinedData={combinedData}
            wbStocks={wbStocks}
            premPrice={premStocks}
            wbNewStocks={wbNewStocks}
            setNewWbStocks={setNewWbStocks}
            isPriceLoaded={isPriceLoaded}
          />}
          {activeTab === 2 && <WbPricesComponent
            config={config}
            setConfig={setConfig}
            combinedData={combinedData}
            wbStocks={wbStocks}
            premPrice={premStocks}
            setNewWbPrice={setNewWbPrice}
            isPriceLoaded={isPriceLoaded}
          />}
          {activeTab === 3 && <WbDiscountsComponent
            config={config}
            setConfig={setConfig}
            combinedData={combinedData}
            wbStocks={wbStocks}
            setNewWbDiscount={setNewWbDiscount}
          />}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default WbWarehouse;