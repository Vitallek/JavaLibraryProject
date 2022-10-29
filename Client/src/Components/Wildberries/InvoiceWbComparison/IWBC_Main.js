import React, { useState, useEffect } from 'react';

import NavComponent from '../../NavSidebar/NavComponent';
import { Grid, Button, Stack } from '@mui/material';
import '@fontsource/roboto/400.css';
import SaveFileComponent from './SaveFileComponent/SaveFileComponent';
import InvoiceDrop from './InvoiceDropComponent/InvoiceDrop';
import { GetSTC_Report } from '../../Utility/Wildberries/CallApiWildberries';
import * as XLSX from 'xlsx'

const handleGetFinOrders = (invoiceDoc, ordersAmount) => {
  // const data = structuredClone(invoiceDoc)
  GetSTC_Report(`https://${process.env.REACT_APP_SERVER_ADDR}/get-fin-orders`, {
    invoiceDoc: invoiceDoc,
    ordersAmount: ordersAmount
  }
  ).then(processedFinOrders => {
    /* generate worksheet and workbook */
    const worksheetSold = XLSX.utils.json_to_sheet(processedFinOrders.sold)
    const worksheetBack = XLSX.utils.json_to_sheet(processedFinOrders.back)
    const worksheetFine = XLSX.utils.json_to_sheet(processedFinOrders.fine)
    const worksheetCorrSell = XLSX.utils.json_to_sheet(processedFinOrders.corrSold)

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheetSold, "Продажи")
    XLSX.utils.book_append_sheet(workbook, worksheetCorrSell, "Корректные продажи")
    XLSX.utils.book_append_sheet(workbook, worksheetBack, "Возвраты")
    XLSX.utils.book_append_sheet(workbook, worksheetFine, "Штрафы")

    /* fix headers */
    // XLSX.utils.sheet_add_aoa(worksheet, [["Name", "Birthday"]], { origin: "A1" });

    /* calculate column width */
    // const max_width = data.reduce((w, r) => Math.max(w, r['Название'].length), 10);
    // worksheet["!cols"] = [{ wch: max_width }];

    /* create an XLSX file and try to save to Presidents.xlsx */
    XLSX.writeFile(workbook, `STC_Report${new Date().toLocaleString()}.xlsx`)
  })
}
const handlelogInvoice = (invoiceDoc) => {
  console.log(invoiceDoc)
}
const IWBC = () => {
  const ordersAmount = 6

  //formdata
  const [invoiceDoc, setInvoiceDoc] = useState([])

  const [isInvoiceLoaded, setIsInvoiceLoaded] = useState(false)
  const [wbFinOrder, setWbFinOrder] = useState([])
  const [isWbFinOrderLoaded, setIsWbFinOrderLoaded] = useState(false)

  const [combinedData, setCombinedData] = useState([])

  // const [dateRange, setDateRange] = useState({
  //   startDate: Date.now() - monthUNIX, 
  //   endDate: Date.now()
  // })

  useEffect(() => {
    if (invoiceDoc.length > 0) {
      setIsInvoiceLoaded(true)
    }
  },[invoiceDoc])

  useEffect(() => {

  },[])

  return (
    <Grid container>
      <Grid item xs={1.7}>
        <NavComponent />
      </Grid>
      <Grid container item xs={10}>
        <Grid item xs={12} className='dnd-wrapper'>
          <Stack direction="row" spacing={2}>
            <InvoiceDrop
              setDoc={setInvoiceDoc}
              isDocLoaded={isInvoiceLoaded}
              setIsDocLoaded={setIsInvoiceLoaded}
            />
            <SaveFileComponent
              isDocLoaded={isWbFinOrderLoaded}
              setIsDocLoaded={setIsWbFinOrderLoaded}
            />
          </Stack>
          <Button 
            disabled={!isInvoiceLoaded}
            onClick={() => handleGetFinOrders(invoiceDoc, ordersAmount)}>process
          </Button>
          <Button 
            disabled={!isInvoiceLoaded}
            onClick={() => handlelogInvoice(invoiceDoc)}>лог накладной
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default IWBC