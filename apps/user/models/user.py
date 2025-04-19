from django.db import models
from apps.core.models.base import BaseModel

class User(BaseModel):
    user_id = models.UUIDField(unique=True, primary_key=True)
    password_hash = models.CharField()
    email = models.EmailField(unique=True)
    role = models.CharField()
    
    class Meta:
        db_table = 'users'
    