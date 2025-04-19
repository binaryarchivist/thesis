from rest_framework.response import Response
from rest_framework.decorators import APIView
from drf_yasg.utils import swagger_auto_schema


class Document(APIView):
    
    @swagger_auto_schema(operation_description="Get a list of documents")
    def get(self, request, format=None):
        return Response({
            "message": "GET Api!"
        })