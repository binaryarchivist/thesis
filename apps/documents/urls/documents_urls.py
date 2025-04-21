from django.urls import path

from ..views import DocumentDetailAPIView, DocumentListCreateAPIView

app_name = "documents"

urlpatterns = [
    path("", DocumentListCreateAPIView.as_view(), name="doc-list-create"),
    path("<uuid:document_id>/", DocumentDetailAPIView.as_view(), name="doc-detail"),
]
