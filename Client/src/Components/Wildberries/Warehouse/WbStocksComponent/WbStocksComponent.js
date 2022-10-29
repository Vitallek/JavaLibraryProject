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

import { PushOneAmount, PushOneDiscount, PushOnePrice } from '../Utility/PushOneDataToWB'
import './WbStocksComponent.css';
import { updateWbWarehouseConfig } from '../../../Utility/Wildberries/CallApiWildberries';
import { CompareStocksWB_Prem } from '../Utility/CompareDataWB_Prem';
import {CreateCombinedDataWithAmount} from '../Utility/CreateCombinedDataExtended';

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
        case 'amount':
            if (isPositiveInteger(newValue)) {
                rowData[field] = newValue;
                PushOneAmount(e.newRowData, wbStocks)
            }
            else
                event.preventDefault();
            break;
        case 'retail_price':
            if (isPositiveInteger(newValue)) {
                rowData[field] = newValue;
                PushOnePrice(e.newRowData, wbStocks)
            }
            else
                event.preventDefault();
            break;
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
    newConfig.custom.amount[e.target.id] = newValue
    setConfig(newConfig)
}
const returnDefaultWbConfig = (config, setConfig) => {
    if(!window.confirm('Вернуть стандартные настройки подсчёта остатков?')) return
    let newConfig = structuredClone(config)
    newConfig.custom = newConfig.defaults
    setConfig(newConfig)
    updateWbWarehouseConfig(`https://${process.env.REACT_APP_SERVER_ADDR}/wb-update-wb-config`, newConfig)
}
const saveCustomWbConfig = (config, setConfig, eq1, between1and6, higher5) => {
    if(!window.confirm('Сохранить введённые настройки подсчёта остатков?')) return
    let newConfig = structuredClone(config)
    newConfig.custom.amount.eq1 = eq1
    newConfig.custom.amount.between1and6 = between1and6
    newConfig.custom.amount.higher5 = higher5
    setConfig(newConfig)
    updateWbWarehouseConfig(`https://${process.env.REACT_APP_SERVER_ADDR}/wb-update-wb-config`, config)
}
const recalculateAmount = (config, combinedData, premPrice, wbStocks, setProducts, setNewWbStocks) => {
    if(!window.confirm('Пересчитать остатки по новым правилам?')) return
    if(premPrice.length === 0) {
        alert('Prem Price не загружен')
        return
    }
    //visible part
    setProducts(CreateCombinedDataWithAmount(combinedData, premPrice, config))
    //what will send to wb
    setNewWbStocks(CompareStocksWB_Prem(premPrice, wbStocks, config))
}

const WbStocksComponent = ({config, setConfig, combinedData, wbStocks, premPrice, wbNewStocks, setNewWbStocks, isPriceLoaded}) => {
    const [products, setProducts] = useState(combinedData);
    const toast = useRef(null);

    const [eq1, seteq1] = useState(config.custom.amount.eq1)
    const [between1and6, setbetween1and6] = useState(config.custom.amount.between1and6)
    const [higher5, sethigher5] = useState(config.custom.amount.higher5)

    const columns = [
        { field: 'article', header: 'Артикул' },
        { field: 'amount', header: 'Кол-во' },
        { field: 'new_amount', header: 'Кол-во NEW' },
    ];

    // useEffect(() => {
    //     let mounted = true
        
    //     return function cleanup() {
    //         mounted = false
    //       }
    // }, [])

    useEffect(() => {
        if (premPrice.length === 0) return
        setProducts(CreateCombinedDataWithAmount(combinedData, premPrice, config))
    }, [premPrice]);

    return (
        <Grid container item xs={12}>
            <Grid container item xs={8}>
                <List style={{ maxHeight: '85vh', overflowY: 'auto' }} className="datatable">
                    <Toast ref={toast} />
                    <Box className="card p-fluid">
                        <DataTable value={products} editMode="cell" dataKey='article' className="editable-cells-table" filterDisplay="row" responsiveLayout="scroll">
                            {columns.map(({ field, header }) => (
                                field === 'new_amount' || field==='article' 
                                ? 
                                <Column key={field} filter sortable field={field} header={header} style={{ width: '25%' }} />
                                :
                                <Column key={field} filter sortable field={field} header={header} style={{ width: '25%' }}
                                    editor={(options) => cellEditor(options)} onCellEditComplete={e => onCellEditComplete(e, wbStocks)} />
                            ))}
                        </DataTable>
                    </Box>
                </List>
            </Grid>
            <Grid item xs={4}>
                <Stack direction="column" sx={{ml: 2}} spacing={2}>
                    <Typography variant="subtitle1">
                        {`Изменение правил подсчёта остатков`}
                    </Typography>
                    <TextField
                    onChange={e => handleChangeConfigParam(e, eq1, seteq1, config, setConfig)}
                    // inputRef={articleInput}
                    onFocus={event => {
                        event.target.select();
                      }}
                    type="number"
                    value={eq1}
                    id="eq1"
                    label="Если кол-во = 1, то приравнять к..."
                    />  
                    <TextField
                    onChange={e => handleChangeConfigParam(e, between1and6, setbetween1and6, config, setConfig)}
                    onFocus={event => {
                        event.target.select();
                      }}
                    // inputRef={articleInput}
                    type="number"
                    value={between1and6}
                    id="between1and6"
                    label="Если кол-во от 2 до 5, то отнять..."
                    /> 
                    <TextField
                    onChange={e => handleChangeConfigParam(e, higher5, sethigher5, config, setConfig)}
                    onFocus={event => {
                        event.target.select();
                      }}
                    // inputRef={articleInput}
                    type="number"
                    value={higher5}
                    id="higher5"
                    label="Если кол-во больше 5, то отнять..."
                    /> 
                    <Button variant="contained" color="secondary" onClick={e => saveCustomWbConfig(config, setConfig, eq1, between1and6, higher5)}>Сохранить конфиг</Button>
                    <Button variant="contained" color="secondary" onClick={e => returnDefaultWbConfig(config, setConfig)}>Сбросить настройки</Button>
                    <Button variant="contained" disabled={!isPriceLoaded} color="error" onClick={e => recalculateAmount(config, combinedData, premPrice, wbStocks, setProducts, setNewWbStocks)}>Пересчитать остатки</Button>
                </Stack>
            </Grid>
        </Grid>

    );
}

export default WbStocksComponent