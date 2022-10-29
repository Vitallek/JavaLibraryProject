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

import { PushOneAmount, PushOneCalcPrice, PushOneDiscount, PushOnePrice } from '../Utility/PushOneDataToWB'
import './WbPricesComponent.css';
import { updateWbWarehouseConfig } from '../../../Utility/Wildberries/CallApiWildberries';
import { ComparePriceWB_Prem } from '../Utility/CompareDataWB_Prem';
import { CreateCombinedDataWithPrice} from '../Utility/CreateCombinedDataExtended';
import { CallApiCurrencyExchange } from '../../../Utility/Currency/CallApiCurrencyExchange';
import { CalculateProductPrice } from '../Utility/CalculateProductPrice';

const RUBstr = 'RUB'
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
    newConfig.custom.price[e.target.id] = newValue
    setConfig(newConfig)
}
const returnDefaultWbConfig = (config, setConfig) => {
    if(!window.confirm('Вернуть стандартные настройки подсчёта цен?')) return
    let newConfig = structuredClone(config)
    newConfig.custom = newConfig.defaults
    setConfig(newConfig)
    updateWbWarehouseConfig(`https://${process.env.REACT_APP_SERVER_ADDR}/wb-update-wb-config`, newConfig)
}
const saveCustomWbConfig = (config, setConfig, wbFee, defaultDiscount, logisticsRUB) => {
    if(!window.confirm('Сохранить введённые настройки подсчёта цен?')) return
    let newConfig = structuredClone(config)
    newConfig.custom.price.wbFee = wbFee
    newConfig.custom.price.defaultDiscount = defaultDiscount
    newConfig.custom.price.logisticsRUB = logisticsRUB
    setConfig(newConfig)
    updateWbWarehouseConfig(`https://${process.env.REACT_APP_SERVER_ADDR}/wb-update-wb-config`, config)
}
const recalculatePrices = (config, combinedData, premPrice, wbStocks, setProducts, setNewWbPrice) => {
    if(!window.confirm('Пересчитать цены по новым правилам?')) return
    if(premPrice.length === 0) {
        alert('Prem Price не загружен')
        return
    }
    //visible part
    async function addNewPriceToTable() {
        setProducts(await CreateCombinedDataWithPrice(combinedData, premPrice, config))
    } 
    addNewPriceToTable()

    async function processPricesToWB() {
        setNewWbPrice(await ComparePriceWB_Prem(premPrice, wbStocks, config))
    }
    //what will send to wb
    processPricesToWB()
}
const handleChangeArticle = (e, articleToChangePriceVal) => {
    if(e.target.value === articleToChangePriceVal) {
        e.preventDefault()
        return
    }
    articleToChangePriceVal = e.target.value
}
const handleChangeNewBYNprice = (e, newBYNpriceVal) => {
    newBYNpriceVal = e.target.value.replace(/,/g, '.')
}
const getExchangeInfo = async () => {
    return await CallApiCurrencyExchange(RUBstr)
}
const handleCalcNewPrice = async (articleToChangePrice, newBYNprice, wbStocks, config, setNewRUBprice) => {
    let BYNRUB_exchange = await getExchangeInfo()
    console.log('курс ' + BYNRUB_exchange.Cur_OfficialRate)
    // let priceRUB = Math.ceil( exchangedPrice / (1 - (config.custom.price.wbFee + config.custom.price.defaultDiscount) / 100))  + config.custom.price.logisticsRUB
    let priceRUB = CalculateProductPrice(BYNRUB_exchange, {retail_price: newBYNprice}, config)
    console.log({ 
      article: articleToChangePrice, 
      newPriceBYN: newBYNprice, 
      newPriceRUB: priceRUB, 
      // secondPriceRUB: priceRUB,
      discount: `${config.custom.price.defaultDiscount}%`,
      afterDiscount: priceRUB - (priceRUB * config.custom.price.defaultDiscount / 100),
      // afterDiscount2: priceRUB - (priceRUB * config.custom.price.defaultDiscount / 100)
    })
    setNewRUBprice(priceRUB)
}
const handlePushOneCalcPrice = (articleToChangePrice, newRUBprice, wbStocks, config) => {
    if(!window.confirm('Загрузить новую цену на товар?')) return
    //check if article exists
    if(wbStocks.filter(product => product.article === articleToChangePrice).length === 0) {
        alert('Такого артикула у WB не нашлось')
        return
    }
    //check if bynprice is valid
    if (isNaN(newRUBprice)) {
        alert('Цена введена неверно')
        return
    }
    PushOneCalcPrice(articleToChangePrice, newRUBprice, wbStocks, config)
}

