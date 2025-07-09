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
      // ✅ Must send both email AND password
      await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      // ✅ Save email for next step (OTP verify)
      localStorage.setItem('otpEmail', email);

      alert('OTP sent to email');
      navigate('/verify-otp');
    } catch (err) {
      console.log(err.response);
      alert(err.response?.data?.msg || 'Failed to send OTP');
    }
  };

  return (
    <div>
      <h2>Login via Email OTP</h2>
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      /><br />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      /><br />
      <button onClick={handleSendOtp}>Send OTP</button>
    </div>
  );
};

export default LoginOtp;
