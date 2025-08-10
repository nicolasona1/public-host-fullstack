# backend/main.py
from flask import request, jsonify
from config import app, db
from models import User
from auth_routes import auth
from card_routes import cards
from ai_routes import ai
from dotenv import load_dotenv, find_dotenv
from pathlib import Path
import os

dotenv_path = find_dotenv(usecwd=True) or str(Path(__file__).with_name(".env"))
load_dotenv(dotenv_path)

# Register blueprints UNDER /api  <-- change these three lines
app.register_blueprint(auth, url_prefix="/api")
app.register_blueprint(cards, url_prefix="/api")
app.register_blueprint(ai, url_prefix="/api")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(port=5002, debug=True)
