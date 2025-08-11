# backend/config.py
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_compress import Compress

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-do-not-use")

    # Cross-site session cookie (Vercel → Render)
    SESSION_COOKIE_NAME = "session"
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = "None"

    # Database (Postgres via DATABASE_URL or SQLite fallback)
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL") or "sqlite:///mydatabase.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JSON_SORT_KEYS = False

# Ensure SQLite folder exists if used
os.makedirs("instance", exist_ok=True)

# App + extensions
app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
Compress(app)

# CORS: allow localhost + Vercel prod & previews
# Matches:
#   https://public-host-fullstack.vercel.app
#   https://public-host-fullstack-<preview>.vercel.app
default_regex = r"https://public-host-fullstack(-.*)?\.vercel\.app|http://localhost:5173"
origins_regex = os.getenv("FRONTEND_ORIGINS_REGEX", default_regex)

CORS(
    app,
    resources={r"/api/*": {"origins": origins_regex}},
    supports_credentials=True,
)
