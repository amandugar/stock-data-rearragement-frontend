import Papa from 'papaparse'
import Deque from 'double-ended-queue'
import { useState } from 'react'
import DetailsTable from './DetailsTable'
import date from 'date-and-time'

const UploadPage = () => {
  const [stockData, setStockData] = useState(null)

  const addToArray = (finalArray, currSale, currPurchase, qty) => {
    console.log({
      currPurchase,
      currSale,
    })

    if (currPurchase['Date'].toString().search('/') >= 0) {
      let currPurchaseArr = currPurchase['Date'].toString().split('/')
      let temp = currPurchaseArr[0]
      currPurchaseArr[0] = currPurchaseArr[1]
      currPurchaseArr[1] = temp
      currPurchase['Date'] = currPurchaseArr.join('-')
    }
    if (currSale['Date'].toString().search('/') >= 0) {
      let currSaleArr = currSale['Date'].toString().split('/')
      let temp = currSaleArr[0]
      currSaleArr[0] = currSaleArr[1]
      currSaleArr[1] = temp
      currSale['Date'] = currSaleArr.join('-')
    }
    let start = date.parse(currPurchase['Date'], 'DD-MM-YYYY')
    if (isNaN(start)) {
      start = date.parse(currPurchase['Date'], 'D-M-YYYY')
    }
    if (isNaN(start)) {
      start = date.parse(currPurchase['Date'], 'DD-M-YYYY')
    }
    if (isNaN(start)) {
      start = date.parse(currPurchase['Date'], 'D-MM-YYYY')
    }
    let end = date.parse(currSale['Date'], 'DD-MM-YYYY')
    if (isNaN(end)) {
      end = date.parse(currSale['Date'], 'D-M-YYYY')
    }
    if (isNaN(end)) {
      end = date.parse(currSale['Date'], 'DD-M-YYYY')
    }
    if (isNaN(end)) {
      end = date.parse(currSale['Date'], 'D-MM-YYYY')
    }
    const difference =
      Math.abs(new Date(end).getTime() - new Date(start).getTime()) /
      (1000 * 3600 * 24)
    let temp = {
      Scripcd: currPurchase['Scripcd'],
      ScripName: currPurchase['Scrip Name'],
      purchaseDate: currPurchase['Date'],
      saleDate: currSale['Date'],
      qty,
      purchaseAmount: currPurchase['Buy Net Rate'],
      saleAmount: currSale['Sale Net Rate'],
      LongTerm: difference > 365 ? 'YES' : '-',
      ShortTerm: difference <= 365 ? 'YES' : '-',
    }

    finalArray.push(temp)
  }

  const insertToArray = (array, finalArray, start, end) => {
    let purchase = new Deque([])
    let sale = new Deque([])
    for (let i = start; i < end; i++) {
      if (array[i]['Buy Qty'] !== '-') {
        purchase.push(array[i])
      } else if (array[i]['Sale Qty'] !== '-') {
        sale.push(array[i])
      }
    }

    while (!sale.isEmpty() && !purchase.isEmpty()) {
      let currSale = sale.peekFront()
      let currPurchase = purchase.peekFront()
      purchase.shift()
      sale.shift()
      if (
        parseInt(currSale['Sale Qty']) === parseInt(currPurchase['Buy Qty'])
      ) {
        addToArray(finalArray, currSale, currPurchase, currSale['Sale Qty'])
      } else if (
        parseInt(currPurchase['Buy Qty']) > parseInt(currSale['Sale Qty'])
      ) {
        let netQty =
          parseInt(currPurchase['Buy Qty']) - parseInt(currSale['Sale Qty'])
        addToArray(finalArray, currSale, currPurchase, currSale['Sale Qty'])
        currPurchase['Buy Qty'] = netQty
        purchase.unshift(currPurchase)
      } else {
        let netQty =
          parseInt(currSale['Sale Qty']) - parseInt(currPurchase['Buy Qty'])
        addToArray(finalArray, currSale, currPurchase, currPurchase['Buy Qty'])
        currSale['Sale Qty'] = netQty
        sale.unshift(currSale)
      }
    }
  }

  const getData = array => {
    let finalArray = []
    let indicesArray = []
    let last = 0
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i]['Clientcd'] !== '') {
        if (array[i]['Scrip Name'] == array[i + 1]['Scrip Name']) {
          continue
        } else {
          indicesArray.push({
            start: last,
            end: i + 1,
          })
          last = i + 1
        }
      }
    }
    indicesArray.forEach(element => {
      insertToArray(array, finalArray, element.start, element.end)
    })
    setStockData(finalArray)
  }

  const eventHandler = e => {
    e.preventDefault()
    const files = e.target[0].files
    if (files) {
      Papa.parse(files[0], {
        header: true,
        complete: results => {
          results = JSON.parse(
            JSON.stringify(results.data).replace(/"\s+|\s+"/g, '"')
          )
          getData(results)
        },
      })
    }
  }
  return (
    <>
      <div className="container m-auto flex-col items-center flex justify-center">
        <form onSubmit={eventHandler}>
          <input type="file" accept=".csv" />
          <button className="bg-gray-200 p-2 rounded">Submit</button>
        </form>
      </div>
      <DetailsTable stockData={stockData} />
    </>
  )
}

export default UploadPage