const WbPricesComponent = ({config, setConfig, combinedData, wbStocks, premPrice, wbNewStocks, setNewWbPrice, isPriceLoaded}) => {
    const [products, setProducts] = useState(combinedData);
    const toast = useRef(null);

    const [wbFee, setWbFee] = useState(config.custom.price.wbFee)
    const [defaultDiscount, setDefaultDiscount] = useState(config.custom.price.defaultDiscount)
    const [logisticsRUB, setLogisticsRUB] = useState(config.custom.price.logisticsRUB)

    const articleToChangePrice = useRef(null)
    const newBYNprice = useRef(null)
    const [newRUBprice, setNewRUBprice] = useState(0)
    // const [, setArticleToChangePrice] = useState('')
    // const [, setNewBYNprice] = useState('')

    const columns = [
        { field: 'article', header: 'Артикул' },
        { field: 'retail_price', header: 'Цена WB' },
        { field: 'new_retail_price', header: 'Цена WB new' }
    ];

    // useEffect(() => {
    //     let mounted = true
        
    //     return function cleanup() {
    //         mounted = false
    //       }
    // }, [])

    useEffect(() => {
        if (premPrice.length === 0) return
        async function addNewPriceToTable() {
            setProducts(await CreateCombinedDataWithPrice(combinedData, premPrice, config))
        } 
        addNewPriceToTable()
        
    }, [premPrice]);

    return (
        <Grid container item xs={12}>
            <Grid container item xs={8}>
                <List style={{ maxHeight: '85vh', overflowY: 'auto' }} className="datatable">
                    <Toast ref={toast} />
                    <Box className="card p-fluid">
                        <DataTable value={products} editMode="cell" dataKey='article' className="editable-cells-table" filterDisplay="row" responsiveLayout="scroll">
                            {columns.map(({ field, header }) => (
                                field === 'new_retail_price' || field==='article'
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
                <List style={{ maxHeight: '85vh', overflowY: 'auto' }} className="datatable">
                    <Stack direction="column" sx={{ml: 1, mr: 1}} spacing={2}>
                        <Typography variant="subtitle1">
                            {`Изменение правил подсчёта цены`}
                        </Typography>
                        <TextField
                        onChange={e => handleChangeConfigParam(e, wbFee, setWbFee, config, setConfig)}
                        onFocus={event => {
                            event.target.select();
                        }}
                        type="number"
                        value={wbFee}
                        id="wbFee"
                        label="Комиссия WB, %"
                        />  
                        <TextField
                        onChange={e => handleChangeConfigParam(e, defaultDiscount, setDefaultDiscount, config, setConfig)}
                        onFocus={event => {
                            event.target.select();
                        }}
                        type="number"
                        value={defaultDiscount}
                        id="defaultDiscount"
                        label="Учитывать скидку, %"
                        /> 
                        <TextField
                        onChange={e => handleChangeConfigParam(e, logisticsRUB, setLogisticsRUB, config, setConfig)}
                        onFocus={event => {
                            event.target.select();
                        }}
                        type="number"
                        value={logisticsRUB}
                        id="logisticsRUB"
                        label="Стоимость логистики, RUB"
                        /> 
                        <Button variant="contained" color="secondary" onClick={e => saveCustomWbConfig(config, setConfig, wbFee, defaultDiscount, logisticsRUB)}>Сохранить конфиг</Button>
                        <Button variant="contained" color="secondary" onClick={e => returnDefaultWbConfig(config, setConfig)}>Сбросить настройки</Button>
                        <Button variant="contained" disabled={!isPriceLoaded} color="error" onClick={e => recalculatePrices(config, combinedData, premPrice, wbStocks, setProducts, setNewWbPrice)}>Пересчитать цены</Button>

                        <Typography variant="subtitle1">
                            {`Пересчитать цену для товара`}
                        </Typography>
                        <TextField
                        onChange={e => handleChangeArticle(e, articleToChangePrice.current.value)}
                        type="text"
                        inputRef={articleToChangePrice}
                        id="articleToChangePrice"
                        label="Артикул товара"
                        /> 
                        <TextField
                        onChange={e => handleChangeNewBYNprice(e, newBYNprice.current.value)}
                        type="text"
                        inputRef={newBYNprice}
                        id="newBYNprice"
                        label="Цена BYN"
                        /> 
                        <Typography variant="subtitle1">
                            {`Новая цена: ${newRUBprice} RUB`}
                        </Typography>
                        <Button 
                        variant="contained" 
                        color="error" 
                        onClick={e => handleCalcNewPrice(articleToChangePrice.current.value, newBYNprice.current.value, wbStocks, config, setNewRUBprice)}>
                            Пересчитать
                        </Button>
                        <Button 
                        variant="contained" 
                        color="error" 
                        onClick={e => handlePushOneCalcPrice(articleToChangePrice.current.value, newRUBprice, wbStocks, config)}>
                            Отправить
                        </Button>
                    </Stack>
                </List>
            </Grid>
        </Grid>

    );
}

export default WbPricesComponent