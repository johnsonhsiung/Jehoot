from flask import Flask, request
import pyrebase

firebaseConfig = {
  "apiKey": "AIzaSyD32B8mepuvdpnYNY2XekKlVfGgAtXEvJo",
  "authDomain": "jehoot-16c84.firebaseapp.com",
  "databaseURL": "https://jehoot-16c84-default-rtdb.firebaseio.com/",
  "projectId": "jehoot-16c84",
  "storageBucket": "jehoot-16c84.appspot.com",
  "messagingSenderId": "105518725013",
  "appId": "1:105518725013:web:44a233c436d81d07a8a89c",
  "measurementId": "G-3KWMPMTFLB"
}

firebase = pyrebase.initialize_app(firebaseConfig)
database = firebase.database()
auth = firebase.auth()

app = Flask(__name__)

@app.route('/new_user')
def new_user():
    try: 
        req = request.get_json()
        auth.create_user_with_email_and_password(req['email'], req['password'])
        return ""
    except:
        return "", 409

@app.route('/login')
def login():
    try: 
        req = request.get_json()
        user = auth.sign_in_with_email_and_password(req['email'], req['password'])
        return {'email': user['email']}
    except:
        return "", 401

