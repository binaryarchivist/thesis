from apps.user.views.users import UserViewSet
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views.auth import AuthViewSet, CustomTokenObtainPairView

app_name = "auth"

router = DefaultRouter()
router.register(r"", AuthViewSet, basename="auth")

urlpatterns = [
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    # path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("users/", UserViewSet.as_view(), name="user-list", basename="lookup/"),
    path("", include(router.urls)),
]
