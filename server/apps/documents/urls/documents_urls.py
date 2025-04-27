from django.urls import path

from ..views import DocumentDetailAPIView, DocumentListAPIView

app_name = "documents"

urlpatterns = [
    path("", DocumentListAPIView.as_view(), name="doc-list"),
    path("<uuid:document_id>/", DocumentDetailAPIView.as_view(), name="doc-detail"),
]
