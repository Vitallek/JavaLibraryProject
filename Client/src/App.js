import './App.css'
import Cookies from 'js-cookie'
import React, {useState, useEffect} from 'react'
import { UserInfoContext } from './UserInfoContext'
import CustomRoutes from './Components/Routes'
import axios from 'axios'

const App = () => {

  let [contextObject, setContextObject] = useState({})

  useEffect(() => {
    if(typeof Cookies.get('token') !== 'undefined'){
      let cookies = JSON.parse(Cookies.get('token'))
      axios.post(`http://${process.env.REACT_APP_SERVER_ADDR}/cookie-login`, cookies).then(response => {
        console.log(response.data)
        const responseJSON = response.data
        setContextObject({
          auth: true, 
          role: responseJSON.role, 
          email: responseJSON.email, 
          name: responseJSON.name,
          favorites: responseJSON.favorites
        })
        // if(responseJSON.msg.code === 200) setAuthorized(true)
      })
      return
    }
    setContextObject({auth: false, role: 'unauth'})
  },[])

  return (
    <UserInfoContext.Provider value={contextObject}>
      <CustomRoutes/>
    </UserInfoContext.Provider>
  )
}

export default App
