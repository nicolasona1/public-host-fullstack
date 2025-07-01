from flask import Blueprint, request, redirect, url_for, flash, session, jsonify
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
        
@auth.route("/user", methods=['GET'])
def get_users():
    contacts = User.query.all()
    json_users = list(map(lambda x: x.to_json(), contacts))
    return jsonify({"users": json_users})

@auth.route("/create_users", methods=["POST"])
def create_users():
    full_name = request.json.get("fullName")
    usr_name = request.json.get("usrName")
    email = request.json.get("email")
    if not full_name or not usr_name or not email:
        return (jsonify({"message": "you must include a name, user name, and email."}), 400)
    
    new_user = User(full_name=full_name, usr_name=usr_name, email=email)
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        return (jsonify({"message": str(e)}), 400)

    return jsonify({"message": "User created"}), 201
    
@auth.route("/update_user/<int:user_id>", methods=["PATCH"])
def update_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404
    
    data = request.json
    user.full_name = data.get("fullName", user.full_name)
    user.usr_name = data.get("usrName", user.usr_name)
    user.email = data.get("email", user.email)

    db.session.commit()
    return jsonify({"message": "user updated"}), 200

@auth.route("/delete_user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404
    
    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "user deleted"}), 200

