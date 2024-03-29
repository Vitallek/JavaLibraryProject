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
  Typography,
  Autocomplete,
  createFilterOptions
} from "@mui/material";
import { Divider } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
const cleanObject = () => ({
  type: 'works',
  key: '1',
  title: 'Book',
  first_publish_year: 2022,
  author_key: 'A1',
  author_name: 'Angelina',
  subject: 'Anime',
  description: '',
  rate: 0,
  rate_amount: 0,
  image: '',
  links: []
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
const AddBookDialog = ({ open, onClose, refresh, userInfoContext }) => {
  const [itemProps, setItemProps] = useState(cleanObject())
  const [links, setLinks] = useState([])
  const [allData, setAllData] = useState({})
  useEffect(() => {
    getAllData(setAllData)
  },[])

  const toast = useRef(null)
  const handleUpdateLink = (field, value, index) => {
    const newLinks = [...links]
    newLinks[index][field] = value
    setLinks(newLinks)
  }
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
  const addItem = () => {
    const objectToPush = { ...itemProps }
    links.forEach(link => {
      if(link.url.length > 0 && link.title.length > 0) objectToPush.links.push(link)
    })
    axios.post(`http://${process.env.REACT_APP_SERVER_ADDR}/insert-to-coll/books/${userInfoContext.token}`,
      JSON.stringify([objectToPush])
    )
    .then(response => {
      toast.current.show({severity: 'success', summary: 'Уведомление', detail: 'Книга добавлена', position:'bottom-right'});
      refresh()
    })
    .catch(err => console.log(err))
    console.log(objectToPush)
  }
  const setAuthor = (e) => {
    if (e.key !== 'Enter') return
    if(e.target.value.length === 0) return 
    const name = e.target.value.split('_id_')[0]
    const key = e.target.value.split('_id_')[1]
    setItemProps(prev => ({...prev, author_name: name, author_key: key}))
  }
  const setSubject = (e) => {
    if (e.key !== 'Enter') return
    if(e.target.value.length === 0) return 
    setItemProps(prev => ({...prev, subject: e.target.value}))
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
      fullWidth
      maxWidth='lg'
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
            sx={{ overflow: 'scroll',minWidth: '30%', maxHeight: '40vh' }}
          >
            {allData.authors && <Autocomplete
              selectOnFocus={false}
              filterOptions={filterOptions}
              getOptionLabel={({ author_name, author_key }) => {
                // this is how our option will be displayed when selected
                // remove the `id` here
                return `${author_name}_id_${author_key}`;
              }}
              filterSelectedOptions

              options={allData.authors}
              sx={{ width: 300 }}
              renderInput={(props) => <TextField {...props} label={'Автор'} onKeyPress={e => setAuthor(e)} />}
            />}
            <TextFieldNoValidate label='Author_key' field='author_key' disabled prop={itemProps.author_key} setItemProps={setItemProps} />
            <TextFieldValidatePositiveInt label='Год' field='first_publish_year' prop={itemProps.first_publish_year} setItemProps={setItemProps} />
            <TextFieldNoValidate label='Key' field='key' prop={itemProps.key} setItemProps={setItemProps} />
            <TextFieldNoValidate label='Название' field='title' prop={itemProps.title} setItemProps={setItemProps} />
            <TextFieldNoValidate label='Тип' field='type' prop={itemProps.type} setItemProps={setItemProps} />
            {allData.subjects && <Autocomplete
              selectOnFocus={false}
              options={allData.subjects}
              sx={{ width: 300 }}
              renderInput={(props) => <TextField {...props} label={'Subjects'} onChange={e => setSubject(e)} />}
            />}
            <TextFieldNoValidate label='Картинка' field='image' prop={itemProps.image} setItemProps={setItemProps} />
          </Stack>

          <Stack
            direction='column'
            spacing={2}
            sx={{ overflow: 'scroll',minWidth: '30%', maxHeight: '40vh' }}
          >
            <TextField
              label="Описание"
              placeholder="https://image.com,https://image2.com"
              multiline
              variant="standard"
              value={itemProps.description}
              onChange={(e) => setItemProps(prev => ({ ...prev, description: e.target.value }))}
            />          
          </Stack>

          <Stack
            sx={{ overflow: 'scroll',minWidth: '30%', maxHeight: '40vh' }}
            direction='column'
            spacing={2}
          >
            <Stack direction='row' spacing={1}>
              <Typography>
                Ссылки
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
                  label="Ссылка"
                  placeholder="https://image.com,https://image2.com"
                  // multiline
                  variant="standard"
                  value={itemProps.links[index]?.url}
                  onChange={(e) => handleUpdateLink('url', e.target.value, index)}
                />
                <TextField
                  label="Название ссылки"
                  placeholder="https://image.com,https://image2.com"
                  // multiline
                  variant="standard"
                  value={itemProps.links[index]?.title}
                  onChange={(e) => handleUpdateLink('title', e.target.value, index)}
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
        <Button onClick={addItem}>
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddBookDialog;