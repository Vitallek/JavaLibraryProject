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
import AddAuthorDialog from './AddAuthorDialog';

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
  axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-all/authors`)
    .then(res => {
      console.log(res.data)
      return setItems(res.data.data)
    })
    .catch(err => alert('can`t get data'))
}
const deleteSelected = (selectedProducts, setProducts, toast) => {
  console.log(selectedProducts)
  axios.delete(`http://${process.env.REACT_APP_SERVER_ADDR}/delete-selected-authors`, { data: JSON.stringify(selectedProducts) })
    .then(response => {
      getItems(setProducts)
      toast.current.show({severity: 'success', summary: 'Уведомление', detail: 'Данные удалены'});
    })
    .catch(err => console.log(err))
}
const updateItem = (field, value, rowData, toast) => {
  axios.put(`http://${process.env.REACT_APP_SERVER_ADDR}/update-author`, 
  JSON.stringify({
    field: field,
    value: value, 
    author_key: rowData.author_key
  }))
  .then(response => {
    toast.current.show({severity: 'success', summary: 'Уведомление', detail: 'Данные обновлены'});
  })
  .catch(err => console.log(err))
}
const AuthorsTableComponent = () => {
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
      case 'author_key':
        if(items.some(item => item.author_key === newValue)) {
          toast.current.show({severity: 'error', summary: 'Error', detail: 'Duplicate key'});
          event.preventDefault()
          break;
        }
        if (newValue.trim().length > 0) {
          rowData[field] = newValue;
          updateItem(field, newValue, rowData, toast)
        }
        break;
      case 'rate':
      case 'rate_amount':
        if (parseFloat(newValue) !== NaN){
          rowData[field] = newValue;
          updateItem(field, parseFloat(newValue), rowData, toast)
        }
        else
          event.preventDefault();
        break;
      default:
        if (newValue.trim().length > 0) {
          rowData[field] = newValue;
          updateItem(field, newValue, rowData, toast)
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
      <DataTable value={[row]} editMode="cell" dataKey="author_key" responsiveLayout="scroll">
        <Column field='author_key' header='a_id' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e)} />
        <Column field='author_name' header='author' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e)} />
        <Column field='rate' header='rate' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e)}/>
        <Column field='rate_amount' header='rate_amount' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e)}/>
        <Column field='image' header='image' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e)} />
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
            deleteSelected(selectedItems, setItems, toast)
            setSelectedItems([])
          }}
        >
          {`delete selected`}
        </Button>
        <Button
          color='success'
          onClick={() => setOpenAddItemDialog(true)}
        >
          {`add item`}
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
        dataKey="author_key"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
        <Column expander style={{ width: '3em' }} />
        <Column field="author_key" header="ID" filter sortable />
        <Column field="author_name" header="Name" filter />
      </DataTable>

      <AddAuthorDialog 
        open={openAddItemDialog}
        onClose={handleCloseAddItemDialog}
        refresh={refreshFromDialog}
      />
    </>
  )
}
export default AuthorsTableComponent