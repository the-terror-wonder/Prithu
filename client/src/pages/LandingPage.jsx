import React from 'react';
import Header from '../components/Header'; // Import the new header

const Feature = ({ icon, title, children }) => (
    <div className="flex flex-col md:flex-row items-start p-4 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
        <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                {icon}
            </div>
        </div>
        <div className="ml-4 mt-2 md:mt-0">
            <h3 className="text-lg font-bold text-slate-100">{title}</h3>
            <p className="mt-2 text-slate-400">{children}</p>
        </div>
    </div>
);

const LandingPage = () => {
    return (
        <div className="min-h-screen w-full bg-slate-900 font-sans text-white relative overflow-hidden">
            {/* Abstract background shapes for visual flair */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-orange-500/10 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

            <Header />

            <main className="relative z-1">
                <div className="max-w-7xl mx-auto pt-40 pb-20 px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-100">
                        The Smartest Way to Plan Your Route
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-400">
                        Prithu's advanced TSP algorithm finds the most efficient path between all your stops, saving you valuable time, fuel, and effort.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-10">
                            <Feature title="Advanced TSP Optimization" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 15.75l-1.42 1.42A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.12-3.83l-1.42-1.42M6 12l.75-1.5M18 12l-.75-1.5m-6 0V3m0 7.5H7.5M12 10.5h4.5m-4.5 3H5.625m6.75 0h1.875m0 0a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>}>
                                Our backend uses a 2-Opt heuristic to solve the Traveling Salesperson Problem, ensuring your routes are logical and efficient, not just greedy.
                            </Feature>
                            <Feature title="Interactive Map UI" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.5-10.5a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V7.5a.75.75 0 01.75-.75z" /></svg>}>
                                Click to add stops, get instant address lookups, and interact with your route. Everything is designed to be fast, responsive, and intuitive.
                            </Feature>
                            <Feature title="Save Places & Routes" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>}>
                                A full-stack solution with a secure backend lets you save your favorite locations and entire routes to your personal account.
                            </Feature>
                        </div>
                        <div className="flex justify-center">
                            <img src="/logo-icon.png" alt="Prithu Icon" className="w-64 h-64 shadow-2xl shadow-blue-500/20 rounded-full" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
