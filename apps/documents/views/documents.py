from django.forms.models import model_to_dict
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.documents.models import Document, DocumentVersion
from apps.user.models.user import User


class DocumentListCreateAPIView(APIView):
    """
    GET   List all documents for the current user.
    POST  Upload a new document and its first version.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

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

    @swagger_auto_schema(
        operation_summary="Create Document",
        operation_description=(
            "Upload a new document (with title & optional description) "
            "and create its initial version in a single call."
        ),
        manual_parameters=[
            openapi.Parameter(
                "title",
                in_=openapi.IN_FORM,
                type=openapi.TYPE_STRING,
                description="Document title",
                required=True,
            ),
            openapi.Parameter(
                "description",
                in_=openapi.IN_FORM,
                type=openapi.TYPE_STRING,
                description="Optional description",
                required=False,
            ),
            openapi.Parameter(
                "file",
                in_=openapi.IN_FORM,
                type=openapi.TYPE_FILE,
                description="File to upload",
                required=True,
            ),
        ],
        responses={
            201: openapi.Response(
                description="Document created successfully",
                schema=openapi.Schema(
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
                    },
                ),
            ),
            400: "Bad Request (missing title or file)",
        },
    )
    def post(self, request):
        payload = request.data
        title = payload.get("title")
        description = payload.get("description", "")
        upload = request.FILES.get("file")

        if not upload:
            return Response(
                {"error": "File is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        if not title:
            return Response(
                {"error": "Title is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        request_user = User.objects.get(email=request.user)
        if request_user is None:
            return Response(
                {"error": "User not found."}, status=status.HTTP_400_BAD_REQUEST
            )

        # Create the Document
        doc = Document.objects.create(
            title=title,
            description=description,
            created_by=request_user,
        )
        # Create the first version
        ver = DocumentVersion(
            document=doc, file=upload, created_by=request_user
        )
        ver.save()

        # TODO: integrate with workflow
        out = model_to_dict(
            doc,
            fields=[
                "document_id",
                "title",
                "description",
                "user_id",
                "status",
                "created_at",
            ],
        )
        return Response(out, status=status.HTTP_201_CREATED)
