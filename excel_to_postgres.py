import pandas as pd
from sqlalchemy import create_engine

# ===================================
# PostgreSQL Connection
# ===================================

DATABASE_URL = "postgresql://postgres:binny905@localhost:5433/postgres"

engine = create_engine(DATABASE_URL)

# ===================================
# Read Excel File
# ===================================

df = pd.read_excel("agent_call_data.xlsx")

# ===================================
# Clean Column Names
# ===================================

df.columns = [
    col.strip().lower().replace(" ", "_")
    for col in df.columns
]

# ===================================
# ADD UNIQUE ID COLUMN
# ===================================

df.insert(0, "id", range(1, len(df) + 1))

print(df.head())

# ===================================
# Upload To PostgreSQL
# ===================================

df.to_sql(
    "call_metrics",
    engine,
    if_exists="replace",
    index=False
)

print("Excel Data Imported Successfully")