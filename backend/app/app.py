from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

MODEL_PATH = "backend/model/uniguard_unidirectional.pkl"

saved = joblib.load(MODEL_PATH)

model = saved["model"]
features = saved["features"]


@app.get("/")
def home():
    return jsonify({
        "status": "online",
        "model": "UniGuard Unidirectional IDS",
        "features": len(features)
    })


@app.post("/predict")
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "No JSON data received"
            }), 400

        row = {}

        for feature in features:
            row[feature] = data.get(feature, 0)

        X = pd.DataFrame([row], columns=features)

        prediction = int(model.predict(X)[0])

        probability = float(
            model.predict_proba(X)[0][1]
        )

        if prediction == 1:
            label = "MALICIOUS"
        else:
            label = "BENIGN"

        return jsonify({
            "prediction": label,
            "malicious_probability": round(probability, 4),
            "threat_detected": prediction == 1
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )