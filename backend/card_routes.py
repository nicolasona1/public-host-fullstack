from flask import Blueprint, request, session, jsonify, send_file
import pandas as pd
import io
from datetime import datetime
from models import CreditCard, User
from config import db
from datetime import date
cards = Blueprint('cards', __name__)
#get all the cards so far
@cards.route('/user_cards', methods=["GET"])
def get_cards():
    try:
        user_id = session.get("userId")
        if not user_id:
            return jsonify({"message": "Unauthorized"}), 401
        print("Fetching Cards:", user_id)
        cards = CreditCard.query.filter_by(user_id=user_id).all()
        #auto reset if due
        def reset_if_due(card):
            today = date.today()
            if card.reset_period == "monthly":
                due = card.last_reset.month != today.month or card.last_reset.year != today.year
            elif card.reset_period == "yearly":
                due = card.last_reset.year != today.year
            else:
                due = False

            if due:
                card.spent = 0.0
                card.last_reset = today
                db.session.commit()
        for card in cards:
            reset_if_due(card)
        json_cards = list(map(lambda x: x.to_json(), cards))
        return jsonify({"cards": json_cards})
    except Exception as e:
        print(f"Error in get_cards: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
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
    reset_period = request.json.get("resetPeriod", "monthly")


    if not card_name or not budget or not bank:
        return jsonify({"message":"Card Name, Budget, and Bank are required."}), 400

    try:
        budget = float(budget)
        spent = float(spent) if spent else 0.0
    except (ValueError, TypeError):
        return jsonify({"message":"Budget and Spent must be numbers."}), 400

    #create the new card object
    new_card = CreditCard(
        card_name=card_name, 
        budget=budget, 
        bank=bank, 
        spent=spent, 
        user_id=user_id,
        reset_period=reset_period,
        )
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
    card.card_name = data.get("cardName", card.card_name)
    card.budget = data.get("budget", card.budget)
    card.bank = data.get("bank", card.bank)
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
#updating options for the cards amount spent

@cards.route("/update_reset_period", methods=["PATCH"])
def update_reset_period():
    user_id = session.get("userId")
    if not user_id:
        return jsonify({"message": "Unauthorized"}), 401

    data = request.get_json()
    reset_period = data.get("resetPeriod")

    if reset_period not in ["monthly", "yearly"]:
        return jsonify({"message": "Invalid reset period"}), 400

    cards = CreditCard.query.filter_by(user_id=user_id).all()
    for card in cards:
        card.reset_period = reset_period
    db.session.commit()

    return jsonify({"message": f"All cards updated to reset {reset_period}."}), 200
#transforming data to excel 
@cards.route("/download_excel", methods=['GET'])
def download_excel():
    user_id = session.get("userId")
    print(f"Download Excel - User ID: {user_id}")
    
    if not user_id:
        print("No user_id in session")
        return {"message": "Unauthorized"}, 401

    user = User.query.get(user_id)
    if not user:
        print(f"User not found for ID: {user_id}")
        return {"message": "User not found"}, 404

    try:
        cards = user.credit_cards  # assuming your User model has a relationship to CreditCard
        print(f"Found {len(cards)} cards for user")

        card_data = [{
            "Card Name": c.card_name,
            "Bank": c.bank,
            "Budget": c.budget,
            "Spent": c.spent,
            "Remaining": c.budget - c.spent
        } for c in cards]

        df = pd.DataFrame(card_data)
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='My Cards')

        output.seek(0)
        filename = f"SmartSpend_{user.full_name}_{datetime.now().strftime('%Y-%m-%d')}.xlsx"

        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=filename
        )

    except Exception as e:
        print(f"Error in download_excel: {e}")
        return {"message": f"Error generating Excel file: {str(e)}"}, 500
