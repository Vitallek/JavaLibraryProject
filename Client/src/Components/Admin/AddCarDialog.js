import React, { useContext, useEffect, useRef, useState } from "react";
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Dialog, DialogTitle, Stack, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from "@mui/material";
import { Divider } from "@mui/material";
// const isPositiveInteger = (val) => {
//   let str = String(val);
//   str = str.trim();
//   if (!str) {
//     return false;
//   }
//   str = str.replace(/^0+/, "") || "0";
//   let n = Math.floor(Number(str));
//   return n !== Infinity && String(n) === str && n >= 0;
// }
const cleanObject = (selectedBrand) => ({
  brand: selectedBrand,
  model: '',
  year: 2022,
  gen: 1,
  color: {
    name: '',
    hex: ''
  },
  price: 0,
  bodyType: '',
  mileage: 0,
  fuelType: '',
  VIN: '',
  transmission: '',
  images: '',
  convenience: '',
  entertainment: '',
  safety: '',
  exterior: '',
  seating: '',
  status: 0
})
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
const TextFieldValidatePositiveInt = ({ label, field, prop, setItemProps }) => {
  return (
    <TextField
      label={label}
      variant="standard"
      value={prop}
      onChange={(e) => {
        if (e.target.value.length === 0) {
          setItemProps(prev => ({ ...prev, [field]: '' }))
          return
        }
        if (!/^[0-9]*$/.test(e.target.value)) {
          e.preventDefault()
          return
        }
        setItemProps(prev => ({ ...prev, [field]: parseInt(e.target.value) }))
      }}
    />)
}
const TextFieldNoValidate = ({ label, field, prop, setItemProps }) => {
  return (
    <TextField
      label={label}
      variant="standard"
      value={prop}
      onChange={(e) => setItemProps(prev => ({ ...prev, [field]: e.target.value }))}
    />)
}
const AddCarDialog = ({ open, onClose, selectedBrand, brands, refresh }) => {
  const [itemProps, setItemProps] = useState(cleanObject(selectedBrand))
  const toast = useRef(null)
  useEffect(() => {
    if (selectedBrand === 'Select Brand') return
    console.log(brands)
    console.log(selectedBrand)
  }, [selectedBrand])
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <Toast ref={toast} position="bottom-right"/>
      <DialogTitle id="responsive-dialog-title">
        {"Добавление нового авто"}
      </DialogTitle>
      <DialogContent>
        <Stack
          direction='row'
          spacing={2}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Stack
            direction='column'
            spacing={2}
          >
            <TextField
              id="bren-input"
              label="Brand"
              disabled
              value={selectedBrand}
              variant="standard"
            />
            <Select
              labelId="model-selection"
              id="model-selection"
              label="Model"
              value={itemProps.model}
              onChange={(e) => setItemProps(prev => ({ ...prev, model: e.target.value }))}
            >
              {brands.find(brand => brand.brand === selectedBrand)?.models.map(model => <MenuItem key={model} value={model}>{model}</MenuItem>)}
            </Select>
            <TextFieldValidatePositiveInt label='Year' field='year' prop={itemProps.year} setItemProps={setItemProps} />
            <TextFieldValidatePositiveInt label='Gen' field='gen' prop={itemProps.gen} setItemProps={setItemProps} />
            <TextField
              label="Color Name"
              variant="standard"
              value={itemProps.color.name}
              onChange={(e) => setItemProps(prev => ({ ...prev, color: ({ ...prev.color, name: e.target.value }) }))}
            />
            <TextField
              label="Color Hex"
              variant="standard"
              value={itemProps.color.hex}
              onChange={(e) => setItemProps(prev => ({ ...prev, color: ({ ...prev.color, hex: e.target.value }) }))}
            />
            <TextFieldValidatePositiveInt label='Price' field='price' prop={itemProps.price} setItemProps={setItemProps} />
            <TextFieldNoValidate label='Body Type' field='bodyType' prop={itemProps.bodyType} setItemProps={setItemProps} />
            <TextFieldValidatePositiveInt label='Mileage' field='mileage' prop={itemProps.mileage} setItemProps={setItemProps} />
          </Stack>

          <Stack
            direction='column'
            spacing={2}
          >

            
            <TextFieldNoValidate label='Fuel Type' field='fuelType' prop={itemProps.fuelType} setItemProps={setItemProps} />
            <TextFieldNoValidate label='VIN' field='VIN' prop={itemProps.VIN} setItemProps={setItemProps} />

            <TextFieldNoValidate label='Convenience' field='convenience' prop={itemProps.convenience} setItemProps={setItemProps} />
            <TextFieldNoValidate label='Entertainment' field='entertainment' prop={itemProps.entertainment} setItemProps={setItemProps} />
            <TextFieldNoValidate label='Safety' field='safety' prop={itemProps.safety} setItemProps={setItemProps} />
            <TextFieldNoValidate label='Exterior' field='exterior' prop={itemProps.exterior} setItemProps={setItemProps} />
            <TextFieldNoValidate label='Seating' field='seating' prop={itemProps.seating} setItemProps={setItemProps} />

            <TextFieldValidatePositiveInt label='Status' field='status' prop={itemProps.status} setItemProps={setItemProps} />
          </Stack>

          <Stack
            sx={{overflow: 'scroll', maxHeight: '40vh'}}
            direction='column'
            spacing={2}
          >
            <TextField
              label="Images Links"
              placeholder="https://image.com,https://image2.com"
              multiline
              variant="standard"
              value={itemProps.images}
              onChange={(e) => setItemProps(prev => ({ ...prev, images: e.target.value }))}
            />
            </Stack>
          

        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setItemProps(prev => ({ ...prev, images: stockIimages.join(',') }))}>
          stock_photos
        </Button>
        <Button onClick={() => {
          setItemProps(cleanObject(selectedBrand))
          onClose()
        }}>
          Отмена
        </Button>
        <Button onClick={() => addItem(selectedBrand, itemProps, refresh, toast)}>
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddCarDialog;

