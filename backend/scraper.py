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
