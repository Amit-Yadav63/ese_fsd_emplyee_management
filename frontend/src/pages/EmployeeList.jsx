import React, { useEffect, useMemo, useState } from 'react';
import { Edit3, Plus, Search, Trash2, X } from 'lucide-react';
import api from '../api/axiosInstance.js';

const emptyForm = {
  name: '',
  email: '',
  department: '',
  skills: '',
  performanceScore: '',
  experience: ''
};

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [department, setDepartment] = useState('');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async (params = {}) => {
    setLoading(true);
    setError('');

    try {
      const endpoint = params.department || params.q ? '/employees/search' : '/employees';
      const { data } = await api.get(endpoint, { params });
      setEmployees(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const departments = useMemo(() => {
    return [...new Set(employees.map((employee) => employee.department))].sort();
  }, [employees]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submitEmployee = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const payload = {
      ...form,
      performanceScore: Number(form.performanceScore),
      experience: Number(form.experience)
    };

    try {
      if (editingId) {
        await api.put(`/employees/${editingId}`, payload);
        setMessage('Employee updated successfully');
      } else {
        await api.post('/employees', payload);
        setMessage('Employee added successfully');
      }

      resetForm();
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save employee');
    }
  };

  const editEmployee = (employee) => {
    setEditingId(employee._id);
    setForm({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      skills: employee.skills.join(', '),
      performanceScore: employee.performanceScore,
      experience: employee.experience
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteEmployee = async (id) => {
    const confirmed = window.confirm('Delete this employee?');
    if (!confirmed) return;

    try {
      await api.delete(`/employees/${id}`);
      setMessage('Employee deleted successfully');
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete employee');
    }
  };

  const runSearch = (event) => {
    event.preventDefault();
    fetchEmployees({ department, q: query });
  };

  const clearSearch = () => {
    setDepartment('');
    setQuery('');
    fetchEmployees();
  };

  return (
    <section className="page-stack">
      <div className="page-heading">
        <h1>Employees</h1>
        <p>Add, update, delete, search, filter, and rank employee performance data.</p>
      </div>

      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}

      <div className="grid-layout">
        <form className="panel form-grid" onSubmit={submitEmployee}>
          <h2>{editingId ? 'Update Employee' : 'Register Employee'}</h2>
          <label>Name<input name="name" value={form.name} onChange={handleChange} required /></label>
          <label>Email<input name="email" type="email" value={form.email} onChange={handleChange} required /></label>
          <label>Department<input name="department" value={form.department} onChange={handleChange} required /></label>
          <label>Skills<input name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node, Leadership" required /></label>
          <label>Performance Score<input name="performanceScore" type="number" min="0" max="100" value={form.performanceScore} onChange={handleChange} required /></label>
          <label>Experience<input name="experience" type="number" min="0" step="0.5" value={form.experience} onChange={handleChange} required /></label>
          <div className="button-row">
            <button className="button" type="submit"><Plus size={18} />{editingId ? 'Update' : 'Add'}</button>
            {editingId && <button className="button ghost" type="button" onClick={resetForm}><X size={18} />Cancel</button>}
          </div>
        </form>

        <div className="panel">
          <h2>Search & Filter</h2>
          <form className="search-bar" onSubmit={runSearch}>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, skill..." />
            <input list="departments" value={department} onChange={(event) => setDepartment(event.target.value)} placeholder="Department" />
            <datalist id="departments">
              {departments.map((item) => <option key={item} value={item} />)}
            </datalist>
            <button className="icon-btn" title="Search" type="submit"><Search size={18} /></button>
            <button className="icon-btn ghost" title="Clear" type="button" onClick={clearSearch}><X size={18} /></button>
          </form>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Skills</th>
                  <th>Score</th>
                  <th>Exp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr key={employee._id}>
                    <td>#{index + 1}</td>
                    <td><strong>{employee.name}</strong><span>{employee.email}</span></td>
                    <td>{employee.department}</td>
                    <td>{employee.skills.join(', ')}</td>
                    <td>{employee.performanceScore}</td>
                    <td>{employee.experience} yrs</td>
                    <td className="actions">
                      <button className="icon-btn" title="Edit" type="button" onClick={() => editEmployee(employee)}><Edit3 size={16} /></button>
                      <button className="icon-btn danger" title="Delete" type="button" onClick={() => deleteEmployee(employee._id)}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!employees.length && <p className="muted">{loading ? 'Loading employees...' : 'No employees found.'}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployeeList;
