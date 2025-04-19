from .views.document import Document
from django.urls import path


urlpatterns = [
    path('', Document.as_view(), name='document-list'),
]
