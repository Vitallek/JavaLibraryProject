import React, { useContext, useEffect, useState, useMemo } from "react";
import { BrowserRouter, Routes, Route, useRoutes, Outlet } from "react-router-dom";
import axios from 'axios';
import { Grid } from "@mui/material";
import ProtectedRoutes from "./ProtectedRoutes";
import { UserInfoContext } from "../UserInfoContext";
import HomePage from "./HomePage/HomePage";
import AllFromBrandComponent from "./AllProductsComponent/AllFromBrandComponent";
import UnderConstructionTemplate from "./UnderConstructionTemplate/UnderConstructionTemplate";
import AboutCompany from "./Content/AboutCompany";
import OrdersComponent from "./Orders/OrdersComponent";
import { brandsMock } from './Utility/brandsMock'
import TopNavComponent from "./Navigation/TopNavComponent";

const CustomRoutes = ({ }) => {
  const props = useContext(UserInfoContext)

  useEffect(() => {
    let mounted = true
    if (!mounted) return
    
    return () => mounted = false
  }, [])

  return (
    <BrowserRouter>
      <Grid item xs={12} sx={{maxHeight: 50}} className='topNavContainer'>
        <TopNavComponent authorized={props.auth} role={props.role}/>
      </Grid>
      <Grid container item xs={12} direction='column' flexWrap='nowrap'>
        <Routes>
          <Route path='/' element={<HomePage/>} />



          <Route path='/repair-service' element={<UnderConstructionTemplate />} />
          <Route path='/reviews' element={<UnderConstructionTemplate />} />
          <Route path='/news' element={<UnderConstructionTemplate />} />
          <Route path='/company-about' element={<AboutCompany />} />
          <Route path='/orders' element={<OrdersComponent user={props} />} />

          <Route path='/vehicles'>
            <Route
              path='/vehicles/:brand/'
              element={<AllFromBrandComponent />}
            />
            <Route
              path='/vehicles/:brand/:model'
              element={<AllFromBrandComponent />}
            />
            <Route
              path='/vehicles/:brand/:model/:minYear'
              element={<AllFromBrandComponent />}
            />
            <Route
              path='/vehicles/:brand/:model/:minYear/:maxYear'
              element={<AllFromBrandComponent />}
            />
            <Route
              path='/vehicles/:brand/:model/:minYear/:maxYear/:minPrice'
              element={<AllFromBrandComponent />}
            />
            <Route
              path='/vehicles/:brand/:model/:minYear/:maxYear/:minPrice/:maxPrice'
              element={<AllFromBrandComponent />}
            />
            <Route
              path='/vehicles/:brand/:model/:minYear/:maxYear/:minPrice/:maxPrice/:mileage'
              element={<AllFromBrandComponent />}
            />
          </Route>
          {props.role === 'admin' ?
            <Route path='/moderation/*' element={<ProtectedRoutes />} /> :
            null}
        </Routes>
      </Grid>
    </BrowserRouter>
  )
}

export default CustomRoutes;