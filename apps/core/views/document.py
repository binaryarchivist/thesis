from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication


class Document(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Get a list of documents", security=[{"Bearer": []}]
    )
    def get(self, request, format=None):
        return Response({"ok": True})
