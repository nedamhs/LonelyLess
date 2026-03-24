#==================================
# EMA routes
# Serves daily/weekly EMA data for the logged-in participant
# GET /ema / daily
# GET /ema / weekly
#==================================
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, EmaDaily, EmaWeekly
from auth import decode_access_token
from fastapi.security import OAuth2PasswordBearer
import math

from routes.utils import get_current_user, clean

router = APIRouter(prefix="/ema", tags=["ema"])

@router.get("/daily")
def get_daily_ema(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Returns all daily EMA rows for the logged-in participant."""
    rows = db.query(EmaDaily).filter(EmaDaily.user_id == current_user.id).order_by(EmaDaily.date).all()
    return [
        {
            "date": str(row.date),
            "surveyindex": row.surveyindex,
            "feel_lonely": clean(row.feel_lonely),
            "feel_isolated": clean(row.feel_isolated),
            "feel_connected": clean(row.feel_connected),
            "affect_positive": clean(row.affect_positive),
            "affect_negative": clean(row.affect_negative),
            "rested_score": clean(row.rested_score),
            "quality_score": clean(row.quality_score),
            "number_social_interactions": clean(row.number_social_interactions),
            "pleasant_social_interactions": clean(row.pleasant_social_interactions),
            "panas_active": clean(row.panas_active),
            "panas_afraid": clean(row.panas_afraid),
            "panas_ashamed": clean(row.panas_ashamed),
            "panas_attentive": clean(row.panas_attentive),
            "panas_determined": clean(row.panas_determined),
            "panas_distressed": clean(row.panas_distressed),
            "panas_enthusiastic": clean(row.panas_enthusiastic),
            "panas_excited": clean(row.panas_excited),
            "panas_guilty": clean(row.panas_guilty),
            "panas_inspired": clean(row.panas_inspired),
            "panas_irritable": clean(row.panas_irritable),
            "panas_jittery": clean(row.panas_jittery),
            "panas_nervous": clean(row.panas_nervous),
            "panas_proud": clean(row.panas_proud),
            "panas_sad": clean(row.panas_sad),
            "panas_scared": clean(row.panas_scared),
            "panas_strong": clean(row.panas_strong),
            "panas_upset": clean(row.panas_upset),
        }
        for row in rows
    ]


@router.get("/weekly")
def get_weekly_ema(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Returns all weekly EMA rows for the logged-in participant."""
    rows = db.query(EmaWeekly).filter(EmaWeekly.user_id == current_user.id).order_by(EmaWeekly.date).all()
    return [
        {
            "date": str(row.date),
            "panas_active": clean(row.panas_active),
            "panas_afraid": clean(row.panas_afraid),
            "panas_ashamed": clean(row.panas_ashamed),
            "panas_attentive": clean(row.panas_attentive),
            "panas_determined": clean(row.panas_determined),
            "panas_distressed": clean(row.panas_distressed),
            "panas_enthusiastic": clean(row.panas_enthusiastic),
            "panas_excited": clean(row.panas_excited),
            "panas_guilty": clean(row.panas_guilty),
            "panas_inspired": clean(row.panas_inspired),
            "panas_irritable": clean(row.panas_irritable),
            "panas_jittery": clean(row.panas_jittery),
            "panas_nervous": clean(row.panas_nervous),
            "panas_proud": clean(row.panas_proud),
            "panas_sad": clean(row.panas_sad),
            "panas_scared": clean(row.panas_scared),
            "panas_strong": clean(row.panas_strong),
            "panas_upset": clean(row.panas_upset),
            "phq9_1": row.phq9_1,
            "phq9_2": row.phq9_2,
            "phq9_3": row.phq9_3,
            "phq9_4": row.phq9_4,
            "phq9_5": row.phq9_5,
            "phq9_6": row.phq9_6,
            "phq9_7": row.phq9_7,
            "phq9_8": row.phq9_8,
            "phq9_9": row.phq9_9,
            "pss4_1": row.pss4_1,
            "pss4_2": row.pss4_2,
            "pss4_3": row.pss4_3,
            "pss4_4": row.pss4_4,
            "week_felt": clean(row.week_felt),
            "week_points": row.week_points,
        }
        for row in rows
    ]
