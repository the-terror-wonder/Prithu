import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import api from '../services/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from context

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const res = await api.post('/auth/login', formData);
        login(res.data.user); // Pass the user data to the context
        navigate('/dashboard');
    } catch (err) {
        alert('Invalid Credentials');
        setIsLoading(false);
    }
};

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans">
      <div className="w-1/2 bg-slate-900 hidden lg:flex flex-col items-center justify-center p-12 text-white text-center relative bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <Link to="/">
          {/* --- Logo Size Increased --- */}
          <img src="/logo-icon.png" alt="Prithu Logo" className="w-108 h-82" />
        </Link>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-yellow-500 bg-clip-text text-transparent">
          Your intelligent route planning assistant.
        </h1>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-sm">
          <h2 className="text-3xl font-bold mb-6 text-slate-800 text-center">
            Login
          </h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              name="username"
              placeholder="Username"
              onChange={onChange}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={onChange}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold p-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
