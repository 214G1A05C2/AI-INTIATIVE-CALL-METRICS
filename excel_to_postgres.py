import pandas as pd
from sqlalchemy import create_engine, text

# Connection
engine = create_engine(
    "postgresql+psycopg2://postgres:binny905@localhost:5433/postgres"
)

# Read Excel
df = pd.read_excel("agent_call_data.xlsx")

# Clean columns
df.columns = (
    df.columns
    .str.strip()
    .str.lower()
    .str.replace(" ", "_")
)

# Explicitly drop/create
with engine.connect() as conn:
    conn.execute(text("DROP TABLE IF EXISTS public.call_metrics"))
    conn.commit()

# Create table again
df.to_sql(
    "call_metrics",
    engine,
    schema="public",
    if_exists="replace",
    index=False
)

print("Table created successfully!")

# Verify immediately
with engine.connect() as conn:
    result = conn.execute(text("""
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_name='call_metrics'
    """))

    for row in result:
        print(row)