import pandas as pd
import psycopg2
from datetime import datetime

# Database Configuration
DB_CONFIG = {
    "dbname": "postgres",
    "user": "postgres",
    "password": "REMOVED_SECRET",
    "host": "localhost",
    "port": "5432"
}

def import_lotto_data():
    """Ultra-flexible import that searches for numbers in each row"""
    try:
        # Load without index to keep all columns accessible
        df = pd.read_csv('LOTTO_ab_2022.csv', sep=';', encoding='latin-1', index_col=False)
        
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        cur.execute("DELETE FROM lottery_results;")

        inserted_count = 0
        for _, row in df.iterrows():
            try:
                # 1. Find Date: Search for first cell that looks like DD.MM.YYYY
                draw_date = None
                row_data = [str(val).strip() for val in row.values if pd.notnull(val)]
                
                for item in row_data:
                    try:
                        draw_date = datetime.strptime(item, "%d.%m.%Y").date()
                        break 
                    except ValueError:
                        continue
                
                if not draw_date:
                    continue

                # 2. Find Numbers: Extract all integers from the row
                # We filter numbers between 1 and 49
                found_numbers = []
                for item in row_data:
                    if item.isdigit():
                        num = int(item)
                        if 1 <= num <= 49:
                            found_numbers.append(num)

                # Based on typical Lotto CSV, the first 6 are primary, 7th is Superzahl
                if len(found_numbers) >= 7:
                    primary_numbers = found_numbers[:6]
                    bonus_numbers = [found_numbers[6]] # The Superzahl (S)

                    cur.execute("""
                        INSERT INTO lottery_results (game_type, draw_date, primary_numbers, bonus_numbers)
                        VALUES (%s, %s, %s, %s);
                    """, ("Lotto 6aus49", draw_date, primary_numbers, bonus_numbers))
                    inserted_count += 1
            except:
                continue

        conn.commit()
        cur.close()
        conn.close()
        print(f"✅ FINALLY! {inserted_count} draws imported successfully.")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    import_lotto_data()