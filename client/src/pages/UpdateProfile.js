import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateProfile = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const navigate = useNavigate();

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${apiBaseUrl}/api/users/update-profile`,
        { rollNumber, registerNumber },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      alert('Profile updated!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Update failed');
    }
  };

  return (
    <div className="form-box">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>Roll Number:</label>
        <input
          type="text"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          required
          placeholder="Enter your Roll Number"
        />

        <label>Register Number:</label>
        <input
          type="text"
          value={registerNumber}
          onChange={(e) => setRegisterNumber(e.target.value)}
          required
          placeholder="Enter your Register Number"
        />

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
