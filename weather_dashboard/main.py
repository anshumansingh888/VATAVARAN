import os
import requests
import streamlit as st
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENWEATHERMAP_API_KEY")

# Add this line to give your website a title in the browser tab
st.set_page_config(page_title="Weather Vibe App")

# --- HEADER SECTION ---
st.title("🌡️ Weather Vibe Check")
st.markdown("### Know your city's mood instantly")
st.write("This app uses real-time data to tell you if it's a good day to go out.")

# --- HORIZONTAL LINE ---
st.divider()

# Add this line before the 'url' line:
city = st.text_input("Enter a city name: ",placeholder="Ayodhya",key="city_input")

# This 'if' statement is the most important part of a Streamlit app.
# It tells Python: "Only run the code below if the user has typed something in the box."
if city:
    # Level 1: Inside the "city" check
    with st.spinner(f"Getting weather for {city}..."):
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
        response = requests.get(url)

    # This 'if' must be indented to stay inside 'if city:'
    if response.status_code == 200:
        # Level 2: Inside the "success" check
        data = response.json()
        temp = data["main"]["temp"]
        description = data["weather"][0]["description"]

        if temp > 30:
            vibe = "Too hot for humans. Stay in the AC."
            vibe_box = st.error 
        elif temp < 15:
            vibe = "Chai and sweater weather."
            vibe_box = st.info  
        else:
            vibe = "The weather is actually perfect."
            vibe_box = st.success 

        st.metric(label=f"Current temp in {city}", value=f"{temp}°C")
        st.write(f"**Condition:** {description.capitalize()}")
        vibe_box(f"**Vibe:** {vibe}")

    else:
        # This aligns with 'if response.status_code == 200'
        st.error("City not found! Please check the spelling.")