import { Bubble } from 'react-chartjs-2';
import { IAllPriceData } from '@/interface/index'
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    TimeScale
} from 'chart.js';
ChartJS.register(LinearScale, PointElement, Tooltip, Legend, TimeScale);
import "chartjs-adapter-date-fns"


interface IoptionConfig {
    label?: string
    data: any[]
    backgroundColor?: string
}
interface Test {
    label?: string
    data: any[]
    backgroundColor?: string
}
const dealData = (arr: any[]) => {
    const dataSet = {}
    const monthMap = new Map()
    const test: Test[] = []

    console.log(arr, 'arr')
    arr.forEach(([region, regionArr]: [string, IAllPriceData[]]) => {
        const data: { x: number, y: Date, r: number }[] = []
        let priceMap = new Map()
        regionArr.forEach((val) => {
            // const getRegionIndex = val.address.match(/^.*市.*區/g)
            // const getRegion = getRegionIndex![0].match(/市.*區/g)![0].slice(1)
            let formatPrice = parseInt(val.price.slice(0, -2).replaceAll(',', ''))
            if (priceMap.has(val.date)) {
                let price = priceMap.get(val.date)
                priceMap.set(val.date, Math.floor((price + formatPrice)/2))
            } else {
                priceMap.set(val.date, formatPrice)
            }
            
            // return {
            //     x: parseInt(val.price.slice(0, -2).replaceAll(',', '')),
            //     y: formatDate,
            // }
        })
        priceMap.forEach((value,key)=>{
            const year = parseInt(key.slice(0, 3)) + 1911
            const month = key.slice(-2)
            const formatDate = new Date(year, parseInt(month));
            // time = formatDate
            const obj = {
                x: Math.floor(value * 1000) / 1000,
                y: formatDate,
                r: 5
            }
            data.push(obj)
        })

        test.push({ label: region, data: data, backgroundColor: `rgb(255, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})` })
    })

    let config: IoptionConfig[] = []
    let configLabel = ''
    // for (var [key, value] of monthMap) {
    //     const year = parseInt(value.date.slice(0, 3)) + 1911
    //     const month = value.date.slice(-2)
    //     const formatDate = new Date(year, parseInt(month));
    //     // time = formatDate
    //     console.log(monthMap, 'monthMap')
    //     console.log(key, 'key')
    //     const obj = {
    //         x: Math.floor(value.price * 1000) / 1000,
    //         y: formatDate,
    //         r: 5
    //     }
    //     data.push(obj)
    //     if (configLabel !== key.slice(0, 3)) {
    //         configLabel = key.slice(0, 3)
    //         const datasetConfig = {
    //             label: configLabel,
    //             data: data,
    //             backgroundColor: `rgb(255, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
    //         }
    //         config.push(datasetConfig)
    //     }
    // }
    console.log(test, 'test data')
    return {
        datasets: test
    }
    // const data = map((val) => {
    //     const year = parseInt(val.date.slice(0, 3)) + 1911
    //     const month = val.date.slice(-2)
    //     const formatDate = new Date(year, parseInt(month));

    //     return {
    //         x: parseInt(val.price.slice(0, -2).replaceAll(',', '')),
    //         y: formatDate,
    //     }
    //     return {
    //         x: val.price

    //     }
    // })
    const dataset = {
        datasets: [{
            label: 'First Dataset',
            data: [{
                x: 20,
                y: 30,
                r: 15
            }, {
                x: 40,
                y: 10,
                r: 10
            }],
            backgroundColor: 'rgb(255, 99, 132)'
        }]
    }
    return dataset
};
const dealOptions = () => {
    // type: 'time',
    // let [minMonth, maxMonth] = [new Date().getTime(), new Date().getTime()]
    // datas.forEach((data) => {
    //     const year = parseInt(data.date.slice(0, 3)) + 1911
    //     const month = data.date.slice(-2)
    //     const formatDate = new Date(year, parseInt(month));
    //     minMonth = Math.min(formatDate.getTime(), minMonth, maxMonth)

    //     maxMonth = Math.max(formatDate.getTime(), maxMonth)
    // })
    return {
        scales: {
            y: {
                type: "time",
                time: {
                    unit: 'month',
                    parser: 'yyyy/MM',
                },
                ticks: {
                    type: "time",
                    callback: function (value: any) {
                        // do something with value
                        // console.log(value, 'asdas')
                        value = value ? new Date(value) : new Date()
                        const formatTime = value
                        return formatTime.getUTCFullYear() + '/' + (formatTime.getMonth() + 1);
                    },

                },
            },
        }
    }
};
export interface IBubbleGraph {
    data: any
}
const BubbleGraph = ({ data }: { data: any[] }) => {
    return (
        <>
            {
                data.length > 0 &&
                <Bubble
                    options={dealOptions()}
                    data={dealData(data)}
                >
                </Bubble>
            }
        </>
    )
}

export { BubbleGraph }