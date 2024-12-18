import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '', nama: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(form);
      alert('Registration successful! You can now log in.');
      navigate('/');
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <form className="card register-card" onSubmit={handleSubmit}>
        <h3>Register</h3>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            id="nama"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Nama"
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Loading...
            </>
          ) : (
            'Register'
          )}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/')}
          disabled={isLoading}
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default Register;
