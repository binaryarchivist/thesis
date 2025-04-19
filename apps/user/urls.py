from .views.user import User
from django.urls import path


urlpatterns = [
    path('', User.as_view(), name='user-get'),
]
