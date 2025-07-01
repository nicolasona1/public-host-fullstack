from flask import request, jsonify
from config import app, db
from models import User
from auth_routes import auth
from card_routes import cards

#here we are initiating the blue prints
app.register_blueprint(auth, url_prefix="")
app.register_blueprint(cards, url_prefix="")

#running the back end so the frontend can fetch data
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(port=5002, debug=True)