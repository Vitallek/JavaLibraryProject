import { CallApiCurrencyExchange } from "../../../Utility/Currency/CallApiCurrencyExchange"
import { CalculateProductPrice } from "./CalculateProductPrice"

const RUBstr = 'RUB'
const getExchangeInfo = async () => {
  return await CallApiCurrencyExchange(RUBstr)
}

export const CreateCombinedDataWithAmount = (combinedData, premPrice, config) => {
  let newCombinedData = [...combinedData]
  newCombinedData.forEach(product => {    
    let premProduct = premPrice.find(element => element.article === product.article)
    if (typeof premProduct === 'undefined') {
      product.new_amount = 0
      return
    }
    let premProductAmountInt = parseInt(premProduct.amount)
    let newAmount = premProductAmountInt - config.custom.amount.higher5
    if(premProductAmountInt <= 0){
      newAmount = 0
    }
    if(premProductAmountInt === 1){
      newAmount = config.custom.amount.eq1
    }
    if(premProductAmountInt > 1 && premProductAmountInt < 6){
      newAmount = premProductAmountInt - config.custom.amount.between1and6
    }
    if(newAmount < 0) newAmount = 0
    product.new_amount = newAmount
  })
  return newCombinedData
}

export const CreateCombinedDataWithPrice = async (combinedData, premPrice, config) => {
  let BYNRUB_exchange = await getExchangeInfo()

  let newCombinedData = [...combinedData]
  newCombinedData.forEach(product => {    
    let premProduct = premPrice.find(element => element.article === product.article)
    if (typeof premProduct === 'undefined') {
      product.new_retail_price = 'Нет в наличии'
      return
    }
    let priceBYN = parseFloat(premProduct.retail_price)
    let priceRUB = CalculateProductPrice(BYNRUB_exchange, premProduct, config)
    let finalStr = `${priceBYN} BYN / ${priceRUB} RUB`
    product.new_retail_price = finalStr
  })
  return newCombinedData
}