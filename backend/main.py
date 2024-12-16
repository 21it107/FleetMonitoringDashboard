import json
import random
import asyncio
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load robot data
with open("fake_robot_data.json") as f:
    robot_data = json.load(f)

# Simulate telemetry updates
async def update_telemetry():
    while True:
        for robot in robot_data:
            if robot["Online/Offline"]:
                robot["Battery Percentage"] = max(0, robot["Battery Percentage"] - random.randint(0, 5))
                robot["CPU Usage"] = random.randint(0, 100)
                robot["RAM Consumption"] = random.randint(500, 8000)
                robot["Last Updated"] = "2024-12-11 11:00:00"
        await asyncio.sleep(5)

# Start background telemetry updates
import threading
threading.Thread(target=asyncio.run, args=(update_telemetry(),)).start()

@app.get("/")
async def root():
    return {"message": "Welcome to the Fleet Monitoring Dashboard"}

@app.get("/robots")
async def get_robots():
    return robot_data

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        await websocket.send_json(robot_data)
        await asyncio.sleep(5)