# backend/init_runtime.py
import os

# Try several common patterns to get the Flask app from main.py
_flask_app = None
try:
    from main import app as _flask_app
except Exception:
    try:
        from main import application as _flask_app
    except Exception:
        try:
            from main import create_app as _create_app
            _flask_app = _create_app()
        except Exception as e:
            raise RuntimeError(
                "Could not locate Flask app in main.py. "
                "Export `app`, `application`, or a `create_app()` function."
            ) from e

app = _flask_app

# ---- Production settings applied even if your code doesn't import Config ----
app.config.update(
    SECRET_KEY=os.environ.get("SECRET_KEY", "dev-do-not-use"),
    SESSION_COOKIE_NAME="session",
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_SAMESITE="None",
    PREFERRED_URL_SCHEME="https",
)

# ---- CORS for frontend origins (Vercel + local dev) ----
from flask_cors import CORS
_frontend_origins = os.environ.get(
    "FRONTEND_ORIGINS",
    "http://localhost:5173"
)
# Allow comma-separated list: "https://your-frontend.vercel.app,http://localhost:5173"
origins = [o.strip() for o in _frontend_origins.split(",") if o.strip()]
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": origins}})

# ---- Optional gzip compression ----
try:
    from flask_compress import Compress
    Compress(app)
except Exception:
    pass  # If not installed, it's fine.

# ---- Health endpoint ----
@app.get("/health")
def health():
    return {"status": "ok"}, 200
