from pathlib import Path
from flask import send_from_directory
from config import app, db
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

# Serve SPA (React build copied to ./static)
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def spa(path: str):
    static_dir = Path(app.static_folder)
    target = static_dir / path
    if path and target.exists() and target.is_file():
        return send_from_directory(static_dir, path)
    return send_from_directory(static_dir, "index.html")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5002, debug=True)
