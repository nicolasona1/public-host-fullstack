from flask import Blueprint, request, session, jsonify
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from config import db
from models import User

auth = Blueprint("auth", __name__)

@auth.route("/sign_up", methods=["POST"])
def sign_up():
    data = request.get_json(silent=True) or {}
    full_name = (data.get("fullName") or "").strip()
    usr_name  = (data.get("usrName")  or "").strip()
    email     = (data.get("email")    or "").strip().lower()

    if not full_name or not usr_name or not email:
        return jsonify({"message": "Missing fullName, usrName, or email"}), 400

    try:
        existing = User.query.filter(
            or_(User.usr_name == usr_name, User.email == email)
        ).first()

        if existing:
            field = "username" if existing.usr_name == usr_name else "email"
            return jsonify({"message": f"{field.capitalize()} already in use"}), 409

        user = User(full_name=full_name, usr_name=usr_name, email=email)
        db.session.add(user)
        db.session.commit()

        session.clear()
        session["userId"]  = user.id
        session["usrName"] = user.usr_name
        session["email"]   = user.email
        session.permanent  = True

        return jsonify({"message": f"Welcome, {user.full_name}!", "user": user.to_json()}), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Account already exists (unique constraint)"}), 409
    except SQLAlchemyError as e:
        db.session.rollback()
        app = auth  # for logging via blueprint logger
        auth.logger.exception("DB error on sign_up")
        return jsonify({"message": "Database error on sign_up"}), 500

@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    usr_name = (data.get("usrName") or "").strip()
    email    = (data.get("email")   or "").strip().lower()

    if not usr_name or not email:
        return jsonify({"message": "Missing usrName or email"}), 400

    try:
        user = User.query.filter_by(usr_name=usr_name, email=email).first()
        if not user:
            return jsonify({"message": "Invalid credentials"}), 401

        session.clear()
        session["userId"]  = user.id
        session["usrName"] = user.usr_name
        session["email"]   = user.email
        session.permanent  = True

        return jsonify({"message": f"Welcome back, {user.full_name}!", "user": user.to_json()}), 200

    except SQLAlchemyError:
        auth.logger.exception("DB error on login")
        return jsonify({"message": "Database error on login"}), 500

@auth.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200
