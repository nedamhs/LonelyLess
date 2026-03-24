#==================================
# Database initialization script
# 
# to run : 
# python init_db.py --flag here
#==================================
import argparse
import os
import pandas as pd
from database import SessionLocal
from auth import hash_password
from sqlalchemy import text

from models import User
from models import EmaDaily, EmaWeekly
from models import AwareFeatures
from models import OuraActivity, OuraReadiness, OuraSleep
from models import HRV_12min, HRV_5min

# local path to the dataset folder.
DATASET_PATH = "/Users/nedamohseni/Desktop/LONELINESS-DATASET"

def init_users():
    db = SessionLocal()
    try:
        participant_codes = [f for f in os.listdir(DATASET_PATH) if os.path.isdir(os.path.join(DATASET_PATH, f))]

        for code in sorted(participant_codes):
            existing = db.query(User).filter(User.participant_code == code).first()
            if existing:
                print(f"⚠️  {code} already exists, skipping")
                continue
            user = User(participant_code=code,
                        hashed_password=hash_password("1234"))               # everyone has same password
            db.add(user)
            print(f"✅ Created {code}")
        db.commit()
        print("\nDone initializing users!")
    finally:
        db.close()


def load_daily_ema():
    """Load and store daily EMA survey data for each user, skipping missing or already loaded files."""
    db = SessionLocal()
    try:
        participants = db.query(User).all()
        for user in participants:
            path = f"{DATASET_PATH}/{user.participant_code}/Ema/daily.csv"
            if not os.path.exists(path):   # skip if missing 
                print(f"⚠️  No EMA daily file for {user.participant_code}, skipping")
                continue

            existing = db.query(EmaDaily).filter(EmaDaily.user_id == user.id).first()
            if existing:    # skip if already loaded
                print(f"⏭️  EMA already loaded for {user.participant_code}, skipping")
                continue

            df = pd.read_csv(path)
            df = df.drop(columns=['sleep_time', 'wake_time', 'who_interaction'], errors='ignore')     #drop these cols. #TODO: add who interaction to db later for llm stuff. 
            count = 0
            for _, row in df.iterrows():
                record = EmaDaily(
                    user_id=user.id,
                    date=row.get('date'),
                    timestamp=row.get('timestamp'),
                    surveyindex=row.get('surveyindex'),
                    panas_active=row.get('PANAS_active'),
                    panas_afraid=row.get('PANAS_afraid'),
                    panas_ashamed=row.get('PANAS_ashamed'),
                    panas_attentive=row.get('PANAS_attentive'),
                    panas_determined=row.get('PANAS_determined'),
                    panas_distressed=row.get('PANAS_distressed'),
                    panas_enthusiastic=row.get('PANAS_enthusiastic'),
                    panas_excited=row.get('PANAS_excited'),
                    panas_guilty=row.get('PANAS_guilty'),
                    panas_inspired=row.get('PANAS_inspired'),
                    panas_irritable=row.get('PANAS_irritable'),
                    panas_jittery=row.get('PANAS_jittery'),
                    panas_nervous=row.get('PANAS_nervous'),
                    panas_proud=row.get('PANAS_proud'),
                    panas_sad=row.get('PANAS_sad'),
                    panas_scared=row.get('PANAS_scared'),
                    panas_strong=row.get('PANAS_strong'),
                    panas_upset=row.get('PANAS_upset'),
                    affect_positive=row.get('affect_positive'),
                    affect_negative=row.get('affect_negative'),
                    feel_connected=row.get('feel_connected'),
                    feel_isolated=row.get('feel_isolated'),
                    feel_lonely=row.get('feel_lonely'),
                    number_social_interactions=row.get('number_social_interactions'),
                    pleasant_social_interactions=row.get('pleasant_social_interactions'),
                    rested_score=row.get('rested_score'),
                    quality_score=row.get('quality_score'),
                )
                db.add(record)
                count += 1
            db.commit()
            print(f"✅ Loaded {count} EMA daily rows for {user.participant_code}")
    finally:
        db.close()


