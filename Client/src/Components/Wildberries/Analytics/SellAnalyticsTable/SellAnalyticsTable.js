import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import React, { useState, useEffect, useRef } from 'react';
import { List, Box, Button } from '@mui/material';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

import './SellAnalyticsTable.css';

const zero = 0
const low_coef = 0.8
const hight_coef = 1.5
const orderedCell = (value, options) => {
    //только последняя колонка с "заказано"
    if(options.column.key !== '.$ordered') return 'row-ordered-common'
    //на остатках 0, и люди берут
    if(options.rowData.stock === zero && options.rowData.ordered > zero) {
        return 'row-ordered-highp'
    }
    //на остатках намного меньше, чем берут люди
    if(options.rowData.ordered / options.rowData.stock > hight_coef) {
        return 'row-ordered-midp'
    }
    //на остатках +- столько же, сколько берут люди
    if(options.rowData.ordered / options.rowData.stock > low_coef) {
        return 'row-ordered-lowp'
    }
    //остальное
    return 'row-ordered-common'
}

const SellAnalyticsTable = ({ combinedData }) => {
    const [products, setProducts] = useState(combinedData)
    const [selectedProducts, setSelectedProducts] = useState([])
    const toast = useRef(null)

    const columns = [
        { field: 'checkbox', header: '' },
        { field: 'article', header: 'Артикул' },
        { field: 'stock', header: 'Кол-во WB' },
        { field: 'ordered', header: 'Заказано' },
    ]

    useEffect(() => {
        setProducts(combinedData)
    }, [combinedData]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <List style={{ maxHeight: '85vh', overflowY: 'auto' }} className="datatable">
            <Toast ref={toast} />
            <Box className="card p-fluid">
                <DataTable 
                    cellClassName={orderedCell}
                    value={products}
                    selection={selectedProducts} 
                    onSelectionChange={(e) => setSelectedProducts(e.value)} 
                    dataKey='article'                     
                    responsiveLayout="scroll"
                    filterDisplay="row"
                >
                    {columns.map(({ field, header }) => (
                        field === 'checkbox' ?
                        <Column selectionMode="multiple"></Column> :
                        <Column key={field} filter sortable field={field} header={header} />
                    ))}
                </DataTable>  
            </Box>
        </List>

    )
}

export default SellAnalyticsTable