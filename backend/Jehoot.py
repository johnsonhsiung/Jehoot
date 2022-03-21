import pyrebase
import requests.exceptions 
import json
# // Import the functions you need from the SDKs you need
# import { initializeApp } from "firebase/app";
# import { getAnalytics } from "firebase/analytics";
# // TODO: Add SDKs for Firebase products that you want to use
# // https://firebase.google.com/docs/web/setup#available-libraries

# // Your web app's Firebase configuration
# // For Firebase JS SDK v7.20.0 and later, measurementId is optional
# const firebaseConfig = {
#   apiKey: "AIzaSyD32B8mepuvdpnYNY2XekKlVfGgAtXEvJo",
#   authDomain: "jehoot-16c84.firebaseapp.com",
#   projectId: "jehoot-16c84",
#   storageBucket: "jehoot-16c84.appspot.com",
#   messagingSenderId: "105518725013",
#   appId: "1:105518725013:web:44a233c436d81d07a8a89c",
#   measurementId: "G-3KWMPMTFLB"
# };

# // Initialize Firebase
# const app = initializeApp(firebaseConfig);
# const analytics = getAnalytics(app);


def print_auth_error_message(httpError):
    # extracts error message from httpError
    error_message = json.loads(httpError.args[1])['error']['message']
    print(error_message)
# connect to firebase 
firebaseConfig = {
  "apiKey": "AIzaSyD32B8mepuvdpnYNY2XekKlVfGgAtXEvJo",
  "authDomain": "jehoot-16c84.firebaseapp.com",
  "projectId": "jehoot-16c84",
  "storageBucket": "jehoot-16c84.appspot.com",
  "messagingSenderId": "105518725013",
  "appId": "1:105518725013:web:44a233c436d81d07a8a89c",
  "measurementId": "G-3KWMPMTFLB",
  "databaseURL": "dummy" # Pyrebase needs this, but we aren't using it. 
}

# initialize project 
firebase = pyrebase.initialize_app(firebaseConfig)


auth = firebase.auth()

def sign_up(): 
    # ODO: get email and password from form instead
    email = input("Enter email")
    password = input("Enter password")
    try:
        user = auth.create_user_with_email_and_password(email,password)
        auth.send_email_verification(user['idToken'])
    except requests.exceptions.HTTPError as httpErr:
        
        print_auth_error_message(httpErr)


    # place holder data to send to database 
    data = {
    "Email" : email
    }

    # Can store data along with the id of the user -> user['localId'] 
    # or store all more info with -> user['idTokden']

def login():
    #TODO: get email and password from form instead
    email = input("Enter email")
    password = input("Enter password")
    try :
        login = auth.sign_in_with_email_and_password(email, password)
    except requests.exceptions.HTTPError as httpErr:
        print_auth_error_message(httpErr)

def reset_password():
     #TODO: get email from form instead
    email = input("Enter email")
    try:
        auth.send_password_reset_email(email)
    except requests.exceptions.HTTPError as httpErr:    
        print_auth_error_message(httpErr)

login()



	
  