import React, { useContext, useEffect, useState, useMemo } from "react";
import { BrowserRouter, Routes, Route, useRoutes, Outlet } from "react-router-dom";
import { Grid } from "@mui/material";
import ProtectedRoutes from "./ProtectedRoutes";
import { UserInfoContext } from "../UserInfoContext";
import HomePage from "./HomePage/HomePage";
import AllFromBrandComponent from "./ItemComponent/BookComponent";
import UnderConstructionTemplate from "./UnderConstructionTemplate/UnderConstructionTemplate";
import AboutCompany from "./Content/AboutCompany";
import TopNavComponent from "./Navigation/TopNavComponent";
import SearchComponent from "./Search/SearchComponent";
import BookComponent from "./ItemComponent/BookComponent";
import EventsComponent from "./EventsComponent/EventsComponent";
import FavoritesComponent from "./Favorites/FavoritesComponent";

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
          <Route path='/search' element={<SearchComponent />} />
          <Route path='/events' element={<EventsComponent />} />
          <Route path='/favorites' element={<FavoritesComponent />} />
          <Route path='/book/:id' element={<BookComponent />} />
          <Route path='/about' element={<HomePage />} />
          <Route path='/account' element={<HomePage />} />

          {props.role === 'admin' ?
            <Route path='/content-moderation/*' element={<ProtectedRoutes />} /> :
            null}
        </Routes>
      </Grid>
    </BrowserRouter>
  )
}

export default CustomRoutes;