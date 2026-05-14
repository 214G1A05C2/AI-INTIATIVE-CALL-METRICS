from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# PostgreSQL connection
engine = create_engine(
    "postgresql+psycopg2://postgres:binny905@localhost:5433/postgres"
)


@app.get("/")
def home():
    return {"message": "Backend Running Successfully"}


# Summary Cards
@app.get("/summary")
def summary():

    query = """
    SELECT
        COUNT(*) AS total_calls,

        COUNT(*) FILTER (
            WHERE user_request ILIKE '%Appointment%'
        ) AS appointments_handled,

        COUNT(*) FILTER (
            WHERE user_request ILIKE '%Silent%'
        ) AS silent_no_request,

        COUNT(*) FILTER (
            WHERE user_request ILIKE '%Front%'
        ) AS transferred_frontdesk

    FROM call_metrics
    """

    with engine.connect() as conn:
        row = conn.execute(text(query)).fetchone()

    return dict(row._mapping)


# Pie Chart Data
@app.get("/request-types")
def request_types():

    query = """
    SELECT
        user_request,
        COUNT(*) AS count
    FROM call_metrics
    GROUP BY user_request
    ORDER BY count DESC
    """

    with engine.connect() as conn:
        rows = conn.execute(text(query)).fetchall()

    return [dict(r._mapping) for r in rows]


# Bar Graph Data
@app.get("/clinic-calls")
def clinic_calls():

    query = """
    SELECT
        clinic_name,
        COUNT(*) AS total_calls
    FROM call_metrics
    GROUP BY clinic_name
    ORDER BY total_calls DESC
    """

    with engine.connect() as conn:
        rows = conn.execute(text(query)).fetchall()

    return [dict(r._mapping) for r in rows]