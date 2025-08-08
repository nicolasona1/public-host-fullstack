from flask import Blueprint, request, session, jsonify
from config import db
from models import User

#creating blueprint
auth = Blueprint("auth", __name__)

#sign up route or creating a new user
@auth.route("/sign_up", methods=["POST"])
def sign_up():
    if request.method == "POST":
        full_name = request.json.get("fullName")
        usr_name = request.json.get("usrName")
        email = request.json.get("email")

        if not full_name or not usr_name or not email:
            return jsonify({"message": "All fields are required"}), 400

        #find if there is an existing user, to redirect them to login
        found_user = User.query.filter_by(usr_name=usr_name).first()
        if found_user:
            return jsonify({"message":"This user name is being used already."}), 409
        else:
            new_user = User(full_name=full_name, usr_name=usr_name, email=email)
            try:
                db.session.add(new_user)
                db.session.commit()
                # Save user info in session after successful signup
                session["userId"] = new_user.id
                session["usrName"] = new_user.usr_name
                session["email"] = new_user.email
                session.permanent = True
            except Exception as e:
                return (jsonify({"message": str(e)}), 400)
            return jsonify({"message": "User created"}), 201
#login route: already an existing accoutn
@auth.route("/login", methods=["POST"])
def login():
    if request.method == "POST":
        data = request.get_json()
        usr_name = data.get("usrName")
        email = data.get("email")

        if not usr_name or not email:
            return jsonify({"message":"User name and email are required"}), 400
        
        #check if the user already exists
        user =  User.query.filter_by(usr_name=usr_name).first()
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        #verify that the email matches the user's email
        if user.email != email:
            return jsonify({"message": "Invalid credentials"}), 401
        
        #if credentials exist save information to session
        session["userId"] = user.id
        session["usrName"] = user.usr_name
        session["email"] = user.email
        session.permanent = True
        
        return jsonify({
            "message": f"Welcome back {user.full_name}!",
            "user": user.to_json()
        })

#log out route
@auth.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200