from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'choko123'
CORS(app, supports_credentials=True,
     origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
     allow_headers=['Content-Type', 'Authorization'],
     methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
     )

app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///mydatabase.db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

SESSION_COOKIE_SAMESITE = "Lax"  # or "None" if you go cross-domain
SESSION_COOKIE_SECURE = False    # Set to True in production with HTTPS