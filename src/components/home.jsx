import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./navBar";
import "../components.css";

function Home() {
    const navigate = useNavigate();

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
                {/* Page Heading */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
                        Welcome to the Application Hub
                    </h1>
                    <p className="text-lg text-gray-600">
                        Navigate to any of the apps below to explore their functionality.
                    </p>
                </div>

                {/* Navigation Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
                    <button
                        onClick={() => navigate("/app1")}
                        className="px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                        Go to App1
                    </button>
                    <button
                        onClick={() => navigate("/app2")}
                        className="px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                        Go to App2
                    </button>
                    <button
                        onClick={() => navigate("/app3/capacitated")}
                        className="px-6 py-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                        Go to App3
                    </button>
                </div>
            </div>
        </>
    );
}

export default Home;