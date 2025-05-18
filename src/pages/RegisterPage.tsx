import { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // reuse the login page styles

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' });
  const [error, setError] = useState<any>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data || 'Registration failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      {error && <pre className="error-message">{JSON.stringify(error, null, 2)}</pre>}
      <form onSubmit={onSubmit} className="login-form">
        <input name="username" placeholder="Username" onChange={handleChange} className="login-input" />
        <input name="email" placeholder="Email" onChange={handleChange} className="login-input" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="login-input" />
        <input name="password2" type="password" placeholder="Confirm Password" onChange={handleChange} className="login-input" />
        <button type="submit" className="login-button">
          Sign Up
        </button>
      </form>
      <Link to="/login" className="register-link">
        Have an account? Login
      </Link>
    </div>
  );
}
