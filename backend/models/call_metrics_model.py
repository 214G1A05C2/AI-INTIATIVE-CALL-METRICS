from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class CallMetrics(db.Model):

    __tablename__ = "call_metrics"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    clinic_name = db.Column(db.String)

    user_request = db.Column(db.String)

    month_name = db.Column(db.String)

    def to_dict(self):

        return {
            "id": self.id,
            "clinic_name": self.clinic_name,
            "user_request": self.user_request,
            "month_name": self.month_name
        }