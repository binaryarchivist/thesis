from django.forms.models import model_to_dict
from django.http import Http404
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.documents.models import Document
from apps.documents.models.document_version import DocumentVersion
from apps.user.models.user import User
from apps.workflows.models.workflows import Workflow


class DocumentDetailAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    swagger_tags = ["Documents"]

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, document_id, user_email):
        try:
            request_user = User.objects.get(email=user_email)
            if request_user is None:
                return Response(
                    {"error": "User not found."}, status=status.HTTP_400_BAD_REQUEST
                )
            return Document.objects.get(document_id=document_id, user=request_user)
        except Document.DoesNotExist:
            raise Http404

    def get(self, request, document_id):

        doc = self.get_object(document_id, request.user)
        data = model_to_dict(
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
        return Response(data)

    def put(self, request, document_id):
        doc = self.get_object(document_id, request.user)
        payload = request.data
        title = payload.get("title")
        description = payload.get("description")

        if title is None or description is None:
            return Response(
                {"error": "Both title and description are required for full update."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        doc.title = title
        doc.description = description
        doc.save()
        data = model_to_dict(
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
        return Response(data)

    def patch(self, request, document_id):
        doc = self.get_object(document_id, request.user)
        payload = request.data

        if "title" in payload:
            doc.title = payload["title"]
        if "description" in payload:
            doc.description = payload["description"]
        doc.save()

        data = model_to_dict(
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
        return Response(data)

    def delete(self, request, document_id):
        doc = self.get_object(document_id, request.user)
        doc.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

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
        assignee_id = payload.get("assignee_id")
        upload = request.FILES.get("file")

        if not upload:
            return Response(
                {"error": "File is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        if not title:
            return Response(
                {"error": "Title is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        if not assignee_id:
            return Response(
                {"error": "Assignee is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        assignee_user = User.objects.filter(user_id=assignee_id).first()
        if assignee_user is None:
            return Response(
                {"error": "User not found."}, status=status.HTTP_400_BAD_REQUEST
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
        ver = DocumentVersion(document=doc, file=upload, created_by=request_user)
        ver.save()

        Workflow.objects.create(
            document_id=doc.document_id,
            assignee_id=assignee_user.user_id,
        )

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
