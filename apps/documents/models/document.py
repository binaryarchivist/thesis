import uuid

from django.db import models

from apps.core.models.base import BaseModel
from apps.user.models.user import User


class Document(BaseModel):
    document_id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    title = models.CharField(max_length=128)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_documents")

    class Meta:
        db_table = "documents"

    def __str__(self):
        return f"{self.title} (ID: {self.document_id})"
