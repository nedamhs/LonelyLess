#====================================================
# Auth routes
# Handles /login endpoint 
# checks credentials and returns a JWT token if valid
#====================================================
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserCreate, Token
from auth import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=Token)
def login(user: UserCreate, db: Session = Depends(get_db)):
    """
    Authenticates a participant by participant code and password.
    Returns a JWT access token if credentials are valid.
    """
    db_user = db.query(User).filter(User.participant_code == user.participant_code).first()  #query for the user by their id 

    if not db_user or not verify_password(user.password, db_user.hashed_password):   #if doesnt exist or ps not correct 
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(data={"sub": db_user.participant_code})            #create access token
    return {"access_token": token, "token_type": "bearer"}                         #return access token 


    