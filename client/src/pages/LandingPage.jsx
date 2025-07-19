import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
            <div className="text-center p-8 max-w-2xl">
                <h1 className="text-5xl md:text-6xl font-extrabold text-blue-600">
                    Welcome to Prithu
                </h1>
                <p className="mt-4 text-lg md:text-xl text-gray-600">
                    The intelligent route optimizer designed to save you time and fuel. Stop guessing, start optimizing.
                </p>
                <p className="mt-6 text-md text-gray-500">
                    Built for drivers in Bhilai, our powerful algorithm finds the shortest path between all your stops, turning a complex logistics puzzle into a simple, actionable plan.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Link
                        to="/login"
                        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-colors"
                    >
                        Register
                    </Link>
                </div>
            </div>
            <footer className="absolute bottom-4 text-gray-400 text-sm">
                Built for Internship Interviews - Showcasing Full-Stack & DSA Skills
            </footer>
        </div>
    );
};

export default LandingPage;