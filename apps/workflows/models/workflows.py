import uuid

from django.db import models

from apps.core.models.base import BaseModel
from apps.documents.models.document import Document
from apps.user.models.user import User


class Workflow(BaseModel):
    STATUS_APPROVED = "approved"
    STATUS_REJECTED = "rejected"
    STATUS_PENDING = "pending"
    STATUS_SIGNED = "signed"
    STATUS_ARCHIVED = "archived"

    workflow_state_choices = (
        (STATUS_APPROVED, "Approved"),
        (STATUS_REJECTED, "Rejected"),
        (STATUS_PENDING, "Pending"),
        (STATUS_SIGNED, "SIGNED"),
        (STATUS_ARCHIVED, "ARCHIVED"),
    )

    workflow_id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    document_id = models.ForeignKey(
        Document, on_delete=models.CASCADE, related_name="attached_document"
    )
    assignee = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="assignee"
    )
    state = models.CharField(
        choices=workflow_state_choices, default=STATUS_PENDING, max_length=20
    )

    class Meta:
        db_table = "workflows"

    def __str__(self):
        return f"{self.name} (ID: {self.workflow_id})"
