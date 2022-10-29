import React, { useEffect, useRef, useState } from 'react';

import NavComponent from '../NavSidebar/NavComponent';
import { Grid, TextField, Stack, List, Button, Box } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import '../../App.css'
import '@fontsource/roboto/400.css';
import { GetLogs, GetWarehouse } from '../Utility/Warehouse/CallWarehouse';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import RestorePageRoundedIcon from '@mui/icons-material/RestorePageRounded';
import { UpdateWarehouse } from '../Utility/Warehouse/CallWarehouse';
import BoxesStack from './Boxes/BoxesStack';
import Cookies from 'js-cookie';
// import { AddBoxDialog } from './Dialogs(using prompt)/AddBoxDialog';

const skipInputVal = 3
const enterKey = 13

const handleSearchBoxByEnter = (e, selectedBox, warehouse, setSelectedBox, setFilteredWarehouse) => {
  if(e.keyCode === enterKey){
    const filtered = warehouse.filter(element =>
      element.box === selectedBox
    )
    setSelectedBox(selectedBox)
    setFilteredWarehouse(filtered)
  }
}

const handleArticleSearch = (e, filteredWarehouse, warehouse, setSelectedArticle, setFilteredWarehouse) => {
  if (e.target.value.length === 0) {
    if (filteredWarehouse.length === warehouse.length) return
    setSelectedArticle(e.target.value)
    setFilteredWarehouse(warehouse)
    return
  }

  if(e.target.value.length < skipInputVal) {
    // setSelectedArticle(e.target.value)
    return
  }

  setSelectedArticle(e.target.value)
  setFilteredWarehouse(warehouse.filter(element =>
    element.articles.some(article =>
      article.toLowerCase().includes(e.target.value.toLowerCase())
    )
  ))
}

const handleBoxSearch = (e, filteredWarehouse, warehouse, setSelectedBox, setFilteredWarehouse) => {
  if (e.target.value.length === 0) {
    if (filteredWarehouse.length === warehouse.length) return
    setSelectedBox(e.target.value)
    setFilteredWarehouse(warehouse)
    return
  }
  const filtered = warehouse.filter(element =>
    element.box === e.target.value
  )
  setSelectedBox(e.target.value)
  setFilteredWarehouse(filtered)
}

const handleAddBox = (warehouse, setWarehouse) => {
  const boxNum = window.prompt('Номер коробки, которую добавляем')
  if (boxNum === null) return
  const modifiedWarehouse = [...warehouse]
  if (modifiedWarehouse.filter(box => box.box === boxNum).length > 0) {
    alert('Коробка с таким номером уже существует')
    return
  }
  modifiedWarehouse.push({
    box: boxNum,
    articles: []
  })
  modifiedWarehouse.sort((box1, box2) => box1.box - box2.box)
  setWarehouse(modifiedWarehouse)
  let msg = `${JSON.parse(Cookies.get('credentials')).username} added box ${boxNum}`
  UpdateWarehouse(`https://${process.env.REACT_APP_SERVER_ADDR}/update_warehouse`, modifiedWarehouse, msg)
}

const handleDownloadLogs = async () => {
  window.open(`https://${process.env.REACT_APP_SERVER_ADDR}/get_wh_logs`, '_blank')
  // console.log(await GetLogs(`https://${process.env.REACT_APP_SERVER_ADDR}/get_wh_logs`))
}
const WarehouseMain = () => {

  const [warehouse, setWarehouse] = useState([])
  const [filteredWarehouse, setFilteredWarehouse] = useState(warehouse)
  const [selectedArticle, setSelectedArticle] = useState('')
  const [selectedBox, setSelectedBox] = useState('')
  // const articleInput = useRef(null)
  const boxInput = useRef(null)

  useEffect(() => {
    let mounted = true
    if(mounted){
      GetWarehouse(`https://${process.env.REACT_APP_SERVER_ADDR}/get_warehouse`).then(data => {
        if (data != null) {
          setWarehouse(data)
        }
      })
    }
    return function cleanup(){
      mounted = false
    }
  }, [])

  useEffect(() => {
    setFilteredWarehouse(warehouse)
  }, [warehouse])

  return (
    <Grid container>
      <Grid item xs={1.7}>
        <NavComponent />
      </Grid>
      <Grid container item xs={10}>
        <Grid item xs={12}>
          <Stack direction='row' spacing={1} sx={{ ml: 2, mt: 1 }} style={{ alignItems: 'center' }}>
            <SearchRoundedIcon fontSize='large' />
            <TextField
              onChange={e => handleArticleSearch(e, filteredWarehouse, warehouse, setSelectedArticle, setFilteredWarehouse)}
              // inputRef={articleInput}
              // value={selectedArticle}
              id="article_input"
              label="Артикул"
            />
            <TextField
              onChange={e => handleBoxSearch(e, filteredWarehouse, warehouse, setSelectedBox, setFilteredWarehouse)}
              inputRef={boxInput}
              value={selectedBox}
              id="article_input"
              label="Коробка"
              onKeyDown={(e) => handleSearchBoxByEnter(e, selectedBox, warehouse, setSelectedBox, setFilteredWarehouse)}
            />
            <Button variant="contained" color="success" onClick={() => handleAddBox(warehouse, setWarehouse)}>
              <InboxRoundedIcon fontSize='large' />
            </Button>
            <Button variant="contained" color="inherit" onClick={() => handleDownloadLogs()}>
              <RestorePageRoundedIcon fontSize='large' />
            </Button>
            {/* <AddBoxDialog warehouse={warehouse} setWarehouse={setWarehouse}/> */}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <List sx={{ mt: 1 }} style={{ maxHeight: '82vh', overflowY: 'auto' }}>
            <BoxesStack
              filteredWarehouse={filteredWarehouse}
              
              article={selectedArticle}
              warehouse={warehouse}
              setWarehouse={setWarehouse}
            />
          </List>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default WarehouseMain;