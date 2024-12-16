import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import io from "socket.io-client";
import axios from "axios";
import RobotList from './components/RobotList';
import RobotMap from './components/RobotMap';

const socket = io("http://localhost:8000");

const App = () => {
    const [robots, setRobots] = useState([]);
    const [filter, setFilter] = useState('all');
    useEffect(() => {
        // Fetch robot data periodically
        const fetchData = async () => {
            const response = await axios.get("http://localhost:8000/robots");
            setRobots(response.data);
        };
        fetchData();
        const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // WebSocket for real-time updates
        socket.on("message", (data) => setRobots(data));
        return () => socket.disconnect();
    }, []);

    return (
        <div className="app">
            <h1>Fleet Monitoring Dashboard</h1>
            <div className="dashboard">
                <div className="filters">
                    <button onClick={() => setFilter('all')}>All</button>
                    <button onClick={() => setFilter('active')}>Active</button>
                    <button onClick={() => setFilter('offline')}>Offline</button>
                    <button onClick={() => setFilter('lowBattery')}>Low Battery</button>
                </div>
                <div className="robot-list">
                    <h2>Robots List</h2>
                    <ul>
                        {robots.map((robot) => (
                            <li
                                key={robot["Robot ID"]}
                                style={{
                                    color: robot["Battery Percentage"] < 20 ? "red" : "black",
                                }}
                            >
                                {robot["Robot ID"]} - {robot["Battery Percentage"]}% 
                                {robot["Online/Offline"] ? " Online" : " Offline"}
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="robot-map">
                    <h2>Map View</h2>
                    <MapContainer center={[0, 0]} zoom={2} style={{ height: "500px" }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {robots.map((robot) => (
                            <Marker
                                key={robot["Robot ID"]}
                                position={robot["Location Coordinates"]}
                            >
                                <Popup>
                                    <div>
                                        <p>ID: {robot["Robot ID"]}</p>
                                        <p>Battery: {robot["Battery Percentage"]}%</p>
                                        <p>CPU: {robot["CPU Usage"]}%</p>
                                        <p>RAM: {robot["RAM Consumption"]} MB</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default App;