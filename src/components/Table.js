import PDFdownloader from "./PDFdownloader"
import Pagination from "./Pagination"

export default function DefaultTable({ tableTitle, theaders, data, link, updatePaginationURL}) {

  return (
    <div className="border-b border-gray-200 rounded-lg shadow bg-white px-4 py-5 sm:px-6">
      {tableTitle && <div className="sm:flex sm:items-center">
        <h1 className="font-semibold text-1xl">
          {tableTitle}
        </h1>
      </div>}
      <div className="mt-8 flow-root mb-10">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden ring-1 ring-black ring-opacity-5">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-100">
                  <tr className="divide-x divide-gray-200">
                    {theaders.map((header, index) => (
                      <th scope="col" key={index} className={header.classes}>
                        {header.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {data?.map((item, index) => (
                  <tr className="divide-x divide-gray-200" key={index}>
                    {Object.keys(item).map((itemkey) => (
                      <td
                        className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm ${
                          theaders.find((header) => header?.title === itemkey)?.classes || ''
                        }`}
                        key={itemkey}
                      >
                        {itemkey === 'action' ? (
                          <div key={itemkey}>
                            <PDFdownloader content={item?.action?.data} />
                          </div>
                        ) : (
                          item[itemkey]
                        )}
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

      <Pagination link={link} updateURL={updatePaginationURL} />
    </div>
  )
}
