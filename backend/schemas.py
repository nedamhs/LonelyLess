#==================================
# Pydantic schemas
# Defines the shape of request and response data for auth endpoints
#==================================
from pydantic import BaseModel

# shape of login request (code + password)
class UserCreate(BaseModel):
    participant_code: str
    password: str

# shape of login response (JWT token)
class Token(BaseModel):
    access_token: str
    token_type: str

# whats stored inside the token (participant_code)
class TokenData(BaseModel):
    participant_code: str | None = None
