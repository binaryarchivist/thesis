import uuid

from apps.core.models.base import BaseModel
from apps.user.models.user import User
from django.db import models


class Document(BaseModel):
    document_id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    title = models.CharField(max_length=128)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_by"
    )

    STATUS_APPROVED = "approved"
    STATUS_REJECTED = "rejected"
    STATUS_PENDING = "pending"
    STATUS_SIGNED = "signed"
    STATUS_ARCHIVED = "archived"

    document_status_choices = (
        (STATUS_APPROVED, "Approved"),
        (STATUS_REJECTED, "Rejected"),
        (STATUS_PENDING, "Pending"),
        (STATUS_SIGNED, "SIGNED"),
        (STATUS_ARCHIVED, "ARCHIVED"),
    )

    status = models.CharField(
        choices=document_status_choices, default=STATUS_PENDING, max_length=20
    )
    assigned_to = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="assigned_to"
    )

    class Meta:
        db_table = "documents"

    def __str__(self):
        return f"{self.title} (ID: {self.document_id})"
