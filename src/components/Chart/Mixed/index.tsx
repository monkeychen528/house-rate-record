import { IAllPriceData } from '@/interface/index'
import {
    Chart as ChartJS,
    LineElement,
    LineController,
    LinearScale,
    CategoryScale,
    PointElement,
    Tooltip,
    Legend,
    TimeScale
} from 'chart.js';
ChartJS.register(LinearScale, PointElement, Tooltip, Legend, TimeScale, LineElement, LineController, CategoryScale);
import { Chart } from 'react-chartjs-2';
import "chartjs-adapter-date-fns"
import { IRate } from '@/interface'


interface Idataset {
    label?: string
    data: any[]
    backgroundColor?: string
    type?: string
    yAxisID?: string
    stepped?: boolean | string,
    borderColor?: string
}
const dealData = (arr: any[], rateArr: IRate[]) => {
    const dataset: Idataset[] = []

    arr.forEach(([region, regionArr]: [string, IAllPriceData[]]) => {
        const data: { x: Date, y: number, r: number }[] = []
        let priceMap = new Map()
        regionArr.forEach((val) => {
            let formatPrice = parseInt(val.price.slice(0, -2).replaceAll(',', ''))
            if (priceMap.has(val.date)) {
                let price = priceMap.get(val.date)
                priceMap.set(val.date, Math.floor((price + formatPrice) / 2))
            } else {
                priceMap.set(val.date, formatPrice)
            }

        })
        priceMap.forEach((value, key) => {
            const year = parseInt(key.slice(0, 3)) + 1911
            const month = key.slice(-2)
            const formatDate = new Date(year, parseInt(month));
            // time = formatDate
            const obj = {
                x: formatDate,
                y: Math.floor(value * 1000) / 1000,
                r: 5
            }
            data.push(obj)
        })
        const randomColor = () => 10 * Math.random()
        dataset.push({ label: region, data: data, backgroundColor: `rgb(${Math.floor(randomColor() * 255 / 10)}, ${Math.floor(randomColor() * 255 / 10)}, ${Math.floor(randomColor() * 255 / 10)})` })
    })
    if (rateArr.length > 0) {
        const rateDataSet = rateArr.map((val) => {
            return { x: new Date(val.date), y: val.ratecol }
        })
        const checkRateFinalDate = rateDataSet[0]
        console.log(rateDataSet, 'rateDataSet')
        if (checkRateFinalDate.x < new Date()) rateDataSet.unshift({ x: new Date(), y: checkRateFinalDate.y })
        dataset.push({
            label: '利率',
            data: rateDataSet,
            type: "line" as const,
            stepped: 'after',
            borderColor: 'black',
            yAxisID: "rate"
        })
    }

    return {
        datasets: dataset
    }

};
const dealOptions = () => {
    return {
        scales: {
            x: {
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
                        return formatTime.getFullYear() + '/' + (formatTime.getMonth() + 1);
                    },
                },
            },

        },
        rate: {

            display: true,
            position: 'right',

        }
    }
};

const MixedGraph = ({ data, rate }: { data: any[], rate: IRate[] }) => {
    return (
        <>
            {
                data.length > 0 &&
                <Chart
                    type="scatter"
                    options={dealOptions()}
                    data={dealData(data, rate)}
                >
                </Chart>
            }
        </>
    )
}

export { MixedGraph }