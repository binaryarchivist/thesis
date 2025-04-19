from django.db import models

from apps.core.models.base import BaseModel
from apps.user.models.user import User

import uuid
from django.db import models
from django.conf import settings

class Document(BaseModel):
    document_id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    title = models.CharField(max_length=128)
    description = models.TextField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="documents")

    class Meta:
        db_table = 'documents'
        
    def __str__(self):
        return f"{self.title} (ID: {self.document_id})"

class DocumentVersion(BaseModel):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name="versions")
    version_number = models.PositiveIntegerField()
    file = models.FileField(upload_to="documents/")  

    class Meta:
        db_table = 'documents_versions'
        unique_together = ('document', 'version_number')

    def __str__(self):
        return f"{self.document.title} - v{self.version_number}"

    def save(self, *args, **kwargs):
        if not self.version_number:
            last_version = DocumentVersion.objects.filter(document=self.document).order_by('-version_number').first()
            self.version_number = (last_version.version_number + 1) if last_version else 1
        super().save(*args, **kwargs)
