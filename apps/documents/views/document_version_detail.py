from django.forms.models import model_to_dict
from django.http import Http404
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.documents.models import DocumentVersion


class DocumentVersionDetailAPIView(APIView):
    swagger_tags = ["Documents Versions"]

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
        ver = self.get_object(pk, request.user)
        data = model_to_dict(
            ver, fields=["id", "version_number", "file", "created_at", "created_by"]
        )
        return Response(data)

    @swagger_auto_schema(tags=["Documents Versions"])
    def delete(self, request, pk):
        ver = self.get_object(pk, request.user)
        ver.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
