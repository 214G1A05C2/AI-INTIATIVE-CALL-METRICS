import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URLpostgresql://ai_admin:xxxxxxxx@dpg-xxxxx-a.singapore-postgres.render.com/ai_voice_agent_6bb7")
    SQLALCHEMY_TRACK_MODIFICATIONS = False