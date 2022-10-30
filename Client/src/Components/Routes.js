import React, { useContext, useEffect, useState, useMemo } from "react";
import { BrowserRouter, Routes, Route, useRoutes, Outlet } from "react-router-dom";
import axios from 'axios';
import { Grid } from "@mui/material";
import ProtectedRoutes from "./ProtectedRoutes";
import NavComponent from './Navigation/NavComponent'
import { UserInfoContext } from "../UserInfoContext";
import HomePage from "./HomePage/HomePage";
import AllFromBrandComponent from "./AllProductsComponent/AllFromBrandComponent";
import TopNavComponent from "./Navigation/TopNavComponent";
import FooterComponent from "./Navigation/FooterComponent";
import UnderConstructionTemplate from "./UnderConstructionTemplate/UnderConstructionTemplate";
import AboutCompany from "./Content/AboutCompany";
import OrdersComponent from "./Orders/OrdersComponent";
import {brandsMock} from './Utility/brandsMock'
import HomePageTest from "./HomePage/HomePageTest";

const processBrandsList = (brands) => {
  const menu = []
  brands.forEach(brand => {
    menu.push({
      //   icon: <HomeRoundedIcon />,
      title: `${brand.brand} (${parseInt(Math.random() * 50) + 10})`,
      to: `/vehicles/${brand.brand.replace(/ /g,'-')}`,
      items: []
    })
  })
  return menu
}

const CustomRoutes = ({}) => {
  const props = useContext(UserInfoContext)

  const [menu, setMenu] = useState(['Empty'])
  const [brands, setBrands] = useState(brandsMock)

  useEffect(() => {
    let mounted = true
    if(!mounted) return
    axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-all-brands`)
      .then(res => setBrands(res.data.data))
      .catch(err => {
        setBrands(brandsMock)
        alert('error occured')
      })
    return () => mounted = false
  },[])

  const brandsMemoized = useMemo(() => processBrandsList(brands),[brands])
  useEffect(() => {
    setMenu(processBrandsList(brands))
  }, [brands])
  
  return (
    <BrowserRouter>
      <Grid container flexWrap='nowrap'>
        <Grid item xs={2} sx={{ maxWidth: 250, minWidth: 216, height: '100%' }} className='navContainer'>
          <NavComponent menu={menu}/>
        </Grid>
        <Grid container item xs={10} direction='column' flexWrap='nowrap'>
          <Grid item xs={12} sx={{maxHeight: 50}}>
            <TopNavComponent authorized={props.auth} role={props.role}/>
          </Grid>
          <Grid container item xs={12} direction='column' flexWrap='nowrap'>
            <Routes>
              {/* <Route path='/' element={<HomePage brands={brands}/>} /> */}
              <Route path='/' element={<HomePageTest brands={brands}/>} />
              <Route path='/repair-service' element={<UnderConstructionTemplate/>} />
              <Route path='/reviews' element={<UnderConstructionTemplate/>} />
              <Route path='/news' element={<UnderConstructionTemplate/>} />
              <Route path='/company-about' element={<AboutCompany/>} />
              <Route path='/orders' element={<OrdersComponent brands={brands} user={props}/>} />

              <Route path='/vehicles'>
                <Route 
                  path='/vehicles/:brand/' 
                  element={<AllFromBrandComponent brands={brands}/>}
                />
                <Route 
                  path='/vehicles/:brand/:model' 
                  element={<AllFromBrandComponent brands={brands}/>}
                />
                <Route 
                  path='/vehicles/:brand/:model/:minYear' 
                  element={<AllFromBrandComponent brands={brands}/>}
                />
                <Route 
                  path='/vehicles/:brand/:model/:minYear/:maxYear' 
                  element={<AllFromBrandComponent brands={brands}/>}
                />
                <Route 
                  path='/vehicles/:brand/:model/:minYear/:maxYear/:minPrice' 
                  element={<AllFromBrandComponent brands={brands}/>}
                />
                <Route 
                  path='/vehicles/:brand/:model/:minYear/:maxYear/:minPrice/:maxPrice' 
                  element={<AllFromBrandComponent brands={brands}/>}
                />
                <Route 
                  path='/vehicles/:brand/:model/:minYear/:maxYear/:minPrice/:maxPrice/:mileage' 
                  element={<AllFromBrandComponent brands={brands}/>}
                />
              </Route>
              {props.role === 'admin' || props.role === 'head_cheater' ?
               <Route path='/adm/*' element={<ProtectedRoutes/>}/> :
                null}
            </Routes>
          </Grid>
        </Grid>
      </Grid>
      {/* <Grid item xs={12} sx={{maxHeight: 50}}>
        footer
        <FooterComponent/>
      </Grid> */}
    </BrowserRouter>
  )
}

export default CustomRoutes;