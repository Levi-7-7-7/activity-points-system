import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Form Data:', JSON.stringify(form, null, 2));

      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        form
      );
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      alert('Login successful!');
      navigate(res.data.user.role === 'tutor' ? '/tutor' : '/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="form-box">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        <a href="/register">Don't have an account? Register</a>
      </form>
    </div>
  );
};

export default Login;
