import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './Components/Header';
import Footer from './Components/Footer';
import LoadingSpinner from './Components/LoadingSpinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Dashboard from './Pages/DashBoard';
import NotesList from './Pages/NoteList.jsx';

// Lazy load pages
const HomePage = lazy(() => import('./Pages/Homespages'));

const Register = lazy(() => import('./Pages/Register'));
const Login = lazy(() => import('./Pages/Loginpage'));
const Profile = lazy(() => import('./Pages/Profile'));

function App() {
  const location = useLocation();
  // Hide Header and Footer on login and register pages
  const hideHeaderFooter = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="d-flex flex-column min-vh-100">
      {!hideHeaderFooter && <Header />}
      <Container fluid className="flex-grow-1 py-4">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/notes" element={<NotesList />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </Container>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default App;