def load_weekly_ema():
    """Load and store weekly EMA survey data for each user, skipping missing or already loaded files."""
    
    phq9_map = {
        'Not at all': 0,
        'Several days': 1,
        'More than half the days': 2,
        'Nearly Every Day': 3
    }
    
    pss4_map = {
        'Never': 0,
        'Almost Never': 1,
        'Sometimes': 2,
        'Fairly Often': 3,
        'Very Often': 4
    }

    db = SessionLocal()
    try:
        participants = db.query(User).all()
        for user in participants:
            path = f"{DATASET_PATH}/{user.participant_code}/Ema/weekly.csv"
            if not os.path.exists(path):       # skip if missing
                print(f"⚠️  No EMA weekly file for {user.participant_code}, skipping")
                continue

            existing = db.query(EmaWeekly).filter(EmaWeekly.user_id == user.id).first()
            if existing:        # skip if already loaded
                print(f"⏭️  EMA weekly already loaded for {user.participant_code}, skipping")
                continue

            df = pd.read_csv(path)
            count = 0
            records = []
            for _, row in df.iterrows():
                records.append(EmaWeekly(
                    user_id=user.id,
                    date=row.get('date'),
                    timestamp=row.get('timestamp'),
                    panas_active=row.get('PANAS_active'),
                    panas_afraid=row.get('PANAS_afraid'),
                    panas_ashamed=row.get('PANAS_ashamed'),
                    panas_attentive=row.get('PANAS_attentive'),
                    panas_determined=row.get('PANAS_determined'),
                    panas_distressed=row.get('PANAS_distressed'),
                    panas_enthusiastic=row.get('PANAS_enthusiastic'),
                    panas_excited=row.get('PANAS_excited'),
                    panas_guilty=row.get('PANAS_guilty'),
                    panas_inspired=row.get('PANAS_inspired'),
                    panas_irritable=row.get('PANAS_irritable'),
                    panas_jittery=row.get('PANAS_jittery'),
                    panas_nervous=row.get('PANAS_nervous'),
                    panas_proud=row.get('PANAS_proud'),
                    panas_sad=row.get('PANAS_sad'),
                    panas_scared=row.get('PANAS_scared'),
                    panas_strong=row.get('PANAS_strong'),
                    panas_upset=row.get('PANAS_upset'),
                    phq9_1=phq9_map.get(row.get('PHQ9_1')),
                    phq9_2=phq9_map.get(row.get('PHQ9_2')),
                    phq9_3=phq9_map.get(row.get('PHQ9_3')),
                    phq9_4=phq9_map.get(row.get('PHQ9_4')),
                    phq9_5=phq9_map.get(row.get('PHQ9_5')),
                    phq9_6=phq9_map.get(row.get('PHQ9_6')),
                    phq9_7=phq9_map.get(row.get('PHQ9_7')),
                    phq9_8=phq9_map.get(row.get('PHQ9_8')),
                    phq9_9=phq9_map.get(row.get('PHQ9_9')),
                    pss4_1=pss4_map.get(row.get('PSS4_1')),
                    pss4_2=pss4_map.get(row.get('PSS4_2')),
                    pss4_3=pss4_map.get(row.get('PSS4_3')),
                    pss4_4=pss4_map.get(row.get('PSS4_4')),
                    week_felt=row.get('week_felt'),
                    week_points=row.get('week_points') if pd.notna(row.get('week_points')) else None,
                ))
            db.bulk_save_objects(records)
            db.commit()
            print(f"✅ Loaded {len(records)} EMA weekly rows for {user.participant_code}")
    finally:
        db.close()

