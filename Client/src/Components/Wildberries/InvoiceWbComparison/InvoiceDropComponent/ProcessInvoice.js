export const ProcessInvoice = (excelRows) => {
    const processedRows = []
    // {
    //     "Отчет по отгрузкам контрагенту с 01.07.22 по  17.07.22": "№ п/п",
    //     "__EMPTY": "Дата накладной",
    //     "__EMPTY_1": "№ накладной",
    //     "__EMPTY_2": "Наименование товара",
    //     "__EMPTY_5": "Единица\r\nизмерения",
    //     "__EMPTY_6": "Количество",
    //     "__EMPTY_7": "Цена,  руб.коп.",
    //     "__EMPTY_9": "Стоимость,\r\n руб.коп.",
    //     "__EMPTY_11": "Ставка НДС, %",
    //     "__EMPTY_12": "Сумма НДС,  руб.коп.",
    //     "__EMPTY_13": "Стоимость\r\nс НДС,  руб.коп.",
    //     "__EMPTY_14": "Примечание",
    //     "__EMPTY_15": "Бренд",
    //     "__EMPTY_16": "Артикул",
    //     "__EMPTY_17": "ШтрихКод"
    // }
    const invoiceDate = '__EMPTY'
    const invoiceNum = '__EMPTY_1'
    const productName = '__EMPTY_2'
    const productQuantity = '__EMPTY_6'
    const priceWithoutNds = '__EMPTY_7'
    const valueWithoutNds = '__EMPTY_9'
    const ndsPercent = '__EMPTY_11'
    const ndsPrice = '__EMPTY_12'
    const priceWithNds = '__EMPTY_13'
    const brand = '__EMPTY_15'
    const article = '__EMPTY_16'

    for (let i = 6; i < excelRows.length - 1; i++) {
        processedRows.push({
            invoiceDate: excelRows[i][invoiceDate],
            invoiceNum: excelRows[i][invoiceNum],
            productName: excelRows[i][productName],
            productQuantity: excelRows[i][productQuantity],
            priceWithoutNds: excelRows[i][priceWithoutNds],
            valueWithoutNds: excelRows[i][valueWithoutNds],
            ndsPercent: excelRows[i][ndsPercent],
            ndsPrice: excelRows[i][ndsPrice],
            priceWithNds: excelRows[i][priceWithNds],
            brand: excelRows[i][brand],
            article: excelRows[i][article],
        })
    }
    return processedRows
}