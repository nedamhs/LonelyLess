#==================================
# HRV routes
# Serves HRV data for the logged-in participant
# Endpoint: 
# GET /hrv/12min
# GET /hrv/5min
#==================================

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User, HRV_12min
from routes.utils import get_current_user, clean

router = APIRouter(prefix="/hrv", tags=["hrv"])

@router.get("/12min")
def get_hrv_12min(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Returns all 12-minute HRV rows for the logged-in participant."""
    rows = db.query(HRV_12min).filter(HRV_12min.user_id == current_user.id).order_by(HRV_12min.timestamp).all()
    return [
        {
            "timestamp": row.timestamp,
            "HRV_MeanNN": clean(row.HRV_MeanNN),
            "HRV_SDNN": clean(row.HRV_SDNN),
            "HRV_SDANN1": clean(row.HRV_SDANN1),
            "HRV_SDNNI1": clean(row.HRV_SDNNI1),
            "HRV_SDANN2": clean(row.HRV_SDANN2),
            "HRV_SDNNI2": clean(row.HRV_SDNNI2),
            "HRV_RMSSD": clean(row.HRV_RMSSD),
            "HRV_SDSD": clean(row.HRV_SDSD),
            "HRV_CVNN": clean(row.HRV_CVNN),
            "HRV_CVSD": clean(row.HRV_CVSD),
            "HRV_MedianNN": clean(row.HRV_MedianNN),
            "HRV_MadNN": clean(row.HRV_MadNN),
            "HRV_MCVNN": clean(row.HRV_MCVNN),
            "HRV_IQRNN": clean(row.HRV_IQRNN),
            "HRV_pNN50": clean(row.HRV_pNN50),
            "HRV_pNN20": clean(row.HRV_pNN20),
            "HRV_HTI": clean(row.HRV_HTI),
            "HRV_TINN": clean(row.HRV_TINN),
            "HRV_LF": clean(row.HRV_LF),
            "HRV_HF": clean(row.HRV_HF),
            "HRV_VHF": clean(row.HRV_VHF),
            "HRV_LFHF": clean(row.HRV_LFHF),
            "HRV_LFn": clean(row.HRV_LFn),
            "HRV_HFn": clean(row.HRV_HFn),
            "HRV_LnHF": clean(row.HRV_LnHF),
            "HRV_SD1": clean(row.HRV_SD1),
            "HRV_SD2": clean(row.HRV_SD2),
            "HRV_SD1SD2": clean(row.HRV_SD1SD2),
            "HRV_S": clean(row.HRV_S),
            "HR": clean(row.HR),
        }
        for row in rows
    ]

@router.get("/5min")
def get_hrv_5min(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Returns all 5-minute HRV rows for the logged-in participant."""
    rows = db.query(HRV_12min).filter(HRV_12min.user_id == current_user.id).order_by(HRV_12min.timestamp).all()
    return [
        {
            "timestamp": row.timestamp,
            "HRV_MeanNN": clean(row.HRV_MeanNN),
            "HRV_SDNN": clean(row.HRV_SDNN),
            "HRV_SDANN1": clean(row.HRV_SDANN1),
            "HRV_SDNNI1": clean(row.HRV_SDNNI1),
            "HRV_SDANN2": clean(row.HRV_SDANN2),
            "HRV_SDNNI2": clean(row.HRV_SDNNI2),
            "HRV_RMSSD": clean(row.HRV_RMSSD),
            "HRV_SDSD": clean(row.HRV_SDSD),
            "HRV_CVNN": clean(row.HRV_CVNN),
            "HRV_CVSD": clean(row.HRV_CVSD),
            "HRV_MedianNN": clean(row.HRV_MedianNN),
            "HRV_MadNN": clean(row.HRV_MadNN),
            "HRV_MCVNN": clean(row.HRV_MCVNN),
            "HRV_IQRNN": clean(row.HRV_IQRNN),
            "HRV_pNN50": clean(row.HRV_pNN50),
            "HRV_pNN20": clean(row.HRV_pNN20),
            "HRV_HTI": clean(row.HRV_HTI),
            "HRV_TINN": clean(row.HRV_TINN),
            "HRV_LF": clean(row.HRV_LF),
            "HRV_HF": clean(row.HRV_HF),
            "HRV_VHF": clean(row.HRV_VHF),
            "HRV_LFHF": clean(row.HRV_LFHF),
            "HRV_LFn": clean(row.HRV_LFn),
            "HRV_HFn": clean(row.HRV_HFn),
            "HRV_LnHF": clean(row.HRV_LnHF),
            "HRV_SD1": clean(row.HRV_SD1),
            "HRV_SD2": clean(row.HRV_SD2),
            "HRV_SD1SD2": clean(row.HRV_SD1SD2),
            "HRV_S": clean(row.HRV_S),
            "HR": clean(row.HR),
        }
        for row in rows
    ]