def load_aware():
    """Load and store AWARE extracted features for each user."""
    db = SessionLocal()
    try:
        participants = db.query(User).all()
        for user in participants:
            path = f"{DATASET_PATH}/{user.participant_code}/AWARE/extracted_features.csv"
            if not os.path.exists(path):
                print(f"⚠️  No AWARE file for {user.participant_code}, skipping")
                continue

            existing = db.query(AwareFeatures).filter(AwareFeatures.user_id == user.id).first()
            if existing:
                print(f"⏭️  AWARE already loaded for {user.participant_code}, skipping")
                continue

            df = pd.read_csv(path)
            records = []
            for _, row in df.iterrows():
                records.append(AwareFeatures(
                    user_id=user.id,
                    timestamp=row.get('timestamp'),
                    call_dur_incoming=row.get('call_dur_incoming'),
                    call_dur_outgoing=row.get('call_dur_outgoing'),
                    call_count_incoming=row.get('call_count_incoming'),
                    call_count_outgoing=row.get('call_count_outgoing'),
                    call_count_missed=row.get('call_count_missed'),
                    notif_shopping=row.get('notif_Shopping'),
                    notif_entertainment=row.get('notif_Entertainment'),
                    notif_tools=row.get('notif_Tools'),
                    notif_travel_local=row.get('notif_Travel & Local'),
                    notif_unknown=row.get('notif_unknown'),
                    notif_lifestyle=row.get('notif_Lifestyle'),
                    notif_social=row.get('notif_Social'),
                    notif_auto_vehicles=row.get('notif_Auto & Vehicles'),
                    notif_education=row.get('notif_Education'),
                    notif_business=row.get('notif_Business'),
                    notif_finance=row.get('notif_Finance'),
                    notif_health_fitness=row.get('notif_Health & Fitness'),
                    notif_music_audio=row.get('notif_Music & Audio'),
                    notif_productivity=row.get('notif_Productivity'),
                    notif_books_reference=row.get('notif_Books & Reference'),
                    notif_photography=row.get('notif_Photography'),
                    notif_video_players_editors=row.get('notif_Video Players & Editors'),
                    notif_communication=row.get('notif_Communication'),
                    mess_received=row.get('mess_received'),
                    mess_sent=row.get('mess_sent'),
                    batt_mean_start=row.get('batt_mean_start'),
                    batt_count_start=row.get('batt_count_start'),
                    touch_clicked=row.get('touch_clicked'),
                    touch_long_clicked=row.get('touch_long_clicked'),
                    touch_scrolled_up=row.get('touch_scrolled_up'),
                    touch_scrolled_down=row.get('touch_scrolled_down'),
                    screen_off=row.get('screen_off'),
                    screen_on=row.get('screen_on'),
                    screen_locked=row.get('screen_locked'),
                    screen_unlocked=row.get('screen_unlocked'),
                    usage_total_on=row.get('usage_total_on'),
                    usage_total_off=row.get('usage_total_off'),
                    usage_num_on=row.get('usage_num_on'),
                    usage_num_off=row.get('usage_num_off'),
                    loc_std_lat=row.get('loc_std_lat'),
                    loc_std_lon=row.get('loc_std_lon'),
                    loc_std_speed=row.get('loc_std_speed'),
                    loc_mean_speed=row.get('loc_mean_speed'),
                    loc_home_dur=row.get('loc_home_dur'),
                    loc_out_dur=row.get('loc_out_dur'),
                    loc_mean_out_dur=row.get('loc_mean_out_dur'),
                    loc_std_out_dur=row.get('loc_std_out_dur'),
                    loc_been_out=row.get('loc_been_out'),
                    loc_dist_traveled=row.get('loc_dist_traveled'),
                    loc_num_places=row.get('loc_num_places'),
                ))
            db.bulk_save_objects(records)
            db.commit()
            print(f"✅ Loaded {len(records)} AWARE rows for {user.participant_code}")
    finally:
        db.close()

def load_oura_activity():
    """Load and store Oura daily activity data for each user."""
    db = SessionLocal()
    try:
        participants = db.query(User).all()
        for user in participants:
            path = f"{DATASET_PATH}/{user.participant_code}/Oura/activity_daily.csv"
            if not os.path.exists(path):
                print(f"⚠️  No Oura activity file for {user.participant_code}, skipping")
                continue

            existing = db.query(OuraActivity).filter(OuraActivity.user_id == user.id).first()
            if existing:
                print(f"⏭️  Oura activity already loaded for {user.participant_code}, skipping")
                continue

            df = pd.read_csv(path)
            records = []
            for _, row in df.iterrows():
                records.append(OuraActivity(
                    user_id=user.id,
                    timestamp=row.get('timestamp'),
                    date=row.get('date'),
                    activity_non_wear=row.get('activity_non_wear'),
                    activity_rest=row.get('activity_rest'),
                    activity_inactive=row.get('activity_inactive'),
                    activity_low=row.get('activity_low'),
                    activity_medium=row.get('activity_medium'),
                    activity_high=row.get('activity_high'),
                    activity_total=row.get('activity_total'),
                    activity_met_min_inactive=row.get('activity_met_min_inactive'),
                    activity_met_min_low=row.get('activity_met_min_low'),
                    activity_met_min_medium=row.get('activity_met_min_medium'),
                    activity_met_min_high=row.get('activity_met_min_high'),
                    activity_average_met=row.get('activity_average_met'),
                    activity_cal_active=row.get('activity_cal_active'),
                    activity_cal_total=row.get('activity_cal_total'),
                    activity_daily_movement=row.get('activity_daily_movement'),
                    activity_inactivity_alerts=row.get('activity_inactivity_alerts'),
                    activity_score=row.get('activity_score'),
                    activity_score_meet_daily_targets=row.get('activity_score_meet_daily_targets'),
                    activity_score_move_every_hour=row.get('activity_score_move_every_hour'),
                    activity_score_recovery_time=row.get('activity_score_recovery_time'),
                    activity_score_stay_active=row.get('activity_score_stay_active'),
                    activity_score_training_frequency=row.get('activity_score_training_frequency'),
                    activity_score_training_volume=row.get('activity_score_training_volume'),
                    activity_steps=row.get('activity_steps'),
                    activity_target_calories=row.get('activity_target_calories'),
                    activity_target_km=row.get('activity_target_km'),
                    activity_target_miles=row.get('activity_target_miles'),
                    activity_to_target_km=row.get('activity_to_target_km'),
                    activity_to_target_miles=row.get('activity_to_target_miles'),
                ))
            db.bulk_save_objects(records)
            db.commit()
            print(f"✅ Loaded {len(records)} Oura activity rows for {user.participant_code}")
    finally:
        db.close()


