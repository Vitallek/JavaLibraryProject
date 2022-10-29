import React, {useState, useRef} from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import { UpdateWarehouse } from '../../Utility/Warehouse/CallWarehouse'

export const AddArticleDialog = ({warehouse, setWarehouse, boxNumber}) => {
  const numberInput = useRef(null)
  const [articleNumber, setArticleNumber] = useState('')
  
  const [open, setOpen] = useState(false)
  const addArticleShowDialog = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleAddArticle = (boxNum) => {
    // const modifiedWarehouse = [...warehouse]
    // modifiedWarehouse.push({
    //   box: `${boxNum}`,
    //   articles: []
    // })
    // setWarehouse(modifiedWarehouse)
    // UpdateWarehouse(`https://${process.env.REACT_APP_SERVER_ADDR}/update_warehouse`, modifiedWarehouse)
    // setOpen(!open)
  }
  const handleArticleNumChange = (e) => {
    setArticleNumber(e.target.value)
  }

  return (
    <>
      <Dialog open={open} onClose={() => handleClose()}>
        <DialogTitle>Добавление товара</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Чтобы добавить товар в коробку, введите его артикул
          </DialogContentText>
          <TextField
            autoFocus
            inputRef={numberInput}
            onChange={handleArticleNumChange}
            value={articleNumber}
            margin="dense"
            label="Number"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Отмена</Button>
          <Button onClick={() => handleAddArticle(boxNumber, articleNumber)}>Добавить</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}