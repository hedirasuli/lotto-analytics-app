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

@app.get("/predict")
async def get_prediction():
    df = get_db_data()
    if df is None or df.empty: return {"error": "No data"}

    all_primaries = [num for sublist in df['primary_numbers'] for num in sublist]
    all_bonus = [num for sublist in df['bonus_numbers'] for num in sublist]
    counts = Counter(all_primaries)

    def get_weighted(pool, count, range_max):
        c = Counter(pool)
        weights = [c.get(i, 0) + 1 for i in range(1, range_max + 1)]
        return sorted(np.random.choice(range(1, range_max + 1), size=count, replace=False, p=np.array(weights)/sum(weights)).tolist())

    # Create strategies with their own localized keys and separate super numbers
    return {
        "analyzed_draws": len(df),
        "strategies": [
            {
                "id": "hot",
                "numbers": sorted([n for n, f in counts.most_common(6)]),
                "super": int(random.choice(all_bonus)) # Random from history
            },
            {
                "id": "cold",
                "numbers": sorted(list(range(1, 50)), key=lambda x: counts.get(x, 0))[:6],
                "super": random.randint(0, 9) # Fresh random
            },
            {
                "id": "smart",
                "numbers": get_weighted(all_primaries, 6, 49),
                "super": int(get_weighted(all_bonus, 1, 9)[0])
            }
        ]
    }
    
    return {"error": "No data found"}

@app.get("/statistics")
async def get_statistics():
    """Returns frequency data for the UI bar chart"""
    df = get_db_data()
    if df is not None and not df.empty:
        all_numbers = [num for sublist in df['primary_numbers'] for num in sublist]
        stats = [{"number": n, "frequency": f} for n, f in Counter(all_numbers).most_common(10)]
        return {"data": stats}
    return {"data": []}

@app.get("/history")
async def get_history():
    """Returns latest draws for the history tab"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        query = "SELECT * FROM lottery_results ORDER BY draw_date DESC LIMIT 30"
        df = pd.read_sql(query, conn)
        conn.close()
        
        history = []
        for _, row in df.iterrows():
            history.append({
                "draw_date": str(row['draw_date']),
                "primary_numbers": row['primary_numbers'],
                "bonus_numbers": row['bonus_numbers']
            })
        return {"data": history}
    except:
        return {"data": []}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8081)