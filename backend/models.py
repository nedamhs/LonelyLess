#==================================
# Database models (tables)
#==================================
# to update db : 
# cd ..../backend
# source venv/bin/activate
# uvicorn main:app --reload --port 8000
#==================================

from sqlalchemy import Column, String, Boolean, Integer, Float, Date, BigInteger, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    participant_code = Column(String, unique=True, nullable=False)  # e.g. "pers2001"
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)                       # remove later 
    # later add the control and savor flag 


class EmaDaily(Base):
    __tablename__ = "ema_daily"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)  # same as participant code 
    date = Column(Date, nullable=False)
    timestamp = Column(BigInteger)
    surveyindex = Column(Integer)

    # PANAS items (daily) 
    panas_active = Column(Float)
    panas_afraid = Column(Float)
    panas_ashamed = Column(Float)
    panas_attentive = Column(Float)
    panas_determined = Column(Float)
    panas_distressed = Column(Float)
    panas_enthusiastic = Column(Float)
    panas_excited = Column(Float)
    panas_guilty = Column(Float)
    panas_inspired = Column(Float)
    panas_irritable = Column(Float)
    panas_jittery = Column(Float)
    panas_nervous = Column(Float)
    panas_proud = Column(Float)
    panas_sad = Column(Float)
    panas_scared = Column(Float)
    panas_strong = Column(Float)
    panas_upset = Column(Float)

    # affect
    affect_positive = Column(Float)
    affect_negative = Column(Float)

    # UCLA Loneliness / connection
    feel_connected = Column(Float)
    feel_isolated = Column(Float)
    feel_lonely = Column(Float)

    # Social interactions
    number_social_interactions = Column(Float)
    pleasant_social_interactions = Column(Float)

    # Sleep self-report scores.
    rested_score = Column(Float)
    quality_score = Column(Float)


    # not storing : 'sleep_time', 'wake_time', 'who_interaction'
    # TODO: add who interaction later. 


class EmaWeekly(Base):
    __tablename__ = "ema_weekly"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    timestamp = Column(BigInteger)

    # PANAS items (past week)
    panas_active = Column(Float)
    panas_afraid = Column(Float)
    panas_ashamed = Column(Float)
    panas_attentive = Column(Float)
    panas_determined = Column(Float)
    panas_distressed = Column(Float)
    panas_enthusiastic = Column(Float)
    panas_excited = Column(Float)
    panas_guilty = Column(Float)
    panas_inspired = Column(Float)
    panas_irritable = Column(Float)
    panas_jittery = Column(Float)
    panas_nervous = Column(Float)
    panas_proud = Column(Float)
    panas_sad = Column(Float)
    panas_scared = Column(Float)
    panas_strong = Column(Float)
    panas_upset = Column(Float)

    # PHQ-9 items (encoded: 0-3)
    # 0- Not at all
    # 1- Several days
    # 2- More than half the days
    # 3- Nearly Every Day
    phq9_1 = Column(Integer)
    phq9_2 = Column(Integer)
    phq9_3 = Column(Integer)
    phq9_4 = Column(Integer)
    phq9_5 = Column(Integer)
    phq9_6 = Column(Integer)
    phq9_7 = Column(Integer)
    phq9_8 = Column(Integer)
    phq9_9 = Column(Integer)

    # PSS-4 items (encoded: 0-4)
    # 0 - Never
    # 1 - Almost Never
    # 2 - Sometimes
    # 3 - Fairly Often
    # 4 - Very Often
    pss4_1 = Column(Integer)
    pss4_2 = Column(Integer)
    pss4_3 = Column(Integer)
    pss4_4 = Column(Integer)

    # Overall week
    week_felt = Column(Float)
    week_points = Column(String)  # free text


