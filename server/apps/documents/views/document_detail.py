from pathlib import Path

from apps.documents.models import Document
from apps.documents.models.document_version import DocumentVersion
from apps.user.models.user import User
from django.forms.models import model_to_dict
from django.http import Http404
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication


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
        doc = Document.objects.get(document_id=document_id)
        data = model_to_dict(
            doc,
            fields=[
                "document_id",
                "title",
                "description",
            ],
        )
        data["created_by"] = doc.created_by.email
        data["created_at"] = doc.created_at.isoformat()
        data["status"] = doc.status
        data["tags"] = doc.tags
        data["priority"] = doc.priority
        data["reviewer"] = doc.reviewer.email
        data["assignee"] = doc.assigned_to.email
        data["assignee_id"] = doc.assigned_to.user_id
        data["reviewer_id"] = doc.reviewer.user_id
        data["document_type"] = doc.document_type if doc.document_type else None

        data["versions"] = []
        for v in doc.versions.order_by("version_number"):
            filename = Path(v.file.name).name
            # build a full URL to the media file
            url = request.build_absolute_uri(v.file.url)
            data["versions"].append(
                {
                    "version_number": v.version_number,
                    "filename": filename,
                    "download_url": url,
                    "created_by": v.created_by.email,
                    "created_at": v.created_at.isoformat(),
                }
            )
        data["allowed_actions"] = []

        user = User.objects.get(email=request.user)
        is_creator = doc.created_by == user
        is_assignee = doc.assigned_to == user

        if doc.status == Document.STATUS_PENDING and is_assignee:
            data["allowed_actions"] += ["approve", "reject", "archive"]

        elif doc.status == Document.STATUS_APPROVED and is_assignee:
            data["allowed_actions"] += ["esign", "archive"]

        elif (
            doc.status in (Document.STATUS_REJECTED, Document.STATUS_PENDING)
            and is_creator
        ):
            data["allowed_actions"] += ["resubmit", "archive"]

        elif doc.status == Document.STATUS_SIGNED and is_assignee:
            data["allowed_actions"].append("archive")

        elif (
            doc.status in (Document.STATUS_APPROVED, Document.STATUS_SIGNED)
            and is_creator
        ):
            data["allowed_actions"].append("archive")
        return Response(data, status=status.HTTP_200_OK)

    def put(self, request, document_id):
        try:
            doc = Document.objects.get(document_id=document_id)
        except Document.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        title = request.data.get("title")
        description = request.data.get("description")
        if title is None or description is None:
            return Response(
                {"error": "Both title and description are required for full update."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        request_user = User.objects.get(email=request.user)
        if request_user is None:
            return Response(
                {"error": "User not found."}, status=status.HTTP_400_BAD_REQUEST
            )
        doc.title = title
        doc.description = description
        doc.save()

        uploaded_file = request.FILES.get("file")
        new_version = None
        if uploaded_file:
            new_version = DocumentVersion(
                document=doc, file=uploaded_file, created_by=request_user
            )
            new_version.save()

        data = model_to_dict(
            doc,
            fields=[
                "document_id",
                "title",
                "description",
                "created_at",
            ],
        )
        # add creator email
        data["created_by"] = doc.created_by.email

        # if we just made a new version, include its info
        if new_version:
            data["new_version"] = {
                "id": new_version.id,
                "version_number": new_version.version_number,
                "filename": new_version.file.name.split("/")[-1],
                "download_url": request.build_absolute_uri(new_version.file.url),
                "created_at": new_version.created_at.isoformat(),
                "created_by": new_version.created_by.email,
            }

        return Response(data, status=status.HTTP_200_OK)

    def delete(self, request, document_id):
        doc = self.get_object(document_id, request.user)
        doc.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
