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
import { MenuItem, Menu } from '@mui/material'
import { InputText } from 'primereact/inputtext';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCarDialog from './AddCarDialog';
import AddBrandDialog from './AddBrandDialog';

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
const getAllFromBrand = (selectedBrand, setProducts) => {
  axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-all/${selectedBrand.toLowerCase().replace(/ /g, '-')}`)
    .then(response => {
      setProducts(response.data.data)
    })
    .catch(err => console.log(err))
}
const deleteBrandColl = (selectedBrand, toast) => {
  axios.delete(`http://${process.env.REACT_APP_SERVER_ADDR}/delete-all/${selectedBrand.toLowerCase().replace(/ /g, '-')}`)
    .then(response => {
      toast.current.show({severity: 'success', summary: 'Уведомление', detail: 'Данные удалены'});
    })
    .catch(err => console.log(err))
}
// const generateRandomData = async (selectedBrand, amount, setProducts, toast) => {
//   if (amount === '') {
//     alert('empty input')
//     return
//   }
//   let data = await generateBrandData(selectedBrand, parseInt(amount))
//   axios.post(`http://${process.env.REACT_APP_SERVER_ADDR}/insert-to-coll/${selectedBrand.toLowerCase().replace(/ /g, '-')}`, JSON.stringify(data))
//     .then(response => {
//       getAllFromBrand(selectedBrand, setProducts)
//       toast.current.show({severity: 'success', summary: 'Уведомление', detail: 'Данные добавлены'});
//     })
//     .catch(err => console.log(err))
// }
const deleteSelected = (selectedBrand, selectedProducts, setProducts, toast) => {
  console.log(selectedProducts)
  axios.delete(`http://${process.env.REACT_APP_SERVER_ADDR}/delete-selected/${selectedBrand.toLowerCase().replace(/ /g, '-')}`, { data: JSON.stringify(selectedProducts) })
    .then(response => {
      getAllFromBrand(selectedBrand, setProducts)
      toast.current.show({severity: 'success', summary: 'Уведомление', detail: 'Данные удалены'});
    })
    .catch(err => console.log(err))
}
const deleteBrand = (selectedBrand, toast) => {
  if (!window.confirm('Удалить бренд?')) return
  if (selectedBrand.length === 0) return
  axios.post(`http://${process.env.REACT_APP_SERVER_ADDR}/delete-brand`, selectedBrand)
  .then(response => {
    toast.current.show({severity: 'success', summary: 'Уведомление', detail: 'Бренд удалён'});
    window.location.reload()
  })
    .catch(err => console.log(err))
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
const CarsComponent = ({ brands }) => {
  const [products, setProducts] = useState([])
  const [selectedBrand, setSelectedBrand] = useState('Select Brand')
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [expandedRows, setExpandedRows] = useState(null)
  const generateNumRef = useRef(null)
  const isMounted = useRef(false)
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const toast = useRef(null)

  const [openAddItemDialog, setOpenAddItemDialog] = useState(false)
  const handleClickOpenAddItemDialog = () => {
    setOpenAddItemDialog(true);
  };

  const handleCloseAddItemDialog = () => {
    setOpenAddItemDialog(false);
  };

  const [openAddBrandDialog, setOpenAddBrandDialog] = useState(false)
  const handleClickOpenAddBrandDialog = () => {
    setOpenAddBrandDialog(true);
  };

  const handleCloseAddBrandDialog = () => {
    setOpenAddBrandDialog(false);
  };

  const handleClickBrandMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseBrandMenu = () => {
    setAnchorEl(null);
  };
  const refreshFromDialog = () => {
    getAllFromBrand(selectedBrand, setProducts)
  }
  useEffect(() => {
    if (selectedBrand === 'Select Brand') return
    getAllFromBrand(selectedBrand, setProducts)
  }, [selectedBrand])

  useEffect(() => {
    isMounted.current = true
    setProducts([])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onCellEditComplete = (e, selectedBrand) => {
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
          updateVehicle(selectedBrand, field, parseInt(newValue), rowData, toast)
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
          updateVehicle(selectedBrand, field, newValue, rowData, toast)
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
      <DataTable value={[row]} editMode="cell" dataKey="VIN" responsiveLayout="scroll">
        <Column field='bodyType' header='body' />
        <Column field='VIN' header='VIN' />
        <Column field='gen' header='gen' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e, selectedBrand)} />
        <Column field='fuelType' header='fuelType' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e, selectedBrand)} />
        <Column field='mileage' header='mileage' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e, selectedBrand)} />
        <Column field='price' header='price' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e, selectedBrand)} />
        <Column field='status' header='status' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e, selectedBrand)} />
        <Column field='year' header='year' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e, selectedBrand)} />
        <Column field='transmission' header='transmission' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e, selectedBrand)} />
        <Column
          field='images'
          body={
            <List sx={{ overflowX: 'auto', maxHeight: 100 }}>{row.images.join(',')}</List>
          }
          header='images'
          editor={(options) => textEditor(options)}
          onCellEditComplete={(e) => onCellEditComplete(e, selectedBrand)} />
        <Column field='convenience' header='convenience' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e, selectedBrand)} />
        <Column field='entertainment' header='entertainment' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e, selectedBrand)} />
        <Column field='exterior' header='exterior' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e, selectedBrand)} />
        <Column field='fuelType' header='fuelType' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e, selectedBrand)} />
        <Column field='safety' header='safety' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e, selectedBrand)} />
        <Column field='seating' header='seating' editor={(options) => textEditor(options)} onCellEditComplete={(e) => onCellEditComplete(e, selectedBrand)} />
        {/* <Column field="rowName" header="field" />
        <Column field="rowValue"

          header="value"
          editor={(options) => textEditor(options)}
          onCellEditComplete={(e) => onCellEditComplete(e, selectedBrand)} /> */}
      </DataTable>
    )
  }

  return (
    <>
      <Stack direction='row' spacing={2} sx={{ m: 1 }}>
        <Toast ref={toast} position="bottom-right"/>
        <Button
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClickBrandMenu}
        >
          {`${selectedBrand} (${products.length})`}
        </Button>
        <Button
          disabled={selectedBrand === 'Select Brand'}
          color='error'
          onClick={() => deleteBrand(selectedBrand, toast)}
        >
          {`delete brand`}
        </Button>
        {/* <TextField
          type="text"
          style={{width: 100}}
          InputLabelProps={{
            shrink: true,
          }}
          inputRef={newBrandRef}
        /> */}
        <Button
          color='success'
          onClick={() => setOpenAddBrandDialog(true)}
        >
          {`add brand`}
        </Button>
        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseBrandMenu}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          }}
        >
          {brands.map((brand) => (
            <MenuItem key={brand.brand} onClick={() => {
              handleCloseBrandMenu()
              setSelectedBrand(brand.brand)
            }}
            >
              {brand.brand}
            </MenuItem>
          ))}
        </Menu>
        <Button
          disabled={selectedBrand === 'Select Brand'}
          color='error'
          onClick={() => deleteBrandColl(selectedBrand, toast)}
        >
          {`delete items`}
        </Button>
        <TextField
          type="number"
          style={{ width: 100 }}
          InputLabelProps={{
            shrink: true,
          }}
          inputRef={generateNumRef}
        />
        <Button
          disabled={selectedBrand === 'Select Brand'}
          color='error'
          onClick={() => {
            deleteSelected(selectedBrand, selectedProducts, setProducts, toast)
            setSelectedProducts([])
          }}
        >
          {`delete selected`}
        </Button>
        <Button
          disabled={selectedBrand === 'Select Brand'}
          color='success'
          onClick={() => setOpenAddItemDialog(true)}
        >
          {`add item`}
        </Button>
      </Stack>
      <DataTable
        selection={selectedProducts}
        onSelectionChange={e => setSelectedProducts(e.value)}
        value={products}
        filterDisplay='row'
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        responsiveLayout="scroll"
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="VIN"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
        <Column expander style={{ width: '3em' }} />
        <Column field="model" header="model" filter sortable />
        <Column field="VIN" header="VIN" filter />
      </DataTable>

      <AddCarDialog 
        open={openAddItemDialog}
        onClose={handleCloseAddItemDialog}
        selectedBrand={selectedBrand}
        brands={brands}
        refresh={refreshFromDialog}
      />
      <AddBrandDialog
        open={openAddBrandDialog}
        onClose={handleCloseAddBrandDialog}
      />
    </>
  )
}
export default CarsComponent