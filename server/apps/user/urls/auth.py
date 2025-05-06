from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from ..views.auth import AuthViewSet, MyTokenObtainPairView

app_name = "auth"

router = DefaultRouter()
router.register(r"", AuthViewSet, basename="auth")

urlpatterns = [
    path("", include(router.urls)),
    path("login/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
