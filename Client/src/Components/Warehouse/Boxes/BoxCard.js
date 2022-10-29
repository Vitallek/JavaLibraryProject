import React, { useRef, useState} from 'react';
import './BoxCard.css'
import { Card, CardActions, CardContent, Button, Typography, Stack, IconButton, TextField } from '@mui/material';
import MoveUpRoundedIcon from '@mui/icons-material/MoveUpRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { PrintBox } from '../../Utility/Warehouse/CallWarehouse';
import { UpdateWarehouse } from '../../Utility/Warehouse/CallWarehouse';
import Cookies from 'js-cookie';

const skipInputVal = 2
const enterKey = 13
const escapeKey = 27

const printBox = (boxNumber) => {
  if (window.confirm('Распечатать артикулы?')){
    PrintBox(`https://${process.env.REACT_APP_SERVER_ADDR}/print_box`,  boxNumber).then(data => {
      const file = new Blob([data], {
        type: "application/pdf"
      })
      //Build a URL from the file
      const fileURL = URL.createObjectURL(file);
      //Open the URL on new Window
      window.open(fileURL);
    })
  }
}

const cardSettings = {
  cardSpacing: 1,
  boxSpacing: 1,
  headerFontSize: 20,
  cardMinW: 300,
  cardMaxW: 300,
}

const handleRemoveBox = (boxNum, boxArticles, warehouse, setWarehouse) => {
  if (boxArticles.length > 0) {
    alert('В коробке что-то есть')
    return
  }
  if (window.confirm('Удалить коробку?')){
    const modifiedWarehouse = [...warehouse]
    const indexOfBoxToRm = modifiedWarehouse.findIndex(box => box.box === boxNum)
    if(indexOfBoxToRm === -1){
      alert('Такой коробки не существует')
      return
    }
    modifiedWarehouse.splice(indexOfBoxToRm, 1)
    setWarehouse(modifiedWarehouse)
    let msg = `${JSON.parse(Cookies.get('credentials')).username} removed box ${boxNum}`
    UpdateWarehouse(`https://${process.env.REACT_APP_SERVER_ADDR}/update_warehouse`, modifiedWarehouse, msg)
  } 
}

const handleRemoveArticle = (boxNum, articleToRm, boxArticles, warehouse, setBoxArticles) => {
  if (window.confirm('Удалить артикул?')){
    const modifiedArticles = [...boxArticles]
    const indexOfArtToRm = modifiedArticles.findIndex(article => article === articleToRm)
    if(indexOfArtToRm === -1){
      alert('Товара с таким артикулом тут нет')
      return
    }
    modifiedArticles.splice(indexOfArtToRm, 1)
    setBoxArticles(modifiedArticles)

    const modifiedWarehouse = [...warehouse]
    const indexOfBoxWhereRemove = modifiedWarehouse.findIndex(box => box.box === boxNum)
    modifiedWarehouse[indexOfBoxWhereRemove].articles = [...modifiedArticles]
    let msg = `${JSON.parse(Cookies.get('credentials')).username} removed product ${articleToRm} from box ${boxNum}`
    UpdateWarehouse(`https://${process.env.REACT_APP_SERVER_ADDR}/update_warehouse`, modifiedWarehouse, msg)    
  }     
}

const handleAddArticle = (boxNum, boxArticles, warehouse, setBoxArticles) => {
  const article = window.prompt('Что добавляем?')
  if(article === null) return
  const modifiedArticles = [...boxArticles]
  if (modifiedArticles.filter(existArt => existArt === article).length > 0) {
    alert('Товар с таким артикулом уже есть в этой коробке')
    return
  }
  modifiedArticles.push(article)
  setBoxArticles(modifiedArticles)

  const modifiedWarehouse = [...warehouse]
  const indexOfBoxToAdd = modifiedWarehouse.findIndex(box => box.box === boxNum)
  modifiedWarehouse[indexOfBoxToAdd].articles = [...modifiedArticles]
  let msg = `${JSON.parse(Cookies.get('credentials')).username} added product ${article} to box ${boxNum}`
  UpdateWarehouse(`https://${process.env.REACT_APP_SERVER_ADDR}/update_warehouse`, modifiedWarehouse, msg)    
}

