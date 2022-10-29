const ProcessPremPrice = (premPrice) => {
  //this is tree which we will return
  let processedPrice = []

  let article = "__EMPTY"
  let name = "__EMPTY_2"
  let price = "__EMPTY_4"
  let retail_price = "__EMPTY_6"
  let amount = "__EMPTY_12"
  premPrice.forEach(element => {
    if (
      typeof element[article] !== 'undefined' && 
      // element[article].length > 0 && 
      // element[article] === ' ' &&
      typeof element[price] !== 'undefined' &&
      typeof element[amount] !== 'undefined'
    ) {
      let amount_new = element[amount]//.replace(/\s/g, '').replace(/,00/g, '')
      if (element[amount] === ' ') amount_new = 0
      processedPrice.push({
        article: element[article].toString(),
        name: element[name].toString(),
        purchase_price: element[price].toString(),//.replace(/\s/g, '').replace(/,/g, '.'),
        retail_price: element[retail_price].toString(),//.replace(/\s/g, '').replace(/,/g, '.'),
        amount: amount_new.toString()
      })
    } else {
      console.log({
        article_type: typeof element[article],
        amount_type: typeof element[amount],
        article: element[article],
        amount: element[amount]
      })
    }
  })
  return processedPrice
}

export default ProcessPremPrice