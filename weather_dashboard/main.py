from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv

# Load the API key from your root .env file
load_dotenv()
API_KEY = os.getenv("OPENWEATHERMAP_API_KEY")

# This is the "app" that Uvicorn was looking for!
app = FastAPI()

# This allows your HTML/JS frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/weather")
def get_weather(city: str):
    # The server makes the request to OpenWeatherMap safely
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(url)
    
    # It sends the JSON data back to your website
    return response.json()