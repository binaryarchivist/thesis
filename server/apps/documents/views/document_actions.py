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


class DocumentActionsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, document_id, action):
        """
        Update a document with an action.
        """
        if action == "reject":
            self.reject_document(document_id)
        if action == "approve":
            self.approve_document(document_id)
        if action == "esign":
            self.esign_document(document_id)
        if action == "archive":
            self.archive_document(document_id)

        return Response(status=status.HTTP_204_NO_CONTENT)

    def reject_document(self, document_id):
        try:
            doc = Document.objects.get(document_id=document_id)
            doc.status = Document.STATUS_REJECTED
            doc.assigned_to = doc.created_by
            doc.save()
            return doc
        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found."}, status=status.HTTP_404_NOT_FOUND
            )

    def approve_document(self, document_id):
        try:
            doc = Document.objects.get(document_id=document_id)
            doc.status = Document.STATUS_APPROVED
            doc.assigned_to = doc.created_by
            doc.save()
            return doc
        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found."}, status=status.HTTP_404_NOT_FOUND
            )

    def esign_document(self, document_id):
        try:
            doc = Document.objects.get(document_id=document_id)
            doc.status = Document.STATUS_SIGNED
            doc.assigned_to = doc.created_by
            doc.save()
            return doc
        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found."}, status=status.HTTP_404_NOT_FOUND
            )

    def archive_document(self, document_id):
        try:
            doc = Document.objects.get(document_id=document_id)
            doc.status = Document.STATUS_ARCHIVED
            doc.assigned_to = doc.created_by
            doc.save()
            return doc
        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found."}, status=status.HTTP_404_NOT_FOUND
            )
