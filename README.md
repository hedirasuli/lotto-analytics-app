### 🎰 Lotto Analytics App
An AI-enhanced Full-Stack platform for automated lottery data scraping and predictive statistical analysis.

### 📖 Overview
The Lotto Analytics App is an AI-powered platform designed to bridge the gap between raw data and actionable insights. By leveraging Machine Learning algorithms in a Python-based backend, it automates the collection of historical results and identifies complex patterns in number frequencies. The project delivers these advanced analytics through a sleek, multilingual mobile experience built with React Native and Expo.

## 🚀 Key Features

*   **Integrated Multilingual System:** Native support for **German (DE)** and **English (EN)** via React Context API, enabling real-time language switching across all screens and navigation components.
*   **AI-Driven Statistical Engine:** A custom-built analysis module (`predict.py`) that utilizes **NumPy** and **Pandas** to calculate probability distributions and identify "Hot/Cold" number trends.
*   **Automated Web Scraping:** Built-in scrapers using **BeautifulSoup4** to keep the dataset (`LOTTO_ab_2022.csv`) synchronized with the latest draw results.
*   **High-Performance API:** A robust **FastAPI** backend ensures low-latency communication between the data engine and the mobile interface.
*   **Modern Mobile UI:** A sleek, tab-based navigation app built with **Expo** and **TypeScript**, optimized for user engagement and clarity.
 

### 🛠 Tech Stack
### **Frontend (Mobile App)**
*   **Framework:** [React Native](https://reactnative.dev/) (Expo SDK)
*   **Navigation:** Expo Router
*   **State Management:** Context API (Localization & Global State)
*   **Client:** Axios
*   
### **Backend (Data Science & API)**
*   **Language:** Python 3.x
*   **Analysis:** [Pandas](https://pandas.pydata.org/), [NumPy](https://numpy.org/)
*   **API Framework:** [FastAPI](https://fastapi.tiangolo.com/) / Uvicorn
*   **Scraping:** BeautifulSoup4, Requests
*   **Database:** PostgreSQL (via `psycopg2`) & CSV local storage
  
### 📁 Project Structure
```
├── backend/
│   ├── scraper.py         # Data extraction logic
│   ├── predict.py         # Frequency analysis & prediction engine
│   ├── main.py            # API Entry point
│   ├── LOTTO_ab_2022.csv  # Historical lottery dataset
│   └── .env               # Sensitive configurations (Git Ignored)
├── frontend/
│   ├── app/               # Main application screens (Home, Stats, History)
│   ├── src/
│   │   ├── context/       # Language & Global state providers
│   │   ├── locals.ts      # Translation dictionary (EN/DE)
│   │   └── styles/        # Global design system & theme constants
│   └── package.json
└── README.md
 ```

### ⚙️ Installation & Setup
### 1. Backend Setup
```
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the API
python main.py
```

### 2. Frontend Setup
```
# Navigate to frontend directory
cd frontend

# Install packages
npm install

# Start the Expo development server
npx expo start
```

### 🌍 Localization Logic
The application utilizes a centralized LanguageContext. By wrapping the root layout with the LanguageProvider, the app ensures that every component—from the headers to the deep statistical charts—listens to the global language state.

Adding a new language:
Simply update the translations object in src/locals.ts and add the new language code to the LanguageProvider.

### 🛡 Security & Best Practices
Environment Variables: All sensitive data is stored in .env files and is strictly excluded from version control via .gitignore.

Optimization: Python's __pycache__ and local .venv environments are ignored to maintain a lightweight repository.

Type Safety: Fully implemented with TypeScript to minimize runtime errors and improve developer experience.

### 📝 License
This project is licensed under the MIT License. Feel free to use, modify, and distribute as per the license terms.

Developed with ❤️ for Data Science and Mobile Innovation.
