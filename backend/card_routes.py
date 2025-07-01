from flask import Blueprint, request, session, jsonify
from models import CreditCard
from config import db
cards = Blueprint('cards', __name__)
#get all the cards so far
@cards.route('/user_cards', methods=["GET"])
def get_cards():
    user_id = session.get("userId")
    # if not user_id:
    #     return jsonify({"message": "Unauthorized"}), 401
    print("Fetching Cards:", user_id)
    cards = CreditCard.query.filter_by(user_id=user_id).all()
    json_cards = list(map(lambda x: x.to_json(), cards))
    return jsonify({"cards": json_cards})
#add and creating cards route
@cards.route("/add_cards", methods=["POST"])
def add_cards():
    user_id = session.get("userId")
    if not user_id:
        return jsonify({"message": f"Unauthorized {user_id}"}), 401

    card_name = request.json.get("cardName")
    budget = request.json.get("budget")
    bank = request.json.get("bank")
    spent = request.json.get("spent", 0.0)

    if not card_name or not budget or not bank:
        return jsonify({"message":"Card Name, Budget, and Bank are required."}), 400

    try:
        budget = float(budget)
        spent = float(spent) if spent else 0.0
    except (ValueError, TypeError):
        return jsonify({"message":"Budget and Spent must be numbers."}), 400

    #create the new card object
    new_card = CreditCard(card_name=card_name, budget=budget, bank=bank, spent=spent, user_id=user_id)
    #saving it to the data base
    db.session.add(new_card)
    db.session.commit()
    return jsonify({"message": "Card added successfully!"}), 201

#update the amount spent
@cards.route("/update_spent/<int:card_id>", methods=["PATCH"])
def update_spent(card_id):
    card = CreditCard.query.get(card_id)
    #verify if the card exists
    if not card:
        return jsonify({"message":"Card not found."}), 400
    #request previous information and update it
    data = request.json
    card.spent = data.get("spent", card.spent)

    db.session.commit()
    return jsonify({"message":"Amount updated."})
#delete a card
@cards.route("/delete_cards/<int:card_id>", methods=["DELETE"])
def delete_cards(card_id):
    card = CreditCard.query.get(card_id)
    #verify if the card exists
    if not card:
        return jsonify({"message": "Card not found"}), 404
    db.session.delete(card)
    db.session.commit()
    return jsonify({"message": "The card was deleted of your dashboard."}), 200