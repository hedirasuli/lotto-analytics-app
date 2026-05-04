import psycopg2
from psycopg2.extras import RealDictCursor
import requests
import feedparser
import re
import pandas as pd
import os

# Database Connection Settings from your screenshot
DB_CONFIG = {
    "dbname": "postgres",
    "user": "postgres",
    "password": "REMOVED_SECRET",
    "host": "localhost",
    "port": "5432"
}

def get_db_connection():
    """Establishes a connection to the PostgreSQL database"""
    return psycopg2.connect(**DB_CONFIG)

def fetch_actual_lotto_data():
    """
    Fetches the latest Germany 6aus49 lotto results using RapidAPI Global Gateway.
    Provides a stable and professional data source for the Play Store app.
    """
    # API endpoint for the latest draw results
    url = "https://lotto-draw-results-global.p.rapidapi.com/get_latest_result"
    
    # Required authentication headers
    headers = {
        # PASTE YOUR KEY HERE: Look for 'x-rapidapi-key' in your RapidAPI dashboard
        "x-rapidapi-key": "042a84049cmshc34db7aee5f86dfp10c4b0jsnfb723a03dc29", 
        "x-rapidapi-host": "lotto-draw-results-global.p.rapidapi.com"
    }
    
    # Specific parameter for the German 6aus49 lottery
    querystring = {"game": "germany_6aus49"} 

    print("🌍 Connecting to RapidAPI Global Gateway...")
    
    try:
        # Performing the GET request
        response = requests.get(url, headers=headers, params=querystring, timeout=15)
        
        # Check if communication with the API was successful
        if response.status_code == 200:
            data = response.json()
            
            # Parsing the JSON response based on the Global API structure
            draw_date = data.get('date')
            numbers = data.get('numbers') 
            
            # Extract Superzahl from complementary_numbers list (index 0)
            superzahl = data.get('complementary_numbers', [0])[0]
            
            if draw_date and numbers:
                print(f"✅ SUCCESS! Live data received for date: {draw_date}")
                print(f"🔢 Numbers: {numbers} | Superzahl: {superzahl}")
                
                # Save the validated data to your PostgreSQL database
                save_to_db('6AUS49', draw_date, numbers, [superzahl])
                return True
            else:
                print("⚠️ API request succeeded, but lottery data was empty.")
        else:
            print(f"❌ API Error: Received Status Code {response.status_code}")
            print("💡 Hint: Check if your API Key is correct or if you've subscribed to the Free plan.")
            
    except requests.exceptions.RequestException as e:
        print(f"💥 Network/Connection Error: {e}")
    except Exception as e:
        print(f"💥 Unexpected Logic Error: {e}")
        
    return False

def fetch_statistics():
    """
    Reads historical lottery data from CSV, handles special characters like '--',
    and calculates number frequency for the prediction engine.
    """
    file_path = 'LOTTO_ab_2022.csv'
    
    if not os.path.exists(file_path):
        print(f"⚠️ Error: {file_path} not found in backend folder.")
        return []

    try:
        # Load CSV with German semicolon separator and correct encoding
        df = pd.read_csv(file_path, sep=';', encoding='latin1')
        
        # Clean column names (removes any hidden spaces or newlines)
        df.columns = df.columns.str.strip()
        
        all_numbers = []

        # Safely process the 'Gewinnzahlen' column
        for entry in df['Gewinnzahlen'].dropna():
            # Split the entry (e.g., "32 7 6 4 41 2") into individual parts
            parts = str(entry).split()
            for p in parts:
                # CRITICAL FIX: Only convert to int if the part is a valid digit
                # This skips invalid entries like '--' which caused the previous crash
                if p.isdigit():
                    all_numbers.append(int(p))
        
        if not all_numbers:
            print("⚠️ Warning: No valid numbers were extracted from CSV.")
            return []

        # Count occurrences and sort by number (1, 2, 3...)
        frequency_counts = pd.Series(all_numbers).value_counts().sort_index()
        
        # Format data as a list of dictionaries for the FastAPI frontend
        stats_list = []
        for num, freq in frequency_counts.items():
            stats_list.append({
                'number': int(num),
                'frequency': int(freq)
            })
            
        print(f"📊 Statistics generated successfully from {len(df)} historical draws.")
        return stats_list

    except Exception as e:
        # Catch any other unexpected errors during file processing
        print(f"💥 Critical error in fetch_statistics: {e}")
        return []