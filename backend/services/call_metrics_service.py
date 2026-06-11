from repositories.call_metrics_repository import (
    CallMetricsRepository
)


class CallMetricsService:

    @staticmethod
    def fetch_all_calls():
        data = CallMetricsRepository.get_all_calls()
        result = []
        for row in data:
            primary_intent = (row.primary_intent or "").strip()

            result.append({
                "id": row.id,
                "call_id": row.call_id,
                "clinic_name": row.clinic_name,
                "call_timestamp": row.call_timestamp,
                "primary_intent": primary_intent,
                "secondary_intents": row.secondary_intents,
                "detected_intents": row.detected_intents,
                "workflow_events": row.workflow_events,
                "workflow_summary": row.workflow_summary,
                "completion_data": row.completion_data,
                "blocker_data": row.blocker_data,
                "final_output": row.final_output,
                "created_at": row.created_at,
                "transcript": row.transcript,
            })

        return result
