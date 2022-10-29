import CallApiWildberries from '../../../Utility/Wildberries/CallApiWildberries'
import { CallApiCurrencyExchange } from '../../../Utility/Currency/CallApiCurrencyExchange'

const RUBstr = 'RUB'
const getExchangeInfo = async () => {
  return await CallApiCurrencyExchange(RUBstr)
}

const PushOneAmount = (newData, wbStocks) => {
  let product = wbStocks.find(element => element.article === newData.article)
  let dataToPush = [{
    barcode: product.barcode,
    stock: parseInt(newData.amount),
    warehouseId: product.warehouseId
  }]
  
  CallApiWildberries( 'post','https://suppliers-api.wildberries.ru/api/v2/stocks',
                      `https://${process.env.REACT_APP_SERVER_ADDR}/wb-post-stocks`,
                      JSON.stringify(dataToPush))
    .then(data => {
      if(data != null){
        console.log(data)
      }
    })
}

const PushOnePrice = (newData, wbStocks) => {
  let product = wbStocks.find(element => element.article === newData.article)
  let dataToPush = [{
    nmId: parseInt(product.nmId),
    price: parseInt(newData.retail_price),
  }]
  
  CallApiWildberries( 'post','https://suppliers-api.wildberries.ru/public/api/v1/prices',
                      `https://${process.env.REACT_APP_SERVER_ADDR}/wb-post-price`,
                      JSON.stringify(dataToPush))
    .then(data => {
      if(data != null){
        console.log(data)
      }
    })
}

const PushOneCalcPrice = async (articleToChangePrice, newRUBprice, wbStocks) => {
  let BYNRUB_exchange = await getExchangeInfo()
  console.log('курс ' + BYNRUB_exchange.Cur_OfficialRate)
  let product = wbStocks.find(element => element.article === articleToChangePrice)
  let dataToPush = [{
    nmId: parseInt(product.nmId),
    price: newRUBprice,
  }]
  CallApiWildberries( 
    'post','https://suppliers-api.wildberries.ru/public/api/v1/prices',
    `https://${process.env.REACT_APP_SERVER_ADDR}/wb-post-price`,
    JSON.stringify(dataToPush))
  .then(data => {
    if(data != null){
      console.log(data)
    }
  })
}

const PushOneDiscount = (newData, wbStocks) => {
  let product = wbStocks.find(element => element.article === newData.article)
  let dataToPush = [{
    discount: parseInt(newData.discount),
    nm: parseInt(product.nmId),
  }]
  CallApiWildberries( 'post','https://suppliers-api.wildberries.ru/public/api/v1/updateDiscounts',
                      `https://${process.env.REACT_APP_SERVER_ADDR}/wb-post-discount`,
                      JSON.stringify(dataToPush))
    .then(data => {
      if(data != null){
        console.log(data)
      }
    })
}

export {PushOneAmount, PushOnePrice, PushOneCalcPrice, PushOneDiscount}