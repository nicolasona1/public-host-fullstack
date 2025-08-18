import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Serve built React from ./static
app = Flask(__name__, static_folder="static", static_url_path="/")
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY", "change-me")

# Normalize DATABASE_URL for SQLAlchemy + psycopg v3
raw_url = os.getenv("DATABASE_URL", "sqlite:///mydatabase.db")
if raw_url.startswith("postgres://"):
    raw_url = raw_url.replace("postgres://", "postgresql+psycopg://", 1)
elif raw_url.startswith("postgresql://") and "+psycopg" not in raw_url:
    raw_url = raw_url.replace("postgresql://", "postgresql+psycopg://", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = raw_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# CORS is only for local dev; in production you’re same-origin
CORS(app, supports_credentials=True, origins=[
    "http://localhost:5173", "http://127.0.0.1:5173",
    "http://localhost:3000", "http://127.0.0.1:3000",
])

db = SQLAlchemy(app)
