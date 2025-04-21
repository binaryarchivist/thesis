from django.urls import path

from ..views import (DocumentVersionDetailAPIView,
                     DocumentVersionListCreateAPIView)

app_name = "documents-versions"

urlpatterns = [
    path(
        "<uuid:document_id>/versions/",
        DocumentVersionListCreateAPIView.as_view(),
        name="doc-version-list-create",
    ),
    path(
        "versions/<int:pk>/",
        DocumentVersionDetailAPIView.as_view(),
        name="doc-version-detail",
    ),
]
