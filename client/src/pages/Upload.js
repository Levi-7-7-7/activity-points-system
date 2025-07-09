import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  const [form, setForm] = useState({
    title: '',
    level: 'state',
    file: null
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    setForm(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in!');
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('level', form.level);
    formData.append('file', form.file);

    try {
      await axios.post('http://localhost:5000/api/certificates/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      alert('Certificate uploaded successfully!');
      setForm({ title: '', level: 'state', file: null });
    } catch (err) {
      alert(err.response?.data?.msg || 'Upload failed');
    }
  };

  return (
    <div className="form-box">
      <h2>Upload Certificate</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Certificate Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <select name="level" value={form.level} onChange={handleChange}>
          <option value="state">State</option>
          <option value="national">National</option>
          <option value="international">International</option>
        </select>
        <input type="file" accept=".pdf,.jpg,.png,.jpeg" onChange={handleFileChange} required />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default Upload;
