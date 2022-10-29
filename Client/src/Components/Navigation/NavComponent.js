import React, { useEffect, useState } from "react"
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse, Box, Grid, TextField } from "@mui/material"
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import { useNavigate } from "react-router-dom"
import useDebounce from '../useDebounce.js'

const hasChildren = (item) => {
  const { items: children } = item

  if (children === undefined) {
    return false
  }

  if (children.constructor !== Array) {
    return false
  }

  if (children.length === 0) {
    return false
  }

  return true
}
const CustomMenuItem = ({ item }) => {
  const Component = hasChildren(item) ? MultiLevel : SingleLevel
  return <Component item={item} />
}
const SingleLevel = ({ item }) => {
  const navigate = useNavigate()
  const handleClick = (path) => {
    navigate(path)
  }

  return (
    <ListItemButton onClick={() => handleClick(item.to)}>
      <ListItemIcon style={{ minWidth: 26 }}>{item.icon}</ListItemIcon>
      <ListItemText style={{ minWidth: 26 }} primary={item.title} />
    </ListItemButton>
  )
}

const MultiLevel = ({ item }) => {
  const { items: children } = item
  const [open, setOpen] = useState(false)
  const handleClick = (path) => {
    setOpen((prev) => !prev)
  }

  return (
    <React.Fragment>
      <ListItemButton sx={{ flexGrow: 4 }} onClick={() => handleClick(item.to)}>
        <ListItemIcon style={{ minWidth: 26 }}>{item.icon}</ListItemIcon>
        <ListItemText style={{ minWidth: 26 }} primary={item.title} />
        {open ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children.map((child, key) => (
            <CustomMenuItem key={key} item={child} />
          ))}
        </List>
      </Collapse>
    </React.Fragment>
  )
}
const NavComponent = ({ menu }) => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filteredMenu, setFilteredMenu] = useState([])
  useDebounce(() => {
    setFilteredMenu(
      menu.filter(el => el.title.toLowerCase().includes(search.toLowerCase()))
    )
  }, [menu, search], 800)
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 1 }}>
        <Box
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
        />
        {/* <SearchRoundedIcon sx={{ color: 'action.active'}} /> */}
        <TextField
          id="brand-search"
          label="Введите бренд"
          variant="outlined"
          fullWidth
          onChange={e => setSearch(e.target.value)}
        />
      </Box>
      {filteredMenu ? filteredMenu.map((item, key) => <CustomMenuItem key={key} item={item} />) : 'nothing'}
    </>
  )
}
export default NavComponent