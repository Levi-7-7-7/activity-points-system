// pages/LoginOtp.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginOtp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      // ✅ Use environment variable for API base URL
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

      await axios.post(`${apiBaseUrl}/api/auth/login`, {
        email,
        password,
      });

      // ✅ Save email for next step (OTP verification)
      localStorage.setItem('otpEmail', email);

      alert('OTP sent to email');
      navigate('/verify-otp');
    } catch (err) {
      console.error(err.response);
      alert(err.response?.data?.msg || 'Failed to send OTP');
    }
  };

  return (
    <div className="form-box">
      <h2>Login via Email OTP</h2>
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      /><br />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      /><br />
      <button onClick={handleSendOtp}>Send OTP</button>
    </div>
  );
};

export default LoginOtp;