const stockIimages = ["https://images.unsplash.com/photo-1617633371235-084d7a6bc1c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwxfHxBdWRpJTIwY2FyfGVufDB8fHx8MTY2NTUwOTYyNA&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1618836436067-3665afbc4ee9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwyfHxBdWRpJTIwY2FyfGVufDB8fHx8MTY2NTUwOTYyNA&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1589320012174-99fc951aa305?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwzfHxBdWRpJTIwY2FyfGVufDB8fHx8MTY2NTUwOTYyNA&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1597007030040-e0991c68cd73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHw0fHxBdWRpJTIwY2FyfGVufDB8fHx8MTY2NTUwOTYyNA&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1596731498067-99aeb581d3d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHw1fHxBdWRpJTIwY2FyfGVufDB8fHx8MTY2NTUwOTYyNA&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1519752235002-1f7189299e90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHw2fHxBdWRpJTIwY2FyfGVufDB8fHx8MTY2NTUwOTYyNA&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1606224103857-e4c74b0139df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHw3fHxBdWRpJTIwY2FyfGVufDB8fHx8MTY2NTUwOTYyNA&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1617566347924-ad5ebdaa014e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHw4fHxBdWRpJTIwY2FyfGVufDB8fHx8MTY2NTUwOTYyNA&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1503507420689-7b961cc77da5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHw5fHxBdWRpJTIwY2FyfGVufDB8fHx8MTY2NTUwOTYyNA&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1518029890864-93a39e8e09b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwxMHx8QXVkaSUyMGNhcnxlbnwwfHx8fDE2NjU1MDk2MjQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1529343048062-0d092ce13859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwxMXx8QXVkaSUyMGNhcnxlbnwwfHx8fDE2NjU1MDk2MjQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1518397727759-189caa3b89a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwxMnx8QXVkaSUyMGNhcnxlbnwwfHx8fDE2NjU1MDk2MjQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1520088096110-20308c23a3cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwxM3x8QXVkaSUyMGNhcnxlbnwwfHx8fDE2NjU1MDk2MjQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1608506876688-ab805ee6c2c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwxNHx8QXVkaSUyMGNhcnxlbnwwfHx8fDE2NjU1MDk2MjQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1611416976036-aea8f71f4f49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwxNXx8QXVkaSUyMGNhcnxlbnwwfHx8fDE2NjU1MDk2MjQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1635433867971-0d43eb4c318b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwxNnx8QXVkaSUyMGNhcnxlbnwwfHx8fDE2NjU1MDk2MjQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1555652736-e92021d28a10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwxN3x8QXVkaSUyMGNhcnxlbnwwfHx8fDE2NjU1MDk2MjQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1647887639815-9271a0a380b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwxOHx8QXVkaSUyMGNhcnxlbnwwfHx8fDE2NjU1MDk2MjQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1643235988160-9aabe50b74ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwxOXx8QXVkaSUyMGNhcnxlbnwwfHx8fDE2NjU1MDk2MjQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1504215680853-026ed2a45def?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwyMHx8QXVkaSUyMGNhcnxlbnwwfHx8fDE2NjU1MDk2MjQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1636395094424-6615de678e32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwyMXx8QXVkaSUyMGNhcnxlbnwwfHx8fDE2NjU1MDk2MjQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1532268116505-8c59cc37d2e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwyMnx8QXVkaSUyMGNhcnxlbnwwfHx8fDE2NjU1MDk2MjQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1635433868513-afc621b81834?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwyM3x8QXVkaSUyMGNhcnxlbnwwfHx8fDE2NjU1MDk2MjQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1640609940895-fe04fa71f22b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwyNHx8QXVkaSUyMGNhcnxlbnwwfHx8fDE2NjU1MDk2MjQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1622701579993-d232b8538a92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwyNXx8QXVkaSUyMGNhcnxlbnwwfHx8fDE2NjU1MDk2MjQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1519752441410-d3ca70ecb937?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwyNnx8QXVkaSUyMGNhcnxlbnwwfHx8fDE2NjU1MDk2MjQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1527593167147-e9c94a5883e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwyN3x8QXVkaSUyMGNhcnxlbnwwfHx8fDE2NjU1MDk2MjQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1565677812319-688b204545bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwyOHx8QXVkaSUyMGNhcnxlbnwwfHx8fDE2NjU1MDk2MjQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1611840973188-1329e9f2b8dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwyOXx8QXVkaSUyMGNhcnxlbnwwfHx8fDE2NjU1MDk2MjQ&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1528875420-3bbc501789c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjY4Nzd8MHwxfHNlYXJjaHwzMHx8QXVkaSUyMGNhcnxlbnwwfHx8fDE2NjU1MDk2MjQ&ixlib=rb-1.2.1&q=80&w=1080"
]