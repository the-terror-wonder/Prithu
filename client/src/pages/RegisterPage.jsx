import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import api from '../services/api';

const RegisterPage = () => {
    // ... (Your existing register logic is unchanged)
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onSubmit = async e => { e.preventDefault(); try { const res = await api.post('/auth/register', { username: formData.username, password: formData.password }); localStorage.setItem('token', res.data.accessToken); navigate('/dashboard'); } catch (err) { alert('User already exists'); } };
    
    return (
        <div className="min-h-screen w-full bg-slate-900 font-sans text-white relative">
            <Header />
            <div className="flex items-center justify-center pt-20 min-h-screen">
                <div className="p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg w-full max-w-sm">
                    <h2 className="text-3xl font-bold mb-6 text-slate-100 text-center">Create Account</h2>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <input name="username" placeholder="Username" onChange={onChange} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition" required />
                        <input type="password" name="password" placeholder="Password" onChange={onChange} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition" required />
                        <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 font-bold p-3 rounded-lg hover:opacity-90 transition-opacity">Register</button>
                    </form>
                    <p className="mt-6 text-center text-sm text-slate-400">
                        Already have an account? <Link to="/login" className="font-semibold text-blue-400 hover:underline">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;