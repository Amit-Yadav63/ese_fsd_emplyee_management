import React, { useEffect, useState } from 'react';
import { BrainCircuit, RefreshCcw } from 'lucide-react';
import api from '../api/axiosInstance.js';

const Recommendations = () => {
  const [employees, setEmployees] = useState([]);
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    const { data } = await api.get('/employees');
    setEmployees(data.data);
  };

  useEffect(() => {
    fetchEmployees().catch((err) => {
      setError(err.response?.data?.message || 'Unable to load employees');
    });
  }, []);

  const getRecommendation = async () => {
    setLoading(true);
    setError('');
    setRecommendation('');

    try {
      const { data } = await api.post('/ai/recommend', { employees });
      setRecommendation(data.recommendation);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-stack">
      <div className="page-heading split">
        <div>
          <h1>AI Recommendations</h1>
          <p>Generate promotion recommendations, training suggestions, feedback, and ranking insights.</p>
        </div>
        <button className="button" type="button" onClick={getRecommendation} disabled={loading || !employees.length}>
          {loading ? <RefreshCcw className="spin" size={18} /> : <BrainCircuit size={18} />}
          {loading ? 'Analyzing...' : 'Generate AI Report'}
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="grid-layout">
        <div className="panel">
          <h2>Data Sent to AI</h2>
          <div className="mini-list">
            {employees.map((employee) => (
              <div className="mini-row" key={employee._id}>
                <strong>{employee.name}</strong>
                <span>{employee.department} · Score {employee.performanceScore} · {employee.experience} yrs</span>
              </div>
            ))}
            {!employees.length && <p className="muted">Add employees before requesting AI recommendations.</p>}
          </div>
        </div>

        <div className="panel recommendation-panel">
          <h2>Recommendation Output</h2>
          {recommendation ? (
            <pre>{recommendation}</pre>
          ) : (
            <p className="muted">Your AI analysis will appear here.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Recommendations;
