import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const email = localStorage.getItem('otpEmail');
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      alert(res.data.msg || 'OTP verified!');
      navigate('/login');
    } catch (err) {
      console.error('OTP verification error:', err);
      alert(err.response?.data?.msg || 'Invalid OTP');
    }
  };

  return (
    <div className="form-box">
      <h2>Enter OTP</h2>
      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={e => setOtp(e.target.value)}
        required
      />
      <button onClick={handleVerify}>Verify & Continue</button>
    </div>
  );
};

export default VerifyOtp;
