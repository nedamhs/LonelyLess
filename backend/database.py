#======================================================================
# Database connection setup
# Connects FastAPI to PostgreSQL, 
# creates session factory for handling per-request DB connections, 
# defines the Base for all table model
# closes DB when done
#=====================================================================
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://nedamohseni@localhost/loneliness_dataset"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



# if __name__ == "__main__":
#     try:
#         with engine.connect() as connection:
#             print("✅ Database connection successful!")
#     except Exception as e:
#         print(f"❌ Connection failed: {e}")