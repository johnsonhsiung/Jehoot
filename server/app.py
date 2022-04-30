from audioop import cross
from flask import Flask, request, Response, make_response, Blueprint
from flask_cors import CORS, cross_origin

import json
import random
import questions
import datetime
from pymongo import MongoClient
from bson import ObjectId
from bson import json_util
from random import randint

# put this sippet ahead of all your bluprints
# blueprint can also be app~~

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

client = MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000')
# client = MongoClient('mongodb+srv://backend:hello123@cluster0.xy4s2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
db = client.jehoot

def parse_json(data):
    return json.loads(json_util.dumps(data))

# Get current gameboard
@app.route('/api/game/board', methods=['GET'])
def gameboard():
    filter = {"_id": ObjectId(request.args['game_id'])}
    game = db.gameboard.find_one(filter)

    if game['current_question'] is not None and \
        game['current_question_timestamp'] < (datetime.datetime.now() - datetime.timedelta(seconds=20)):

        game['current_question'] = None
        new_vals = {'$set': {'current_question': None}}
        db.gameboard.update_one(filter, new_vals)

    return parse_json(game)

# For admin to start the game
@app.route('/api/game/create', methods=['POST'])
def create_game():
    game = {
        'admin': request.json['admin'],
        'current_answers' : [],
        'players': [],
        'game_pin': ''.join(str(randint(0, 9)) for _ in range(6)),
        'questions': [],
        'current_question': None,
        'current_question_timestamp': None,
        'current_selector': None
    }
    game_id = str(db.gameboard.insert_one(game).inserted_id)
    return {'game_id': game_id}

#For user to join game
@app.route('/api/game/join', methods=['POST'])
def join_game():
    filter = {"_id": ObjectId(request.json['game_id'])}
    game = db.gameboard.find_one(filter)
    if request.json['username'] in game['players']:
        return Response(status=409)

    new_vals = {'$set': {f'players.{request.json["username"]}': 0}}
    db.gameboard.update_one(filter, new_vals)
    return Response(status=200)

# For admin to start the game
@app.route('/api/game/start', methods=['POST'])
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
@app.route('/api/game/question/chose', methods=['POST'])
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

@app.route('/api/game/question/answer', methods=['POST'])
def choose_answer():
    filter = {"_id": ObjectId(request.json['game_id'])}
    user_answer = {
        '$push': {
            "current_answers": [request.json['username'], request.json['answer']]
        }
    }
    db.gameboard.update_one(filter, user_answer)
    return Response(status=200)
    
# if __name__ == "__main__":
#     app.run()
