# backend/config.py
import os

class Config:
    # --- Session / cookies over HTTPS cross-site (Vercel <-> Render) ---
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-do-not-use")
    SESSION_COOKIE_NAME = "session"
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = True          # required for cross-site over HTTPS
    SESSION_COOKIE_SAMESITE = "None"      # allow cookies cross-site
    PREFERRED_URL_SCHEME = "https"

    # --- Database ---
    # Local dev uses SQLite; prod will use Neon Postgres via DATABASE_URL
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "sqlite:///instance/app.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
