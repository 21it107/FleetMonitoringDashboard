import React, { useEffect, useState } from "react";
import axios from "axios";

const RobotList = () => {
    const [robots, setRobots] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("http://localhost:8000/robots");
            setRobots(response.data);
        };
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="robot-list">
            <h2>Robots</h2>
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
    );
};

export default RobotList;