def load_oura_readiness():
    """Load and store Oura daily readiness data for each user."""
    db = SessionLocal()
    try:
        participants = db.query(User).all()
        for user in participants:
            path = f"{DATASET_PATH}/{user.participant_code}/Oura/readiness_daily.csv"
            if not os.path.exists(path):
                print(f"⚠️  No Oura readiness file for {user.participant_code}, skipping")
                continue

            existing = db.query(OuraReadiness).filter(OuraReadiness.user_id == user.id).first()
            if existing:
                print(f"⏭️  Oura readiness already loaded for {user.participant_code}, skipping")
                continue

            df = pd.read_csv(path)
            records = []
            for _, row in df.iterrows():
                records.append(OuraReadiness(
                    user_id=user.id,
                    timestamp=row.get('timestamp'),
                    date=row.get('date'),
                    readiness_score=row.get('readiness_score'),
                    readiness_score_activity_balance=row.get('readiness_score_activity_balance'),
                    readiness_score_hrv_balance=row.get('readiness_score_hrv_balance'),
                    readiness_score_previous_day=row.get('readiness_score_previous_day'),
                    readiness_score_previous_night=row.get('readiness_score_previous_night'),
                    readiness_score_recovery_index=row.get('readiness_score_recovery_index'),
                    readiness_score_resting_hr=row.get('readiness_score_resting_hr'),
                    readiness_score_sleep_balance=row.get('readiness_score_sleep_balance'),
                    readiness_score_temperature=row.get('readiness_score_temperature'),
                ))
            db.bulk_save_objects(records)
            db.commit()
            print(f"✅ Loaded {len(records)} Oura readiness rows for {user.participant_code}")
    finally:
        db.close()


