import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import TutorPanel from './pages/Notifications';
import UpdateProfile from './pages/UpdateProfile';
import StudentList from './pages/StudentList';
import StudentDetail from './pages/StudentDetail';
import LoginOtp from './pages/LoginOtp';
import VerifyOtp from './pages/VerifyOtp'; // ✅ Correctly imported

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} /> {/* ✅ Add this */}
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tutor" element={<TutorPanel />} />
        <Route path="/login-otp" element={<LoginOtp />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/tutor/students" element={<StudentList />} />
        <Route path="/tutor/student/:id" element={<StudentDetail />} />
      </Routes>

    </Router>
  );
}

export default App;