class AwareFeatures(Base):
    __tablename__ = "aware_features"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    timestamp = Column(BigInteger)

    # Call features
    call_dur_incoming = Column(Float)
    call_dur_outgoing = Column(Float)
    call_count_incoming = Column(Float)
    call_count_outgoing = Column(Float)
    call_count_missed = Column(Float)

    # Notification features
    notif_shopping = Column(Float)
    notif_entertainment = Column(Float)
    notif_tools = Column(Float)
    notif_travel_local = Column(Float)
    notif_unknown = Column(Float)
    notif_lifestyle = Column(Float)
    notif_social = Column(Float)
    notif_auto_vehicles = Column(Float)
    notif_education = Column(Float)
    notif_business = Column(Float)
    notif_finance = Column(Float)
    notif_health_fitness = Column(Float)
    notif_music_audio = Column(Float)
    notif_productivity = Column(Float)
    notif_books_reference = Column(Float)
    notif_photography = Column(Float)
    notif_video_players_editors = Column(Float)
    notif_communication = Column(Float)

    # Message features
    mess_received = Column(Float)
    mess_sent = Column(Float)

    # Battery features
    batt_mean_start = Column(Float)
    batt_count_start = Column(Float)

    # Touch features
    touch_clicked = Column(Float)
    touch_long_clicked = Column(Float)
    touch_scrolled_up = Column(Float)
    touch_scrolled_down = Column(Float)

    # Screen features
    screen_off = Column(Float)
    screen_on = Column(Float)
    screen_locked = Column(Float)
    screen_unlocked = Column(Float)

    # Usage features
    usage_total_on = Column(Float)
    usage_total_off = Column(Float)
    usage_num_on = Column(Float)
    usage_num_off = Column(Float)

    # Location features
    loc_std_lat = Column(Float)
    loc_std_lon = Column(Float)
    loc_std_speed = Column(Float)
    loc_mean_speed = Column(Float)
    loc_home_dur = Column(Float)
    loc_out_dur = Column(Float)
    loc_mean_out_dur = Column(Float)
    loc_std_out_dur = Column(Float)
    # loc_been_out = Column(Integer)
    loc_been_out = Column(Float)       # this is boolean
    loc_dist_traveled = Column(Float)
    loc_num_places = Column(Float)


class OuraActivity(Base):
    __tablename__ = "oura_activity"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    timestamp = Column(BigInteger)
    date = Column(Date)

    activity_non_wear = Column(Float)
    activity_rest = Column(Float)
    activity_inactive = Column(Float)
    activity_low = Column(Float)
    activity_medium = Column(Float)
    activity_high = Column(Float)
    activity_total = Column(Float)
    activity_met_min_inactive = Column(Float)
    activity_met_min_low = Column(Float)
    activity_met_min_medium = Column(Float)
    activity_met_min_high = Column(Float)
    activity_average_met = Column(Float)
    activity_cal_active = Column(Float)
    activity_cal_total = Column(Float)
    activity_daily_movement = Column(Float)
    activity_inactivity_alerts = Column(Float)
    activity_score = Column(Float)
    activity_score_meet_daily_targets = Column(Float)
    activity_score_move_every_hour = Column(Float)
    activity_score_recovery_time = Column(Float)
    activity_score_stay_active = Column(Float)
    activity_score_training_frequency = Column(Float)
    activity_score_training_volume = Column(Float)
    activity_steps = Column(Float)
    activity_target_calories = Column(Float)
    activity_target_km = Column(Float)
    activity_target_miles = Column(Float)
    activity_to_target_km = Column(Float)
    activity_to_target_miles = Column(Float)

    # not storing: 
    # activity_day_end
    # activity_day_start


class OuraReadiness(Base):
    __tablename__ = "oura_readiness"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    timestamp = Column(BigInteger)
    date = Column(Date)

    readiness_score = Column(Float)
    readiness_score_activity_balance = Column(Float)
    readiness_score_hrv_balance = Column(Float)
    readiness_score_previous_day = Column(Float)
    readiness_score_previous_night = Column(Float)
    readiness_score_recovery_index = Column(Float)
    readiness_score_resting_hr = Column(Float)
    readiness_score_sleep_balance = Column(Float)
    readiness_score_temperature = Column(Float)

    # not storing : 
    # ideal bedtime start & end times


