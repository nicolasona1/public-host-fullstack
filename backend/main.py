from pathlib import Path
from flask import send_from_directory
from config import app, db
# Import models so SQLAlchemy knows about them before create_all()
from models import User, CreditCard
from auth_routes import auth
from card_routes import cards
from ai_routes import ai

# Mount all APIs under /api
app.register_blueprint(auth,  url_prefix="/api")
app.register_blueprint(cards, url_prefix="/api")
app.register_blueprint(ai,    url_prefix="/api")

@app.get("/api/health")
def health():
    return {"ok": True}

# ---- SPA: serve the React build from ./static ----
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def spa(path: str):
    static_dir = Path(app.static_folder)
    target = static_dir / path
    if path and target.exists() and target.is_file():
        return send_from_directory(static_dir, path)
    return send_from_directory(static_dir, "index.html")

# IMPORTANT: create tables even when running under Gunicorn (Render)
with app.app_context():
    db.create_all()
