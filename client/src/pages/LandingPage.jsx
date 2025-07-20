import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import api from '../services/api';

// --- A visual component to explain the problem ---
const ProblemStatementGraphic = () => {
    const points = [{cx:40, cy:40}, {cx:160, cy:50}, {cx:50, cy:150}, {cx:150, cy:140}];
    return (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <div className="text-center">
                <h3 className="font-bold text-lg text-red-400">The Daily Scramble</h3>
                <svg viewBox="0 0 200 200" className="mt-4 w-full h-auto rounded-lg bg-slate-700/30">
                    {points.map((p, i) => <circle key={i} cx={p.cx} cy={p.cy} r="8" fill="#f87171" />)}
                    <path d="M 40 40 L 160 50 L 50 150 L 150 140" stroke="#f87171" strokeWidth="3" fill="none" strokeDasharray="5,5" />
                </svg>
                <p className="mt-2 font-mono text-slate-400">Guesswork & Backtracking</p>
            </div>
            <div className="text-center">
                <h3 className="font-bold text-lg text-cyan-400">The Prithu Way</h3>
                <svg viewBox="0 0 200 200" className="mt-4 w-full h-auto rounded-lg bg-slate-700/30">
                    {points.map((p, i) => <circle key={i} cx={p.cx} cy={p.cy} r="8" fill="#67e8f9" />)}
                    <path d="M 40 40 L 50 150 L 150 140 L 160 50" stroke="#67e8f9" strokeWidth="3" fill="none" />
                </svg>
                <p className="mt-2 font-mono text-slate-400">A Perfect, Optimized Path</p>
            </div>
        </div>
    );
};

// A component for the features/impact stats
const ImpactStat = ({ value, title }) => (
    <div className="bg-slate-800/50 p-6 rounded-lg text-center border border-slate-700">
        <p className="text-4xl font-extrabold text-cyan-400">{value}</p>
        <p className="mt-1 text-slate-400">{title}</p>
    </div>
);

const LandingPage = () => {
    const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });

    const onFeedbackChange = e => setFeedback({ ...feedback, [e.target.name]: e.target.value });

    const onFeedbackSubmit = async e => {
        e.preventDefault();
        setFormMessage({ type: '', text: 'Sending...' });
        try {
            const res = await api.post('/feedback', feedback);
            setFormMessage({ type: 'success', text: res.data.msg });
            setFeedback({ name: '', email: '', message: '' });
        } catch (err) {
            setFormMessage({ type: 'error', text: err.response?.data?.msg || 'An error occurred.' });
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-black font-sans text-white relative">
            
            <Header />

            <main className="relative z-10">
                {/* Hero Section */}
                <div className="max-w-7xl mx-auto pt-40 pb-20 px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-100">
                        Stop Guessing, Start Optimizing
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-400">
                        For delivery drivers, field agents, and explorers All over the world, Prithu turns a complex list of stops into the most efficient route, saving you valuable time, fuel, and effort every single day.
                    </p>
                </div>

                {/* Problem Statement Section */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                         <h2 className="text-3xl font-bold text-slate-100">A Simple Problem with a Costly Outcome</h2>
                         <p className="mt-2 text-slate-400">Going from Stop 1 ➝ 2 ➝ 3 ➝ 4 is almost never the fastest path. Every wrong turn and backtrack costs you money.</p>
                    </div>
                    <ProblemStatementGraphic />
                </div>

                {/* Impact Section */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <ImpactStat value="Up to 30%" title="Less Fuel Consumed" />
                        <ImpactStat value="Up to 50%" title="Less Planning Time" />
                        <ImpactStat value="100%" title="More Reliable Deliveries" />
                    </div>
                </div>

                {/* Suggestions Form Section */}
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-slate-100">Have a Suggestion?</h2>
                        <p className="mt-2 text-slate-400">We're always looking to improve. Let us know what you think!</p>
                    </div>
                    <form onSubmit={onFeedbackSubmit} className="mt-8 space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <input type="text" name="name" value={feedback.name} onChange={onFeedbackChange} placeholder="Your Name" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition" required />
                            <input type="email" name="email" value={feedback.email} onChange={onFeedbackChange} placeholder="Your Email" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition" required />
                        </div>
                        <textarea name="message" value={feedback.message} onChange={onFeedbackChange} placeholder="Your suggestion..." rows="4" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition" required></textarea>
                        <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 font-bold p-3 rounded-lg hover:opacity-90 transition-opacity">Submit Feedback</button>
                        {formMessage.text && (
                            <p className={`text-center text-sm mt-4 ${formMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {formMessage.text}
                            </p>
                        )}
                    </form>
                </div>
            </main>
        </div>
    );
};
export default LandingPage;