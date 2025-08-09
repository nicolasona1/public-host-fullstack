import os
import json
from datetime import date
from pathlib import Path

from flask import Blueprint, jsonify, session, request
from dotenv import load_dotenv, find_dotenv

# --- Load .env reliably ---
dotenv_path = find_dotenv(usecwd=True) or str(Path(__file__).with_name(".env"))
load_dotenv(dotenv_path)

# --- OpenAI client ---
from openai import OpenAI

API_KEY = os.getenv("OPENAI_API_KEY")
if not API_KEY:
    raise RuntimeError(
        "OPENAI_API_KEY not found. Create backend/.env with:\n"
        "OPENAI_API_KEY=sk-...your real key...\n"
    )

# Use a valid OpenAI model
MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
client = OpenAI(api_key=API_KEY)

# --- DB imports ---
from models import CreditCard

ai = Blueprint("ai", __name__)

def _float_or_zero(v):
    try:
        return float(v or 0)
    except Exception:
        return 0.0

def summarize_cards(cards):
    """
    Produce a compact, privacy-safe snapshot of the user's cards
    that the model can use to generate advice.
    """
    summary = []
    totals = {"budget": 0.0, "spent": 0.0}

    for c in cards:
        budget = _float_or_zero(getattr(c, "budget", 0))
        spent = _float_or_zero(getattr(c, "spent", 0))
        util = (spent / budget) if budget else 0.0

        summary.append({
            "card_name": getattr(c, "card_name", None),
            "bank": getattr(c, "bank", None),
            "budget": budget,
            "spent": spent,
            "reset_period": getattr(c, "reset_period", None),
            "last_reset": (getattr(c, "last_reset", None) or date.today()).isoformat(),
            "utilization": round(util, 4),
        })
        totals["budget"] += budget
        totals["spent"] += spent

    totals["overall_utilization"] = round((totals["spent"] / totals["budget"]) if totals["budget"] else 0.0, 4)
    return {"cards": summary, "totals": totals}

@ai.route("/ai/recommendation", methods=["POST"])
def recommendation():
    """
    Returns structured JSON advice using OpenAI's chat completions API
    """
    try:
        user_id = session.get("userId")
        if not user_id:
            return jsonify({"message": "Unauthorized"}), 401

        # Pull user's cards
        cards = CreditCard.query.filter_by(user_id=user_id).all()
        
        if not cards:
            return jsonify({
                "grade": "green",
                "summary": "No cards found. Start by adding your first credit card to get personalized recommendations!",
                "quick_tips": ["Add your first credit card", "Set a realistic budget", "Track your spending regularly"]
            }), 200

        payload = summarize_cards(cards)

        # Create the prompt for OpenAI
        system_prompt = """You are a helpful financial advisor for college students. 
        Analyze the provided credit card data and return advice in JSON format only.
        
        Return a JSON object with this exact structure:
        {
            "grade": "green" | "yellow" | "red",
            "summary": "Brief overall assessment",
            "quick_tips": ["tip1", "tip2", "tip3"],
            "suggested_actions": [{"label": "action", "impact": "expected result"}]
        }
        
        Grade meanings:
        - green: Good financial health (utilization < 30%)
        - yellow: Caution needed (utilization 30-70%)
        - red: Immediate attention required (utilization > 70%)
        """

        user_prompt = f"""
        Here is the user's credit card data:
        {json.dumps(payload, indent=2)}
        
        Please analyze this data and provide personalized financial advice in the specified JSON format.
        """

        # Make the API call to OpenAI
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.7,
            max_tokens=1000
        )

        # Parse the response
        ai_response = response.choices[0].message.content
        
        try:
            result = json.loads(ai_response)
            
            # Validate the response structure
            if not all(key in result for key in ["grade", "summary"]):
                raise ValueError("Missing required fields in AI response")
                
            # Ensure arrays exist
            if "quick_tips" not in result:
                result["quick_tips"] = []
            if "suggested_actions" not in result:
                result["suggested_actions"] = []
                
            return jsonify(result), 200
            
        except json.JSONDecodeError:
            # Fallback response if JSON parsing fails
            return jsonify({
                "grade": "yellow",
                "summary": "Unable to generate structured advice at this time.",
                "quick_tips": ["Review your spending regularly", "Keep utilization below 30%", "Pay bills on time"],
                "suggested_actions": []
            }), 200

    except Exception as e:
        print(f"Error in AI recommendation: {str(e)}")
        return jsonify({
            "message": "AI service temporarily unavailable",
            "error": str(e)
        }), 500

# Optional: Add a test endpoint to verify AI connectivity
@ai.route("/ai/test", methods=["GET"])
def test_ai():
    """Test endpoint to verify OpenAI API connectivity"""
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": "Say 'AI service is working!'"}],
            max_tokens=10
        )
        
        return jsonify({
            "status": "success",
            "message": response.choices[0].message.content,
            "model": MODEL
        }), 200
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500