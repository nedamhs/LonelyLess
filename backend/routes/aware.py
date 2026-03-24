#==================================
# AWARE routes
# Serves extracted AWARE features for the logged-in participant
# Endpoint: GET /aware/features
#==================================

from fastapi import APIRouter, Depends, HTTPException   
from sqlalchemy.orm import Session
from database import get_db
from models import User, AwareFeatures
from auth import decode_access_token
from fastapi.security import OAuth2PasswordBearer
import math

from routes.utils import get_current_user, clean

router = APIRouter(prefix="/aware", tags=["aware"])


@router.get("/features")
def get_aware_features(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Returns all AWARE extracted feature rows for the logged-in participant."""
    rows = db.query(AwareFeatures).filter(AwareFeatures.user_id == current_user.id).order_by(AwareFeatures.timestamp).all()
    return [
        {
            "timestamp": row.timestamp,
            "call_dur_incoming": clean(row.call_dur_incoming),
            "call_dur_outgoing": clean(row.call_dur_outgoing),
            "call_count_incoming": clean(row.call_count_incoming),
            "call_count_outgoing": clean(row.call_count_outgoing),
            "call_count_missed": clean(row.call_count_missed),
            "notif_shopping": clean(row.notif_shopping),
            "notif_entertainment": clean(row.notif_entertainment),
            "notif_tools": clean(row.notif_tools),
            "notif_travel_local": clean(row.notif_travel_local),
            "notif_unknown": clean(row.notif_unknown),
            "notif_lifestyle": clean(row.notif_lifestyle),
            "notif_social": clean(row.notif_social),
            "notif_auto_vehicles": clean(row.notif_auto_vehicles),
            "notif_education": clean(row.notif_education),
            "notif_business": clean(row.notif_business),
            "notif_finance": clean(row.notif_finance),
            "notif_health_fitness": clean(row.notif_health_fitness),
            "notif_music_audio": clean(row.notif_music_audio),
            "notif_productivity": clean(row.notif_productivity),
            "notif_books_reference": clean(row.notif_books_reference),
            "notif_photography": clean(row.notif_photography),
            "notif_video_players_editors": clean(row.notif_video_players_editors),
            "notif_communication": clean(row.notif_communication),
            "mess_received": clean(row.mess_received),
            "mess_sent": clean(row.mess_sent),
            "batt_mean_start": clean(row.batt_mean_start),
            "batt_count_start": clean(row.batt_count_start),
            "touch_clicked": clean(row.touch_clicked),
            "touch_long_clicked": clean(row.touch_long_clicked),
            "touch_scrolled_up": clean(row.touch_scrolled_up),
            "touch_scrolled_down": clean(row.touch_scrolled_down),
            "screen_off": clean(row.screen_off),
            "screen_on": clean(row.screen_on),
            "screen_locked": clean(row.screen_locked),
            "screen_unlocked": clean(row.screen_unlocked),
            "usage_total_on": clean(row.usage_total_on),
            "usage_total_off": clean(row.usage_total_off),
            "usage_num_on": clean(row.usage_num_on),
            "usage_num_off": clean(row.usage_num_off),
            "loc_std_lat": clean(row.loc_std_lat),
            "loc_std_lon": clean(row.loc_std_lon),
            "loc_std_speed": clean(row.loc_std_speed),
            "loc_mean_speed": clean(row.loc_mean_speed),
            "loc_home_dur": clean(row.loc_home_dur),
            "loc_out_dur": clean(row.loc_out_dur),
            "loc_mean_out_dur": clean(row.loc_mean_out_dur),
            "loc_std_out_dur": clean(row.loc_std_out_dur),
            "loc_been_out": clean(row.loc_been_out),        #BINARY
            "loc_dist_traveled": clean(row.loc_dist_traveled),
            "loc_num_places": clean(row.loc_num_places),
        }
        for row in rows
    ]