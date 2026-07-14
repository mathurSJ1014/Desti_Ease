# 🌍 DestiEase

**DestiEase** is an AI-powered travel recommendation platform that helps users discover suitable destinations based on their preferences and environmental conditions. It combines **Machine Learning, NLP, weather data, and Generative AI** to provide a smarter travel-planning experience.

## ✨ Features

* 🧭 Personalized destination recommendations
* 🔮 ML-based destination prediction
* 🌦️ 7-day weather forecasts
* 💰 Budget-based destination filtering
* 🗓️ City itineraries
* 💬 AI-powered travel chatbot
* 🖼️ Destination images and descriptions

## 🧠 How It Works

### Recommendation System

Uses **TF-IDF Vectorization** and **Cosine Similarity** to recommend similar destinations based on:

* City descriptions
* Ratings
* Ideal trip duration
* Best time to visit

### Prediction System

Uses a **Random Forest Classifier** to predict suitable destinations based on:

* Temperature
* Humidity
* Traffic
* Terrain
* Season
* Month
* Budget

## 🛠️ Tech Stack

**Frontend:** HTML, CSS, JavaScript
**Backend:** Python, Flask
**Machine Learning:** Pandas, Scikit-learn
**Algorithms:** TF-IDF, Cosine Similarity, Random Forest
**APIs:** WeatherAPI, Google Generative AI

## 📂 Project Structure

```text
Website/
├── app.py
├── data/
│   ├── City.csv
│   ├── indian_cities_50_data.csv
│   └── itineraries/
├── static/
│   ├── city_images/
│   ├── description/
│   ├── css/
│   ├── js/
│   └── images/
└── templates/
    ├── index.html
    ├── predict.html
    └── recommendations.html
```

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Website
```

### 2. Create and activate a virtual environment

**Windows**

```bash
python -m venv venv
venv\Scripts\activate
```

**macOS / Linux**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
WEATHER_API_KEY=your_weather_api_key
GOOGLE_API_KEY=your_google_api_key
```

> Never commit your `.env` file or API keys to GitHub.

### 5. Run the application

```bash
python app.py
```

Open:

```text
http://127.0.0.1:5000
```

## 🚀 Deployment

The application can be deployed on any Python-compatible hosting platform.

**Build Command**

```bash
pip install -r requirements.txt
```

**Start Command**

```bash
gunicorn app:app
```

Add the following environment variables to your deployment platform:

```text
WEATHER_API_KEY
GOOGLE_API_KEY
```

If `app.py` is inside the `Website` folder, set the deployment root directory to:

```text
Website
```

## 📦 Requirements

```text
Flask
pandas
scikit-learn
requests
google-generativeai
gunicorn
python-dotenv
```

## 🔮 Future Improvements

* Interactive maps and route planning
* Hotel and flight recommendations
* User authentication and saved destinations
* Dynamic AI-generated itineraries
* Docker-based deployment

## 👨‍💻 Author

**Somya Mathur**

---

<p align="center">
  <b>🌍 DestiEase — Making destination discovery smarter with AI.</b>
</p>
