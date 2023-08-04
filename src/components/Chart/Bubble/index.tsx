import { Bubble } from 'react-chartjs-2';
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
import { IAllPriceData } from '@/interface/index'
import { formatData,stringDateToDate } from '../utils/format'

interface IConfig {
    label?: string
    data: { x: Date, y: number, r: number }[]
    backgroundColor?: string
}

const dealData = (arr: any[]) => {
    const config: IConfig[] = []

    arr.forEach(([region, regionArr]: [string, IAllPriceData[]]) => {
        const data: { x: Date, y: number, r: number }[] = []
        let priceMap = formatData(regionArr)

        priceMap.forEach((value, key) => {
            const formatDate = stringDateToDate(key)
            const obj = {
                x: formatDate,
                y: Math.floor(parseInt(value.price) * 1000) / 1000,
                r: value.count / 10 > 20 ? 20 : value.count / 10
            }
            data.push(obj)
        })

        config.push({ label: region, data: data, backgroundColor: `rgb(255, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})` })
    })


    return {
        datasets: config
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
            <small>計算方式:金額為價格的中位數<br />
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