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
import AddCarDialog from '../Admin/AddCarDialog';

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
const deleteSelected = (selectedProducts, setProducts, toast) => {
  console.log(selectedProducts)
  // axios.delete(`http://${process.env.REACT_APP_SERVER_ADDR}/delete-selected/${selectedBrand.toLowerCase().replace(/ /g, '-')}`, { data: JSON.stringify(selectedProducts) })
  //   .then(response => {
  //     getItems(setProducts)
  //     toast.current.show({severity: 'success', summary: 'Уведомление', detail: 'Данные удалены'});
  //   })
  //   .catch(err => console.log(err))
}
const updateVehicle = (selectedBrand, field, value, rowData, toast) => {
  axios.put(`http://${process.env.REACT_APP_SERVER_ADDR}/update-col/`, 
  JSON.stringify({
    coll: selectedBrand.toLowerCase().replace(/ /g, '-'), 
    field: field,
    value:value, 'VIN': rowData["VIN"]
  })
  ).then(response => {
      toast.current.show({severity: 'success', summary: 'Уведомление', detail: 'Данные обновлены'});
    })
    .catch(err => console.log(err))
}
const BooksTableComponent = () => {
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
      case 'price':
      case 'gen':
      case 'mileage':
      case 'price':
      case 'status':
      case 'year':
        if (isPositiveInteger(newValue)){
          rowData[field] = newValue;
          updateVehicle(field, parseInt(newValue), rowData, toast)
        }
        else
          event.preventDefault();
        break;
      case 'images':
        alert('todo')
        break;
      default:
        if (newValue.trim().length > 0) {
          rowData[field] = newValue;
          updateVehicle(field, newValue, rowData, toast)
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
    delete row.color
    let data = Object.entries(row).map(el => {
      if (el[0] === 'images') return { rowName: el[0], rowValue: el[1].join(',') }
      return { rowName: el[0], rowValue: el[1] }
    })
    return (
      <DataTable value={[row]} editMode="cell" dataKey="key" responsiveLayout="scroll">
        <Column field='type' header='type' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e)} />
        <Column field='key' header='key' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e)} />
        <Column field='title' header='title' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e)} />
        <Column field='first_publish_year' header='year' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e)} />
        <Column field='author_key' header='a_id' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e)} />
        <Column field='author_key' header='author' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e)} />
        <Column
          field='links'
          body={row.links && 
            <List sx={{ overflowX: 'auto', maxHeight: 100 }}>{row.links.join(',')}</List>
          }
          header='links'
          editor={(options) => textEditor(options)}
          onCellEditComplete={(e) => onCellEditComplete(e)} />
        <Column field='rate' header='rate' />
        <Column field='rate_amount' header='rate_amount' />
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
        dataKey="key"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
        <Column expander style={{ width: '3em' }} />
        <Column field="key" header="ID" filter sortable />
        <Column field="title" header="Title" filter />
      </DataTable>

      {/* <AddCarDialog 
        open={openAddItemDialog}
        onClose={handleCloseAddItemDialog}
        selectedBrand={''}
        brands={[]}
        refresh={refreshFromDialog}
      /> */}
    </>
  )
}
export default BooksTableComponent