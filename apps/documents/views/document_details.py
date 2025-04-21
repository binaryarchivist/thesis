from django.forms.models import model_to_dict
from django.http import Http404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.documents.models import Document


class DocumentDetailAPIView(APIView):
    swagger_tags = ["Documents"]

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, document_id, user):
        try:
            return Document.objects.get(document_id=document_id, user=user)
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
