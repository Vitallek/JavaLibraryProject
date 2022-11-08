import { Tabs, Tab, Tooltip, Grid } from '@mui/material';
import "primeflex/primeflex.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { useEffect, useState, useContext } from 'react';
import { UserInfoContext } from '../../UserInfoContext';
import CarsComponent from '../Admin/CarsComponent';
import DeployDays from '../Admin/DeployDays';
import AdminOrdersComponent from '../Admin/AdminOrdersComponent';
import BooksTableComponent from './BooksTableComponent';
import AuthorsTableComponent from './AuthorsTableComponent';
import SubjectsTableComponent from './SubjectsTableComponent';

const AdminMainComponent = () => {
  const userInfoContext = useContext(UserInfoContext)
  const [activeTab, setActiveTab] = useState(0)
  const [brands, setBrands] = useState([])
  const switchTab = (event, value) => {
    setActiveTab(value)
  }
  useEffect(() => {
    let mounted = true
    if (!mounted) return
    // axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-all-brands`)
    //   .then(res => setBrands(res.data.data))
    //   .catch(err => alert('error occured'))
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
          <Tab label="Books" />
          <Tab label="Authors" />
          <Tab label="Genres" />
          <Tab label="Content" />
        </Tabs>
        {activeTab === 0 && <BooksTableComponent userInfoContext={userInfoContext}
        />}
        {activeTab === 1 && <AuthorsTableComponent userInfoContext={userInfoContext}
        />}
        {activeTab === 2 && <SubjectsTableComponent userInfoContext={userInfoContext}
        />}
        {activeTab === 3 && <BooksTableComponent userInfoContext={userInfoContext}
        />}
      </Grid>
    </Grid>
  )
}

export default AdminMainComponent