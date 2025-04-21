from django.forms.models import model_to_dict
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.documents.models import Document


class DocumentListCreateAPIView(APIView):
    swagger_tags = ["Documents"]

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

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

    def post(self, request):
        payload = request.data
        title = payload.get("title")
        description = payload.get("description", "")

        if not title:
            return Response(
                {"error": "Title is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        doc = Document.objects.create(
            title=title,
            description=description,
            user=request.user,
        )

        # TODO: Workflow integration

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
