import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Serve the React build from ./static at site root
app = Flask(__name__, static_folder="static", static_url_path="/")
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY", "change-me")

# --- Use Render Postgres in production; safe SQLite fallback in /tmp ---
raw_url = os.getenv("DATABASE_URL", "sqlite:////tmp/mydatabase.db")  # /tmp is writable on Render
# Normalize for SQLAlchemy + psycopg v3
if raw_url.startswith("postgres://"):
    raw_url = raw_url.replace("postgres://", "postgresql+psycopg://", 1)
elif raw_url.startswith("postgresql://") and "+psycopg" not in raw_url:
    raw_url = raw_url.replace("postgresql://", "postgresql+psycopg://", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = raw_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Cookies (same-origin on Render over HTTPS)
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = True

# CORS only matters in local dev (Vite)
CORS(app, supports_credentials=True, origins=[
    "http://localhost:5173", "http://127.0.0.1:5173",
    "http://localhost:3000", "http://127.0.0.1:3000",
])

db = SQLAlchemy(app)
