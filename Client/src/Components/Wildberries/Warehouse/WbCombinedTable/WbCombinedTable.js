import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import React, { useState, useEffect, useRef } from 'react';
import { List, Box } from '@mui/material';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

import {PushOneAmount, PushOneDiscount, PushOnePrice} from '../Utility/PushOneDataToWB'
import './WbCombinedTable.css';

const WbCombinedTable = ({ combinedData, wbStocks }) => {
    const [products, setProducts] = useState(combinedData);
    const toast = useRef(null);

    const columns = [
        { field: 'article', header: 'Артикул' },
        { field: 'retail_price', header: 'Цена WB' },
        { field: 'amount', header: 'Кол-во' },
        { field: 'discount', header: 'Скидка' }
    ];

    useEffect(() => {
        setProducts(combinedData)
    }, [combinedData]); // eslint-disable-line react-hooks/exhaustive-deps

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

    const onCellEditComplete = (e) => {
        if (!window.confirm('Подтвердите действие')) return
        let { rowData, newValue, field, originalEvent: event } = e;
        console.log(e)
        switch (field) {
            case 'amount':
                if (isPositiveInteger(newValue)){
                    rowData[field] = newValue;
                    PushOneAmount(e.newRowData, wbStocks)
                }
                else
                    event.preventDefault();
                break;
            case 'retail_price':
                if (isPositiveInteger(newValue)){
                    rowData[field] = newValue;
                    PushOnePrice(e.newRowData, wbStocks)
                }
                else
                    event.preventDefault();
                break;
            case 'discount':
                if (isPositiveInteger(newValue)){
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
        return <InputText type="text" onFocus={e => e.target.select()} value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    }

    return (
        <List style={{ maxHeight: '85vh', overflowY: 'auto' }} className="datatable">
            <Toast ref={toast} />
            <Box className="card p-fluid">
                <DataTable value={products} editMode="cell" dataKey='article' className="editable-cells-table" filterDisplay="row" responsiveLayout="scroll">
                    {columns.map(({ field, header }) => (
                        field === 'article' 
                        ?
                        <Column key={field} filter sortable field={field} header={header} style={{ width: '25%' }} />
                        :
                        <Column key={field} filter sortable field={field} header={header} style={{ width: '25%' }} 
                            editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete} />
                        ))}
                </DataTable>  
            </Box>
        </List>

    );
}

export default WbCombinedTable