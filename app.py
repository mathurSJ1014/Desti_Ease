import os
import pandas as pd
from flask import Flask, render_template, request, jsonify, url_for
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import google.generativeai as palm
import requests
from datetime import datetime
import os 
from dotenv import load_dotenv 
load_dotenv() 

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY") 
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KE")

app = Flask(__name__)


def get_weather_forecast(city_name):
    """
    Fetches 7-day weather forecast using WeatherAPI
    """
    try:
        # WeatherAPI configuration
        base_url = "http://api.weatherapi.com/v1/forecast.json"
        
        # Prepare API parameters
        params = {
            "key": WEATHER_API_KEY,
            "q": city_name,
            "days": 7,
            "aqi": "no",
            "alerts": "no"
        }
        
        # Make API request
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        
        # Parse the response
        data = response.json()
        
        # Extract forecast data
        forecast = []
        for day in data['forecast']['forecastday']:
            forecast.append({
                "date": day['date'],
                "temp_min": day['day']['mintemp_c'],
                "temp_max": day['day']['maxtemp_c'],
                "description": day['day']['condition']['text'],
                "icon": day['day']['condition']['icon']
            })
        
        return forecast
    
    except Exception as e:
        print(f"Error fetching weather data for {city_name}: {e}")
        return None

def get_city_description(city_name):
    """
    Reads city description from the corresponding text file.
    """
    try:
        # Convert city name to filename format (lowercase with underscores)
        filename = city_name.lower().replace(' ', '_') + '.txt'
        file_path = os.path.join('static', 'description', filename)
        
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                description = f.read().strip()
            return description
        return "Description not available"
    except Exception as e:
        return f"Error reading description: {str(e)}"

palm.configure(api_key=GOOGLE_API_KEY)
model = palm.GenerativeModel("gemini-pro")
chat=model.start_chat(history=[])

# Recommendation Model - Load the dataset for city recommendations
df = pd.read_csv('data/City.csv', encoding='latin1')  # replace with your actual file path
df.fillna('', inplace=True)

# Combine relevant columns into a single 'description' for the recommendation engine
df['combined_desc'] = df['City_desc'] + ' ' + df['Ideal_duration'] + ' ' + df['Best_time_to_visit'] + ' ' + str(df['Ratings'])

# Initialize the TF-IDF vectorizer
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf_vectorizer.fit_transform(df['combined_desc'])
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

def get_recommendations(city, cosine_sim=cosine_sim):
    city = city.lower()
    idx = df.index[df['City'].str.lower() == city].tolist()

    if not idx:
        return pd.DataFrame(columns=['City', 'Ratings', 'Ideal_duration', 'Best_time_to_visit', 'City_desc'])

    idx = idx[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:6]  # Top 5 recommendations, excluding the city itself
    city_indices = [i[0] for i in sim_scores]

    return df[['City', 'Ratings', 'Ideal_duration', 'Best_time_to_visit', 'City_desc']].iloc[city_indices]

# Prediction Model - Load dataset for city prediction
city_data = pd.read_csv('data/indian_cities_50_data.csv')

# Encode categorical columns for prediction model
label_encoder = LabelEncoder()
city_data['Season'] = label_encoder.fit_transform(city_data['Season'])

features = city_data[['Temperature (°C)', 'Humidity (%)', 'Traffic (1-10)', 'Terrain (1=Urban, 2=Plains, 3=Hills)', 'Season', 'Month']]
target = city_data['City']

X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.3, random_state=42)

rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/recommendations', methods=['GET', 'POST'])
def recommendations():
    if request.method == 'POST':
        city = request.form.get('city')  # Get the city from the form
        recommendations = get_recommendations(city)  # Get recommendations based on the city
        return render_template('recommendations.html', city=city, recommendations=recommendations)
    return render_template('recommendations.html')

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'POST':
        try:
            # Extract form data
            temperature = float(request.form['temperature'])
            humidity = float(request.form['humidity'])
            traffic = int(request.form['traffic'])
            terrain = int(request.form['terrain'])
            season = label_encoder.transform([request.form['season']])[0]
            month = int(request.form['month'])
            budget = request.form['budget']

            # Prepare input for prediction
            sample_input = pd.DataFrame({
                'Temperature (°C)': [temperature],
                'Humidity (%)': [humidity],
                'Traffic (1-10)': [traffic],
                'Terrain (1=Urban, 2=Plains, 3=Hills)': [terrain],
                'Season': [season],
                'Month': [month]
            })

            # Predict with the trained model
            proba = rf_model.predict_proba(sample_input)
            city_probabilities = dict(zip(rf_model.classes_, proba[0]))

            # Sort and get top cities
            sorted_cities = sorted(city_probabilities.items(), key=lambda x: x[1], reverse=True)
            top_cities = sorted_cities[:9]

            if budget=='luxury':
                filter = top_cities[:3]
            elif budget == 'moderate':
                filter = top_cities[3:6]
            elif budget == 'economical':
                filter = top_cities[6:9]
            else:
                filter = top_cities[:3]

            # Enrich city data with descriptions and image URLs
            city_data = []
            description_dir = os.path.join('static', 'description')
            image_dir = os.path.join('static', 'city_images')

            for city, probability in filter:
                # Load city description
                description_file = os.path.join(description_dir, f"{city}.txt")
                if os.path.exists(description_file):
                    with open(description_file, 'r', encoding = 'utf-8') as file:
                        description = file.read()
                else:
                    description = "Description not available."

                # Construct city image URL
                image_url = url_for('static', filename=f'city_images/{city}.jpg')

                try:
                    weather_forecast = get_weather_forecast(city)
                except Exception as weather_error:
                    print(f"Weather forecast error for {city}: {weather_error}")
                    weather_forecast = None


                # Append city data
                city_data.append({
                    'name': city,
                    'probability': round(probability * 100, 2),  # Convert to percentage
                    'description': description,
                    'image_url': image_url,
                    'weather_forecast': weather_forecast
                })

            # Render results with city_data
            return render_template('predict.html', city_data=city_data)

        except Exception as e:
            return render_template('predict.html', error=str(e))

    # GET request or empty POST
    return render_template('predict.html', city_data=None)


@app.route('/chatbot', methods=['POST'])
def chatbot():
    user_message = request.json.get('message')  # Get user's message from frontend
    try:
        # Modify the prompt to generate an extremely concise response
        concise_prompt = f"Respond to the following in exactly 10-15 words: {user_message}"
        
        # Generate AI response using Google PaLM 2 API
        response = chat.send_message(concise_prompt)
        reply = response.text if response else "Sorry, can't understand."
        
        return jsonify({'reply': reply})
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'reply': "Unable to process request."})
              

@app.route('/itinerary')
def fetch_itinerary():
    city_name = request.args.get('city')
    if not city_name:
        return "City name is required.", 400

    try:
        # Keep the exact file naming format
        formatted_city_name = city_name.replace(" ", "_")
        file_path = f"data/itineraries/{formatted_city_name} _itinerary.txt"
        
        if not os.path.exists(file_path):
            return jsonify({
                "error": f"Itinerary for {city_name} not found",
                "details": f"Tried path: {file_path}"
            }), 404

        # Read the file content
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Fix the formatting by properly handling each day
        days = []
        current_day = ""
        for line in content.split('\n'):
            line = line.strip()
            if line.startswith('Day'):
                if current_day:  # Save previous day if exists
                    days.append(current_day)
                current_day = line
            elif line and current_day:  # Append content to current day
                current_day = f"{current_day} {line}"
        if current_day:  # Add the last day
            days.append(current_day)

        # Generate HTML with consistent formatting
        formatted_html = '<div class="itinerary-container">'
        for day in days:
            if ':' in day:
                day_num, activity = day.split(':', 1)
            else:
                day_parts = day.split(' ', 1)
                day_num = day_parts[0]
                activity = day_parts[1] if len(day_parts) > 1 else ''
            
            formatted_html += f'''
                <div class="itinerary-day">
                    <h3>{day_num}:</h3>
                    <p>{activity.strip()}</p>
                </div>
            '''
        formatted_html += '</div>'
        
        return formatted_html

    except Exception as e:
        print(f"Error processing itinerary: {str(e)}")
        return jsonify({
            "error": "Error processing itinerary",
            "message": str(e)
        }), 500


@app.template_filter('timestamp_to_date')
def timestamp_to_date(timestamp):
    return datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d')

if __name__ == '__main__':
    app.run(debug=True)
