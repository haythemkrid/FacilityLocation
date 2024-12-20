import './App.css'
import React, {useState} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App1 from "./components/app1";
import App2 from "./components/app2";
import App3 from "./components/app3";
import Home from "./components/home.jsx";

function App() {
    const [app321, setApp321] = useState(true);

    return (
        <div className="mt-4 mx-8 p-4 font-playfair">
            <Router>
                <Routes>
                    <Route path="/" element={<Home/>}></Route>{" "}
                    <Route path="/app1" element={<App1/>}></Route>
                    <Route path="/app2" element={<App2/>}></Route>
                    <Route path="/app3/uncapacitated" element={<App3 app321={app321} setApp321={setApp321}/>}></Route>
                    <Route path="/app3/capacitated" element={<App3 app321={app321} setApp321={setApp321}/>}></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
