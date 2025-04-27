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

    @swagger_auto_schema(tags=["Documents Versions"])
    def post(self, request, document_id):
        request_user = User.objects.get(email=request.user)
        if request_user is None:
            return Response(
                {"error": "User not found."}, status=status.HTTP_400_BAD_REQUEST
            )
        doc = self.get_document(document_id, request_user)
        # file must be in request.FILES
        upload = request.FILES.get("file")
        if not upload:
            return Response(
                {"error": "File is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        # version_number auto‐assigned in model.save()

        ver = DocumentVersion(document=doc, file=upload, created_by=request_user)
        ver.save()

        data = model_to_dict(
            ver, fields=["id", "version_number", "file", "created_at", "created_by"]
        )
        return Response(data, status=status.HTTP_201_CREATED)
