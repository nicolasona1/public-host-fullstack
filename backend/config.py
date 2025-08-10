# backend/config.py
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

class Config:
    # --- Cookies/session over HTTPS cross-site (Vercel/Netlify <-> Render) ---
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-do-not-use")
    SESSION_COOKIE_NAME = "session"
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = True      # required when SameSite=None
    SESSION_COOKIE_SAMESITE = "None"

    # --- Database ---
    # For now use SQLite (ephemeral on Render free tier). Later: set DATABASE_URL for Postgres.
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "sqlite:///instance/app.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

# Create folders for SQLite if needed
os.makedirs("instance", exist_ok=True)

# Create the Flask app + DB
app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)

# CORS (allow credentials + your frontends)
_frontend_origins = os.environ.get("FRONTEND_ORIGINS", "")
origins = [o.strip() for o in _frontend_origins.split(",") if o.strip()] or [
    "http://localhost:5173"
]
CORS(app, supports_credentials=True, resources={r"/*": {"origins": origins}})
