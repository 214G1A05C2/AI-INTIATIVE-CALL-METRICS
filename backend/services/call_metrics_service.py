from repositories.call_metrics_repository import (
    CallMetricsRepository
)


class CallMetricsService:

    @staticmethod
    def fetch_all_calls():

        data = CallMetricsRepository.get_all_calls()

        result = []

        for row in data:

            result.append({
                "clinic_name": row.clinic_name,
                "user_request": row.user_request,
                "month_name": row.month_name
            })

        return result