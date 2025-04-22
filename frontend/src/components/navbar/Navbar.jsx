import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ✅ Adjust the path as per your structure

function Navbar() {
    const { isAuthenticated, logout } = useAuth(); // ✅ real auth status and logout
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // clear token + update auth state
        navigate("/login"); // redirect to login page
    };

    return (
        <nav className="bg-gray-800 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <div className="text-2xl font-bold">
                    <Link to="/" className="hover:text-indigo-400 transition duration-300">
                        VoteWise
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-4">
                    <Link
                        to="/election"
                        className="px-3 py-2 rounded-md hover:bg-indigo-500 hover:text-white transition duration-300"
                    >
                        Election
                    </Link>
                    <Link
                        to="/vote"
                        className="px-3 py-2 rounded-md hover:bg-indigo-500 hover:text-white transition duration-300"
                    >
                        Vote
                    </Link>
                    <Link
                        to="/results"
                        className="px-3 py-2 rounded-md hover:bg-indigo-500 hover:text-white transition duration-300"
                    >
                        Results
                    </Link>
                    <Link
                        to="/profile"
                        className="px-3 py-2 rounded-md hover:bg-indigo-500 hover:text-white transition duration-300"
                    >
                        Profile
                    </Link>

                    {!isAuthenticated ? (
                        <>
                            <Link
                                to="/login"
                                className="px-3 py-2 rounded-md hover:bg-indigo-500 hover:text-white transition duration-300"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-3 py-2 rounded-md hover:bg-indigo-500 hover:text-white transition duration-300"
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="px-3 py-2 rounded-md hover:bg-indigo-500 hover:text-white transition duration-300"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
