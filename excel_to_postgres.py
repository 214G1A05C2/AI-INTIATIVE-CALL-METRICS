import pandas as pd
from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:binny905@localhost:5433/postgres"

engine = create_engine(DATABASE_URL)

# File is actually CSV content
df = pd.read_csv("agent_call_data.xlsx")

print(df.head())

df.columns = [
    col.strip().lower().replace(" ", "_")
    for col in df.columns
]

df.to_sql(
    "call_metrics",
    engine,
    if_exists="replace",
    index=False
)

print("Excel Data Imported Successfully")