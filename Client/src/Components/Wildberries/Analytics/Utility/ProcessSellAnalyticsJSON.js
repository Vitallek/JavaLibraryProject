//adds some rows to existing json
const ProcessSellAnalyticsJSON = (wbStocks, doc) => {
  //this is tree which we will return
  let processedJSON = [...wbStocks]
  wbStocks.forEach(element => {
    let productFromDoc = doc.find(el => el.article === element.article)
    if(typeof productFromDoc === 'undefined') {
      element.ordered = 0
      return
    }
    element.ordered = productFromDoc.ordered
    element.sold = productFromDoc.sold
  })
  // {
  //   "article": element[article],
  //   "ordered": element[ordered],
  //   "sold": element[sold]
  // }
  console.log(processedJSON)
  return processedJSON
}

export default ProcessSellAnalyticsJSON