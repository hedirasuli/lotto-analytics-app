import pandas as pd
import psycopg2
from collections import Counter

# Database Config
DB_CONFIG = {
    "dbname": "postgres",
    "user": "postgres",
    "password": "REMOVED_SECRET",
    "host": "localhost",
    "port": "5432"
}

def analyze_and_predict():
    try:
        # 1. Load Data from DB
        conn = psycopg2.connect(**DB_CONFIG)
        query = "SELECT primary_numbers FROM lottery_results"
        df = pd.read_sql(query, conn)
        conn.close()

        # 2. Flatten the list of numbers
        all_numbers = [num for sublist in df['primary_numbers'] for num in sublist]
        
        # 3. Count Frequencies (Simple AI Logic)
        counts = Counter(all_numbers)
        most_common = counts.most_common(6)
        
        print("\n--- 🤖 AI Analysis Results ---")
        print(f"Total numbers analyzed: {len(all_numbers)}")
        print("Most frequent numbers (Hot Numbers):")
        for num, freq in most_common:
            print(f"Number {num}: appeared {freq} times")

        # 4. Suggestion based on Frequency
        prediction = [n for n, f in most_common]
        print(f"\n🔮 AI Prediction for next draw: {sorted(prediction)}")

    except Exception as e:
        print(f"❌ Analysis Error: {e}")

if __name__ == "__main__":
    analyze_and_predict() 