def load_oura_sleep():
    """Load and store Oura daily sleep data for each user."""
    db = SessionLocal()
    try:
        participants = db.query(User).all()
        for user in participants:
            path = f"{DATASET_PATH}/{user.participant_code}/Oura/sleep_daily.csv"
            if not os.path.exists(path):
                print(f"⚠️  No Oura sleep file for {user.participant_code}, skipping")
                continue

            existing = db.query(OuraSleep).filter(OuraSleep.user_id == user.id).first()
            if existing:
                print(f"⏭️  Oura sleep already loaded for {user.participant_code}, skipping")
                continue

            df = pd.read_csv(path)
            records = []
            for _, row in df.iterrows():
                records.append(OuraSleep(
                    user_id=user.id,
                    timestamp=row.get('timestamp'),
                    date=row.get('date'),
                    sleep_duration=row.get('sleep_duration'),
                    sleep_awake=row.get('sleep_awake'),
                    sleep_light=row.get('sleep_light'),
                    sleep_rem=row.get('sleep_rem'),
                    sleep_deep=row.get('sleep_deep'),
                    sleep_total=row.get('sleep_total'),
                    sleep_breath_average=row.get('sleep_breath_average'),
                    sleep_efficiency=row.get('sleep_efficiency'),
                    sleep_hr_average=row.get('sleep_hr_average'),
                    sleep_hr_lowest=row.get('sleep_hr_lowest'),
                    sleep_is_longest=row.get('sleep_is_longest'),
                    sleep_onset_latency=row.get('sleep_onset_latency'),
                    sleep_restless=row.get('sleep_restless'),
                    sleep_rmssd=row.get('sleep_rmssd'),
                    sleep_score=row.get('sleep_score'),
                    sleep_score_alignment=row.get('sleep_score_alignment'),
                    sleep_score_deep=row.get('sleep_score_deep'),
                    sleep_score_disturbances=row.get('sleep_score_disturbances'),
                    sleep_score_efficiency=row.get('sleep_score_efficiency'),
                    sleep_score_latency=row.get('sleep_score_latency'),
                    sleep_score_rem=row.get('sleep_score_rem'),
                    sleep_score_total=row.get('sleep_score_total'),
                    sleep_temperature_delta=row.get('sleep_temperature_delta'),
                    sleep_temperature_deviation=row.get('sleep_temperature_deviation'),
                    sleep_temperature_trend_deviation=row.get('sleep_temperature_trend_deviation'),
                    sleep_bedtime_start=row.get('sleep_bedtime_start'),
                    sleep_bedtime_end=row.get('sleep_bedtime_end'),
                    sleep_midpoint_time=row.get('sleep_midpoint_time'),
                    sleep_bedtime_start_delta=row.get('sleep_bedtime_start_delta'),
                    sleep_bedtime_end_delta=row.get('sleep_bedtime_end_delta'),
                    sleep_midpoint_at_delta=row.get('sleep_midpoint_at_delta'),
                ))
            db.bulk_save_objects(records)
            db.commit()
            print(f"✅ Loaded {len(records)} Oura sleep rows for {user.participant_code}")
    finally:
        db.close()


def load_hrv_12min():
    """Load and store 12-minute HRV data for each user."""
    db = SessionLocal()
    try:
        participants = db.query(User).all()
        for user in participants:
            path = f"{DATASET_PATH}/{user.participant_code}/Samsung/hrv_12min.csv"
            if not os.path.exists(path):
                print(f"⚠️  No HRV 12min file for {user.participant_code}, skipping")
                continue

            existing = db.query(HRV_12min).filter(HRV_12min.user_id == user.id).first()
            if existing:
                print(f"⏭️  HRV 12min already loaded for {user.participant_code}, skipping")
                continue

            df = pd.read_csv(path)
            records = []
            for _, row in df.iterrows():
                records.append(HRV_12min(
                    user_id=user.id,
                    timestamp=row.get('timestamp'),
                    HRV_MeanNN=row.get('HRV_MeanNN'),
                    HRV_SDNN=row.get('HRV_SDNN'),
                    HRV_SDANN1=row.get('HRV_SDANN1'),
                    HRV_SDNNI1=row.get('HRV_SDNNI1'),
                    HRV_SDANN2=row.get('HRV_SDANN2'),
                    HRV_SDNNI2=row.get('HRV_SDNNI2'),
                    HRV_RMSSD=row.get('HRV_RMSSD'),
                    HRV_SDSD=row.get('HRV_SDSD'),
                    HRV_CVNN=row.get('HRV_CVNN'),
                    HRV_CVSD=row.get('HRV_CVSD'),
                    HRV_MedianNN=row.get('HRV_MedianNN'),
                    HRV_MadNN=row.get('HRV_MadNN'),
                    HRV_MCVNN=row.get('HRV_MCVNN'),
                    HRV_IQRNN=row.get('HRV_IQRNN'),
                    HRV_pNN50=row.get('HRV_pNN50'),
                    HRV_pNN20=row.get('HRV_pNN20'),
                    HRV_HTI=row.get('HRV_HTI'),
                    HRV_TINN=row.get('HRV_TINN'),
                    HRV_LF=row.get('HRV_LF'),
                    HRV_HF=row.get('HRV_HF'),
                    HRV_VHF=row.get('HRV_VHF'),
                    HRV_LFHF=row.get('HRV_LFHF'),
                    HRV_LFn=row.get('HRV_LFn'),
                    HRV_HFn=row.get('HRV_HFn'),
                    HRV_LnHF=row.get('HRV_LnHF'),
                    HRV_SD1=row.get('HRV_SD1'),
                    HRV_SD2=row.get('HRV_SD2'),
                    HRV_SD1SD2=row.get('HRV_SD1SD2'),
                    HRV_S=row.get('HRV_S'),
                    HR=row.get('HR'),
                ))
            db.bulk_save_objects(records)
            db.commit()
            print(f"✅ Loaded {len(records)} HRV 12min rows for {user.participant_code}")
    finally:
        db.close()


