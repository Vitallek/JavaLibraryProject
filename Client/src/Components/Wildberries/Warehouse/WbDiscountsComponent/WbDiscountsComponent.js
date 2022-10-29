import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import React, { useState, useEffect, useRef } from 'react';
import { List, Box, Grid, Stack, Typography, TextField, Button } from '@mui/material';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

import { PushOneDiscount } from '../Utility/PushOneDataToWB'
import './WbDiscountsComponent.css';
import { updateWbWarehouseConfig } from '../../../Utility/Wildberries/CallApiWildberries';
import DatePickerComponent from './DatePickerComponent';
import CallApiWildberries from '../../../Utility/Wildberries/CallApiWildberries';

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

const onCellEditComplete = (e, wbStocks) => {
    if (!window.confirm('Подтвердите действие')) return
    let { rowData, newValue, field, originalEvent: event } = e;
    console.log(e)
    switch (field) {
        case 'discount':
            if (isPositiveInteger(newValue)) {
                rowData[field] = newValue;
                PushOneDiscount(e.newRowData, wbStocks)
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

const cellEditor = (options) => {
    return textEditor(options);
}

const textEditor = (options) => {
    return <InputText type="text"  onFocus={e => e.target.select()} value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
}
const handleChangeConfigParam = (e, oldvalue, setValue, config, setConfig) => {
    if(e.target.value.length === 0) {
        e.preventDefault()
        return
    }
    let newValue = parseInt(e.target.value)
    if(newValue === oldvalue) {
        e.preventDefault()
        return
    }
    setValue(newValue)
    let newConfig = structuredClone(config)
    newConfig.custom.discount[e.target.id] = newValue
    setConfig(newConfig)
}
const returnDefaultWbConfig = (config, setConfig) => {
    if(!window.confirm('Вернуть стандартные настройки подсчёта остатков?')) return
    let newConfig = structuredClone(config)
    newConfig.custom = newConfig.defaults
    setConfig(newConfig)
    updateWbWarehouseConfig(`https://${process.env.REACT_APP_SERVER_ADDR}/wb-update-wb-config`, newConfig)
}
const saveCustomWbConfig = (config, setConfig, defaultDiscount) => {
    if(!window.confirm('Сохранить введённые настройки подсчёта остатков?')) return
    let newConfig = structuredClone(config)
    newConfig.custom.discount.defaultDiscount = defaultDiscount
    setConfig(newConfig)
    updateWbWarehouseConfig(`https://${process.env.REACT_APP_SERVER_ADDR}/wb-update-wb-config`, config)
}
const handlePushSomeDiscounts = (wbStocks, selectedProducts, date, config) => {
    // [
    //     {
    //       "discount": 15,
    //       "nm": 12345678
    //     }
    //   ]
    if (!window.confirm('Загрузить скидки?')) return
    let newDiscount = []
    selectedProducts.forEach(product => {
        let productInfo = wbStocks.find(element => element.article === product.article)
        newDiscount.push({
            "discount": config.custom.discount.defaultDiscount,
            "nm": productInfo.nmId,
        })
    })
    let url = `https://suppliers-api.wildberries.ru/public/api/v1/updateDiscounts`
    if (date != '') {
        let dateStr = date.toLocaleString( 'sv', { timeZoneName: 'short' })
        url += `?activateFrom=${dateStr.slice(0, dateStr.indexOf('G') - 1)}`
    }

    CallApiWildberries('post', url, `https://${process.env.REACT_APP_SERVER_ADDR}/wb-post-discount`, JSON.stringify(newDiscount))
    .then(data => {
        if (data != null) {
        console.log(data)
        alert('Скидки были загружены')
        }
    })
    .catch(e => {
        alert(JSON.stringify(e))
        console.log(e)
    })
}
const handleSelectRow = (row, selectedProducts) => {
    let newSelectedProducts = [...selectedProducts]
    newSelectedProducts.push(row)
}
const WbDiscountsComponent = ({config, setConfig, combinedData, wbStocks, setNewWbDiscount}) => {
    const [products, setProducts] = useState([])
    const [selectedProducts, setSelectedProducts] = useState([])
    const toast = useRef(null);
    const [date, setDate] = useState('')

    const [defaultDiscount, setDefaultDiscount] = useState(config.custom.discount.defaultDiscount)

    // const columns = [
    //     { field: 'article', header: 'Артикул' },
    //     { field: 'discount', header: 'Скидка' }
    // ]

    useEffect(() => {
        let mounted = true

        setProducts(combinedData)

        return function cleanup() {
            mounted = false
          }
    }, [])

    // useEffect(() => {
    //     if (premPrice.length === 0) return
    //     setProducts(CreateCombinedDataWithAmount(combinedData, premPrice, config))
    // }, [premPrice]);

    // useEffect(() => {
    //     let i = 1
    //     combinedData.forEach(element => {
    //         element.id = i
    //         i++
    //     })
    //     setProducts(combinedData)
    //     console.log('prudcts changed')
    // },[]);

    return (
        <Grid container item xs={12}>
            <Grid container item xs={8}>
                <List style={{ maxHeight: '85vh', overflowY: 'auto' }} className="datatable">
                    <Toast ref={toast} />
                    <Box className="card p-fluid">
                        {/* <DataTable value={products} editMode="cell" dataKey='article' className="editable-cells-table" filterDisplay="row" responsiveLayout="scroll">
                            {columns.map(({ field, header }) => (
                                field === 'new_amount' 
                                ? 
                                <Column key={field} filter sortable field={field} header={header} style={{ width: '25%' }} />
                                :
                                <Column key={field} filter sortable field={field} header={header} style={{ width: '25%' }}
                                    editor={(options) => cellEditor(options)} onCellEditComplete={e => onCellEditComplete(e, wbStocks)} />
                            ))}
                        </DataTable> */}
                        <DataTable 
                            value={products} 
                            selection={selectedProducts} 
                            onSelectionChange={(e) => setSelectedProducts(e.value)} 
                            dataKey="article" 
                            selectionMode="checkbox"
                            responsiveLayout="scroll"
                            filterDisplay="row"
                            editMode="cell"
                            className="editable-cells-table"
                        >
                            <Column selectionMode="multiple"></Column>
                            <Column filter sortable field="article" header="Артикул"></Column>
                            <Column filter sortable field="discount" header="Скидка" 
                                editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}>
                            </Column>

                        </DataTable>
                    </Box>
                </List>
            </Grid>
            <Grid item xs={4}>
                <Stack direction="column" sx={{ml: 2}} spacing={2}>
                    <Typography variant="subtitle1">
                        {`Изменение скидок на товары`}
                    </Typography>
                    <TextField
                    onChange={e => handleChangeConfigParam(e, defaultDiscount, setDefaultDiscount, config, setConfig)}
                    // inputRef={articleInput}
                    onFocus={event => {
                        event.target.select();
                      }}
                    type="text"
                    value={defaultDiscount}
                    id="defaultDiscount"
                    label="Скидка, %"
                    />  
                    <Button variant="contained" color="secondary" onClick={e => saveCustomWbConfig(config, setConfig, defaultDiscount)}>Сохранить конфиг</Button>
                    <Button variant="contained" color="secondary" onClick={e => returnDefaultWbConfig(config, setConfig)}>Сбросить настройки</Button>
                    {/* <Button variant="contained" disabled={!isPriceLoaded} color="error" onClick={e => recalculateAmount(config, combinedData, premPrice, wbStocks, setProducts, setNewWbDiscount)}>Пересчитать остатки</Button> */}
                    
                    <Typography variant="subtitle1">
                        {`Дата`}
                    </Typography>
                    <DatePickerComponent date={date} setDate={setDate}/>

                    <Button variant="contained" color="secondary" onClick={e => handlePushSomeDiscounts(wbStocks, selectedProducts, date, config)}>Загрузить скидки</Button>
                </Stack>
            </Grid>
        </Grid>

    );
}

export default WbDiscountsComponent