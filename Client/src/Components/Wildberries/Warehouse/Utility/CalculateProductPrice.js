export const CalculateProductPrice = (BYNRUB_exchange, premProduct, config) => {
    const exchangedPrice = (parseFloat(premProduct.retail_price) * 1 / BYNRUB_exchange.Cur_OfficialRate * BYNRUB_exchange.Cur_Scale)
    return Math.ceil(exchangedPrice / ((1 - config.custom.price.wbFee / 100) - (1 - config.custom.price.wbFee / 100) * config.custom.price.defaultDiscount / 100)) + config.custom.price.logisticsRUB
}
