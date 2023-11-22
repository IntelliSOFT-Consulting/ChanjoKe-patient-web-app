// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Page404 from './pages/Page404';
import Registration from './pages/Registration';
import VaccinationSchedule from './pages/VaccinationSchedule';
import VaccinationCertificate from './pages/VaccinationCertificate';
import AuthorizedLayout from './layouts/AuthorizedLayout'
import UnauthorizedLayout from './layouts/UnauthorizedLayout';

const authToken = localStorage.getItem('token')

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ !authToken ? <AuthorizedLayout /> : <UnauthorizedLayout /> }>
          <Route index element={ !authToken ? <Home /> : <Login />} />
          <Route path="vaccination-certificate" element={<VaccinationCertificate />} />
          <Route path="vaccination-schedule" element={<VaccinationSchedule/>} />
          <Route path="login" element={<Login />} />
          <Route path="registration" element={<Registration />} />
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
