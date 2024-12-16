import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import io from "socket.io-client";

const socket = io("http://localhost:8000/ws");

const RobotMap = () => {
    const [robots, setRobots] = useState([]);

    useEffect(() => {
        socket.on("message", (data) => setRobots(data));
        return () => socket.disconnect();
    }, []);

    return (
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
    );
};

export default RobotMap;