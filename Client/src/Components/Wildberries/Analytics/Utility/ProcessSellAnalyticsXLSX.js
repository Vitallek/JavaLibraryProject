//converts xlsx to json
const ProcessSellAnalyticsXLSX = (doc) => {
  //this is tree which we will return
  let processedPrice = []

  let article = "__EMPTY_4"
  let warehouse = "__EMPTY_9"
  let ordered = "Заказано"
  let sold = "Выкупленные товары"
  
  doc.forEach(element => {
    if (element[warehouse] !== 'Склад поставщика') return
    processedPrice.push({
      "article": element[article],
      "ordered": element[ordered],
      "sold": element[sold]
    })
  })
  return processedPrice
}

export default ProcessSellAnalyticsXLSX