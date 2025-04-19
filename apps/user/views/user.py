from rest_framework.response import Response
from rest_framework.decorators import APIView
from drf_yasg.utils import swagger_auto_schema

class User(APIView):
    
    @swagger_auto_schema(operation_description="Get user")
    def get(self, request, format=None):
        return Response({
            "message": "GET Api!"
        })
        
    @swagger_auto_schema(operation_description="Create user")
    def post(self, request, format=None):
        return Response({
            "message": "Creating User ?!"
        })