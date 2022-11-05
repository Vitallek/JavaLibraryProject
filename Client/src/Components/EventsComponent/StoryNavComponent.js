import React, { useEffect, useState } from "react"
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse, Box, Grid, TextField } from "@mui/material"
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import { useNavigate } from "react-router-dom"
import useDebounce from '../useDebounce.js'

const NavComponent = ({ menu, setSelectedStory }) => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filteredMenu, setFilteredMenu] = useState([])
  useDebounce(() => {
    setFilteredMenu(
      menu.filter(el => el.event.toLowerCase().includes(search.toLowerCase()))
    )
  }, [menu, search], 800)

  const CustomMenuItem = ({ item , setSelectedStory}) => {
    const navigate = useNavigate()
    const handleClick = (path) => {
      navigate(path)
    }
  
    return (
      <ListItemButton onClick={() => setSelectedStory(item)}>
        <ListItemIcon style={{ minWidth: 26 }}>{item.icon}</ListItemIcon>
        <ListItemText style={{ minWidth: 26 }} primary={item.title} />
      </ListItemButton>
    )
  }
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 1 }}>
        {/* <Box
          onClick={() => navigate('/')}
          component="img"
          sx={{
            cursor:'pointer',
            height: 200,
            p: 1
            // width: '100%',
            // maxHeight: { xs: 233, md: 167 },
            // maxWidth: { xs: 350, md: 250 },
          }}
          alt="company logo"
          src="/company_logo.png"
        /> */}
        <TextField
          id="brand-search"
          label="Halloween"
          variant="outlined"
          fullWidth
          onChange={e => setSearch(e.target.value)}
        />
      </Box>
      {filteredMenu ? filteredMenu.map((item, key) => <CustomMenuItem key={key} item={item} setSelectedStory={setSelectedStory}/>) : 'nothing'}
    </>
  )
}
export default NavComponent