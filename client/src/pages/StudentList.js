import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/all-students', {
          headers: { Authorization: localStorage.getItem('token') }
        });

        const sorted = res.data.sort((a, b) => (a.rollNumber || '').localeCompare(b.rollNumber || ''));
        setStudents(sorted);
      } catch (err) {
        console.error('Error fetching students:', err);
        alert(err.response?.data?.msg || 'Failed to load student list');
      }
    };

    fetchStudents();
  }, []);

  const handleDownloadExcel = () => {
    const data = students.map((s) => {
      return {
        Name: s.name,
        RollNumber: s.rollNumber || '',
        RegisterNumber: s.registerNumber || '',
        Email: s.email,
        TotalPoints: s.totalPoints || 0,
        Eligible: s.totalPoints >= 60 ? 'Yes' : 'No'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Student_Activity_Report.xlsx');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Student Activity Report', 14, 22);

    const tableColumn = ["Roll No", "Register No", "Name", "Email", "Points", "Eligible"];
    const tableRows = [];

    students.forEach((student) => {
      const eligible = (student.totalPoints || 0) >= 60 ? "Yes" : "No";

      tableRows.push([
        student.rollNumber || "-",
        student.registerNumber || "-",
        student.name,
        student.email,
        student.totalPoints || 0,
        eligible
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save('Student_Activity_Report.pdf');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📋 All Students</h2>

      <div style={{ marginBottom: '15px' }}>
        <button onClick={handleDownloadExcel} className="small-btn" style={{ marginRight: '10px' }}>
          📥 Download Excel
        </button>
        <button onClick={handleDownloadPDF} className="small-btn">
          📄 Download PDF
        </button>
      </div>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Roll Number</th>
            <th>Register Number</th>
            <th>Name</th>
            <th>Email</th>
            <th>Total Points</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="6" align="center">No students found.</td>
            </tr>
          ) : (
            students.map(std => (
              <tr key={std._id}>
                <td>{std.rollNumber || '-'}</td>
                <td>{std.registerNumber || '-'}</td>
                <td>{std.name}</td>
                <td>{std.email}</td>
                <td>{std.totalPoints || 0}</td>
                <td>
                  <button onClick={() => navigate(`/tutor/student/${std._id}`)}>
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
