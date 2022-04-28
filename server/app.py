import json
import random
import questions
import datetime
from flask import Flask, request, Response
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson import json_util

client = MongoClient('mongodb+srv://backend:hello123@cluster0.xy4s2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
db = client.jehoot
app = Flask(__name__)

def parse_json(data):
    return json.loads(json_util.dumps(data))

# For getting current gameboard
@app.route('/gameboard')
def gameboard():
    filter = {"_id": ObjectId(request.json['game_id'])}
    game = db.gameboard.find_one(filter)

    if game['current_question'] is not None and \
        game['current_question_timestamp'] < (datetime.datetime.now() - datetime.timedelta(seconds=20)):

        new_vals = {'$set': {'current_question': None}}
        db.gameboard.update_one(filter, new_vals)

    return parse_json(game)

# For admin to start the game
@app.route('/create_game', methods=['POST'])
def create_game():
    game = {
        'admin': request.json['admin'],
        'players': {},
        'used_questions': [],
        'current_question': None,
        'current_question_timestamp': None,
        'current_selector': None
    }
    game_id = str(db.gameboard.insert_one(game).inserted_id)
    return {'game_id': game_id, 'questions': questions.questions}

# For user to join game
@app.route('/join_game', methods=['POST'])
def join_game():
    filter = {"_id": ObjectId(request.json['game_id'])}
    game = db.gameboard.find_one(filter)
    if request.json['username'] in game['players']:
        return Response(status=409)

    new_vals = {'$set': {f'players.{request.json["username"]}': 0}}
    db.gameboard.update_one(filter, new_vals)
    return Response(status=200)

# For admin to start the game
@app.route('/start_game', methods=['POST'])
def start_game():
    filter = {"_id": ObjectId(request.json['game_id'])}
    game = db.gameboard.find_one(filter)
    if request.json['username'] != game['admin']:
        return Response(status=401)

    current_selector, _ = random.choice(list(game['players'].items()))
    new_vals = {'$set': {'current_selector': current_selector}}
    db.gameboard.update_one(filter, new_vals)
    return Response(status=200)

# For current selector to choose question
@app.route('/choose_question', methods=['POST'])
def choose_question():
    filter = {"_id": ObjectId(request.json['game_id'])}
    game = db.gameboard.find_one(filter)
    if request.json['username'] != game['current_selector']:
        return Response(status=401)

    for q in game['used_questions']:
        if request.json['question'] == q:
            return Response(status=409)

    question = request.json['question']
    timestamp = datetime.datetime.now()
    new_vals = {
        '$set': {
            'current_question': question, 
            'current_question_timestamp': timestamp
        },
        '$push': {
            "used_questions": question
        }
    }
    db.gameboard.update_one(filter, new_vals)
    return Response(status=200)
    