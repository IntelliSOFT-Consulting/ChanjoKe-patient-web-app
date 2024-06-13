import { useEffect, useState } from 'react';
import Stats from '../components/Stats';
import Table from '../components/DataTable';
import DefaultTable from '../components/Table';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { lockVaccine } from '../utils/validate';
import { getOffset } from '../utils/methods';
import useAppointment from '../hooks/useAppointments';
import useCertificate from '../hooks/useCertificates';
import useImmunizationRecommendation from '../hooks/useImmunizationRecommendation';
import useImmunization from '../hooks/useImmunization';

const tHeaders = [
  { title: 'Scheduled Date', classes: 'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900' },
  { title: 'Vaccine', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Dose Number', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' },
  { title: 'Status', classes: 'px-3 py-3.5 text-left text-sm font-semibold text-gray-900' }
]

function Home() {

  const [upcomingVaccinations, setUpcomingVaccinations] = useState([])
  const [user, setUser] = useState({})

  const navigate = useNavigate()
  const {
    loader,
    appointments,
    appointmentCount,
    fetchAppointments,
  } = useAppointment()
  const {
    certificateCount,
    fetchUserCertificates,
  } = useCertificate()
  const {
    recommendations,
    fetchUserRecommendations,
  } = useImmunizationRecommendation()
  const {
    immunizationCount,
    fetchPatientImmunizations
  } = useImmunization()
  
  useEffect(() => {
    const userStorage = localStorage.getItem('user')
    
    if (userStorage === 'undefined' || userStorage === null || !Object.keys(userStorage).length) {
      localStorage.clear()
      navigate("/auth")
    }

    setUser(JSON.parse(userStorage))

    fetchAppointments(user, null)
    fetchUserCertificates(user)
    fetchUserRecommendations(user)
    fetchPatientImmunizations(user)

  }, [])

  const updateAppointmentURL = (page) => {
    const offset = getOffset(page, 5)
    fetchAppointments(user, offset)
  }

  useEffect(() => {

    if (Array.isArray(recommendations) && recommendations.length > 0) {
      const locked = recommendations.map((recommendedVaccine) => {
        const dueDate = recommendedVaccine?.dateCriterion?.find(item => 
          item.code.coding.some(code => code.code === "Earliest-date-to-administer")
        );
        const lastDate = recommendedVaccine?.dateCriterion?.find(item => 
          item.code.coding.some(code => code.code === "Latest-date-to-administer")
        );
        const passedDate = lockVaccine(moment(dueDate?.value), moment(lastDate?.value))
  
        if (passedDate === false) {
          return recommendedVaccine
        }
      }).filter(Boolean);
  
      if (locked.length > 0) {
        const firstItem = locked[1].series
        const seriesItem = locked.filter((vaccination) => vaccination.series === firstItem)
  
        const upcomingVaccines = seriesItem.map((item) => ({
          date: moment(item?.dateCriterion?.[0]?.value).format('DD-MM-YYYY'),
          vaccine: item?.vaccineCode?.[0]?.text,
          dose: item?.doseNumberPositiveInt,
          status: 'Upcoming',
        }))
  
        setUpcomingVaccinations(upcomingVaccines)
      }
    }
  }, [recommendations])

  const columns = [
    {
      title: 'Appointments',
      dataIndex: 'appointments',
      key: 'appointments',
    },
    {
      title: 'Scheduled Date',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
    },
    {
      title: 'Appointment Date',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ]
  
  return (
    <div>
      <div className='hidden md:block'>
        <Stats
          appointments={appointmentCount}
          certificates={certificateCount}
          vaccines={immunizationCount}/>
      </div>

      <br className='hidden md:block' />

      <h3 className='sm:hidden font-bold text-2xl'>Vaccination Appointments</h3>

      <div className="sm:hidden mt-5">
        {appointments.length > 0 && appointments.map((result) => (
          <div key={result.id} className='w-full grid grid-cols-5 gap-3 border border-1 border-gray-200'>
            <div className="py-5 pr-6 col-span-4">
              <div className="text-sm pl-5 leading-6 text-gray-900">{result.vaccine}</div>
              <div className="mt-1 pl-5 text-xs leading-5 text-gray-800">{result.date} - Dose: {result.dose}</div>
            </div>
            <div className="py-5 max-w-auto right-5">
              <div className="flex">
                <a
                  href={`/client-details/${result.id}`}
                  className="text-sm font-medium leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  View
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='hidden md:block'>
        <h1 className="font-semibold text-1xl mb-3">
          Appointments
        </h1>
        {appointments.length > 0 && !loader && 
          <Table
            columns={columns}
            dataSource={appointments}
            size="small"
            loading={loader}
            pagination={{
              pageSize: 5,
              showSizeChanger: false,
              hideOnSinglePage: true,
              showTotal: (total) => `Total ${total} items`,
              total: appointmentCount - 1,
              onChange: (page) => updateAppointmentURL(page),
            }}
            locale={{
              emptyText: (
                <div className="flex flex-col items-center justify-center">
                  <p className="text-gray-400 text-sm my-2">
                    No Appointments
                  </p>
                </div>
              ),
            }}
          />
        }
      </div>

      <div className='hidden md:block mt-5'>
        {appointments.length > 0 && !loader && <DefaultTable
          tableTitle="Upcoming Vaccinations"
          theaders={tHeaders}
          data={upcomingVaccinations} />}
      </div>

      {loader === true && <div className="my-10 mx-auto flex justify-center h-5 w-5">
        <Spin
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 72,
              }}
              spin
            />
          }
        />
      </div>}

      <div className="sm:hidden mt-5">
        {appointments.length > 0 && appointments.map((result) => (
          <div key={result.id} className='w-full grid grid-cols-5 gap-3 border border-1 border-gray-200'>
            <div className="py-5 pr-6 col-span-4">
              <div className="text-sm pl-5 leading-6 text-gray-900">{result.vaccine}</div>
              <div className="mt-1 pl-5 text-xs leading-5 text-gray-800">{result.date} - Dose: {result.dose}</div>
            </div>
            <div className="py-5 max-w-auto right-5">
              <div className="flex">
                <a
                  href='#'
                  className="text-sm font-medium leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  View
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Home;