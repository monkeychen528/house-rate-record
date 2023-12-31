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
    TimeScale,
    ChartDataset,
    ChartData,
    ChartOptions
} from 'chart.js';
ChartJS.register(LinearScale, PointElement, Tooltip, Legend, TimeScale, LineElement, LineController, CategoryScale);
import { Chart } from 'react-chartjs-2';
import "chartjs-adapter-date-fns"
import { IRate } from '@/interface'
import { formatData, stringDateToDate } from '../utils/format'


type graphType = "scatter" |"line"

type ScatterType = ChartDataset<graphType,{ x: Date, y: number, r?: number }[]>

const dealData = (arr: any[], rateArr: IRate[]) => {
    const dataset: ScatterType[] = []

    arr.forEach(([region, regionArr]: [string, IAllPriceData[]]) => {
        const data: { x: Date, y: number, r: number }[] = []
        let priceMap = formatData(regionArr)

        priceMap.forEach((value, key) => {
            const formatDate = stringDateToDate(key)
            // time = formatDate
            const obj = {
                x: formatDate,
                y: Math.floor(parseInt(value.price) * 1000) / 1000,
                r: 5
            }
            data.push(obj)
        })
        const randomColor = () => 10 * Math.random()
        dataset.push({ type: "scatter" as const, label: region, data: data, backgroundColor: `rgb(${Math.floor(randomColor() * 255 / 10)}, ${Math.floor(randomColor() * 255 / 10)}, ${Math.floor(randomColor() * 255 / 10)})` })
    })
    if (rateArr.length > 0) { //check rate graph whether show
        const rateDataSet = rateArr.map((val) => {
            return { x: new Date(val.date), y: val.ratecol }
        })
        const checkRateFinalDate = rateDataSet[0]
        if (checkRateFinalDate.x.getTime() < new Date().getTime()) rateDataSet.unshift({ x: new Date(), y: checkRateFinalDate.y })

        dataset.push({
            label: '利率',
            data: rateDataSet,
            type: "line" as const,
            // stepped: 'after', //利率劃線方式
            borderColor: 'black',
            yAxisID: "rate"
        })
    }

    return {
        datasets: dataset
    }

};
const dealOptions: ChartOptions<'scatter'
    | 'line'> = {
    scales: {
        x: {
            type: "time",
            time: {
                unit: 'month',
                parser: 'yyyy/MM',
            },
            ticks: {
                // type: "time" as const,
                callback: function (value: any) {
                    value = value ? new Date(value) : new Date()
                    const formatTime = value
                    return formatTime.getFullYear() + '/' + (formatTime.getMonth() + 1);
                },
            },
        },
        y: {
            position: 'left',
            display: true,
        },
        rate: {

            position: 'right',
            display: true,
        }
    },
}


const MixedGraph = ({ data, rate }: { data: any[], rate: IRate[] }) => {
    return (
        <>
            {
                data.length > 0 &&
                <Chart
                    type="scatter"
                    options={dealOptions}
                    data={dealData(data, rate)}
                >
                </Chart>
            }
        </>
    )
}

export { MixedGraph }