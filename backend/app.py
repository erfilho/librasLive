from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/upload", methods=["POST"])
def upload_audio():
    if "audio" not in request.files:
        return jsonify({"error": "No file part"}), 400

    audio = request.files["audio"]
    filename = f"audio_{uuid.uuid4()}.wav"
    path = os.path.join(UPLOAD_FOLDER, filename)
    audio.save(path)

    return jsonify({"message": "File uploaded successfully", "arquivo": filename}), 200

if __name__ == "__main__":
    app.run(debug=True)