const handleMoveArticle = (boxFrom, articleToMove, warehouse, setBoxArticles) => {
  const boxTo = window.prompt('В какую коробку?')
  if(boxTo === null) return
  const modifiedWarehouse = [...warehouse]
  let msg = `${JSON.parse(Cookies.get('credentials')).username} moved PART of ${articleToMove} to ${boxTo}`

  if (!window.confirm('Перенести часть?')) {
    //remove from box1
    const indexOfBoxFromRmArt = modifiedWarehouse.findIndex(box => box.box === boxFrom)
    const indexOfArtToRm = modifiedWarehouse[indexOfBoxFromRmArt].articles.findIndex(article => article === articleToMove)
    modifiedWarehouse[indexOfBoxFromRmArt].articles.splice(indexOfArtToRm, 1)
    setBoxArticles([...modifiedWarehouse[indexOfBoxFromRmArt].articles])
    msg = `${JSON.parse(Cookies.get('credentials')).username} moved ALL ${articleToMove} to ${boxTo}`
  } 
  //add to box2
  const indexOfBoxWhereAdd = modifiedWarehouse.findIndex(box => box.box === boxTo)
  console.log(modifiedWarehouse[indexOfBoxWhereAdd].articles.findIndex(article => article === articleToMove))
  if(modifiedWarehouse[indexOfBoxWhereAdd].articles.findIndex(article => article === articleToMove) === -1) {
    modifiedWarehouse[indexOfBoxWhereAdd].articles.push(articleToMove)
  }

  UpdateWarehouse(`https://${process.env.REACT_APP_SERVER_ADDR}/update_warehouse`, modifiedWarehouse, msg)    
}

const mergeNoDuplucates = (arrays) => {
  return [...new Set([].concat(...arrays))]
}
const handleMergeBoxes = (boxNum, warehouse, setWarehouse) => {
  const BoxWhereMerge = window.prompt(`Объединить коробку ${boxNum} в коробку...`)
  if (BoxWhereMerge === null) return
  const modifiedWarehouse = [...warehouse]

  const indexOfBoxWhereMerge = modifiedWarehouse.findIndex(box => box.box === BoxWhereMerge)
  const indexOfBoxToMerge = modifiedWarehouse.findIndex(box => box.box === boxNum)

  const mergedArticles = [...mergeNoDuplucates([
    modifiedWarehouse[indexOfBoxWhereMerge].articles, 
    modifiedWarehouse[indexOfBoxToMerge].articles
  ])]
  modifiedWarehouse[indexOfBoxWhereMerge].articles = [...mergedArticles]
  modifiedWarehouse.splice(indexOfBoxToMerge, 1)
  setWarehouse(modifiedWarehouse)
  let msg = `${JSON.parse(Cookies.get('credentials')).username} merged box ${boxNum} to box ${BoxWhereMerge}`
  UpdateWarehouse(`https://${process.env.REACT_APP_SERVER_ADDR}/update_warehouse`, modifiedWarehouse, msg)    
}

const onBoxNumChanged = (e, oldBoxNum, setBoxNum, setIsEditingNum, warehouse) => {
  if(e.keyCode === enterKey){
    let newBoxNum = e.target.value
    const modifiedWarehouse = [...warehouse]
    if(modifiedWarehouse.some(box => box.box === newBoxNum)){
      window.alert(' Коробка с таким номером уже есть и это может привести к ошибкам')
      setIsEditingNum(false)
      setBoxNum(oldBoxNum)
      return
    } else {
      const indexOfBoxToRename = modifiedWarehouse.findIndex(box => box.box === oldBoxNum)
      modifiedWarehouse[indexOfBoxToRename].box = newBoxNum
      setBoxNum(newBoxNum)
      let msg = `${JSON.parse(Cookies.get('credentials')).username} renamed box ${oldBoxNum} to ${newBoxNum}`
      UpdateWarehouse(`https://${process.env.REACT_APP_SERVER_ADDR}/update_warehouse`, modifiedWarehouse, msg)
    }
    setIsEditingNum(false)
    return
  }
  if(e.keyCode === escapeKey) setIsEditingNum(false)
}

