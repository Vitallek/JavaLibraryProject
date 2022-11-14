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
  createFilterOptions
} from "@mui/material";
import { Divider } from "@mui/material";
import { UserInfoContext } from "../../UserInfoContext";
const cleanObject = () => ({
  author_key: 'A1',
  author_name: 'Angelina',
  rate: 0,
  rate_amount: 0,
  image: '',
})
const filterOptions = createFilterOptions({
  stringify: ({ author_name, author_key }) => `${author_name} ${author_key}`
});
const TextFieldValidatePositiveInt = ({ label, field, prop, setItemProps, disabled }) => {
  return (
    <TextField
      disabled={disabled !== undefined && disabled}
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
const TextFieldNoValidate = ({ label, field, prop, setItemProps, disabled }) => {
  return (
    <TextField
      disabled={disabled !== undefined && disabled}
      label={label}
      variant="standard"
      value={prop}
      onChange={(e) => setItemProps(prev => ({ ...prev, [field]: e.target.value }))}
    />)
}
const getAllData = async (setAllData) => {
  let authors = []
  await axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-all/authors`)
  .then(res => authors = [...res.data.data])
  .catch(err => alert('error on load authors'))
  let subjects = []
  await axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-all/subjects`)
  .then(res => subjects = [...res.data.data])
  .catch(err => alert('error on load genres'))
  authors.forEach(author => author.label = author.author_name)
  subjects.forEach(subject => subject.label = subject.subject)
  setAllData({
    authors: authors,
    subjects: subjects
  })
  console.log({
    authors: authors,
    subjects: subjects
  })
}
const AddAuthorDialog = ({ open, onClose, refresh, userInfoContext }) => {
  const [itemProps, setItemProps] = useState(cleanObject())
  const [allData, setAllData] = useState({})
  useEffect(() => {
    getAllData(setAllData)
  },[])

  const toast = useRef(null)

  const addItem = () => {
    const objectToPush = { ...itemProps }
    axios.post(`http://${process.env.REACT_APP_SERVER_ADDR}/insert-to-coll/authors/${userInfoContext.token}`,
      JSON.stringify([objectToPush])
    )
    .then(response => {
      toast.current.show({severity: 'success', summary: 'Уведомление', detail: 'Автор добавлен', position:'bottom-right'});
      refresh()
    })
    .catch(err => console.log(err))
    console.log(objectToPush)
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
      fullWidth
    >
      <Toast ref={toast} position="bottom-right" />
      <DialogTitle id="responsive-dialog-title">
        {"Добавление нового автора"}
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
            sx={{ overflow: 'scroll',minWidth: '30%', maxHeight: '40vh' }}
          >
            <TextFieldNoValidate label='Имя' field='author_name' prop={itemProps.author_name} setItemProps={setItemProps} />
            <TextFieldNoValidate label='ID' field='author_key' prop={itemProps.author_key} setItemProps={setItemProps} />
            <TextFieldNoValidate label='Картинка' field='image' prop={itemProps.image} setItemProps={setItemProps} />
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
        <Button onClick={addItem}>
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddAuthorDialog;