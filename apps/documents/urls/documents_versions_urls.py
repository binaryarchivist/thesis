from django.urls import path

from ..views import DocumentVersionDetailAPIView, DocumentVersionListAPIView

app_name = "documents-versions"

urlpatterns = [
    path(
        "<uuid:document_id>/versions/",
        DocumentVersionListAPIView.as_view(),
        name="doc-version-list",
    ),
    path(
        "versions/<int:pk>/",
        DocumentVersionDetailAPIView.as_view(),
        name="doc-version-detail",
    ),
]
