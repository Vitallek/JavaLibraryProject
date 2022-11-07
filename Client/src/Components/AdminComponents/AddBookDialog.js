import React, { useContext, useEffect, useRef, useState } from "react";
import axios from 'axios';
import { Toast } from 'primereact/toast';
import {
  Dialog,
  DialogTitle,
  Stack,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Typography
} from "@mui/material";
import { Divider } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
const cleanObject = () => ({
  type: '',
  key: '',
  title: '',
  first_publish_year: 2022,
  author_key: '',
  author_name: '',
  subject: '',
  description: '',
  rate: 0,
  rate_amount: 0,
  image: '',
  links: []
})
const addItem = (itemProps, refresh, toast) => {
  const objectToPush = { ...itemProps }
  objectToPush.images = itemProps.images.split(',')
  // axios.put(`http://${process.env.REACT_APP_SERVER_ADDR}/insert-to-coll/${selectedBrand.toLowerCase().replace(/ /g, '-')}`,
  //   JSON.stringify([objectToPush])
  // )
  // .then(response => {
  //   toast.current.show({severity: 'success', summary: 'Уведомление', detail: 'Данные добавлены', position:'bottom-right'});
  //   refresh()
  // })
  // .catch(err => console.log(err))
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
const AddBookDialog = ({ open, onClose, refresh }) => {
  const [itemProps, setItemProps] = useState(cleanObject())
  const [links, setLinks] = useState([])
  const toast = useRef(null)
  const handleAddLink = () => {
    const newLinks = [...links]
    newLinks.push({
      title: '',
      url: ''
    })
    setLinks(newLinks)
  }
  const handleRemoveLink = () => {
    const newLinks = [...links]
    newLinks.pop()
    setLinks(newLinks)
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
      fullWidth
      maxWidth='md'
    >
      <Toast ref={toast} position="bottom-right" />
      <DialogTitle id="responsive-dialog-title">
        {"Добавление новой книги"}
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
            <TextFieldValidatePositiveInt label='Year' field='first_publish_year' prop={itemProps.first_publish_year} setItemProps={setItemProps} />
            <TextFieldNoValidate label='Key' field='key' prop={itemProps.key} setItemProps={setItemProps} />
            <TextFieldNoValidate label='Title' field='title' prop={itemProps.title} setItemProps={setItemProps} />
            <TextFieldNoValidate label='Type' field='type' prop={itemProps.type} setItemProps={setItemProps} />
            <TextFieldNoValidate label='Author_key' field='author_key' prop={itemProps.author_key} setItemProps={setItemProps} />
            <TextFieldNoValidate label='Author_name' field='author_name' prop={itemProps.author_name} setItemProps={setItemProps} />
            <TextFieldNoValidate label='ImageLink' field='image' prop={itemProps.image} setItemProps={setItemProps} />
          </Stack>

          <Stack
            direction='column'
            spacing={2}
          >
            <TextField
              label="Description"
              placeholder="https://image.com,https://image2.com"
              multiline
              variant="standard"
              value={itemProps.description}
              onChange={(e) => setItemProps(prev => ({ ...prev, description: e.target.value }))}
            />          
          </Stack>

          <Stack
            sx={{ overflow: 'scroll', maxHeight: '40vh' }}
            direction='column'
            spacing={2}
          >
            <Stack direction='row' spacing={1}>
              <Typography>
                Links
              </Typography>
              <IconButton onClick={handleAddLink}>
                <AddIcon />
              </IconButton>
              <IconButton onClick={handleRemoveLink}>
                <RemoveIcon />
              </IconButton>
            </Stack>
            {links.map((link, index) => (
              <Stack key={index} direction='row' spacing={1}>
                <TextField
                  label="Link url"
                  placeholder="https://image.com,https://image2.com"
                  // multiline
                  variant="standard"
                  value={itemProps.images}
                  onChange={(e) => setItemProps(prev => ({ ...prev, images: e.target.value }))}
                />
                <TextField
                  label="Link title"
                  placeholder="https://image.com,https://image2.com"
                  // multiline
                  variant="standard"
                  value={itemProps.images}
                  onChange={(e) => setItemProps(prev => ({ ...prev, images: e.target.value }))}
                />
              </Stack>
            ))}
          </Stack>


        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setItemProps(cleanObject())
          onClose()
        }}>
          Отмена
        </Button>
        <Button onClick={() => addItem(itemProps, refresh, toast)}>
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddBookDialog;