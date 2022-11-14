import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast';
import { Button, Stack, TextField, Box, List } from '@mui/material';
import {Button as PrimeButton} from 'primereact/button'
import { InputText } from 'primereact/inputtext';
import AddBookDialog from './AddBookDialog';

const ITEM_HEIGHT = 48
const isPositiveInteger = (val) => {
  let str = String(val);
  str = str.trim();
  if (!str) {
    return false;
  }
  str = str.replace(/^0+/, "") || "0";
  let n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}
const getItems = (setItems) => {
  axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-all/books`)
    .then(res => {
      console.log(res.data)
      return setItems(res.data.data)
    })
    .catch(err => alert('can`t get data'))
}
const deleteSelected = (selectedProducts, setProducts, toast,userInfoContext) => {
  console.log(selectedProducts)
  axios.delete(`http://${process.env.REACT_APP_SERVER_ADDR}/delete-selected-books/${userInfoContext.token}`, { data: JSON.stringify(selectedProducts) })
    .then(response => {
      getItems(setProducts)
      toast.current.show({severity: 'success', summary: 'Уведомление', detail: 'Данные удалены'});
    })
    .catch(err => console.log(err))
}
const updateItem = (field, value, rowData, toast,userInfoContext) => {
  axios.put(`http://${process.env.REACT_APP_SERVER_ADDR}/update-book/${userInfoContext.token}`, 
  JSON.stringify({
    field: field,
    value: value, 
    'key': rowData.key
  }))
  .then(response => {
    toast.current.show({severity: 'success', summary: 'Уведомление', detail: 'Данные обновлены'});
  })
  .catch(err => console.log(err))
}
const BooksTableComponent = ({userInfoContext}) => {
  const [items, setItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([]);
  const [expandedRows, setExpandedRows] = useState([])
  const isMounted = useRef(false)
  const toast = useRef(null)

  const [openAddItemDialog, setOpenAddItemDialog] = useState(false)
  const handleClickOpenAddItemDialog = () => {
    setOpenAddItemDialog(true);
  };

  const handleCloseAddItemDialog = () => {
    setOpenAddItemDialog(false);
  };
  const refreshFromDialog = () => {
    getItems(setItems)
  }
  useEffect(() => {
    isMounted.current = true
    getItems(setItems)
  }, [])
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;

    switch (field) {
      case 'key':
      case 'title':
        if(items.some(item => item.key === newValue)) {
          toast.current.show({severity: 'error', summary: 'Error', detail: 'Duplicate key'});
          event.preventDefault()
          break;
        }
        if (newValue.trim().length > 0) {
          rowData[field] = newValue;
          updateItem(field, newValue, rowData, toast,userInfoContext)
        }
        break;
      case 'first_publish_year':
      case 'rate':
      case 'rate_amount':
        if (isPositiveInteger(newValue)){
          rowData[field] = newValue;
          updateItem(field, parseInt(newValue), rowData, toast,userInfoContext)
        }
        else
          event.preventDefault();
        break;
      default:
        if (newValue.trim().length > 0) {
          rowData[field] = newValue;
          updateItem(field, newValue, rowData, toast,userInfoContext)
        }
        else
          event.preventDefault();
        break;
    }
  }
  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  }
  const rowExpansionTemplate = (row) => {
    delete row._id
    return (
      <DataTable value={[row]} editMode="cell" dataKey="key" responsiveLayout="scroll">
        <Column field='type' header='Тип' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e)} />
        <Column field='key' header='key' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e)} />
        <Column field='title' header='Название' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e)} />
        <Column field='first_publish_year' header='Год' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e)} />
        <Column field='author_key' header='a_id' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e)} />
        <Column field='author_name' header='Автор' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e)} />
        <Column field='rate' header='Оценка' />
        <Column field='rate_amount' header='Оценили' />
        <Column field='image' header='Картинка' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e)} />
      </DataTable>
    )
  }

  return (
    <>
      <Stack direction='row' spacing={2} sx={{ m: 1 }}>
        <Toast ref={toast} position="bottom-right"/>
        <Button
          disabled={selectedItems.length === 0}
          color='error'
          onClick={() => {
            deleteSelected(selectedItems, setItems, toast,userInfoContext)
            setSelectedItems([])
          }}
        >
          {`удалить выбранные`}
        </Button>
        <Button
          color='success'
          onClick={() => setOpenAddItemDialog(true)}
        >
          {`добавить книгу`}
        </Button>
      </Stack>
      <DataTable
        selection={selectedItems}
        onSelectionChange={e => setSelectedItems(e.value)}
        value={items}
        filterDisplay='row'
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        responsiveLayout="scroll"
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="key"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
        <Column expander style={{ width: '3em' }} />
        <Column field="key" header="ID" filter sortable />
        <Column field="title" header="Название" filter />
      </DataTable>

      <AddBookDialog 
        open={openAddItemDialog}
        onClose={handleCloseAddItemDialog}
        refresh={refreshFromDialog}
        userInfoContext={userInfoContext}
      />
    </>
  )
}
export default BooksTableComponent