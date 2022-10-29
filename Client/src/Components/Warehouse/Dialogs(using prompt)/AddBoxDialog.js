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

export const AddBoxDialog = ({warehouse, setWarehouse}) => {
  const numberInput = useRef(null)
  const [boxNumber, setBoxNumber] = useState('')

  const [open, setOpen] = useState(false)
  const addBoxShowDialog = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleAddBox = (boxNum) => {
    const modifiedWarehouse = [...warehouse]
    modifiedWarehouse.push({
      box: `${boxNum}`,
      articles: []
    })
    setWarehouse(modifiedWarehouse)
    UpdateWarehouse(`https://${process.env.REACT_APP_SERVER_ADDR}/update_warehouse`, modifiedWarehouse)
    setOpen(!open)
  }
  const handleBoxNumChange = (e) => {
    setBoxNumber(e.target.value)
  }

  return (
    <>
      <Button variant="contained" color="success" onClick={() => addBoxShowDialog()}>
        <InboxRoundedIcon fontSize='large' />
      </Button>
      <Dialog open={open} onClose={() => handleClose()}>
        <DialogTitle>Добавление коробки</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Чтобы добавить коробку, введите её номер
          </DialogContentText>
          <TextField
            autoFocus
            inputRef={numberInput}
            onChange={handleBoxNumChange}
            value={boxNumber}
            margin="dense"
            label="Number"
            type="number"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Отмена</Button>
          <Button onClick={() => handleAddBox(boxNumber)}>Добавить</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}