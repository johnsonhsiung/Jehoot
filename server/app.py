from flask import Flask, request, Response
from pymongo import MongoClient
from bson.objectid import ObjectId
import json
from bson import json_util
import random
import questions

client = MongoClient('mongodb+srv://backend:hello123@cluster0.xy4s2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
db = client.jehoot

app = Flask(__name__)

def parse_json(data):
    return json.loads(json_util.dumps(data))

# Get current gameboard
@app.route('/gameboard')
def gameboard():
    game = db.gameboard.find_one({"_id": ObjectId(request.json['game_id'])})
    return parse_json(game)

# For admin to start the game
@app.route('/create_game', methods=['POST'])
def create_game():
    game = {
        'admin': request.json['admin'],
        'players': None,
        'used_questions': None,
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
    if game['players'] is None:
        game['players'] = {}
    if request.json['username'] in game['players']:
        return Response(status=409)
    game['players'][request.json['username']] = 0
    db.gameboard.replace_one(filter, game)
    return Response(status=200)

# For admin to start the game
@app.route('/start_game', methods=['POST'])
def start_game():
    filter = {"_id": ObjectId(request.json['game_id'])}
    game = db.gameboard.find_one(filter)
    if request.json['username'] != game['admin']:
        return Response(status=401)
    if game['players'] is None:
        game['players'] = {}
    current_selector, _ = random.choice(list(game['players'].items()))
    game['current_selector'] = current_selector
    db.gameboard.replace_one(filter, game)
    return Response(status=200)
