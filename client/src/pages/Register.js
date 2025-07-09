import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    registerNumber: '',
    rollNumber: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    try {
      const dataToSend = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      };

      if (form.role === 'student') {
        dataToSend.registerNumber = form.registerNumber;
        dataToSend.rollNumber = form.rollNumber;
      }

      await axios.post('http://localhost:5000/api/auth/register', dataToSend);

      localStorage.setItem('otpEmail', form.email);
      alert('OTP sent to your email');
      navigate('/verify-otp');
    } catch (err) {
      alert(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="form-box">
      <h2>Register</h2>

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        required
      >
        <option value="">Select Role</option>
        <option value="student">Student</option>
        <option value="tutor">Tutor</option>
      </select>

      {form.role === 'student' && (
        <>
          <input
            name="registerNumber"
            placeholder="Register Number"
            value={form.registerNumber}
            onChange={handleChange}
            required
          />

          <input
            name="rollNumber"
            placeholder="Roll Number"
            value={form.rollNumber}
            onChange={handleChange}
            required
          />
        </>
      )}

      <button onClick={handleRegister}>Send OTP</button>
      <a href="/login">Already have an account? Login</a>
    </div>
  );
};

export default Register;