class OuraSleep(Base):
    __tablename__ = "oura_sleep"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    timestamp = Column(BigInteger)
    date = Column(Date)

    sleep_duration = Column(Float)
    sleep_awake = Column(Float)
    sleep_light = Column(Float)
    sleep_rem = Column(Float)
    sleep_deep = Column(Float)
    sleep_total = Column(Float)
    sleep_breath_average = Column(Float)
    sleep_efficiency = Column(Float)
    sleep_hr_average = Column(Float)
    sleep_hr_lowest = Column(Float)
    sleep_is_longest = Column(Float)
    sleep_onset_latency = Column(Float)
    sleep_restless = Column(Float)
    sleep_rmssd = Column(Float)
    sleep_score = Column(Float)
    sleep_score_alignment = Column(Float)
    sleep_score_deep = Column(Float)
    sleep_score_disturbances = Column(Float)
    sleep_score_efficiency = Column(Float)
    sleep_score_latency = Column(Float)
    sleep_score_rem = Column(Float)
    sleep_score_total = Column(Float)
    sleep_temperature_delta = Column(Float)
    sleep_temperature_deviation = Column(Float)
    sleep_temperature_trend_deviation = Column(Float)

    sleep_bedtime_start = Column(BigInteger)  # not needed for dashboard
    sleep_bedtime_end = Column(BigInteger)    # not needed for dashboard

    sleep_midpoint_time = Column(Float)
    sleep_bedtime_start_delta = Column(Float)
    sleep_bedtime_end_delta = Column(Float)
    sleep_midpoint_at_delta = Column(Float)


class HRV_12min(Base):
    __tablename__ = "hrv_12min"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    timestamp = Column(BigInteger)

    HRV_MeanNN = Column(Float)
    HRV_SDNN = Column(Float)
    HRV_SDANN1 = Column(Float)
    HRV_SDNNI1 = Column(Float)
    HRV_SDANN2 = Column(Float)
    HRV_SDNNI2 = Column(Float)
    HRV_RMSSD = Column(Float)
    HRV_SDSD = Column(Float)
    HRV_CVNN = Column(Float)
    HRV_CVSD = Column(Float)
    HRV_MedianNN = Column(Float)
    HRV_MadNN = Column(Float)
    HRV_MCVNN = Column(Float)
    HRV_IQRNN = Column(Float)
    HRV_pNN50 = Column(Float)
    HRV_pNN20 = Column(Float)
    HRV_HTI = Column(Float)
    HRV_TINN = Column(Float)
    HRV_LF = Column(Float)
    HRV_HF = Column(Float)
    HRV_VHF = Column(Float)
    HRV_LFHF = Column(Float)
    HRV_LFn = Column(Float)
    HRV_HFn = Column(Float)
    HRV_LnHF = Column(Float)
    HRV_SD1 = Column(Float)
    HRV_SD2 = Column(Float)
    HRV_SD1SD2 = Column(Float)
    HRV_S = Column(Float)
    HR = Column(Float)

class HRV_5min(Base):
    __tablename__ = "hrv_5min"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    timestamp = Column(BigInteger)

    HRV_MeanNN = Column(Float)
    HRV_SDNN = Column(Float)
    HRV_SDANN1 = Column(Float)
    HRV_SDNNI1 = Column(Float)
    HRV_SDANN2 = Column(Float)
    HRV_SDNNI2 = Column(Float)
    HRV_RMSSD = Column(Float)
    HRV_SDSD = Column(Float)
    HRV_CVNN = Column(Float)
    HRV_CVSD = Column(Float)
    HRV_MedianNN = Column(Float)
    HRV_MadNN = Column(Float)
    HRV_MCVNN = Column(Float)
    HRV_IQRNN = Column(Float)
    HRV_pNN50 = Column(Float)
    HRV_pNN20 = Column(Float)
    HRV_HTI = Column(Float)
    HRV_TINN = Column(Float)
    HRV_LF = Column(Float)
    HRV_HF = Column(Float)
    HRV_VHF = Column(Float)
    HRV_LFHF = Column(Float)
    HRV_LFn = Column(Float)
    HRV_HFn = Column(Float)
    HRV_LnHF = Column(Float)
    HRV_SD1 = Column(Float)
    HRV_SD2 = Column(Float)
    HRV_SD1SD2 = Column(Float)
    HRV_S = Column(Float)
    HR = Column(Float)