const BoxCard = ({ box, selectedArticle, warehouse, setWarehouse}) => {
  const [boxArticles, setBoxArticles] = useState(box.articles)

  const [boxNum, setBoxNum] = useState(box.box)
  const [isEditingNum, setIsEditingNum] = useState(false)
  const boxNumInput = useRef(null)

  return (
    <Card
      sx={{ minWidth: cardSettings.cardMinW, m: cardSettings.cardSpacing, maxWidth: cardSettings.cardMaxW }}
      style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}
    >
      <CardContent>
        <Typography 
          onClick={() => setIsEditingNum(true)} 
          sx={{ 
            fontSize: cardSettings.headerFontSize,
          }} 
          width={100}
          component={'span'} 
          color="text.secondary" 
          gutterBottom
        >
          {`Коробка `}
          {!isEditingNum ? boxNum :
            <TextField
              autoFocus
              onChange={(e) => setBoxNum(e.target.value)}
              inputRef={boxNumInput}
              value={boxNum}
              id="box_num_input"
              label="Номер"
              onKeyDown={(e) => onBoxNumChanged(e, box.box, setBoxNum, setIsEditingNum, warehouse)}
            />
          }
        </Typography>

        <Stack direction="row" spacing={cardSettings.boxSpacing} flexWrap='wrap'>
          {boxArticles.map(article =>
            selectedArticle.length > skipInputVal && article.toLowerCase().includes(selectedArticle.toLowerCase()) ? (
              <Stack key={article} direction='row' className='article-wrapper-selected' sx={{ p: 0.5, ml: 1 }}>
                <Typography sx={{ fontSize: cardSettings.headerFontSize * 0.7 }} color="text.secondary">
                  {article.replace(/['"]+/g, '')}
                </Typography>
                <IconButton size='medium' onClick={() => handleMoveArticle(boxNum, article, warehouse, setBoxArticles)}>
                  <MoveUpRoundedIcon />
                </IconButton>
                <IconButton size='medium' onClick={() => handleRemoveArticle(boxNum, article, boxArticles, warehouse, setBoxArticles)}>
                  <DeleteForeverRoundedIcon />
                </IconButton>
              </Stack>
            ) : (
              <Stack key={article} direction='row' className='article-wrapper-default' sx={{ p: 0.5, ml: 1 }}>
                <Typography sx={{ fontSize: cardSettings.headerFontSize * 0.7 }} color="text.secondary">
                  {article.replace(/['"]+/g, '')}
                </Typography>
                <IconButton size='medium' onClick={() => handleMoveArticle(boxNum, article, warehouse, setBoxArticles)}>
                  <MoveUpRoundedIcon />
                </IconButton>
                <IconButton size='medium' onClick={() => handleRemoveArticle(boxNum, article, boxArticles, warehouse, setBoxArticles)}>
                  <DeleteForeverRoundedIcon />
                </IconButton>
              </Stack>
            )
          )}
        </Stack>
      </CardContent>
      <CardActions>
        <Button onClick={() => handleAddArticle(boxNum, boxArticles, warehouse, setBoxArticles)} size="small" color='success' variant='contained'>Add</Button>
        <Button onClick={() => handleMergeBoxes(boxNum, warehouse, setWarehouse)} size="small" color='warning' variant='contained'>Merge</Button>
        <Button onClick={() => handleRemoveBox(boxNum, box.articles, warehouse, setWarehouse)} size="small" color='error' variant='contained'>Remove</Button>
        <Button onClick={() => printBox(boxNum)} size="small" color='info' variant='contained'>Print</Button>
      </CardActions>
    </Card>
  );
}

export default BoxCard