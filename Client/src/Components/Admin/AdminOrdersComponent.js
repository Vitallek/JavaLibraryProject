
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Button, Stack } from '@mui/material';

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
const getAllOrders = (setOrders) => {
  axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-all-orders`)
    .then(response => {
      setOrders(response.data.data)
    })
    .catch(err => console.log(err))
}
const deleteSelected = (selectedProducts, setOrders, toast) => {
  console.log(selectedProducts)
  // axios.delete(`http://${process.env.REACT_APP_SERVER_ADDR}/delete-selected/Orders`, { data: JSON.stringify(selectedProducts) })
  //   .then(response => {
  //     getAllFromBrand(selectedBrand, setProducts)
  //     toast.current.show({ severity: 'success', summary: 'Уведомление', detail: 'Данные удалены' });
  //   })
  //   .catch(err => console.log(err))
}

const updateStatus = (newData, toast) => {
  console.log(newData)
  axios.put(`http://${process.env.REACT_APP_SERVER_ADDR}/update-col/`,
    JSON.stringify({coll:'Orders', field: 'status', value: newData.status, 'VIN': newData["VIN"] })
  ).then(response => {
    toast.current.show({ severity: 'success', summary: 'Уведомление', detail: 'Данные обновлены' });
  })
    .catch(err => {
      toast.current.show({ severity: 'error', summary: 'Уведомление', detail: 'Ошибка сервера' });
      console.log(err)
    })
}
const AdminOrdersComponent = ({ brands }) => {
  const [orders, setOrders] = useState([])
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [editingRows, setEditingRows] = useState({})
  // const newBrandRef = useRef(null)
  const isMounted = useRef(false)
  const toast = useRef(null)

  useEffect(() => {
    isMounted.current = true
    getAllOrders(setOrders)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onCellEditComplete = (e, selectedBrand) => {
    let { rowData, newValue, field, originalEvent: event } = e;

    switch (field) {
      case 'status':
        if (isPositiveInteger(newValue)) {
          rowData[field] = newValue;
          alert('update order todo')
          // updateVehicle(selectedBrand, field, newValue, rowData, toast)
        }
        else
          event.preventDefault();
        break;
      default:
        if (newValue.trim().length > 0)
          rowData[field] = newValue;
        else
          event.preventDefault();
        break;
    }
  }
  const statuses = [
    { label: 'Новый', value: 1 },
    { label: 'В обработке', value: 2 },
    { label: 'Можно забирать', value: 3 },
    { label: 'Выполнен', value: 4 }
  ]

  const statusEditor = (options) => {
    return (
      <Dropdown value={options.value} options={statuses} optionLabel="label" optionValue="value"
          onChange={(e) => options.editorCallback(e.value)} placeholder="Select a Status"
          itemTemplate={(option) => {
              return <span className='product-badge'>{option.label}</span>
          }} />
    )
  }
  const onRowEditChange = (e) => {
    setEditingRows(e.data);
  }
  const onRowEditComplete = (e) => {
    let _orders = [...orders];
    let { newData, index } = e;
    updateStatus(e.newData, toast)
    _orders[index] = newData;
    setOrders(_orders);
  }
  return (
    <>
      <Stack direction='row' spacing={2} sx={{ m: 1 }}>
        <Toast ref={toast} position="bottom-right"/>
        <Button
          disabled={selectedOrders.length === 0}
          color='error'
          onClick={() => {
            deleteSelected(selectedOrders, setOrders, toast)
            setSelectedOrders([])
          }}
        >
          {`delete selected`}
        </Button>
      </Stack>
      <DataTable
        editMode="row"
        editingRows={editingRows}
        selection={selectedOrders}
        onRowEditChange={onRowEditChange} 
        onRowEditComplete={onRowEditComplete}
        onSelectionChange={e => setSelectedOrders(e.value)}
        value={orders}
        filterDisplay='row'
        selectionMode="checkbox"
        // expandedRows={expandedRows}
        // onRowToggle={(e) => setExpandedRows(e.data)}
        responsiveLayout="scroll"
        // rowExpansionTemplate={rowExpansionTemplate}
        dataKey="VIN"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
        {/* <Column expander style={{ width: '3em' }} /> */}
        <Column field="brand" header="Brand" filter sortable />
        <Column field="model" header="Model" filter sortable />
        <Column field="VIN" header="VIN" filter sortable />
        <Column field="user_email" header="Email" filter sortable />
        <Column field="user_phone" header="Phone" filter sortable />
        <Column field="status" header="Status" filter sortable body={row => {
          switch (row.status) {
            case 1:
              return 'Новый'
            case 2:
              return 'В обработке'
            case 3:
              return 'Можно забирать'
            case 4:
              return 'Выполнен'
            default:
              return 'Ошибка';
          }
        }}
        editor={(options) => statusEditor(options)} 
        onCellEditComplete={(e) => onCellEditComplete(e)}
        />
        <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
      </DataTable>
    </>
  )
}
export default AdminOrdersComponent