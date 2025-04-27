from apps.user.views.users import UserViewSet
from django.urls import path

app_name = "users"

urlpatterns = [
    path("", UserViewSet.as_view(), name="user-list"),
]
