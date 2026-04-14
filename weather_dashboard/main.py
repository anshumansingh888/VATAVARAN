import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENWEATHERMAP_API_KEY")

import requests

# Add this line before the 'url' line:
city = input("Enter a city name: ")

# We use an 'f-string' to bake the city and key directly into the URL
url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"

# This sends the request and stores the response in a variable
response = requests.get(url)

# This converts the server's text response into a Python Dictionary (key-value pairs)
data = response.json()
# To get temperature, we look inside 'main' then inside 'temp'
temp = data["main"]["temp"]

# To get the description, we look inside the 'weather' list at index 0
description = data["weather"][0]["description"]

if temp > 30:
    vibe = "Too hot for humans. Stay in the AC."
elif temp < 15:
    vibe = "Chai and sweater weather."
else:
    vibe = "The weather is actually perfect."

print(f"Current temp in {city}: {temp}°C")
print(f"Condition: {description}")
print(f"Vibe: {vibe}")