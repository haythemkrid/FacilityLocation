import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import App31 from "./app31";
import App32 from "./app32";
import NavBar from "./navBar";
import "../components.css"; // Include your existing CSS

function App3({ app321, setApp321 }) {
    const navigate = useNavigate();

    const toggleApp321 = () => {
        const newValue = !app321;
        setApp321(newValue);
        const newRoute = newValue ? "/app3/uncapacitated" : "/app3/capacitated";
        navigate(newRoute);
    };

    useEffect(() => {
        const initialRoute = app321 ? "/app3/uncapacitated" : "/app3/capacitated";
        navigate(initialRoute);
    }, [app321, navigate]);

    return (
        <>
            <NavBar />
            <div className="p-4 bg-gray-100 flex flex-col items-center justify-start min-h-screen">
                {/* Toggle Settings */}
                <div className="flex items-center justify-between w-full max-w-4xl mb-4 p-3 bg-white rounded-md shadow-md">
                    <h1 className="text-xl font-bold text-gray-700">Toggle Between Capacitated and Uncapacitated</h1>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={!app321} // Toggle ON for "Capacitated" (when app321 = false)
                            onChange={toggleApp321}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-500 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900">
                            {!app321 ? "Capacitated" : "Uncapacitated"}
                        </span>
                    </label>
                </div>

                {/* Render Content */}
                <div className="w-full max-w-4xl mt-6 bg-white p-6 rounded-md shadow-md flex flex-col">
                    {app321 ? <App31 /> : <App32 />}
                </div>
            </div>
        </>
    );
}

export default App3;