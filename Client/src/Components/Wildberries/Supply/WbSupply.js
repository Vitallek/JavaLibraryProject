import React from 'react';

import NavComponent from '../../NavSidebar/NavComponent';
import { Grid, Button, Stack } from '@mui/material';
import { PrintInvoiceDocument, PrintSupply, PrintSupplyStickers } from '../../Utility/Wildberries/CallApiWildberries';
import * as XLSX from 'xlsx'

import '@fontsource/roboto/400.css';

const handlePrintSupply = () => {
  if (window.confirm('Распечатать поставку?')){
    PrintSupply(`https://${process.env.REACT_APP_SERVER_ADDR}/wb-print-supply`).then(data => {
      const file = new Blob([data], {
        type: "application/pdf"
      })
      //Build a URL from the file
      const fileURL = URL.createObjectURL(file);
      //Open the URL on new Window
      window.open(fileURL);
    })
  }
}

const handlePrintStickersOld = () => {
  if (window.confirm('Распечатать стикеры?')){
    PrintSupplyStickers(`https://${process.env.REACT_APP_SERVER_ADDR}/wb-print-supply-stickers-old`).then(data => {
      const file = new Blob([data], {
        type: "application/pdf"
      })
      //Build a URL from the file
      const fileURL = URL.createObjectURL(file);
      //Open the URL on new Window
      window.open(fileURL);
    })
  }
}
const handlePrintStickersNew = () => {
  if (window.confirm('Распечатать стикеры?')){
    PrintSupplyStickers(`https://${process.env.REACT_APP_SERVER_ADDR}/wb-print-supply-stickers`).then(data => {
      const file = new Blob([data], {
        type: "application/pdf"
      })
      //Build a URL from the file
      const fileURL = URL.createObjectURL(file);
      //Open the URL on new Window
      window.open(fileURL);
    })
  }
}
const handleDownloadInvoice = () => {
  PrintInvoiceDocument(`https://${process.env.REACT_APP_SERVER_ADDR}/wb-invoice-doc`).then(data => {
    /* generate worksheet and workbook */
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice");

    /* fix headers */
    // XLSX.utils.sheet_add_aoa(worksheet, [["Name", "Birthday"]], { origin: "A1" });

    /* calculate column width */
    // const max_width = data.reduce((w, r) => Math.max(w, r['Название'].length), 10);
    // worksheet["!cols"] = [{ wch: max_width }];

    /* create an XLSX file and try to save to Presidents.xlsx */
    XLSX.writeFile(workbook, `InvoiceData_${new Date().toLocaleString()}.xlsx`);
  })
}

const WbSupply = () => {

  return (
    <Grid container>
      <Grid item xs={1.7}>
        <NavComponent/>
      </Grid>
      <Grid container item xs={10}>
        <Grid item xs={3}>
          <Stack direction="column" spacing={2}>
            <Button contained onClick={() => handlePrintSupply()}>{'печать поставки'}</Button>
            <Button contained onClick={() => handlePrintStickersOld()}>{'печать стикеров (старая)'}</Button>
            <Button contained onClick={() => handlePrintStickersNew()}>{'печать стикеров (новая)'}</Button>
            <Button contained onClick={() => handleDownloadInvoice()}>{'печать файла для накладной'}</Button>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default WbSupply;