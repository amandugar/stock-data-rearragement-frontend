import TableHeaders from '../constants/TableHeaders'
import TableKeys from '../constants/TableKeys'

const DetailsTable = ({ stockData }) => {
  return (
    <div className="flex flex-col container m-auto">
      <div className=" sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {TableHeaders.map((header, index) => (
                    <th
                      scope="col"
                      key={index}
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}

                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stockData &&
                  stockData.map((data, index) => (
                    <tr key={index}>
                      {TableKeys.map((keyName, index) => (
                        <td key={index} className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {data[keyName]}
                              </div>
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailsTable
