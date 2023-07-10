import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions
} from 'chart.js';

import { Scatter } from 'react-chartjs-2';
import { IAllPriceData } from '@/interface'
import "chartjs-adapter-date-fns"

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);

// chart parameter
function chartData(data: IAllPriceData[]) {
  const returnData = {
    labels: data.map((val) => {
      const year = parseInt(val.date.slice(0, 3)) + 1911
      const month = val.date.slice(-2)
      const formatDate = new Date(year, parseInt(month));
      return formatDate.getFullYear() + '/' + (formatDate.getMonth() + 1)
    }),
    datasets: [
      {
        label: '成交分布',
        data: data.map((val) => {
          const year = parseInt(val.date.slice(0, 3)) + 1911
          const month = val.date.slice(-2)
          const formatDate = new Date(year, parseInt(month));

          return {
            x: parseInt(val.price.slice(0, -2).replaceAll(',', '')),
            y: formatDate,
          }
        }),
        backgroundColor: 'rgba(255, 99, 132, 1)',
      },
    ],

  };
  return returnData
}

const dealOptions = (datas: IAllPriceData[]): ChartOptions<"scatter"> => {
  // type: 'time',
  let [minMonth, maxMonth] = [new Date().getTime(), new Date().getTime()]
  datas.forEach((data) => {
    const year = parseInt(data.date.slice(0, 3)) + 1911
    const month = data.date.slice(-2)
    const formatDate = new Date(year, parseInt(month));
    minMonth = Math.min(formatDate.getTime(), minMonth, maxMonth)

    maxMonth = Math.max(formatDate.getTime(), maxMonth)
  })
  return {
    scales: {
      y: {
        type: "time",
        time: {
          unit: 'month',
          parser: 'yyyy/MM',
        },
        ticks: {
          callback: function (value: any) {
            value = value ? new Date(value) : new Date()
            const formatTime = value
            return formatTime.getUTCFullYear() + '/' + (formatTime.getMonth() + 1);
          },

        },
        min: (() => {
          let year = new Date(minMonth).getFullYear()
          let month = new Date(minMonth).getMonth() - 1

          return new Date(year, month).getTime()
        })(),
      },
    }
  }
};


export function ScatterGraph({ data }: { data: IAllPriceData[] }) {
  return (
    <Scatter data={chartData(data)} options={dealOptions(data)} />
  )
}