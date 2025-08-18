from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

# Serve built React files from ./static (we'll copy Vite's build here)
app = Flask(
    __name__,
    static_folder="static",      # where index.html and assets will live after build
    static_url_path="/"          # serve static files at root (/)
)

# Secrets / config
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY", "choko123")

# In dev we allow the Vite dev server; in prod you’ll serve same-origin so CORS won’t matter
CORS(
    app,
    supports_credentials=True,
    origins=[
        'http://localhost:3000', 'http://127.0.0.1:3000',
        'http://localhost:5173', 'http://127.0.0.1:5173'
    ],
    allow_headers=['Content-Type', 'Authorization'],
    methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
)

# SQLite file in project folder
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", 'sqlite:///mydatabase.db')
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# Cookies (tighten in production behind HTTPS)
SESSION_COOKIE_SAMESITE = "Lax"   # set to "None" if you host frontend separately on another domain with HTTPS
SESSION_COOKIE_SECURE = False     # set True in production with HTTPS
