import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { toast } from 'react-toastify';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(form);
      const { data } = response;

      // Simpan data ke localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('username', data.user.username);
      localStorage.setItem('nama', data.user.nama);

      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="card login-card" onSubmit={handleSubmit}>
        <h3>Login</h3>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
            disabled={loading}
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
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>
        <button
          type="button"
          className="btn btn-link"
          onClick={() => navigate('/register')}
          disabled={loading}
        >
          Create an Account
        </button>
      </form>
    </div>
  );
};

export default Login;
