from flask import Flask, request, Response
from flask_cors import CORS

import json
import random
from questions import questions
import datetime
from pymongo import MongoClient
from bson import ObjectId
from bson import json_util
import copy

# put this sippet ahead of all your bluprints
# blueprint can also be app~~

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

# client = MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000')
client = MongoClient('mongodb+srv://backend:hello123@cluster0.xy4s2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
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
    # Put the property 'used' in all the questions. We could also just manually add property to questions.py. 
    questions_copy = copy.deepcopy(questions)
    for _, value in questions_copy.items():
        for _, value1 in value.items():
            value1['used'] = False 
    game = {
        'admin': request.json['admin'],
        'current_answers' : {}, # {'Rohin' : 0, 'Johnson' : 0, ...}
        'players': {}, # {‘Rohin’: {'total_points: 67', 'last_round_points': 5}, 'Johnson' : {'total_points': 5, 'last_round_points' : 5},...} 
        'questions': questions_copy,
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
    if request.json['username'] in game['players'].keys():
        return Response(status=409)
    new_vals = {'$set' : {f'players.{request.json["username"]}': {'total_points': 0, 'last_round_points' : 0}}}
    db.gameboard.update_one(filter, new_vals)
    return Response(status=200)

# For admin to start the game
@app.route('/api/game/start', methods=['POST'])
def start_game():
    filter = {"_id": ObjectId(request.json['game_id'])}
    game = db.gameboard.find_one(filter)
    if request.json['username'] != game['admin']:
        return Response(status=401)

    current_selector = random.choice(list((game['players'].keys())))
    new_vals = {'$set': {'current_selector': current_selector}}
    db.gameboard.update_one(filter, new_vals)
    return Response(status=200)

# For current selector to choose question
@app.route('/api/game/question/choose', methods=['POST'])
def choose_question():
    filter = {"_id": ObjectId(request.json['game_id'])}
    game = db.gameboard.find_one(filter)
    if request.json['username'] != game['current_selector']:
        return Response(status=401)

    # I commented it out because frontend has access to used questions now, so I'm assuming the logic will be there
    # for q in game['used_questions']:
    #     if request.json['question'] == q:
    #         return Response(status=409)

    question = request.json['question']
    timestamp = datetime.datetime.now()
    new_vals = {
        '$set': {
            'current_question': question, 
            'current_question_timestamp': timestamp
        }
    }
    db.gameboard.update_one(filter, new_vals)
    return Response(status=200)

@app.route('/api/game/question/answer', methods=['POST'])
def choose_answer():
    filter = {"_id": ObjectId(request.json['game_id'])}
    user_answer = {
        '$set': {
            f'current_answers.{request.json["username"]}': request.json['answer'] # answer is 0,1,2,3 
        }
    }
    db.gameboard.update_one(filter, user_answer)
    return Response(status=200)


@app.route('/api/game/question/get_winner', methods=['GET']) # is it get?
def get_winner():
    def _update_scores(winners, question_value, user):
        # winners is the username of winners. 
        # question_value is the initial value of the question
        # user is [username, score] 
        username = user[0]
        modifier = 0 # can change later 
        if username in winners: 
            index = winners.index(username)
            if index == 0: 
                # first place
                modifier = 1
            elif index == 1: 
                modifier = 0.5 
            else:
                modifier = 0.25
        return user_name[1] + int(modifier * question_value)
    filter = {"_id": ObjectId(request.args['game_id'])} 
    game = db.gameboard.find_one(filter)

    question = game['current_question'] # I saw in chat the question looks like this? (Math, 100).
    correct_answer = questions[question[0]][question[1]]['answer'] # trying to get the correct answer for the question which is an int
    # current_answers looks like this [username, answer]. Can I access it like I would a list? 
    winners = [user for user, answer in game['current_answers'].items() if int(answer) == correct_answer][0:3] # gets username if answer is correct answer 
    # first 3 winners for now. I was thinking it'd be more fun if everyone who got correct answer gets some points
    # we changed players to dict so this part won't work. 
    current_players = list(game['players'])
    current_players = [[user[0], _update_scores(winners, int(question[1]), user)] for user in current_players] # each user in current players is (username, score) right?
    new_vals = {
        '$set': {
            'players': current_players,
            'current_answers': [],
            'current_selector': winners[0] # just the username of first winner 
        }
    }
    db.gameboard.update_one(filter, new_vals)
    return json.dump(winners) # user names of winners 

   



    
if __name__ == "__main__":
    app.run()
