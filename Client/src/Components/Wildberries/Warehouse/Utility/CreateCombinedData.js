const CreateCombinedData = (wbStocks, wbInfo) => {
  let combinedData = []
  wbStocks.forEach(product => {    
    let fromInfo = wbInfo.find(element => element.nmId === product.nmId)
    if (typeof fromInfo === 'undefined') {
      console.log(product)
      return
    }
    combinedData.push({
      article: product.article,
      retail_price: fromInfo.price,
      amount: product.stock,
      discount: fromInfo.discount,      
    })
  })
  return combinedData
}

export default CreateCombinedData