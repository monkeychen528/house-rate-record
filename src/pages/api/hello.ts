// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'


export type T_Data = {
  city: string,
  region: string[]
}
const mockData = [{
  city: "台北市",
  region: ["北投區", "士林區", "大同區", "中山區", "內湖區", "松山區", "萬華區", "中正區", "大安區", "信義區", "南港區", "文山區"]
},
{
  city: "新北市",
  region: ["萬里區",
    "金山區",
    "板橋區",
    "汐止區",
    "深坑區",
    "石碇區",
    "瑞芳區",
    "平溪區",
    "雙溪區",
    "貢寮區",
    "新店區",
    "坪林區",
    "烏來區",
    "永和區",
    "中和區",
    "土城區",
    "三峽區",
    "樹林區",
    "鶯歌區",
    "三重區",
    "新莊區",
    "泰山區",
    "林口區",
    "蘆洲區",
    "五股區",
    "八里區",
    "淡水區",
    "三芝區",
    "石門區"]
}
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: T_Data[] }>
) {
  res.status(200).json({ data: mockData })
}
