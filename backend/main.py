from pathlib import Path
import re
from flask import send_from_directory, jsonify, request
from sqlalchemy import inspect
from config import app, db
# Import models BEFORE create_all so SQLAlchemy knows about them
from models import User, CreditCard
from auth_routes import auth
from card_routes import cards
from ai_routes import ai

# --- API blueprints ---
app.register_blueprint(auth,  url_prefix="/api")
app.register_blueprint(cards, url_prefix="/api")
app.register_blueprint(ai,    url_prefix="/api")

@app.get("/api/health")
def health():
    return {"ok": True}

# (Optional) DB debug endpoint
def _sanitize(url: str) -> str:
    return re.sub(r"://([^:]+):[^@]+@", r"://\\1:****@", str(url))

@app.get("/api/_debug/db")
def db_debug():
    eng = db.engine
    insp = inspect(eng)
    return jsonify({"engine": _sanitize(str(eng.url)), "tables": insp.get_table_names()})

# --- SPA: serve React build ---
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def spa(path: str):
    static_dir = Path(app.static_folder)
    target = static_dir / path
    if path and target.exists() and target.is_file():
        return send_from_directory(static_dir, path)
    return send_from_directory(static_dir, "index.html")

# --- IMPORTANT: catch 404s from the static route and send index.html for client routes ---
@app.errorhandler(404)
def spa_fallback(e):
    p = request.path or ""
    # Let real API and real assets 404 normally
    if p.startswith("/api") or p.startswith("/assets") or "favicon" in p or "." in p:
        return e
    # Any other route (e.g., /dashboard, /login) -> hand back to the SPA
    return send_from_directory(app.static_folder, "index.html")

# Create tables even under Gunicorn (Render)
with app.app_context():
    db.create_all()
