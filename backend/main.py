from pathlib import Path
import re
from flask import send_from_directory, jsonify
from sqlalchemy import inspect
from config import app, db
# Import models so SQLAlchemy knows them before create_all()
from models import User, CreditCard
from auth_routes import auth
from card_routes import cards
from ai_routes import ai

# Mount APIs at /api/*
app.register_blueprint(auth,  url_prefix="/api")
app.register_blueprint(cards, url_prefix="/api")
app.register_blueprint(ai,    url_prefix="/api")

@app.get("/api/health")
def health():
    return {"ok": True}

# ----- TEMP DEBUG: verify DB connectivity + tables (remove later) -----
def _sanitize(url: str) -> str:
    return re.sub(r"://([^:]+):[^@]+@", r"://\\1:****@", str(url))

@app.get("/api/_debug/db")
def db_debug():
    eng = db.engine
    insp = inspect(eng)
    return jsonify({
        "engine": _sanitize(str(eng.url)),
        "tables": insp.get_table_names()
    })

# Serve SPA (React build in ./static)
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def spa(path: str):
    static_dir = Path(app.static_folder)
    target = static_dir / path
    if path and target.exists() and target.is_file():
        return send_from_directory(static_dir, path)
    return send_from_directory(static_dir, "index.html")

# Create tables even under Gunicorn on Render
with app.app_context():
    db.create_all()
