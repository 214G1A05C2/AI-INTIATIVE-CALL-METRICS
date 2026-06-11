import os
from pathlib import Path


class Config:
    _base_dir = Path(__file__).resolve().parent
    _sqlite_db = _base_dir / "instance" / "calls.db"
    _sqlite_uri = _sqlite_db.as_posix()

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{_sqlite_uri}",
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False
