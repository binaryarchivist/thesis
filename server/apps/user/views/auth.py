from django.contrib.auth import get_user_model
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class AuthViewSet(viewsets.ViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]

    register_request = openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=["email", "password"],
        properties={
            "email": openapi.Schema(
                type=openapi.TYPE_STRING, format=openapi.FORMAT_EMAIL
            ),
            "password": openapi.Schema(
                type=openapi.TYPE_STRING, format=openapi.FORMAT_PASSWORD
            ),
        },
    )
    register_responses = {
        201: openapi.Response(
            "User + JWT",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "refresh": openapi.Schema(type=openapi.TYPE_STRING),
                    "access": openapi.Schema(type=openapi.TYPE_STRING),
                },
            ),
        ),
        400: openapi.Response(
            "Bad request",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={"error": openapi.Schema(type=openapi.TYPE_STRING)},
            ),
        ),
    }

    @swagger_auto_schema(
        operation_description="Register and return JWT tokens",
        request_body=register_request,
        responses=register_responses,
    )
    @action(detail=False, methods=["post"])
    def register(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        if not email or not password:
            return Response({"error": "email+password required"}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({"error": "User exists"}, status=400)

        user = User.objects.create_user(email=email, password=password)
        refresh = RefreshToken.for_user(user)
        return Response(
            {"refresh": str(refresh), "access": str(refresh.access_token)}, status=201
        )
