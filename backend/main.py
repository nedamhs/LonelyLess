#============================================
# Main FastAPI app entry point
# creates DB tables and Registers all routers 
#============================================
from fastapi import FastAPI
from database import engine
import models

from routes.auth import router as auth_router
from routes.ema import router as ema_router
from routes.aware import router as aware_router
from routes.oura import router as oura_router
from routes.hrv import router as hrv_router

from fastapi.middleware.cors import CORSMiddleware


# creates all tables in Postgres from models, if they dont exist
models.Base.metadata.create_all(bind=engine)

# start fast api 
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Plugs the  routes into the app.
app.include_router(auth_router)
app.include_router(ema_router)
app.include_router(aware_router)
app.include_router(oura_router)
app.include_router(hrv_router)

@app.get("/")
def root():
    return {"message": "MAIN - LonelyLess API is running"}