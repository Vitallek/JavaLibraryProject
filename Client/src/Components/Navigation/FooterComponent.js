import { useNavigate } from "react-router-dom"
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material"

const menu = [
  {
    // icon: <HomeRoundedIcon />,
    title: 'О компании',
    to: '/company-about',
    items: []
  },
]
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
      <ListItemText style={{ minWidth: 26 }} primary={item.title} />
    </ListItemButton>
  )
}
const FooterComponent = () => {
  return (
    <>
      {menu.map((item, key) => <CustomMenuItem key={key} item={item} />)}
    </>
  )
}
export default FooterComponent