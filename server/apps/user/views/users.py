from django.contrib.auth import get_user_model
# from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

# from rest_framework.decorators import action


User = get_user_model()


class UserViewSet(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Get user List",
        operation_description="Return a list of users except the authenticated user.",
    )
    def get(self, request):
        users = User.objects.exclude(email=request.user)
        data = []
        for user in users:
            data.append(
                {
                    "user_id": user.user_id,
                    "email": user.email,
                }
            )
        return Response(data)
