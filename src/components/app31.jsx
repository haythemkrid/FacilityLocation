import "../components.css";
import React, { useState } from "react";
import axios from "axios";
import NavBar from "./navBar";

function App3() {
    const [num_facilities, setNumFacilities] = useState(1);
    const [num_customers, setNumCustomers] = useState(1);
    const [fixed_costs, setFixedCosts] = useState([]);
    const [transportation_costs, setTransportationCosts] = useState([[]]);
    const [output, setOutput] = useState(null);
    const [error, setError] = useState("");

    const handleFixedCostsChange = (index, value) => {
        const updatedFixedCosts = [...fixed_costs];
        updatedFixedCosts[index] = parseFloat(value) || 0;
        setFixedCosts(updatedFixedCosts);
    };

    const handleTransportationCostsChange = (row, col, value) => {
        const updatedCosts = [...transportation_costs];
        if (!updatedCosts[row]) {
            updatedCosts[row] = Array(num_facilities).fill(0);
        }
        updatedCosts[row][col] = parseFloat(value) || 0;
        setTransportationCosts(updatedCosts);
    };

    const handleNumFacilitiesChange = (value) => {
        const newNumFacilities = Math.max(1, parseInt(value) || 1);
        setNumFacilities(newNumFacilities);

        const updatedFixedCosts = Array(newNumFacilities).fill(0);
        setFixedCosts(updatedFixedCosts);

        const updatedTransportationCosts = Array.from({ length: num_customers }, (_, rowIndex) =>
            transportation_costs[rowIndex]
                ? transportation_costs[rowIndex].slice(0, newNumFacilities).concat(Array(Math.max(0, newNumFacilities - transportation_costs[rowIndex].length)).fill(0))
                : Array(newNumFacilities).fill(0)
        );
        setTransportationCosts(updatedTransportationCosts);
    };

    const handleNumCustomersChange = (value) => {
        const newNumCustomers = Math.max(1, parseInt(value) || 1);
        setNumCustomers(newNumCustomers);

        const updatedTransportationCosts = Array.from({ length: newNumCustomers }, (_, rowIndex) =>
            transportation_costs[rowIndex] || Array(num_facilities).fill(0)
        );
        setTransportationCosts(updatedTransportationCosts);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (
            fixed_costs.length !== num_facilities ||
            transportation_costs.length !== num_customers ||
            !transportation_costs.every((row) => row.length === num_facilities)
        ) {
            setError("Invalid input data. Ensure all costs and dimensions are correct.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/app3/uncapacitated", {
                num_facilities,
                num_customers,
                fixed_costs,
                transportation_costs,
            });

            if (response.data.error) {
                setError(response.data.error);
            } else {
                setOutput(response.data.solutions);
            }
        } catch (err) {
            console.error(err);
            setError("Error sending data to the server.");
        }
    };

    return (
        <>
            <div className="App bg-gray-100 min-h-screen p-10">
                <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
                    Uncapacitated Facility Location Problem
                </h1>
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-xl mx-auto">
                    <div className="mb-4">
                        <label className="block font-medium text-gray-700 mb-2">Number of Facilities:</label>
                        <input
                            type="number"
                            value={num_facilities}
                            onChange={(e) => handleNumFacilitiesChange(e.target.value)}
                            className="w-full p-2 border rounded"
                            min="1"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-medium text-gray-700 mb-2">Number of Customers:</label>
                        <input
                            type="number"
                            value={num_customers}
                            onChange={(e) => handleNumCustomersChange(e.target.value)}
                            className="w-full p-2 border rounded"
                            min="1"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-3">Fixed Costs (Facilities):</label>
                        {Array.from({ length: num_facilities }, (_, index) => (
                            <div key={index} className="mb-2">
                                <input
                                    type="number"
                                    placeholder={`Fixed Cost Facility ${index + 1}`}
                                    value={fixed_costs[index] || ""}
                                    onChange={(e) => handleFixedCostsChange(index, e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-4">
                        <label className="block font-medium text-gray-700 mb-3">
                            Transportation Costs (Customer x Facility):
                        </label>
                        {Array.from({ length: num_customers }, (_, rowIndex) => (
                            <div key={rowIndex} className="flex space-x-2 mb-2">
                                {Array.from({ length: num_facilities }, (_, colIndex) => (
                                    <input
                                        key={`${rowIndex}-${colIndex}`}
                                        type="number"
                                        placeholder={`Cost C[${rowIndex + 1}][${colIndex + 1}]`}
                                        value={transportation_costs[rowIndex]?.[colIndex] || ""}
                                        onChange={(e) =>
                                            handleTransportationCostsChange(rowIndex, colIndex, e.target.value)
                                        }
                                        className="w-16 p-2 border rounded"
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded mt-6 hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </form>

                {output && (
                    <div className="mt-8 bg-white p-6 rounded shadow-md max-w-xl mx-auto">
                        <h2 className="text-lg font-medium text-blue-700">Solutions:</h2>

                        {/* Facilities Opened */}
                        <div className="mt-4">
                            <h3 className="font-medium">Facilities Opened:</h3>
                            <ul className="list-disc pl-6 mt-2 text-gray-700">
                                {output[1].map((facility, index) => (
                                    <li key={index}>{facility}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Customer Assignments */}
                        <div className="mt-4">
                            <h3 className="font-medium">Customer Assignments:</h3>
                            <ul className="list-disc pl-6 mt-2 text-gray-700">
                                {output[0].map((assignment, index) => (
                                    <li key={index}>{assignment}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default App3;