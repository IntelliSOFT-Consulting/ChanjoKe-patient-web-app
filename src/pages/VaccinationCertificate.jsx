import { useEffect } from 'react';
import Table from '../components/Table';
import useCertificate from '../hooks/useCertificates';

const tableHeaders = [
  { title: 'Vaccination Date', classes: 'py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900' },
  { title: 'Vaccine', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Action', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
]

const user = JSON.parse(localStorage.getItem('user'))

export default function VaccinationCertificate() {

  const { certificates, fetchUserCertificates } = useCertificate()

  useEffect(() => {
    fetchUserCertificates(user)
  })
  return (
    <>
      <br className='hidden md:block' />

      <h3 className='sm:hidden font-bold text-2xl'>Vaccination Certificates</h3>

      <div className="sm:hidden mt-5">
        {certificates.map((result) => (
          <div key={result.id} className='w-full grid grid-cols-5 gap-3 border border-1 border-gray-200'>
            <div className="py-5 pr-6 col-span-3">
              <div className="text-sm pl-5 leading-6 text-gray-900">{result.vaccine}</div>
              <div className="mt-1 pl-5 text-xs leading-5 text-gray-800">{result.date}</div>
            </div>
            <div className="py-8 col-span-2 max-w-auto right-5">
              <div className="">
                <a
                  href={`/client-details/${result.id}`}
                  className="text-sm font-medium leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='hidden md:block'>
        <Table
          tableTitle="Vaccination Certificate"
          theaders={tableHeaders}
          data={certificates} />
      </div>

    </>
  );
}