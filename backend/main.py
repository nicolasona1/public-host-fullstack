from flask import send_from_directory, jsonify
from config import app, db
from auth_routes import auth
from card_routes import cards
from ai_routes import ai
from dotenv import load_dotenv, find_dotenv
from pathlib import Path
import os

# Load env from .env if present
dotenv_path = find_dotenv(usecwd=True) or str(Path(__file__).with_name(".env"))
load_dotenv(dotenv_path)

# ---- API blueprints under /api so they don’t collide with the SPA routes ----
app.register_blueprint(auth,  url_prefix="/api")
app.register_blueprint(cards, url_prefix="/api")
app.register_blueprint(ai,    url_prefix="/api")

# ---- SPA (React) routes ----
# Serve index.html for the root
@app.route("/")
def root():
    return send_from_directory(app.static_folder, "index.html")

# Catch-all: if the file exists in /static, serve it; otherwise return index.html (client-side routing)
@app.route("/<path:path>")
def static_proxy(path):
    full_path = Path(app.static_folder) / path
    if full_path.exists():
        return send_from_directory(app.static_folder, path)
    # Fallback to React app for client-side routes like /dashboard, /login, etc.
    return send_from_directory(app.static_folder, "index.html")

# ---- App startup ----
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    # You can change the port as you like; leave debug off in production
    app.run(port=5002, debug=True)
