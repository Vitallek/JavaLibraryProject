import React, { useContext, useEffect, useRef, useState } from "react";
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Dialog, DialogTitle, Stack, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from "@mui/material";
import { Divider } from "@mui/material";

const addItem = (selectedBrand, itemProps, refresh, toast) => {
  const objectToPush = { ...itemProps }
  objectToPush.images = itemProps.images.split(',')
  axios.put(`http://${process.env.REACT_APP_SERVER_ADDR}/insert-to-coll/${selectedBrand.toLowerCase().replace(/ /g, '-')}`,
    JSON.stringify([objectToPush])
  ).then(response => {
    toast.current.show({severity: 'success', summary: 'Уведомление', detail: 'Данные добавлены', position:'bottom-right'});
    refresh()
  })
    .catch(err => console.log(err))
  console.log(objectToPush)
}

const CollectionDialog = ({ open, onClose, userCollections}) => {
  const [selectedColl, setSelectedColl] = useState('')
  const toast = useRef(null)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <Toast ref={toast} position="bottom-right"/>
      <DialogTitle id="responsive-dialog-title">
        {"Add to collection"}
      </DialogTitle>
      <DialogContent>
        <Button color='success' variant="contained">
          NEW
        </Button>
        {userCollections && <Select
          sx={{ minWidth: "10vw" }}
          value={userCollections[0].name === undefined ? '' : selectedColl}
          onChange={e => setSelectedColl(e.target.value)}
        >
          {userCollections && userCollections.map(field => (
            <MenuItem key={field} value={field}>
              {field}
            </MenuItem>
          ))}
        </Select>}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          onClose()
        }}>
          Отмена
        </Button>
        {/* <Button onClick={() => addItem(selectedBrand, itemProps, refresh, toast)}>
          Добавить
        </Button> */}
      </DialogActions>
    </Dialog>
  )
}

export default CollectionDialog;