import { CallApiCurrencyExchange } from '../../../Utility/Currency/CallApiCurrencyExchange'
import { CalculateProductPrice } from './CalculateProductPrice'

const RUBstr = 'RUB'
const getExchangeInfo = async () => {
  return await CallApiCurrencyExchange(RUBstr)
}

export const CompareStocksWB_Prem = (premPrice, wbStocks, config) => {
  //this is tree which we will return
  let comparedStocks = []
  // [
  //   {
  //     "barcode": "656335639",
  //     "stock": 1,
  //     "warehouseId": 7543
  //   }
  // ]
  wbStocks.forEach(product => {
    let premProduct = premPrice.find(element => element.article === product.article)
    // 1 то 1
    // >1 <6 то -1
    // >5 то -2

    if (typeof premProduct === 'undefined') {
      comparedStocks.push({
        barcode: product.barcode,
        stock: 0,
        warehouseId: product.warehouseId,
      })
      return
    }

    let premProductInt = parseInt(premProduct.amount)
    let newStock = premProductInt - config.custom.amount.higher5
    if (premProductInt <= 0) {
      newStock = 0
    }
    if (premProductInt === 1) {
      newStock = config.custom.amount.eq1
    }
    if (premProductInt > 1 && premProductInt < 6) {
      newStock = premProductInt - config.custom.amount.between1and6
    }
    if (newStock < 0) newStock = 0
    comparedStocks.push({
      barcode: product.barcode,
      stock: newStock,
      warehouseId: product.warehouseId,
    })
  })
  return comparedStocks
}
export const ComparePriceWB_Prem = async (premPrice, wbStocks, config) => {
  let BYNRUB_exchange = await getExchangeInfo()
  let comparedPrice = []
  // [
  //   {
  //     "nmId": 1234567,
  //     "price": 1000
  //   }
  // ]
  wbStocks.forEach(product => {
    let premProduct = premPrice.find(element => element.article === product.article)
    if (typeof premProduct === 'undefined') return
    comparedPrice.push({
      nmId: product.nmId,
      price: CalculateProductPrice(BYNRUB_exchange,premProduct,config),
    })
  })
  return comparedPrice
}
export const CompareDiscountWB_Prem = (premPrice, wbStocks, config) => {
  let comparedDiscount = []
  // [
  //   {
  //     "discount": 15,
  //     "nm": 12345678
  //   }
  // ]

  wbStocks.forEach(product => {
    // let premProduct = premPrice.find(element => element.article === product.article)
    //discount processing
    comparedDiscount.push({
      discount: config.custom.discount.defaultDiscount,
      nm: product.nmId,
    })
  })
  return comparedDiscount
}