def load_hrv_5min():
    """Load and store 5-minute HRV data for each user."""
    db = SessionLocal()
    try:
        participants = db.query(User).all()
        for user in participants:
            path = f"{DATASET_PATH}/{user.participant_code}/Samsung/hrv_5min.csv"
            if not os.path.exists(path):
                print(f"⚠️  No HRV 5min file for {user.participant_code}, skipping")
                continue

            existing = db.query(HRV_5min).filter(HRV_5min.user_id == user.id).first()
            if existing:
                print(f"⏭️  HRV 5min already loaded for {user.participant_code}, skipping")
                continue

            df = pd.read_csv(path)
            records = []
            for _, row in df.iterrows():
                records.append(HRV_5min(
                    user_id=user.id,
                    timestamp=row.get('timestamp'),
                    HRV_MeanNN=row.get('HRV_MeanNN'),
                    HRV_SDNN=row.get('HRV_SDNN'),
                    HRV_SDANN1=row.get('HRV_SDANN1'),
                    HRV_SDNNI1=row.get('HRV_SDNNI1'),
                    HRV_SDANN2=row.get('HRV_SDANN2'),
                    HRV_SDNNI2=row.get('HRV_SDNNI2'),
                    HRV_RMSSD=row.get('HRV_RMSSD'),
                    HRV_SDSD=row.get('HRV_SDSD'),
                    HRV_CVNN=row.get('HRV_CVNN'),
                    HRV_CVSD=row.get('HRV_CVSD'),
                    HRV_MedianNN=row.get('HRV_MedianNN'),
                    HRV_MadNN=row.get('HRV_MadNN'),
                    HRV_MCVNN=row.get('HRV_MCVNN'),
                    HRV_IQRNN=row.get('HRV_IQRNN'),
                    HRV_pNN50=row.get('HRV_pNN50'),
                    HRV_pNN20=row.get('HRV_pNN20'),
                    HRV_HTI=row.get('HRV_HTI'),
                    HRV_TINN=row.get('HRV_TINN'),
                    HRV_LF=row.get('HRV_LF'),
                    HRV_HF=row.get('HRV_HF'),
                    HRV_VHF=row.get('HRV_VHF'),
                    HRV_LFHF=row.get('HRV_LFHF'),
                    HRV_LFn=row.get('HRV_LFn'),
                    HRV_HFn=row.get('HRV_HFn'),
                    HRV_LnHF=row.get('HRV_LnHF'),
                    HRV_SD1=row.get('HRV_SD1'),
                    HRV_SD2=row.get('HRV_SD2'),
                    HRV_SD1SD2=row.get('HRV_SD1SD2'),
                    HRV_S=row.get('HRV_S'),
                    HR=row.get('HR'),
                ))
            db.bulk_save_objects(records)
            db.commit()
            print(f"✅ Loaded {len(records)} HRV 5min rows for {user.participant_code}")
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--init-users", action="store_true", help="Create participants from dataset folders")
    parser.add_argument("--load-ema", action="store_true", help="Load EMA daily data for all participants")
    parser.add_argument("--load-weekly-ema", action="store_true", help="Load EMA weekly data for all participants")
    parser.add_argument("--load-aware", action="store_true", help="Load AWARE extracted features for all participants")
    parser.add_argument("--load-oura-activity", action="store_true", help="Load Oura daily activity data for all participants")
    parser.add_argument("--load-oura-readiness", action="store_true", help="Load Oura daily readiness data for all participants")
    parser.add_argument("--load-oura-sleep", action="store_true", help="Load Oura daily sleep data for all participants")
    parser.add_argument("--load-hrv-12min", action="store_true", help="Load 12-minute HRV data for all participants")
    parser.add_argument("--load-hrv-5min", action="store_true", help="Load 5-minute HRV data for all participants")


    args = parser.parse_args()

    if args.init_users:
        init_users()

    if args.load_ema:
        load_daily_ema()
    if args.load_weekly_ema:
        load_weekly_ema()

    if args.load_aware:
        load_aware()

    
    if args.load_oura_activity:
        load_oura_activity()
    if args.load_oura_readiness:
        load_oura_readiness()
    if args.load_oura_sleep:
        load_oura_sleep()
    
    if args.load_hrv_12min:
        load_hrv_12min()
    if args.load_hrv_5min:
        load_hrv_5min()

    
