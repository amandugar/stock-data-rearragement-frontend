import Papa from 'papaparse'
import Deque from 'double-ended-queue'

const UploadPage = () => {
  const addToArray = (finalArray, currSale, currPurchase, qty) => {
    let currSaleSplit = currSale['Date']
    let currPurchaseSplit = currPurchase['Date']
    if (currSale['Date'].search('/')) {
      currSale['Date'] = `${currSale['Date']}`.split('/').join('-')
      currSaleSplit = currSale['Date'].split('-')
      let temp = currSaleSplit[0]
      currSaleSplit[0] = currSaleSplit[1]
      currSaleSplit[1] = temp
      currSaleSplit.join('-')
    }
    if (currPurchase['Date'].search('/')) {
      currPurchase['Date'] = `${currPurchase['Date']}`.split('-').join('/')
      currPurchaseSplit = currPurchase['Date'].split('/')
      let temp = currPurchaseSplit[0]
      currPurchaseSplit[0] = currPurchaseSplit[1]
      currPurchaseSplit[1] = temp
      currPurchaseSplit.join('-')
    }

    const start = `${currPurchaseSplit}`.split('-').join('/')
    const end = `${currSaleSplit}`.split('-').join('/')
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
      LongTerm: difference > 365 ? true : false,
      ShortTerm: difference <= 365 ? true : false,
    }
    finalArray.push(temp)
    console.log(finalArray)
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
    // jsonexport(finalArray, function (err, csv) {
    //   if (err) return console.error(err)
    //   fs.writeFileSync('data.csv', csv)
    // })
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
    <div className="container m-auto flex-col items-center flex justify-center">
      <form onSubmit={eventHandler}>
        <input type="file" accept=".csv" />
        <button className="bg-gray-200 p-2 rounded">Submit</button>
      </form>
    </div>
  )
}

export default UploadPage
