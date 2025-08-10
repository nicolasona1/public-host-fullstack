# backend/init_runtime.py
# Expose a single WSGI app for Gunicorn: "init_runtime:app"

from config import app  # creates app + db
import main             # registers blueprints/routes on the same app

# Health check for Render
@app.get("/health")
def health():
    return {"status": "ok"}, 200
