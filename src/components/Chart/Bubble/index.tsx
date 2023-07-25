import { Bubble } from 'react-chartjs-2';
import { IAllPriceData } from '@/interface/index'
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    TimeScale,
    ChartOptions
} from 'chart.js';
ChartJS.register(LinearScale, PointElement, Tooltip, Legend, TimeScale);
import "chartjs-adapter-date-fns"

interface Test {
    label?: string
    data: any[]
    backgroundColor?: string
}
const dealData = (arr: any[]) => {
    const dataSet = {}
    const monthMap = new Map()
    const test: Test[] = []

    arr.forEach(([region, regionArr]: [string, IAllPriceData[]]) => {
        const data: { x: Date, y: number, r: number }[] = []
        let priceMap = new Map()
        regionArr.forEach((val) => {
            // const getRegionIndex = val.address.match(/^.*市.*區/g)
            // const getRegion = getRegionIndex![0].match(/市.*區/g)![0].slice(1)
            let formatPrice = parseInt(val.price.slice(0, -2).replaceAll(',', ''))
            if (priceMap.has(val.date)) {
                let obj = priceMap.get(val.date)
                priceMap.set(val.date, { price: Math.floor((obj.price + formatPrice) / 2), count: obj.count += 1 })
            } else {
                priceMap.set(val.date, { price: formatPrice, count: 0 })
            }

        })

        priceMap.forEach((value, key) => {
            const year = parseInt(key.slice(0, 3)) + 1911
            const month = key.slice(-2)
            const formatDate = new Date(year, parseInt(month));
            // time = formatDate
            const obj = {
                x: formatDate,
                y: Math.floor(value.price * 1000) / 1000,
                r: value.count / 10 > 20 ? 20 : value.count /10
            }
            data.push(obj)
        })

        test.push({ label: region, data: data, backgroundColor: `rgb(255, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})` })
    })


    return {
        datasets: test
    }

};
const dealOptions = (): ChartOptions<"bubble"> => {

    return {
        scales: {
            x: {
                type: "time",
                time: {
                    unit: 'month',
                    parser: 'yyyy/MM',
                },
                ticks: {
                    callback: function (value: any) {
                        value = value ? new Date(value) : new Date()
                        const formatTime = value
                        return formatTime.getFullYear() + '/' + (formatTime.getMonth() + 1);
                    },
                },
            },
        }
    }
};

const BubbleGraph = ({ data }: { data: any[] }) => {
    return (
        <>
        <small>計算方式:金額為價格的中位數<br/>
        圓的大小:當月總數量 / 10</small>
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