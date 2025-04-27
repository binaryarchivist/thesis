from django.urls import path

from ..views import DocumentVersionDetailAPIView, DocumentVersionListAPIView

app_name = "documents-versions"

urlpatterns = [
    path(
        "<int:pk>/",
        DocumentVersionDetailAPIView.as_view(),
        name="doc-version-detail",
    ),
]
