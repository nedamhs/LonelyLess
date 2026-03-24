#==================================
# Oura routes
# Serves Oura activity/readiness/sleep data for the logged-in participant
# Endpoint: 
# GET /oura/activity
# GET /oura/readiness
# GET /oura/sleep
#==================================

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User, OuraActivity, OuraReadiness, OuraSleep
from routes.utils import get_current_user, clean

router = APIRouter(prefix="/oura", tags=["oura"])

@router.get("/activity")
def get_oura_activity(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Returns all Oura daily activity rows for the logged-in participant."""
    rows = db.query(OuraActivity).filter(OuraActivity.user_id == current_user.id).order_by(OuraActivity.date).all()
    return [
        {
            "date": str(row.date),
            "timestamp": row.timestamp,
            "activity_non_wear": clean(row.activity_non_wear),
            "activity_rest": clean(row.activity_rest),
            "activity_inactive": clean(row.activity_inactive),
            "activity_low": clean(row.activity_low),
            "activity_medium": clean(row.activity_medium),
            "activity_high": clean(row.activity_high),
            "activity_total": clean(row.activity_total),
            "activity_met_min_inactive": clean(row.activity_met_min_inactive),
            "activity_met_min_low": clean(row.activity_met_min_low),
            "activity_met_min_medium": clean(row.activity_met_min_medium),
            "activity_met_min_high": clean(row.activity_met_min_high),
            "activity_average_met": clean(row.activity_average_met),
            "activity_cal_active": clean(row.activity_cal_active),
            "activity_cal_total": clean(row.activity_cal_total),
            "activity_daily_movement": clean(row.activity_daily_movement),
            "activity_inactivity_alerts": clean(row.activity_inactivity_alerts),
            "activity_score": clean(row.activity_score),
            "activity_score_meet_daily_targets": clean(row.activity_score_meet_daily_targets),
            "activity_score_move_every_hour": clean(row.activity_score_move_every_hour),
            "activity_score_recovery_time": clean(row.activity_score_recovery_time),
            "activity_score_stay_active": clean(row.activity_score_stay_active),
            "activity_score_training_frequency": clean(row.activity_score_training_frequency),
            "activity_score_training_volume": clean(row.activity_score_training_volume),
            "activity_steps": clean(row.activity_steps),
            "activity_target_calories": clean(row.activity_target_calories),
            "activity_target_km": clean(row.activity_target_km),
            "activity_target_miles": clean(row.activity_target_miles),
            "activity_to_target_km": clean(row.activity_to_target_km),
            "activity_to_target_miles": clean(row.activity_to_target_miles),
        }
        for row in rows
    ]


@router.get("/readiness")
def get_oura_readiness(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Returns all Oura daily readiness rows for the logged-in participant."""
    rows = db.query(OuraReadiness).filter(OuraReadiness.user_id == current_user.id).order_by(OuraReadiness.date).all()
    return [
        {
            "date": str(row.date),
            "timestamp": row.timestamp,
            "readiness_score": clean(row.readiness_score),
            "readiness_score_activity_balance": clean(row.readiness_score_activity_balance),
            "readiness_score_hrv_balance": clean(row.readiness_score_hrv_balance),
            "readiness_score_previous_day": clean(row.readiness_score_previous_day),
            "readiness_score_previous_night": clean(row.readiness_score_previous_night),
            "readiness_score_recovery_index": clean(row.readiness_score_recovery_index),
            "readiness_score_resting_hr": clean(row.readiness_score_resting_hr),
            "readiness_score_sleep_balance": clean(row.readiness_score_sleep_balance),
            "readiness_score_temperature": clean(row.readiness_score_temperature),
        }
        for row in rows
    ]


@router.get("/sleep")
def get_oura_sleep(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Returns all Oura daily sleep rows for the logged-in participant."""
    rows = db.query(OuraSleep).filter(OuraSleep.user_id == current_user.id).order_by(OuraSleep.date).all()
    return [
        {
            "date": str(row.date),
            "timestamp": row.timestamp,
            "sleep_duration": clean(row.sleep_duration),
            "sleep_awake": clean(row.sleep_awake),
            "sleep_light": clean(row.sleep_light),
            "sleep_rem": clean(row.sleep_rem),
            "sleep_deep": clean(row.sleep_deep),
            "sleep_total": clean(row.sleep_total),
            "sleep_breath_average": clean(row.sleep_breath_average),
            "sleep_efficiency": clean(row.sleep_efficiency),
            "sleep_hr_average": clean(row.sleep_hr_average),
            "sleep_hr_lowest": clean(row.sleep_hr_lowest),
            "sleep_is_longest": clean(row.sleep_is_longest),
            "sleep_onset_latency": clean(row.sleep_onset_latency),
            "sleep_restless": clean(row.sleep_restless),
            "sleep_rmssd": clean(row.sleep_rmssd),
            "sleep_score": clean(row.sleep_score),
            "sleep_score_alignment": clean(row.sleep_score_alignment),
            "sleep_score_deep": clean(row.sleep_score_deep),
            "sleep_score_disturbances": clean(row.sleep_score_disturbances),
            "sleep_score_efficiency": clean(row.sleep_score_efficiency),
            "sleep_score_latency": clean(row.sleep_score_latency),
            "sleep_score_rem": clean(row.sleep_score_rem),
            "sleep_score_total": clean(row.sleep_score_total),
            "sleep_temperature_delta": clean(row.sleep_temperature_delta),
            "sleep_temperature_deviation": clean(row.sleep_temperature_deviation),
            "sleep_temperature_trend_deviation": clean(row.sleep_temperature_trend_deviation),
            "sleep_bedtime_start": row.sleep_bedtime_start,
            "sleep_bedtime_end": row.sleep_bedtime_end,
            "sleep_midpoint_time": clean(row.sleep_midpoint_time),
            "sleep_bedtime_start_delta": clean(row.sleep_bedtime_start_delta),
            "sleep_bedtime_end_delta": clean(row.sleep_bedtime_end_delta),
            "sleep_midpoint_at_delta": clean(row.sleep_midpoint_at_delta),
        }
        for row in rows
    ]