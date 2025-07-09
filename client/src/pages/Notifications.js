import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [certs, setCerts] = useState([]);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  const fetchCertificates = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/certificates/pending`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCerts(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to fetch pending certificates');
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleAction = async (id, action, comment) => {
    try {
      await axios.put(
        `${apiBaseUrl}/api/certificates/review/${id}`,
        { action, comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert(`Certificate ${action}d successfully`);
      fetchCertificates(); // reload list
    } catch (err) {
      alert(err.response?.data?.msg || 'Action failed');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📢 Notifications – Pending Certificate Approvals</h2>

      {certs.length === 0 ? (
        <p>No pending certificates.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Title</th>
              <th>Level</th>
              <th>Certificate</th>
              <th>Comment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {certs.map((cert) => (
              <tr key={cert._id}>
                <td>
                  {cert.student.name} ({cert.student.email})
                </td>
                <td>{cert.title}</td>
                <td>{cert.level}</td>
                <td>
                  <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Add comment"
                    onChange={(e) => (cert.comment = e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => handleAction(cert._id, 'approve', cert.comment || '')}>
                    ✅ Approve
                  </button>
                  <button onClick={() => handleAction(cert._id, 'reject', cert.comment || '')}>
                    ❌ Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Notifications;
