from apps.documents.models import DocumentVersion
from apps.user.models.user import User
from django.forms.models import model_to_dict
from django.http import Http404
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from apps.documents.models.document import Document
from rest_framework.parsers import FormParser, MultiPartParser
from django.shortcuts                import get_object_or_404
from drf_yasg import openapi


class DocumentVersionDetailAPIView(APIView):
    swagger_tags = ["Documents Versions"]
    parser_classes = [MultiPartParser, FormParser]

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=["Documents Versions"])
    def get_object(self, pk, user):
        try:
            ver = DocumentVersion.objects.get(pk=pk)
            if ver.document.user != user:
                raise DocumentVersion.DoesNotExist
            return ver
        except DocumentVersion.DoesNotExist:
            raise Http404

    @swagger_auto_schema(tags=["Documents Versions"])
    def get(self, request, pk):
        request_user = User.objects.get(email=request.user)
        if request_user is None:
            return
        ver = self.get_object(pk, request_user)
        data = model_to_dict(
            ver, fields=["id", "version_number", "file", "created_at", "created_by"]
        )
        return Response(data)

    @swagger_auto_schema(tags=["Documents Versions"])
    def delete(self, request, pk):
        request_user = User.objects.get(email=request.user)
        if request_user is None:
            return
        ver = self.get_object(pk, request_user)
        ver.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @swagger_auto_schema(
    tags=["Documents Versions"],
    operation_description="Upload a new version of a document",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=["file"],
        properties={
            "file": openapi.Schema(type=openapi.TYPE_FILE, description="PDF or image")
        },
    ),
    responses={201: openapi.Response("Created", schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "id": openapi.Schema(type=openapi.TYPE_INTEGER),
            "version_number": openapi.Schema(type=openapi.TYPE_INTEGER),
            "download_url": openapi.Schema(type=openapi.TYPE_STRING, format="uri"),
            "created_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
            "created_by": openapi.Schema(type=openapi.TYPE_STRING),
        },
    ))},
    )
    def post(self, request, document_id):
        # 1) Get the user and document (404 if not found)
        user = request.user
        document = get_object_or_404(Document, document_id=document_id)

        # 2) Ensure a file was uploaded
        upload = request.FILES.get("file")
        if not upload:
            return Response(
                {"error": "A file is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3) Create and save the new version (model.save() auto-assigns version_number)
        version = DocumentVersion(
            document=document,
            file=upload,
            created_by=user
        )
        version.save()

        # 4) Build a JSON‐serializable response
        data = {
            "id": version.id,
            "version_number": version.version_number,
            "download_url": request.build_absolute_uri(version.file.url),
            "created_at": version.created_at.isoformat(),
            "created_by": version.created_by.email,
        }
        return Response(data, status=status.HTTP_201_CREATED)
