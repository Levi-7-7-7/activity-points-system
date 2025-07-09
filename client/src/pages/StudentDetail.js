import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const StudentDetail = () => {
  const { id } = useParams();
  const [certs, setCerts] = useState([]);
  const [student, setStudent] = useState(null);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await axios.get(
          `${apiBaseUrl}/api/certificates/student/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setCerts(res.data);
        setStudent(res.data[0]?.student || null);
      } catch (err) {
        console.error('Error fetching student certificates:', err);
        alert('Failed to fetch certificates');
      }
    };

    fetchCerts();
  }, [id, apiBaseUrl]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📄 Certificates of {student?.name || 'Student'}</h2>

      {certs.length === 0 ? (
        <p style={styles.empty}>No certificates uploaded yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Level</th>
                <th>Status</th>
                <th>Points</th>
                <th>Certificate</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {certs.map((cert) => (
                <tr key={cert._id}>
                  <td>{cert.title}</td>
                  <td>{cert.level}</td>
                  <td style={cert.status === 'approved' ? styles.statusApproved : styles.statusPending}>
                    {cert.status}
                  </td>
                  <td>{cert.points}</td>
                  <td>
                    {cert.fileUrl ? (
                      <a
                        href={cert.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.link}
                      >
                        View
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{cert.tutorComment || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    background: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    margin: '30px auto',
    maxWidth: '1000px'
  },
  heading: {
    fontSize: '22px',
    marginBottom: '20px',
    color: '#333'
  },
  empty: {
    color: '#777',
    fontStyle: 'italic'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  link: {
    color: '#007bff',
    textDecoration: 'underline'
  },
  statusApproved: {
    color: 'green',
    fontWeight: 'bold'
  },
  statusPending: {
    color: 'orange',
    fontWeight: 'bold'
  }
};

export default StudentDetail;
