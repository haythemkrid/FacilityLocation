import React from "react";
import { useNavigate } from "react-router-dom";

function NavBar() {
    const navigate = useNavigate();

    return (
        <nav className="flex items-center justify-between bg-gray-800 text-white p-4 shadow-md">
            {/* Logo or App Title */}
            <div className="text-xl font-bold">
                Operational Research
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-4">
                {/* Problem1 */}
                <button
                    onClick={() => navigate("/")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-all"
                >
                    Problem1
                </button>

                {/* Problem2 */}
                <button
                    disabled
                    className="px-4 py-2 bg-gray-500 text-gray-300 rounded-lg cursor-not-allowed font-medium"
                >
                    Problem2
                </button>

                {/* Problem3 */}
                <button
                    disabled
                    className="px-4 py-2 bg-gray-500 text-gray-300 rounded-lg cursor-not-allowed font-medium"
                >
                    Problem3
                </button>
            </div>
        </nav>
    );
}

export default NavBar;