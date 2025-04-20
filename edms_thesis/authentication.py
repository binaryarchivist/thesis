from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication


class PublicAPIView(APIView):
    permission_classes = [AllowAny]  # e.g. registration
    authentication_classes = []  # skip JWT check entirely


class ProtectedAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
