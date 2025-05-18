import { useState, useContext, useEffect } from 'react';
import { login } from '../api/auth';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const { accessToken, login: doLogin } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await login(form);
      const { access_token, refresh_token, user } = res.data;
      doLogin(access_token, refresh_token, user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <pre className="error-message">{JSON.stringify(error, null, 2)}</pre>}
      <form onSubmit={onSubmit} className="login-form">
        <input name="email" placeholder="Email" onChange={handleChange} className="login-input" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="login-input" />
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <Link to="/register" className="register-link">
        New user? Register
      </Link>
    </div>
  );
}
