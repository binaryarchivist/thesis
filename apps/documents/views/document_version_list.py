from django.forms.models import model_to_dict
from django.http import Http404
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.documents.models import Document


class DocumentVersionListAPIView(APIView):
    swagger_tags = ["Documents Versions"]

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=["Documents Versions"])
    def get_document(self, document_id, user):
        try:
            return Document.objects.get(document_id=document_id, user=user)
        except Document.DoesNotExist:
            raise Http404

    @swagger_auto_schema(tags=["Documents Versions"])
    def get(self, request, document_id):
        doc = self.get_document(document_id, request.user)
        versions = doc.versions.all().order_by("version_number")
        data = [
            model_to_dict(
                ver, fields=["id", "version_number", "file", "created_at", "created_by"]
            )
            for ver in versions
        ]
        return Response(data)
