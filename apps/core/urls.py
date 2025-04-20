from django.urls import path

from .views.document import Document

urlpatterns = [
    path("", Document.as_view(), name="document-list"),
]
