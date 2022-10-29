import React, { useContext, useEffect, useRef, useState } from "react";
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Dialog, DialogTitle, Stack, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from "@mui/material";
import { Divider } from "@mui/material";

const addBrand = (brand, toast) => {
  if (brand.brand.length === 0) return
  axios.post(`http://${process.env.REACT_APP_SERVER_ADDR}/add-brand`, brand)
  .then(response => {
    window.location.reload()
    toast.current.show({severity: 'success', summary: 'Уведомление', detail: 'Бренд добавлен'});
  })
    .catch(err => console.log(err))
}
const AddBrandDialog = ({ open, onClose, selectedBrand, brands, refresh }) => {
  const [brand, setBrand] = useState({
    brand: '',
    models: []
  })
  const toast = useRef(null)
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <Toast ref={toast} position="bottom-right" />
      <DialogTitle id="responsive-dialog-title">
        {"Добавление нового бренда"}
      </DialogTitle>
      <DialogContent>
        <Stack
          direction='column'
          spacing={2}
        >
          <TextField
            id="bren-input"
            label="Brand"
            variant="standard"
            value={brand.brand}
            onChange={(e) => setBrand(prev => ({...prev, brand: e.target.value}))}
          />
          <TextField
              label="Models"
              placeholder="GT-R, R35, MODEL-ONE, DBW..."
              multiline
              variant="standard"
              value={brand.models.join()}
              onChange={(e) => setBrand(prev => ({ ...prev, models: e.target.value.split(',') }))}
            />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          onClose()
        }}>
          Отмена
        </Button>
        <Button onClick={() => addBrand(brand, toast)}>
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddBrandDialog;