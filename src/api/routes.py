"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required


api = Blueprint('api', __name__)
bcrypt = Bcrypt()
# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# Endpoint crear usuario
@api.route('/user/create', methods=['POST'])
def create_user():
    user_data = request.get_json()
    new_user = User(**user_data)
    new_user.password = bcrypt.generate_password_hash(new_user.password).decode('utf-8')
    db.session.add(new_user)
    db.session.commit()
    print(new_user)
    print (user_data)
    return "usuario creado con exito", 200

# Endpoint verificar login
@api.route('/user/login', methods=['POST'])
def login():
    user_data = request.get_json()
    user = User.query.filter_by(email=user_data["email"]).first()
    if user and bcrypt.check_password_hash(user.password, user_data["password"]):
        access_token = create_access_token(identity=str(user.id))
        return jsonify({"msg":"login correcto","acces_token":access_token})
    else:
        return jsonify({"error":"El email no esta registrado o los datos son incorrectos"})

# Endpoint listar usuarios
@api.route('/user/list', methods=['GET'])
@jwt_required()
def get_list_user():
    list_user = User.query.all()
    list_user = [user.serialize() for user in list_user]
    return jsonify({"Users": list_user})

# Endpoint listar usuarios por id
@api.route('/user/list/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    print(user)

    return jsonify({"user":user.serialize()})