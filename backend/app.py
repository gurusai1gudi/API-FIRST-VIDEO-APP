from flask import Flask, request, jsonify, Response
from datetime import datetime,timedelta
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import timedelta
from bson.objectid import ObjectId
from flask_cors import CORS
import os

# Load environment variables
load_dotenv()

# Flask app
app = Flask(__name__)
CORS(app)
# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)
# MongoDB Connection
client = MongoClient(os.getenv("MONGO_URI"))
db = client["api_first_video_app"]
users_collection = db["users"]
videos_collection = db["videos"]
# AUTH ROUTES
@app.route("/auth/signup", methods=["POST"])
def signup():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields required"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    password_hash = generate_password_hash(password)

    users_collection.insert_one({
        "name": name,
        "email": email,
        "password_hash": password_hash,
        "created_at": datetime.utcnow()
    })

    return jsonify({"message": "User registered successfully"}), 201


@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = users_collection.find_one({"email": email})

    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user["_id"]))

    return jsonify({"access_token": access_token}), 200


@app.route("/auth/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()

    user = users_collection.find_one(
        {"_id": ObjectId(user_id)},
        {"password_hash": 0}
    )

    return jsonify({
        "name": user["name"],
        "email": user["email"]
    }), 200


# HEALTH CHECK

@app.route("/")
def home():
    return {"message": "Backend is running "}

# DASHBOARD
@app.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    videos = videos_collection.find(
        {"is_active": True},
        {"youtube_id": 0}
    ).limit(2)

    response = []
    for v in videos:
        response.append({
            "id": str(v["_id"]),
            "title": v["title"],
            "description": v["description"],
            "thumbnail_url": v["thumbnail_url"]
        })

    return jsonify(response), 200

# VIDEO STREAM (WRAPPER)
@app.route("/video/<video_id>/stream")
@jwt_required()
def stream_video(video_id):
    video = videos_collection.find_one({"_id": ObjectId(video_id)})

    if not video:
        return {"error": "Video not found"}, 404

    youtube_id = video["youtube_id"]
    html = f"""
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <style>
          html, body {{
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background: black;
            overflow: hidden;
          }}
          #player {{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }}
          iframe {{
            width: 100%;
            height: 100%;
            border: 0;
          }}
        </style>
      </head>
      <body>
        <div id="player">
          <iframe
            src="https://www.youtube.com/embed/{youtube_id}?playsinline=1&controls=1&modestbranding=1&rel=0"
            allow="autoplay; encrypted-media; fullscreen"
            allowfullscreen>
          </iframe>
        </div>
      </body>
    </html>
    """

    return Response(html, mimetype="text/html")
# RUN
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)