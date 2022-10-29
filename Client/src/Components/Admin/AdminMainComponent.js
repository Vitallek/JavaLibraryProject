import { Tabs, Tab, Tooltip, Grid } from '@mui/material';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import axios from 'axios';
import "primeflex/primeflex.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { useEffect, useState, useContext } from 'react';
import { UserInfoContext } from '../../UserInfoContext';
import CarsComponent from './CarsComponent';
import DeployDays from './DeployDays';
import AdminOrdersComponent from './AdminOrdersComponent';

const AdminMainComponent = () => {
  const props = useContext(UserInfoContext)
  const [activeTab, setActiveTab] = useState(0)
  const [brands, setBrands] = useState([])
  const switchTab = (event, value) => {
    setActiveTab(value)
  }
  useEffect(() => {
    let mounted = true
    if (!mounted) return
    axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-all-brands`)
      .then(res => setBrands(res.data.data))
      .catch(err => alert('error occured'))
    return () => mounted = false
  }, [])

  return (
    <Grid container>
      <Grid item xs={12}>
        <Tabs
          variant='fullWidth'
          onChange={switchTab}
          value={activeTab}
          textColor="inherit"
          indicatorColor="string"
        >
          <Tab label="Авто" />
          <Tab label="Заказы" />
          {/* <Tab label="Контент" /> */}
          <Tab label="Пользователи" />
          <Tab color='error' label="Памятка разработчику!" icon={
            <Tooltip title="Важно!">
              <WarningRoundedIcon color='error'/>
            </Tooltip> }/>
        </Tabs>
        {activeTab === 0 && <CarsComponent
          brands={brands}
        />}
        {activeTab === 1 && <AdminOrdersComponent
          brands={brands}
        />}
        {/* {activeTab === 2 && <WbPricesComponent
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
        />} */}
        {activeTab === 3 && <DeployDays/>}
      </Grid>
    </Grid>
  )
}

export default AdminMainComponent