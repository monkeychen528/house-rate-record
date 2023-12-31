import Head from 'next/head'
import Image from 'next/image'
import Script from 'next/script'
import React, { useEffect, useState } from 'react'
import { Inter } from 'next/font/google'
import { DropDown } from '@/components/DropDown'
import styles from '@/styles/Home.module.css'
import { T_Data } from './api/hello'
import { ICheckboxCommon } from '@/components/Checkbox'
import { IAllPriceData, IRate } from '@/interface'
import { ScatterGraph } from '@/components/Chart/Scatter';
import { BubbleGraph } from '@/components/Chart/Bubble'
import { MixedGraph } from '@/components/Chart/Mixed'
import { Checkbox, MultiCheckbox } from "@/components/Checkbox"

interface IRegion {
  data: T_Data[]
}

function limitDate(date: IRate[], limit?: any) { //先擷取1年的
  const returnDate = date.filter((val) => {
    const now = new Date()
    const year = now.getFullYear()
    if (new Date(val.date).getFullYear() >= 2022) return val
  })
  return returnDate
}

const componentType = [
  {
    value: 'mixed',
    name: "混合圖",
    key: 'mixed'
  },
  {
    value: 'bubble',
    name: "泡泡圖",
    key: 'bubble'
  },
  {
    value: 'scatter',
    name: "散佈圖",
    key: 'scatter'
  },
]

export default function Home() {
  const [citys, setCitys] = useState<string[]>([])
  const [region, setRegion] = useState<IRegion>({ data: [] })
  const [selectCity, setSelectCity] = useState<string>("台北市")
  const [selectRegion, setSelectRegion] = useState<string>('')
  const [checkboxRegion, setCheckboxRegion] = useState<ICheckboxCommon[]>([])
  const [checkboxDataMap, setCheckboxDataMap] = useState(new Map())
  const [allPriceData, setAllPriceData] = useState<IAllPriceData[]>([])
  const [selectPriceData, setSelectPriceData] = useState<IAllPriceData[]>([])
  //利率
  const [rate, setRate] = useState<IRate[]>([])
  // which component
  const [type, setType] = useState('mixed')
  const handleChangeCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectCity(e.target.value)
  }
  const handleChangeRegion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectRegion(e.target.value)
  }

  // checkbox new set
  const handelCheckboxMap = (value: string) => {
    if (checkboxDataMap.has(value)) {
      const cloneMap = new Map([...checkboxDataMap])
      cloneMap.delete(value)
      return setCheckboxDataMap(cloneMap)
    }
    const specificData = allPriceData.filter((val) => {
      return val.address.indexOf(value) > -1
    })
    const newMap = new Map<string, IAllPriceData[]>([[value, specificData]])
    setCheckboxDataMap((prev) => new Map([...prev, ...newMap]))
  }

  // choose which component to show
  const handleComponentType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value)
  }

  // mock region data
  useEffect(() => {
    (async () => {
      const fetchData = await fetch('/api/hello')
      const data = await fetchData.json()
      const citys = data.data.map((val: { city: string }) => {
        return val.city
      })
      setCitys(citys)
      setRegion(data)
    })()
  }, [])

  //get data 
  useEffect(() => {
    (async () => {
      let fetchData, data, parseData, rateData
      if (process.env.NODE_ENV === "development") {
        fetchData = await fetch('http://localhost:3050/getPrice')
        data = await fetchData.json()
        parseData = data
      } else {
        fetchData = await fetch(`${process.env.NEXT_PUBLIC_KV_REST_API_URL}/json.get/price`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_KV_REST_API_READ_ONLY_TOKEN}`,
          },
        })
        data = await fetchData.json()
        parseData = JSON.parse(data.result)
      }

      if (process.env.NODE_ENV === "development") {
        rateData = await fetch('http://localhost:3050/allRate')
        const rate = await rateData.json()
        setRate(rate.data)
      }else{
        rateData = await fetch(process.env.NEXT_PUBLIC_EDGE_CONFIG)
        const rate = await rateData.json()
        setRate(rate.items.data)
      }
      setAllPriceData(parseData.data)
    })()
  }, [])
  // filter region
  useEffect(() => {
    const regionFilter = allPriceData.filter((data: IAllPriceData) => {
      return data.address.indexOf(selectRegion) > -1
    })
    setSelectPriceData(regionFilter)
  }, [selectRegion])
  // checkbox region filter
  useEffect(() => {
    if (region.data.length > 0 && type !== 'scatter') {
      const regions = region.data.filter((val: { city: string }) => {
        return val.city === selectCity
      })
      const checkboxData = regions[0].region.map((val: string) => {
        return {
          name: val,
          child: val,
          value: val,

        }
      })
      setCheckboxRegion(checkboxData)
    }
  }, [citys])

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>


        <p>選擇顯示方式</p>
        <DropDown value={componentType} defaultSelect={type} handleCallback={handleComponentType} />

        {type === "scatter" && <div>
          {
            citys.length > 0 && <DropDown value={citys} key={'citys'} defaultSelect={selectCity} handleCallback={handleChangeCity} />
          }
          {
            region && region.data && region?.data.map((val) => {
              return selectCity === val.city && <DropDown key={"reions"} value={val.region} handleCallback={handleChangeRegion} />
            })
          }
          <ScatterGraph data={selectPriceData} />
        </div>}
        {type !== "scatter" &&
          <>
            <p>請選擇複數個縣市</p>
            <MultiCheckbox dataArr={checkboxRegion} handleCheckbox={handelCheckboxMap} checkedData={checkboxDataMap} />
          </>
        }
        {type === "bubble" && <BubbleGraph data={Array.from(checkboxDataMap)} />}
        {type === "mixed" && <MixedGraph data={Array.from(checkboxDataMap)} rate={limitDate(rate)} />}
      </main>
    </>
  )
}
