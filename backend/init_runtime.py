# backend/init_runtime.py
import os

# Try several common patterns to get the Flask app
_flask_app = None

# 1) Try main.py (common layout)
try:
    from main import app as _flask_app  # noqa: F401
except Exception:
    # 2) Try main.application
    try:
        from main import application as _flask_app  # noqa: F401
    except Exception:
        # 3) Try a factory in main
        try:
            from main import create_app as _create_app  # type: ignore
            _flask_app = _create_app()
        except Exception:
            # 4) In your project, the app lives in config.py
            try:
                from config import app as _flask_app  # noqa: F401
            except Exception as e:
                raise RuntimeError(
                    "Could not locate a Flask app. "
                    "Tried: main.app, main.application, main.create_app(), and config.app"
                ) from e

app = _flask_app

# ---- Harden cookies for cross-site over HTTPS (Vercel <-> Render) ----
app.config.update(
    SECRET_KEY=os.environ.get("SECRET_KEY", "dev-do-not-use"),
    SESSION_COOKIE_NAME="session",
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SECURE=True,     # required for cross-site cookies on HTTPS
    SESSION_COOKIE_SAMESITE="None", # allow cookies to be sent cross-site
    PREFERRED_URL_SCHEME="https",
)

# ---- CORS: allow your frontend(s). You can pass multiple origins comma-separated. ----
from flask_cors import CORS
_frontend_origins = os.environ.get("FRONTEND_ORIGINS", "http://localhost:5173")
origins = [o.strip() for o in _frontend_origins.split(",") if o.strip()]

# Your routes are registered at "", not /api, so cover all paths:
CORS(app, supports_credentials=True, resources={r"/*": {"origins": origins}})

# ---- Optional gzip compression ----
try:
    from flask_compress import Compress
    Compress(app)
except Exception:
    pass  # OK if not installed

# ---- Health endpoint ----
@app.get("/health")
def health():
    return {"status": "ok"}, 200
