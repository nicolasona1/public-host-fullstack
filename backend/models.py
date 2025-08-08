from config import db
from datetime import date

#User Model
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    usr_name = db.Column(db.String(100), nullable=False, unique=True)  
    email = db.Column(db.String(100), nullable=False, unique=True) 
    #one to many relationship with CreditCard
    credit_cards = db.relationship('CreditCard', backref='owner', lazy=True)
    #conecting backend with frontend
    def to_json(self):
        return{
            "id":self.id,
            "fullName": self.full_name,
            "usrName":self.usr_name,
            "email": self.email,
        }
#credit cards model

class CreditCard(db.Model):

    __tablename__ = "credit_cards"

    id = db.Column(db.Integer, primary_key=True)
    card_name = db.Column(db.String(100), nullable=False)
    budget = db.Column(db.Float, nullable=False)
    bank = db.Column(db.String(100), nullable=False)
    spent = db.Column(db.Float, default=0.0)
    #reset optioins for users
    reset_period = db.Column(db.String(10), default="monthly")
    last_reset = db.Column(db.Date, default=date.today)
   # Foreign key to associate the card with a user
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    def to_json(self):
        return {
            "id":self.id,
            "cardName": self.card_name,
            "budget": self.budget,
            "bank": self.bank,
            "spent": self.spent,
            "reset_period":self.reset_period,
            "last_reset":self.last_reset,
            "userId":self.user_id,
        }
