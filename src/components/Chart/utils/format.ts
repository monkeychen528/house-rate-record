import { IAllPriceData } from '@/interface/index'

export const formatData = (regionArr: IAllPriceData[]): Map<string, IAllPriceData> => {
    let priceMap = new Map() // { key: times, value: {price, count}} count: how many data are repeat
    regionArr.forEach((val) => {
        let formatPrice = parseInt(val.price.slice(0, -2).replaceAll(',', ''))
        if (priceMap.has(val.times)) {
            let obj = priceMap.get(val.times)
            priceMap.set(val.times, { price: Math.floor((obj.price + formatPrice) / 2), count: obj.count += 1 })
            // price : average price
        } else {
            priceMap.set(val.times, { price: formatPrice, count: 0 })
        }
    })
    return priceMap
}

export const stringDateToDate = (strDate:string) => {
    const year = parseInt(strDate.slice(0, 3)) + 1911
    const month = strDate.slice(-2)
    const formatDate = new Date(year, parseInt(month)-1);
    return formatDate
}