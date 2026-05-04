import random
import pandas as pd
import psycopg2
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from collections import Counter
import warnings
warnings.filterwarnings("ignore", category=UserWarning)

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_CONFIG = {
    "dbname": "postgres",
    "user": "postgres",
    "password": "REMOVED_SECRET",
    "host": "localhost",
    "port": "5432"
}

def get_db_data():
    """Fetches all historical data for analysis"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        query = "SELECT primary_numbers, bonus_numbers FROM lottery_results"
        df = pd.read_sql(query, conn)
        conn.close()
        return df
    except Exception as e:
        print(f"DB Error: {e}")
        return None

def get_weighted_random(numbers_list, range_max, pick_count):
    """Core Math Logic: Picks numbers based on frequency weights"""
    counts = Counter(numbers_list)
    total_samples = len(numbers_list)
    
    possible_numbers = list(range(1 if range_max > 10 else 0, range_max + 1))
    weights = []
    
    for n in possible_numbers:
        freq = counts.get(n, 0)
        # Weight formula: (Frequency + 1) / (Total + possible outcomes)
        # Adding 1 ensures numbers with 0 frequency still have a tiny chance
        weight = (freq + 1) / (total_samples + len(possible_numbers))
        weights.append(weight)
    
    # Normalize weights to sum to 1.0
    weights = np.array(weights)
    weights /= weights.sum()
    
    return np.random.choice(possible_numbers, size=pick_count, replace=False, p=weights)
