import React, { useEffect, useMemo, useState } from 'react';
import { Award, BriefcaseBusiness, TrendingUp, Users } from 'lucide-react';
import api from '../api/axiosInstance.js';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await api.get('/employees');
        setEmployees(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load dashboard');
      }
    };

    fetchEmployees();
  }, []);

  const stats = useMemo(() => {
    const total = employees.length;
    const averageScore = total
      ? Math.round(employees.reduce((sum, employee) => sum + Number(employee.performanceScore), 0) / total)
      : 0;
    const topEmployee = employees[0];
    const departments = new Set(employees.map((employee) => employee.department)).size;

    return { total, averageScore, topEmployee, departments };
  }, [employees]);

  return (
    <section className="page-stack">
      <div className="page-heading">
        <h1>Dashboard</h1>
        <p>Monitor performance score trends, departments, and top ranked employees.</p>
      </div>
      {error && <div className="alert error">{error}</div>}
      <div className="stats-grid">
        <div className="stat-card"><Users /><span>Total Employees</span><strong>{stats.total}</strong></div>
        <div className="stat-card"><TrendingUp /><span>Average Score</span><strong>{stats.averageScore}</strong></div>
        <div className="stat-card"><BriefcaseBusiness /><span>Departments</span><strong>{stats.departments}</strong></div>
        <div className="stat-card"><Award /><span>Top Performer</span><strong>{stats.topEmployee?.name || 'N/A'}</strong></div>
      </div>
      <div className="panel">
        <h2>Employee Rankings</h2>
        <div className="ranking-list">
          {employees.slice(0, 5).map((employee, index) => (
            <div className="ranking-row" key={employee._id}>
              <span className="rank">#{index + 1}</span>
              <div>
                <strong>{employee.name}</strong>
                <p>{employee.department} · {employee.experience} yrs · {employee.skills.join(', ')}</p>
              </div>
              <span className="score">{employee.performanceScore}</span>
            </div>
          ))}
          {!employees.length && <p className="muted">No employee records yet.</p>}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
