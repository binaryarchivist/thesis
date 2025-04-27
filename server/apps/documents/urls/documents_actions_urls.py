from django.urls import path

from ..views import DocumentActionsAPIView

app_name = "documents"

urlpatterns = [
    path("action/<action>/", DocumentActionsAPIView.as_view(), name="doc-actions"),
]
