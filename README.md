關於此專案:
專案網址:https://house-rate-record.vercel.app

# 利率跟房價的關係圖

此專案使用next 13，因13新版開始新增了app router，結構上跟先前的版本不太一樣，先練練手熟悉一下
後端的伺服器未上伺服器、因主要是用來做爬蟲跟資料擷取
使用koa不用express是因為之前沒用過故了解一下
有用到python是因為近期在學python，且有相關的圖文辨識技術


## 前端技術:nextjs、react-chart
## 後端技術:nodejs、mysql、puppeteer、python
後端路由框架:koa、flask
圖片解析技術:ocr
部屬相關流程:vercel

### 待處理
~~1.目前資料可能轉存成json用json-server，或是再看看是不是用firebase~~
2.cicd的設定(vercel部屬目前有自己的，開發上的可以考慮加入試試)
3.再視情形是否使用docker包裝
4.資料太大時傳送無法一次傳送，vercel的更新方式須再處理格式、分批修改
