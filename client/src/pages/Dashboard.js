import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [certs, setCerts] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/certificates/my-certificates', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setCerts(res.data);
        const points = res.data.reduce((acc, cert) =>
          cert.status === 'approved' ? acc + cert.points : acc, 0);
        setTotalPoints(points);
      } catch (err) {
        alert(err.response?.data?.msg || 'Failed to load certificates');
      }
    };

    fetchCertificates();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/certificates/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      alert('Certificate deleted');

      const updatedCerts = certs.filter(c => c._id !== id);
      setCerts(updatedCerts);

      const updatedPoints = updatedCerts.reduce((acc, c) =>
        c.status === 'approved' ? acc + c.points : acc, 0);
      setTotalPoints(updatedPoints);
    } catch (err) {
      alert(err.response?.data?.msg || 'Delete failed');
    }
  };

  return (
    <div className="dashboard-box">
      <h2>📊 My Activity Dashboard</h2>

      <div className="summary">
        <p><strong>Total Points:</strong> {totalPoints}</p>
        <p className={totalPoints >= 60 ? 'status eligible' : 'status not-eligible'}>
          <strong>Status:</strong> {totalPoints >= 60 ? 'Eligible for Diploma' : 'Not Eligible Yet'}
        </p>
      </div>

      <hr style={{ margin: '20px 0' }} />

      {certs.length === 0 ? (
        <p>No certificates uploaded yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Level</th>
                <th>Status</th>
                <th>Points</th>
                <th>Certificate</th>
                <th>Comment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {certs.map(cert => (
                <tr key={cert._id}>
                  <td>{cert.title}</td>
                  <td>{cert.level}</td>
                  <td>{cert.status}</td>
                  <td>{cert.points}</td>
                  <td>
                    <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer">📄 View</a>
                  </td>
                  <td>{cert.tutorComment || '-'}</td>
                  <td>
                    {cert.status === 'pending' && (
                      <button className="small-btn" onClick={() => handleDelete(cert._id)}>🗑️ Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
