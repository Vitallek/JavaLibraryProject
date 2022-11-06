import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Menu, MenuItem, Button, Stack, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material"
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CollectionsBookmarkRoundedIcon from '@mui/icons-material/CollectionsBookmarkRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import '@fontsource/roboto/400.css';
import SignInDialog from "../HomePage/SignInDialog";
import Cookies from "js-cookie";
import { Box } from "@mui/system";

const menu = [
  {
    icon: <Box component='img' width={35} src='./pumpkin.svg'/>,
    title: 'Events',
    to: '/events',
    items: []
  },
  {
    icon: <SearchRoundedIcon />,
    title: 'Search',
    to: '/search',
    items: []
  },
  {
    // icon: <HomeRoundedIcon />,
    title: 'About',
    to: '/about',
    items: []
  },
  // {
  //   // icon: <HomeRoundedIcon />,
  //   title: 'Collections',
  //   to: '/collections',
  //   items: []
  // }
]
const Logout = () => {
  Cookies.remove('credentials')
  window.location.reload()
}
const CustomMenuItem = ({ item }) => {
  const Component = SingleLevel
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
      <ListItemText style={{ minWidth: 26, textAlign: 'center' }} primary={item.title} />
    </ListItemButton>
  )
}
const handleOpenMenu = (event, setAnchorEl) => {
  setAnchorEl(event.currentTarget)
}
const handleCloseMenu = (setAnchorEl) => {
  setAnchorEl(null)
}
const handleOpenSignIn = (setDialogOpen, setAnchorEl) => {
  setDialogOpen({
    isOpen: true,
    type: 0
  })
  setAnchorEl(null)
}
const handleOpenReg = (setDialogOpen, setAnchorEl) => {
  setDialogOpen({
    isOpen: true,
    type: 1
  })
  setAnchorEl(null)
}
const TopNavComponent = ({ authorized, role }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const isMenuOpened = Boolean(anchorEl)
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState({ isOpen: false, type: 0 })

  const AuthMenu = () => {
    return (
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={isMenuOpened}
        onClose={() => handleCloseMenu(setAnchorEl)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => { alert('todo') }}>
          <ListItemIcon>
            <AccountCircleRoundedIcon />
          </ListItemIcon>
          <ListItemText>
            Profile
          </ListItemText>
        </MenuItem>
        {role === 'admin' || role === 'head_cheater' ?
          <MenuItem onClick={() => {
            handleCloseMenu(setAnchorEl)
            navigate('/adm')
          }}>
            <ListItemIcon>
              <SupervisorAccountRoundedIcon />
            </ListItemIcon>
            <ListItemText>
              Administration
            </ListItemText>
          </MenuItem> : null
        }
        <MenuItem onClick={() => { 
          handleCloseMenu(setAnchorEl)
          navigate('/favorites')
         }}>
          <ListItemIcon>
            <FavoriteRoundedIcon />
          </ListItemIcon>
          <ListItemText>
            Favourite
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={Logout}>
          <ListItemIcon>
            <LogoutRoundedIcon />
          </ListItemIcon>
          <ListItemText>
            Logout
          </ListItemText>
        </MenuItem>
      </Menu>
    )
  }
  const UnAuthMenu = () => {
    return (
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={isMenuOpened}
        onClose={() => handleCloseMenu(setAnchorEl)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Typography
          sx={{ p: 2, fontSize: 30 }}
          variant="body1"
        >
          Меню
        </Typography>
        <MenuItem onClick={() => handleOpenSignIn(setDialogOpen, setAnchorEl)}>
          <ListItemIcon>
            <LoginRoundedIcon />
          </ListItemIcon>
          <ListItemText>
            Войти
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleOpenReg(setDialogOpen, setAnchorEl)}>
          <ListItemIcon>
            <AccountCircleRoundedIcon />
          </ListItemIcon>
          <ListItemText>
            Зарегистрироваться
          </ListItemText>
        </MenuItem>
      </Menu>
    )
  }

  return (
    <Stack direction='row' spacing={2} display='flex' justifyContent='space-between'>
      <Box
        onClick={() => navigate('/')}
        sx={{
          ml:2,
          cursor: 'pointer',
          height: '100%',
          p: 1
          // width: '100%',
          // maxHeight: { xs: 233, md: 167 },
          // maxWidth: { xs: 350, md: 250 },
        }}
      >
        <AutoStoriesRoundedIcon color="action" fontSize="large" />
      </Box>
      <Stack direction='row' spacing={2}>

        {menu.map((item, key) => <CustomMenuItem key={key} item={item} />)}
        <Button
          startIcon={<MoreVertRoundedIcon />}
          sx={{ color: 'black' }}
          id="basic-button"
          aria-controls={isMenuOpened ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={isMenuOpened ? 'true' : undefined}
          onClick={(e) => handleOpenMenu(e, setAnchorEl)}
        >
        </Button>
        {authorized ? <AuthMenu /> : <UnAuthMenu />}
        <SignInDialog dialogOpen={dialogOpen} setOpen={setDialogOpen} />
      </Stack>
    </Stack>
  )
}
export default TopNavComponent