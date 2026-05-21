from flask import Flask, jsonify
from flask_cors import CORS

import pandas as pd
from sqlalchemy import create_engine

app = Flask(__name__)
CORS(app)

# ==============================
# PostgreSQL Connection
# ==============================

DB_URL = "postgresql://postgres:binny905@localhost:5433/postgres"

engine = create_engine(DB_URL)

# ==============================
# Home API
# ==============================

@app.route("/")
def home():
    return {
        "message": "Backend Running Successfully"
    }

# ==============================
# Dashboard API
# ==============================

@app.route("/api/call-metrics")
def call_metrics():

    query = """
        SELECT *
        FROM call_metrics
    """

    df = pd.read_sql(query, engine)

    data = df.to_dict(orient="records")

    return jsonify(data)

# ==============================
# Run Server
# ==============================

if __name__ == "__main__":
    app.run(debug=True, port=8000)