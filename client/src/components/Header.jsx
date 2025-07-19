import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-20 bg-slate-900/80 backdrop-blur-sm">
            <nav className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0">
                        <Link to="/">
                            <img className="h-25" src="/logo-full.png" alt="Prithu Logo" />
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/login" className="px-5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Login
                        </Link>
                        <Link to="/register" className="px-5 py-2 text-sm font-medium text-blue-950 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-md hover:opacity-90 transition-opacity">
                            Register
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;