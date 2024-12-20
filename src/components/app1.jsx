import "../components.css";
import React, { useState } from "react";
import axios from "axios";
import NavBar from "./navBar";

function App1() {
    const [num_installations, set_num_installations] = useState(1);
    const [num_demands, set_num_demands] = useState(1);
    const [distances, setDistances] = useState([[]]);
    const [service_levels, setServiceLevels] = useState([]);
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");

    const handleDistancesChange = (row, col, value) => {
        let updatedDistances = [...distances];
        if (!updatedDistances[row]) {
            updatedDistances[row] = Array(num_installations).fill("");
        }
        updatedDistances[row][col] = value;
        setDistances(updatedDistances);
    };

    const handleServiceLevelsChange = (index, value) => {
        let updatedServiceLevels = [...service_levels];
        updatedServiceLevels[index] = value;
        setServiceLevels(updatedServiceLevels);
    };

    const handleNumDemandsChange = (value) => {
        const newNumDemands = Math.max(1, parseInt(value) || 1);
        set_num_demands(newNumDemands);
        const updatedDistances = Array.from({ length: newNumDemands }, (_, i) =>
            distances[i] ? distances[i].slice(0, num_installations) : Array(num_installations).fill("")
        );
        setDistances(updatedDistances);
        const updatedServiceLevels = service_levels.slice(0, newNumDemands).concat(
            Array(Math.max(0, newNumDemands - service_levels.length)).fill("")
        );
        setServiceLevels(updatedServiceLevels);
    };

    const handleNumInstallationsChange = (value) => {
        const newNumInstallations = Math.max(1, parseInt(value) || 1);
        set_num_installations(newNumInstallations);
        const updatedDistances = distances.map((row) =>
            row.slice(0, newNumInstallations).concat(
                Array(Math.max(0, newNumInstallations - row.length)).fill("")
            )
        );
        setDistances(updatedDistances);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (num_demands <= 0) {
            setError("Number of demands must be greater than 0.");
            return;
        }
        if (num_installations <= 0) {
            setError("Number of installations must be greater than 0.");
            return;
        }
        if (
            distances.length !== num_demands ||
            !distances.every((row) => row.length === num_installations)
        ) {
            setError(
                `Distances matrix must match dimensions ${num_demands} x ${num_installations}`
            );
            return;
        }
        if (service_levels.length !== num_demands) {
            setError(`Service levels array must have exactly ${num_demands} entries.`);
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/app1", {
                num_installations,
                num_demands,
                distances,
                service_levels,
            });

            if (response.data.error) {
                setError(response.data.error);
            } else {
                setOutput(response.data.solution);
            }
        } catch (err) {
            console.error(err);
            setError("Error sending data to the server.");
        }
    };

    return (
        <>
            <NavBar />
            <div className="App bg-gray-100 min-h-screen p-10">
                <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
                    Set Covering Problem with Distances
                </h1>
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-xl mx-auto">
                    <div className="mb-4">
                        <label className="block font-medium text-gray-700 mb-2">
                            Number of Installations:
                        </label>
                        <input
                            type="number"
                            value={num_installations}
                            onChange={(e) => handleNumInstallationsChange(e.target.value)}
                            className="w-full p-2 border rounded"
                            min="1"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-medium text-gray-700 mb-2">
                            Number of Demands:
                        </label>
                        <input
                            type="number"
                            value={num_demands}
                            onChange={(e) => handleNumDemandsChange(e.target.value)}
                            className="w-full p-2 border rounded"
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700 mb-2">Distances Matrix:</label>
                        {Array.from({ length: num_demands }, (_, rowIndex) => (
                            <div key={rowIndex} className="flex space-x-2 mb-2">
                                {Array.from({ length: num_installations }, (_, colIndex) => (
                                    <input
                                        key={`${rowIndex}-${colIndex}`}
                                        type="number"
                                        placeholder={`D[${rowIndex}][${colIndex}]`}
                                        value={distances[rowIndex]?.[colIndex] || ""}
                                        onChange={(e) =>
                                            handleDistancesChange(
                                                rowIndex,
                                                colIndex,
                                                parseFloat(e.target.value) || 0
                                            )
                                        }
                                        className="w-16 p-2 border rounded"
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <label className="block font-medium text-gray-700 mb-2">Service Levels:</label>
                        {Array.from({ length: num_demands }, (_, index) => (
                            <div key={index} className="mb-2">
                                <input
                                    type="number"
                                    placeholder={`SL[${index}]`}
                                    value={service_levels[index] || ""}
                                    onChange={(e) =>
                                        handleServiceLevelsChange(index, parseFloat(e.target.value) || 0)
                                    }
                                    className="w-full p-2 border rounded"
                                />
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
                        <h2 className="text-lg font-medium text-blue-700">Selected Installations:</h2>
                        <ul className="list-disc pl-6 mt-2 text-gray-700">
                            {output.map((installation, index) => (
                                <li key={index}>Installation {installation}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
}

export default App1;