from django.urls import path

from ..views import DocumentVersionListAPIView

app_name = "documents-versions-list"

urlpatterns = [
    path(
        "<uuid:document_id>/versions/list",
        DocumentVersionListAPIView.as_view(),
        name="doc-version-list",
    ),
]
