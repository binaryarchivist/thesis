from django.forms.models import model_to_dict
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.documents.models import Document


class DocumentListAPIView(APIView):
    """
    GET   List all documents for the current user.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="List Documents",
        operation_description="Return a list of documents owned by the authenticated user.",
        responses={
            200: openapi.Response(
                description="A list of documents",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            "document_id": openapi.Schema(type=openapi.TYPE_STRING),
                            "title": openapi.Schema(type=openapi.TYPE_STRING),
                            "description": openapi.Schema(type=openapi.TYPE_STRING),
                            "user_id": openapi.Schema(type=openapi.TYPE_INTEGER),
                            "status": openapi.Schema(type=openapi.TYPE_STRING),
                            "created_at": openapi.Schema(
                                type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME
                            ),
                            "created_by": openapi.Schema(type=openapi.TYPE_STRING),
                        },
                    ),
                ),
            )
        },
    )
    def get(self, request):
        docs = Document.objects.filter(user=request.user)
        data = [
            model_to_dict(
                doc,
                fields=[
                    "document_id",
                    "title",
                    "description",
                    "user_id",
                    "status",
                    "created_at",
                    "created_by",
                ],
            )
            for doc in docs
        ]
        return Response(data)
