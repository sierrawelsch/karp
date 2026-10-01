import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import Items from './pages/Items';
import Organizations from './pages/Organizations';
import Vendors from './pages/Vendors';
import Volunteers from './pages/Volunteers';
import Achievements from './pages/Achievements';
import Login from './pages/Login';
import UserTypeSelection from './pages/UserTypeSelection';
import SignUp from './pages/SignUp';
import SignUpDetails from './pages/SignUpDetails';
import RequireAuth from './components/RequireAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup/select-type" element={<UserTypeSelection />} />
        <Route path="/signup/details" element={<SignUpDetails />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              path="events"
              element={
                <ProtectedRoute allowedUserTypes={['ORGANIZATION', 'ADMIN']}>
                  <Events />
                </ProtectedRoute>
              }
            />
            <Route
              path="items"
              element={
                <ProtectedRoute allowedUserTypes={['VENDOR', 'ADMIN']}>
                  <Items />
                </ProtectedRoute>
              }
            />
            <Route
              path="organizations"
              element={
                <ProtectedRoute allowedUserTypes={['ADMIN']}>
                  <Organizations />
                </ProtectedRoute>
              }
            />
            <Route
              path="volunteers"
              element={
                <ProtectedRoute allowedUserTypes={['ADMIN']}>
                  <Volunteers />
                </ProtectedRoute>
              }
            />
            <Route
              path="vendors"
              element={
                <ProtectedRoute allowedUserTypes={['ADMIN']}>
                  <Vendors />
                </ProtectedRoute>
              }
            />
            <Route
              path="achievements"
              element={
                <ProtectedRoute allowedUserTypes={['ADMIN']}>
                  <Achievements />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
